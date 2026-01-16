import api from '../api';

/**
 * MacroService
 * Handles all macro-related API calls for both agent and client macros
 */
class MacroService {
  /**
   * Get all agent macros (role_id = 3)
   * @returns {Promise<{macros: Array, departments: Array}>}
   */
  static async getAgentMacros() {
    const response = await api.get('/agents');
    return response.data;
  }

  /**
   * Get all client macros (role_id = 2)
   * @returns {Promise<{macros: Array, departments: Array}>}
   */
  static async getClientMacros() {
    const response = await api.get('/clients');
    return response.data;
  }

  /**
   * Create a new macro
   * @param {Object} data - Macro data
   * @param {string} data.text - Macro message text
   * @param {number|null} data.dept_id - Department ID (null for "All")
   * @param {boolean} data.active - Active status
   * @param {number} data.created_by - User ID who created the macro
   * @param {number} roleId - Role ID (2 for client, 3 for agent)
   * @returns {Promise<Object>} Created macro
   */
  static async createMacro(data, roleId) {
    const endpoint = roleId === 3 ? '/agents' : '/clients';
    const response = await api.post(endpoint, data);
    return response.data;
  }

  /**
   * Update an existing macro
   * @param {number} id - Macro ID
   * @param {Object} data - Updated macro data
   * @param {string} data.text - Macro message text
   * @param {boolean} data.active - Active status
   * @param {number|null} data.dept_id - Department ID
   * @param {number} data.updated_by - User ID who updated the macro
   * @param {number} roleId - Role ID (2 for client, 3 for agent)
   * @returns {Promise<Object>} Updated macro
   */
  static async updateMacro(id, data, roleId) {
    const endpoint = roleId === 3 ? `/agents/${id}` : `/clients/${id}`;
    const response = await api.put(endpoint, data);
    return response.data;
  }

  /**
   * Get all departments
   * @returns {Promise<Array>} List of departments
   */
  static async getDepartments() {
    const response = await api.get('/department');
    return response.data;
  }
}

export default MacroService;
