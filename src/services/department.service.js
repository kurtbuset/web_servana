import api from '../api';

/**
 * DepartmentService handles all department-related API calls
 * 
 * Backend endpoints:
 * - GET /departments - Get all departments
 * - POST /departments - Create a new department
 * - PUT /departments/:id - Update a department
 * - PUT /departments/:id/toggle - Toggle department active status
 */
export class DepartmentService {
  /**
   * Get all departments
   * Returns departments ordered by name
   * @returns {Promise<Array>} Array of department objects
   */
  static async getDepartments() {
    const response = await api.get('/departments');
    return response.data;
  }

  /**
   * Create a new department
   * @param {Object} data - Department data
   * @param {string} data.dept_name - Department name
   * @param {number} data.dept_created_by - User ID creating the department
   * @returns {Promise<Object>} Created department object
   */
  static async createDepartment(data) {
    const response = await api.post('/departments', data);
    return response.data;
  }

  /**
   * Update an existing department
   * @param {number} id - Department ID
   * @param {Object} data - Department data to update
   * @param {string} data.dept_name - Department name (optional)
   * @param {boolean} data.dept_is_active - Active status (optional)
   * @param {number} data.dept_updated_by - User ID updating the department
   * @returns {Promise<Object>} Updated department object
   */
  static async updateDepartment(id, data) {
    const response = await api.put(`/departments/${id}`, data);
    return response.data;
  }

  /**
   * Toggle department active status
   * @param {number} id - Department ID
   * @param {Object} data - Toggle data
   * @param {boolean} data.dept_is_active - New active status
   * @param {number} data.dept_updated_by - User ID updating the department
   * @returns {Promise<Object>} Updated department object
   */
  static async toggleDepartment(id, data) {
    const response = await api.put(`/departments/${id}/toggle`, data);
    return response.data;
  }
}
