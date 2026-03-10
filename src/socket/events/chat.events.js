/**
 * Chat Socket Events
 * Handles real-time chat messages, user join/leave, and customer list updates
 */

/**
 * Register chat event listeners
 * @param {Socket} socket - Socket.IO client instance
 * @param {Object} callbacks - Event callback functions
 * @param {Function} callbacks.onMessageReceived - Called when message is received
 * @param {Function} callbacks.onCustomerListUpdate - Called when customer list updates
 * @param {Function} callbacks.onUserJoined - Called when user joins room
 * @param {Function} callbacks.onUserLeft - Called when user leaves room
 * @returns {Function} Cleanup function to unregister events
 */
export const registerChatEvents = (socket, callbacks = {}) => {
  const {
    onMessageReceived,
    onCustomerListUpdate,
    onUserJoined,
    onUserLeft
  } = callbacks;

  // Message received
  const handleReceiveMessage = (msg) => {
    console.log('received message')
    if (onMessageReceived) {
      onMessageReceived(msg);
    }
  };

  // Customer list update
  const handleCustomerListUpdate = (updateData) => {
    console.log('Received customerListUpdate:', updateData);
    if (onCustomerListUpdate) {
      onCustomerListUpdate(updateData);
    }
  };

  // User joined room
  const handleUserJoined = (data) => {
    console.log(`${data.userType} joined chat_group ${data.chatGroupId}`);
    if (onUserJoined) {
      onUserJoined(data);
    }
  };

  // User left room
  const handleUserLeft = (data) => {
    console.log(`${data.userType} left chat_group ${data.chatGroupId}`);
    if (onUserLeft) {
      onUserLeft(data);
    }
  };

  // Register listeners
  socket.on('receiveMessage', handleReceiveMessage);
  socket.on('customerListUpdate', handleCustomerListUpdate);
  socket.on('userJoined', handleUserJoined);
  socket.on('userLeft', handleUserLeft);

  // Return cleanup function
  return () => {
    socket.off('receiveMessage', handleReceiveMessage);
    socket.off('customerListUpdate', handleCustomerListUpdate);
    socket.off('userJoined', handleUserJoined);
    socket.off('userLeft', handleUserLeft);
  };
};
