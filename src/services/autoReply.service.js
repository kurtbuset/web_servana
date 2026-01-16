import api from "../api";

/**
 * AutoReplyService
 * Handles all auto-reply related API operations
 */
class AutoReplyService {
  /**
   * Get all auto-replies
   * @returns {Promise<Array>} Array of auto-replies
   */
  static async getAutoReplies() {
    const response = await api.get("/auto-replies");
    return response.data;
  }

  /**
   * Get active departments
   * @returns {Promise<Array>} Array of active departments
   */
  static async getActiveDepartments() {
    const response = await api.get("/auto-replies/departments/active");
    return response.data;
  }

  /**
   * Get all departments (including inactive)
   * @returns {Promise<Array>} Array of all departments
   */
  static async getAllDepartments() {
    const response = await api.get("/auto-replies/departments/all");
    return response.data;
  }

  /**
   * Create a new auto-reply
   * @param {Object} autoReplyData - Auto-reply data
   * @param {string} autoReplyData.message - Reply message
   * @param {number|null} autoReplyData.dept_id - Department ID (null for all departments)
   * @param {number} autoReplyData.created_by - User ID creating the reply
   * @returns {Promise<Object>} Created auto-reply
   */
  static async createAutoReply(autoReplyData) {
    const response = await api.post("/auto-replies", {
      message: autoReplyData.message,
      dept_id: autoReplyData.dept_id,
      created_by: autoReplyData.created_by,
    });
    return response.data;
  }

  /**
   * Update an existing auto-reply
   * @param {number} autoReplyId - Auto-reply ID
   * @param {Object} autoReplyData - Updated auto-reply data
   * @param {string} autoReplyData.message - Reply message (optional)
   * @param {number|null} autoReplyData.dept_id - Department ID (optional)
   * @param {number} autoReplyData.updated_by - User ID updating the reply
   * @returns {Promise<Object>} Updated auto-reply
   */
  static async updateAutoReply(autoReplyId, autoReplyData) {
    const response = await api.put(`/auto-replies/${autoReplyId}`, {
      message: autoReplyData.message,
      dept_id: autoReplyData.dept_id,
      updated_by: autoReplyData.updated_by,
    });
    return response.data;
  }

  /**
   * Toggle auto-reply active status
   * @param {number} autoReplyId - Auto-reply ID
   * @param {boolean} isActive - New active status
   * @param {number} updatedBy - User ID updating the status
   * @returns {Promise<Object>} Updated auto-reply
   */
  static async toggleAutoReply(autoReplyId, isActive, updatedBy) {
    const response = await api.patch(`/auto-replies/${autoReplyId}/toggle`, {
      is_active: isActive,
      updated_by: updatedBy,
    });
    return response.data;
  }
}

export default AutoReplyService;
