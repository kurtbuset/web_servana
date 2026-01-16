import { useState, useCallback, useEffect } from 'react';
import { DepartmentService } from '../services/department.service';
import { toast } from 'react-toastify';
import { useUser } from '../../context/UserContext';

/**
 * useDepartments hook manages department CRUD operations
 * 
 * Features:
 * - Fetch all departments
 * - Create new department
 * - Update department
 * - Toggle department active status
 * - Duplicate detection
 * - Loading and error state management
 * - Toast notifications
 * - Auto-fetch on mount
 * 
 * @returns {Object} Department state and actions
 */
export const useDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { userData } = useUser();

  const CURRENT_USER_ID = userData?.user_id;

  /**
   * Fetch all departments
   * @returns {Promise<Array>} Array of departments
   */
  const fetchDepartments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await DepartmentService.getDepartments();
      setDepartments(data);
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to fetch departments';
      setError(errorMessage);
      toast.error('Failed to load departments. Please refresh the page.', {
        position: 'top-right',
        autoClose: 5000,
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Create a new department
   * @param {string} deptName - Department name
   * @returns {Promise<Object>} Created department
   */
  const createDepartment = useCallback(async (deptName) => {
    if (!deptName.trim()) {
      toast.error('Department name cannot be empty', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    // Check for duplicate department name
    const isDuplicate = departments.some(
      (dept) => dept.dept_name.toLowerCase().trim() === deptName.toLowerCase().trim()
    );

    if (isDuplicate) {
      toast.error('This department already exists', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await DepartmentService.createDepartment({
        dept_name: deptName.trim(),
        dept_created_by: CURRENT_USER_ID,
      });
      
      toast.success('Department added successfully', {
        position: 'top-right',
        autoClose: 3000,
      });
      
      await fetchDepartments(); // Refresh list
      return result;
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to save department';
      setError(errorMessage);
      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 3000,
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [departments, CURRENT_USER_ID, fetchDepartments]);

  /**
   * Update an existing department
   * @param {number} deptId - Department ID
   * @param {string} deptName - New department name
   * @returns {Promise<Object>} Updated department
   */
  const updateDepartment = useCallback(async (deptId, deptName) => {
    if (!deptName.trim()) {
      toast.error('Department name cannot be empty', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    // Check for duplicate department name (excluding current department)
    const isDuplicate = departments.some(
      (dept) => 
        dept.dept_id !== deptId && 
        dept.dept_name.toLowerCase().trim() === deptName.toLowerCase().trim()
    );

    if (isDuplicate) {
      toast.error('This department already exists', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await DepartmentService.updateDepartment(deptId, {
        dept_name: deptName.trim(),
        dept_updated_by: CURRENT_USER_ID,
      });
      
      toast.success('Department updated successfully', {
        position: 'top-right',
        autoClose: 3000,
      });
      
      await fetchDepartments(); // Refresh list
      return result;
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to save department';
      setError(errorMessage);
      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 3000,
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [departments, CURRENT_USER_ID, fetchDepartments]);

  /**
   * Toggle department active status
   * @param {number} deptId - Department ID
   * @param {boolean} currentStatus - Current active status
   * @returns {Promise<Object>} Updated department
   */
  const toggleDepartment = useCallback(async (deptId, currentStatus) => {
    try {
      await DepartmentService.toggleDepartment(deptId, {
        dept_is_active: !currentStatus,
        dept_updated_by: CURRENT_USER_ID,
      });

      // Optimistically update the local state
      setDepartments((prevDepartments) =>
        prevDepartments.map((dept) =>
          dept.dept_id === deptId
            ? { ...dept, dept_is_active: !currentStatus }
            : dept
        )
      );

      toast.success(
        `Department ${!currentStatus ? 'activated' : 'deactivated'} successfully`,
        {
          position: 'top-right',
          autoClose: 2000,
        }
      );
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to toggle active status';
      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 3000,
      });
      throw err;
    }
  }, [CURRENT_USER_ID]);

  // Auto-fetch on mount
  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  return {
    departments,
    loading,
    error,
    fetchDepartments,
    createDepartment,
    updateDepartment,
    toggleDepartment,
  };
};
