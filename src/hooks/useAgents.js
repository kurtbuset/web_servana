import { useState, useCallback, useEffect } from 'react';
import { AgentService } from '../services/agent.service';
import { toast } from 'react-toastify';

/**
 * useAgents hook manages agent CRUD operations
 * 
 * Features:
 * - Fetch all agents and departments
 * - Create new agent
 * - Update agent (email, password, active status, departments)
 * - Toggle agent active status
 * - Toggle department assignments
 * - Duplicate email detection
 * - Email validation
 * - Loading and error state management
 * - Toast notifications
 * - Auto-fetch on mount
 * 
 * @returns {Object} Agent state and actions
 */
export const useAgents = () => {
  const [agents, setAgents] = useState([]);
  const [allDepartments, setAllDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Default role ID for new agents
  const DEFAULT_ROLE_ID = 2;

  /**
   * Fetch all agents and departments
   * @returns {Promise<Object>} Object with agents and departments
   */
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [agentsData, departmentsData] = await Promise.all([
        AgentService.getAgents(),
        AgentService.getDepartments(),
      ]);

      setAgents(agentsData);
      setAllDepartments(departmentsData);
      
      return { agents: agentsData, departments: departmentsData };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to fetch agents';
      setError(errorMessage);
      toast.error('Failed to load agents. Please refresh the page.', {
        position: 'top-right',
        autoClose: 5000,
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Validate email format
   * @param {string} email - Email to validate
   * @returns {boolean} True if valid
   */
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  /**
   * Check if email already exists
   * @param {string} email - Email to check
   * @param {number} currentId - Current agent ID (for edit)
   * @returns {boolean} True if email exists
   */
  const emailAlreadyExists = useCallback((email, currentId = null) => {
    return agents.some(
      (agent) =>
        agent.email.toLowerCase() === email.toLowerCase() &&
        agent.id !== currentId
    );
  }, [agents]);

  /**
   * Create a new agent
   * @param {string} email - Agent email
   * @param {string} password - Agent password
   * @returns {Promise<Object>} Created agent
   */
  const createAgent = useCallback(async (email, password) => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    // Validation
    if (!trimmedEmail || !trimmedPassword) {
      const error = 'Email and password are required.';
      toast.error(error, { position: 'top-right', autoClose: 3000 });
      throw new Error(error);
    }

    if (!isValidEmail(trimmedEmail)) {
      const error = 'Please enter a valid email address.';
      toast.error(error, { position: 'top-right', autoClose: 3000 });
      throw new Error(error);
    }

    if (emailAlreadyExists(trimmedEmail)) {
      const error = 'Email is already taken.';
      toast.error(error, { position: 'top-right', autoClose: 3000 });
      throw new Error(error);
    }

    setLoading(true);
    setError(null);
    try {
      const payload = {
        email: trimmedEmail,
        password: trimmedPassword,
        active: true,
        departments: [],
        roleId: DEFAULT_ROLE_ID,
      };

      const result = await AgentService.createAgent(payload);

      const newAgent = {
        id: result.id,
        email: result.email || trimmedEmail,
        password: trimmedPassword,
        departments: [],
        active: true,
      };

      setAgents((prev) => [...prev, newAgent]);

      toast.success('Agent added successfully', {
        position: 'top-right',
        autoClose: 3000,
      });

      return result;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to save agent';
      setError(errorMessage);
      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 3000,
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [emailAlreadyExists]);

  /**
   * Update an existing agent
   * @param {number} agentId - Agent ID
   * @param {string} email - New email
   * @param {string} password - New password (optional)
   * @param {number} agentIndex - Agent index in array (for optimistic update)
   * @returns {Promise<Object>} Updated agent
   */
  const updateAgent = useCallback(async (agentId, email, password, agentIndex) => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password?.trim();

    // Validation
    if (!trimmedEmail || !trimmedPassword) {
      const error = 'Email and password are required.';
      toast.error(error, { position: 'top-right', autoClose: 3000 });
      throw new Error(error);
    }

    if (!isValidEmail(trimmedEmail)) {
      const error = 'Please enter a valid email address.';
      toast.error(error, { position: 'top-right', autoClose: 3000 });
      throw new Error(error);
    }

    if (emailAlreadyExists(trimmedEmail, agentId)) {
      const error = 'Email is already taken.';
      toast.error(error, { position: 'top-right', autoClose: 3000 });
      throw new Error(error);
    }

    setLoading(true);
    setError(null);
    try {
      const agent = agents[agentIndex];
      const payload = {
        email: trimmedEmail,
        password: trimmedPassword,
        active: agent.active,
        departments: agent.departments || [],
      };

      await AgentService.updateAgent(agentId, payload);

      setAgents((prev) =>
        prev.map((a, i) =>
          i === agentIndex ? { ...a, email: trimmedEmail } : a
        )
      );

      toast.success('Agent updated successfully', {
        position: 'top-right',
        autoClose: 3000,
      });
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to save agent';
      setError(errorMessage);
      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 3000,
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [agents, emailAlreadyExists]);

  /**
   * Toggle agent active status
   * @param {number} agentIndex - Agent index in array
   * @returns {Promise<void>}
   */
  const toggleActive = useCallback(async (agentIndex) => {
    const agent = agents[agentIndex];
    const updatedAgent = { ...agent, active: !agent.active };

    try {
      await AgentService.updateAgent(agent.id, {
        email: agent.email,
        active: updatedAgent.active,
        departments: agent.departments,
      });

      setAgents((prev) => prev.map((a, i) => (i === agentIndex ? updatedAgent : a)));

      toast.success(
        `Agent ${updatedAgent.active ? 'activated' : 'deactivated'} successfully`,
        {
          position: 'top-right',
          autoClose: 2000,
        }
      );
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to update agent status';
      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 3000,
      });
      throw err;
    }
  }, [agents]);

  /**
   * Toggle department assignment for an agent
   * @param {number} agentIndex - Agent index in array
   * @param {string} dept - Department name
   * @returns {Promise<void>}
   */
  const toggleDepartment = useCallback(async (agentIndex, dept) => {
    const agent = agents[agentIndex];
    const updatedDepartments = (agent.departments || []).includes(dept)
      ? agent.departments.filter((d) => d !== dept)
      : [...(agent.departments || []), dept];

    try {
      await AgentService.updateAgent(agent.id, {
        email: agent.email,
        active: agent.active,
        departments: updatedDepartments,
      });

      setAgents((prev) =>
        prev.map((a, i) =>
          i === agentIndex ? { ...a, departments: updatedDepartments } : a
        )
      );

      toast.success('Department updated successfully', {
        position: 'top-right',
        autoClose: 2000,
      });
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to update department';
      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 3000,
      });
      throw err;
    }
  }, [agents]);

  // Auto-fetch on mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    agents,
    allDepartments,
    loading,
    error,
    fetchData,
    createAgent,
    updateAgent,
    toggleActive,
    toggleDepartment,
    isValidEmail,
    emailAlreadyExists,
  };
};
