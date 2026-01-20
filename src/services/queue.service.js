import api from "../api";

/**
 * QueueService
 * Handles all queue-related API operations
 */
class QueueService {
  /**
   * Get all queued chat groups (unassigned chats)
   * @returns {Promise<Array>} Array of chat groups waiting in queue
   */
  static async getQueuedChats() {
    const response = await api.get("/queues/chatgroups", { withCredentials: true });
    return response.data;
  }

  /**
   * Get messages for a specific client
   * @param {number} clientId - Client ID
   * @param {string} before - Timestamp for pagination (optional)
   * @param {number} limit - Number of messages to fetch (default: 10)
   * @returns {Promise<Object>} Object containing messages array
   */
  static async getMessages(clientId, before = null, limit = 10) {
    const response = await api.get(`/queues/${clientId}`, {
      params: {
        before,
        limit,
      },
    });
    return response.data;
  }

  /**
   * Accept a chat from the queue (assign to current agent)
   * @param {number} chatGroupId - Chat group ID
   * @returns {Promise<Object>} Success response with agent and chat group info
   */
  static async acceptChat(chatGroupId) {
    const response = await api.post(`/queues/${chatGroupId}/accept`);
    return response.data;
  }

  /**
   * Get canned messages for quick replies
   * @returns {Promise<Array>} Array of canned message strings
   */
  static async getCannedMessages() {
    const response = await api.get("/chat/canned-messages");
    return response.data;
  }
}

export default QueueService;
