import api from '../api';

/**
 * MacroService
 * Handles all macro-related API calls for both agent and client macros
 */
class MacroService {
  /**
   * Get all macros for a specific role type
   * @param {string} roleType - "agent" or "client"
   * @returns {Promise<{macros: Array, departments: Array}>}
   */
  static async getMacrosByRoleType(roleType) {
    const response = await api.get(`/macros/${roleType}`);
    return response.data;
  }

  /**
   * Create a new macro
   * @param {Object} data - Macro data
   * @param {string} data.text - Macro message text
   * @param {number|null} data.dept_id - Department ID (null for "All")
   * @param {boolean} data.active - Active status
   * @param {number} data.created_by - User ID who created the macro
   * @param {string} roleType - Role type ("agent" or "client")
   * @returns {Promise<Object>} Created macro
   */
  static async createMacro(data, roleType) {
    const response = await api.post(`/macros/${roleType}`, data);
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
   * @param {string} roleType - Role type ("agent" or "client")
   * @returns {Promise<Object>} Updated macro
   */
  static async updateMacro(id, data, roleType) {
    const response = await api.put(`/macros/${roleType}/${id}`, data);
    return response.data;
  }

  /**
   * Get all departments
   * @returns {Promise<Array>} List of departments
   */
  static async getDepartments() {
    const response = await api.get('/departments');
    return response.data;
  }

  // Legacy methods for backward compatibility (can be removed later)
  /**
   * @deprecated Use getMacrosByRoleType('agent') instead
   */
  static async getAgentMacros() {
    return this.getMacrosByRoleType('agent');
  }

  /**
   * @deprecated Use getMacrosByRoleType('client') instead
   */
  static async getClientMacros() {
    return this.getMacrosByRoleType('client');
  }
}

export default MacroService;
