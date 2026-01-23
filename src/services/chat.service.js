import api from '../api';

/**
 * ChatService handles all chat-related API calls
 * 
 * Backend endpoints:
 * - GET /chat/chatgroups - Get all chat groups for current user
 * - GET /chat/:clientId - Get messages for a specific client
 * - GET /chat/canned-messages - Get canned messages for user's role
 * - GET /chat/counts - Get pending and active chat counts
 */
export class ChatService {
  /**
   * Get all chat groups assigned to the current user
   * Returns chat groups with customer info, department, and profile images
   * @returns {Promise<Array>} Array of chat groups
   */
  static async getChatGroups() {
    const response = await api.get('/chat/chatgroups');
    return response.data;
  }

  /**
   * Get messages for a specific client
   * Supports pagination with before/limit parameters
   * @param {number} clientId - Client ID
   * @param {string} before - ISO timestamp for pagination (optional)
   * @param {number} limit - Number of messages to fetch (default: 10)
   * @returns {Promise<Object>} Object containing messages array
   */
  static async getMessages(clientId, before = null, limit = 10) {
    const params = { limit };
    if (before) {
      params.before = before;
    }
    const response = await api.get(`/chat/${clientId}`, { params });
    return response.data;
  }

  /**
   * Get canned messages for the current user's role
   * Returns active canned messages that can be used in chat
   * @returns {Promise<Array>} Array of canned message objects
   */
  static async getCannedMessages() {
    const response = await api.get('/chat/canned-messages');
    return response.data;
  }

  /**
   * Get chat counts (pending and active)
   * Returns different counts based on user role (Admin vs Agent)
   * @returns {Promise<Object>} Object with pendingChats and activeChats counts
   */
  static async getChatCounts() {
    const response = await api.get('/chat/counts');
    return response.data;
  }

  /**
   * Transfer chat group to another department
   * @param {number} chatGroupId - Chat group ID to transfer
   * @param {number} deptId - Target department ID
   * @returns {Promise<Object>} Transfer success response
   */
  static async transferChatGroup(chatGroupId, deptId) {
    const response = await api.post(`/chat/${chatGroupId}/transfer`, { deptId });
    return response.data;
  }

  /**
   * Get all departments
   * @returns {Promise<Array>} Array of department objects with id and name
   */
  static async getAllDepartments() {
    const response = await api.get('/departments');
    return response.data;
  }
}
