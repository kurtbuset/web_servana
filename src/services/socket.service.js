import io from 'socket.io-client';

/**
 * SocketService manages WebSocket connections for real-time features
 * This is a singleton service that wraps Socket.IO client
 * 
 * Features:
 * - Real-time chat messaging
 * - Chat group updates
 * - Queue notifications
 */
class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  /**
   * Connect to Socket.IO server
   * @param {string} url - Socket.IO server URL
   * @returns {Socket} Socket.IO client instance
   */
  connect(url) {
    if (!this.socket) {
      this.socket = io(url, {
        withCredentials: true,
        transports: ['websocket', 'polling']
      });

      // Log connection status
      this.socket.on('connect', () => {
        console.log('Socket.IO connected');
      });

      this.socket.on('disconnect', () => {
        console.log('Socket.IO disconnected');
      });

      this.socket.on('error', (error) => {
        console.error('Socket.IO error:', error);
      });
    }
    return this.socket;
  }

  /**
   * Disconnect from Socket.IO server
   */
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.listeners.clear();
    }
  }

  /**
   * Register event listener
   * @param {string} event - Event name
   * @param {Function} callback - Event handler function
   */
  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
      this.listeners.set(event, callback);
    }
  }

  /**
   * Unregister event listener
   * @param {string} event - Event name
   */
  off(event) {
    if (this.socket && this.listeners.has(event)) {
      this.socket.off(event, this.listeners.get(event));
      this.listeners.delete(event);
    }
  }

  /**
   * Emit event to server
   * @param {string} event - Event name
   * @param {*} data - Data to send
   */
  emit(event, data) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  /**
   * Join a chat group room
   * @param {number} groupId - Chat group ID
   */
  joinChatGroup(groupId) {
    this.emit('joinChatGroup', groupId);
  }

  /**
   * Send a chat message
   * @param {Object} message - Message object
   * @param {number} message.chat_group_id - Chat group ID
   * @param {string} message.chat_body - Message content
   */
  sendMessage(message) {
    this.emit('sendMessage', message);
  }

  /**
   * Listen for customer list updates
   * @param {Function} callback - Callback function to handle updates
   */
  onCustomerListUpdate(callback) {
    this.on('customerListUpdate', callback);
  }

  /**
   * Stop listening for customer list updates
   */
  offCustomerListUpdate() {
    this.off('customerListUpdate');
  }

  /**
   * Get the socket instance
   * @returns {Socket|null} Socket.IO client instance
   */
  getSocket() {
    return this.socket;
  }

  /**
   * Check if socket is connected
   * @returns {boolean} Connection status
   */
  isConnected() {
    return this.socket && this.socket.connected;
  }
}

// Export singleton instance
export default new SocketService();
