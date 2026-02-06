import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import MacroService from '../services/macro.service';

/**
 * Custom hook for managing macros (agent or client)
 * @param {string} roleType - Role type ("agent" or "client")
 * @returns {Object} Macro state and operations
 */
const useMacros = (roleType) => {
  const [macros, setMacros] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch macros on mount or when roleType changes
  useEffect(() => {
    if (roleType) {
      fetchMacros();
    }
  }, [roleType]);

  /**
   * Fetch all macros for the specified role type
   */
  const fetchMacros = async () => {
    if (!roleType) {
      setError('Role type is required');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await MacroService.getMacrosByRoleType(roleType);

      const mappedMacros = (data.macros || []).map((macro) => ({
        id: macro.canned_id,
        text: macro.canned_message,
        active: macro.canned_is_active,
        dept_id: macro.dept_id,
        department: macro.department?.dept_name || 'All',
      }));

      setMacros(mappedMacros);
      setDepartments(data.departments || []);
    } catch (err) {
      console.error(`Failed to fetch ${roleType} macros:`, err);
      const errorMessage = `Failed to fetch ${roleType} macros.`;
      setError(errorMessage);
      toast.error('Failed to load macros. Please refresh the page.', {
        position: 'top-right',
        autoClose: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Create a new macro
   * @param {string} text - Macro message text
   * @param {number|null} dept_id - Department ID
   * @param {number} created_by - User ID
   * @returns {Promise<boolean>} Success status
   */
  const createMacro = async (text, dept_id, created_by) => {
    if (!text.trim()) {
      toast.error('Message cannot be empty', {
        position: 'top-right',
        autoClose: 3000,
      });
      return false;
    }

    // Check for duplicate (case-insensitive)
    const isDuplicate = macros.some(
      (m) => m.text.toLowerCase().trim() === text.toLowerCase().trim()
    );

    if (isDuplicate) {
      toast.error('This macro already exists', {
        position: 'top-right',
        autoClose: 3000,
      });
      return false;
    }

    try {
      const newMacro = await MacroService.createMacro(
        {
          text,
          dept_id,
          active: true,
          created_by,
        },
        roleType
      );

      const mappedMacro = {
        id: newMacro.id,
        text: newMacro.text,
        active: newMacro.active,
        dept_id: newMacro.dept_id,
        department: newMacro.department,
      };

      setMacros((prev) => [...prev, mappedMacro]);
      toast.success('Macro added successfully', {
        position: 'top-right',
        autoClose: 3000,
      });
      return true;
    } catch (err) {
      console.error('Failed to create macro:', err);
      const errorMessage = err.response?.data?.error || 'Failed to add macro';
      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 3000,
      });
      return false;
    }
  };

  /**
   * Update an existing macro
   * @param {number} id - Macro ID
   * @param {string} text - Updated message text
   * @param {boolean} active - Active status
   * @param {number|null} dept_id - Department ID
   * @param {number} updated_by - User ID
   * @returns {Promise<boolean>} Success status
   */
  const updateMacro = async (id, text, active, dept_id, updated_by) => {
    if (!text.trim()) {
      toast.error('Message cannot be empty', {
        position: 'top-right',
        autoClose: 3000,
      });
      return false;
    }

    // Check for duplicate when editing (excluding current macro)
    const isDuplicate = macros.some(
      (m) => m.id !== id && m.text.toLowerCase().trim() === text.toLowerCase().trim()
    );

    if (isDuplicate) {
      toast.error('This macro already exists', {
        position: 'top-right',
        autoClose: 3000,
      });
      return false;
    }

    try {
      const updatedMacro = await MacroService.updateMacro(
        id,
        {
          text,
          active,
          dept_id,
          updated_by,
        },
        roleType
      );

      const mappedMacro = {
        id: updatedMacro.id,
        text: updatedMacro.text,
        active: updatedMacro.active,
        dept_id: updatedMacro.dept_id,
        department: updatedMacro.department,
      };

      setMacros((prev) => prev.map((m) => (m.id === id ? mappedMacro : m)));
      toast.success('Macro updated successfully', {
        position: 'top-right',
        autoClose: 3000,
      });
      return true;
    } catch (err) {
      console.error('Failed to update macro:', err);
      const errorMessage = err.response?.data?.error || 'Failed to update macro';
      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 3000,
      });
      return false;
    }
  };

  /**
   * Toggle macro active status
   * @param {number} id - Macro ID
   * @param {number} updated_by - User ID
   */
  const toggleActive = async (id, updated_by) => {
    const macro = macros.find((m) => m.id === id);
    if (!macro) return;

    const newActiveStatus = !macro.active;

    try {
      await MacroService.updateMacro(
        id,
        {
          text: macro.text,
          active: newActiveStatus,
          dept_id: macro.dept_id,
          updated_by,
        },
        roleType
      );

      setMacros((prev) =>
        prev.map((m) => (m.id === id ? { ...m, active: newActiveStatus } : m))
      );

      toast.success(
        `Macro ${newActiveStatus ? 'activated' : 'deactivated'} successfully`,
        {
          position: 'top-right',
          autoClose: 2000,
        }
      );
    } catch (err) {
      console.error('Failed to toggle active:', err);
      toast.error('Failed to update macro status', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  /**
   * Change macro department
   * @param {number} id - Macro ID
   * @param {number|null} dept_id - New department ID
   * @param {number} updated_by - User ID
   */
  const changeDepartment = async (id, dept_id, updated_by) => {
    const macro = macros.find((m) => m.id === id);
    if (!macro) return;

    try {
      await MacroService.updateMacro(
        id,
        {
          text: macro.text,
          active: macro.active,
          dept_id,
          updated_by,
        },
        roleType
      );

      const department = departments.find((d) => d.dept_id === dept_id);
      setMacros((prev) =>
        prev.map((m) =>
          m.id === id
            ? { ...m, dept_id, department: department?.dept_name || 'All' }
            : m
        )
      );

      toast.success('Department updated successfully', {
        position: 'top-right',
        autoClose: 2000,
      });
    } catch (err) {
      console.error('Failed to update department:', err);
      toast.error('Failed to update department', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  return {
    macros,
    departments,
    loading,
    error,
    createMacro,
    updateMacro,
    toggleActive,
    changeDepartment,
    refetch: fetchMacros,
  };
};

export default useMacros;
