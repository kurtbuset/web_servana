import api from '../api';

/**
 * AgentService handles all agent management API calls
 * 
 * Backend endpoints:
 * - GET /manage-agents/agents - Get all agents
 * - GET /manage-agents/departments - Get all departments
 * - POST /manage-agents/agents - Create a new agent
 * - PUT /manage-agents/agents/:id - Update an agent
 */
export class AgentService {
  /**
   * Get all agents
   * Returns agents with their email, active status, and departments
   * @returns {Promise<Array>} Array of agent objects
   */
  static async getAgents() {
    const response = await api.get('/manage-agents/agents');
    return response.data;
  }

  /**
   * Get all departments
   * Returns list of department names for agent assignment
   * @returns {Promise<Array>} Array of department names
   */
  static async getDepartments() {
    const response = await api.get('/manage-agents/departments');
    return response.data;
  }

  /**
   * Create a new agent
   * @param {Object} data - Agent data
   * @param {string} data.email - Agent email
   * @param {string} data.password - Agent password
   * @param {boolean} data.active - Active status
   * @param {Array<string>} data.departments - Assigned departments
   * @param {number} data.roleId - Role ID (default: 2 for Agent)
   * @returns {Promise<Object>} Created agent object
   */
  static async createAgent(data) {
    const response = await api.post('/manage-agents/agents', data);
    return response.data;
  }

  /**
   * Update an existing agent
   * @param {number} id - Agent ID
   * @param {Object} data - Agent data to update
   * @param {string} data.email - Agent email (optional)
   * @param {string} data.password - Agent password (optional)
   * @param {boolean} data.active - Active status (optional)
   * @param {Array<string>} data.departments - Assigned departments (optional)
   * @returns {Promise<Object>} Updated agent object
   */
  static async updateAgent(id, data) {
    const response = await api.put(`/manage-agents/agents/${id}`, data);
    return response.data;
  }
}
