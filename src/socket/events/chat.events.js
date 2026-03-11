/**
 * Chat Socket Events
 * Handles real-time chat messages, user join/leave, customer list updates, and errors
 */
import toast from '../../utils/toast';
import * as EVENTS from '../constants/events';

/**
 * Register chat event listeners
 * @param {Socket} socket - Socket.IO client instance
 * @param {Object} callbacks - Event callback functions
 * @param {Function} callbacks.onMessageReceived - Called when message is received
 * @param {Function} callbacks.onCustomerListUpdate - Called when customer list updates
 * @param {Function} callbacks.onUserJoined - Called when user joins room
 * @param {Function} callbacks.onUserLeft - Called when user leaves room
 * @param {Function} callbacks.onMessageError - Called when message sending fails
 * @param {Function} callbacks.onError - Called when general error occurs
 * @returns {Function} Cleanup function to unregister events
 */
export const registerChatEvents = (socket, callbacks = {}) => {
  const {
    onMessageReceived,
    onCustomerListUpdate,
    onUserJoined,
    onUserLeft,
    onMessageError,
    onError
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

  // Message error
  const handleMessageError = (error) => {
    console.error('❌ Message error:', error);
    const errorMessage = error.error || error.details || 'Failed to send message';
    toast.error(errorMessage);
    
    if (onMessageError) {
      onMessageError(error);
    }
  };

  // General error
  const handleError = (error) => {
    console.error('❌ Socket error:', error);
    const errorMessage = error.message || error.reason || 'An error occurred';
    
    // Only show toast for non-authentication errors (auth errors are handled elsewhere)
    if (!errorMessage.toLowerCase().includes('auth')) {
      toast.error(errorMessage);
    }
    
    if (onError) {
      onError(error);
    }
  };

  // Register listeners
  socket.on(EVENTS.RECEIVE_MESSAGE, handleReceiveMessage);
  socket.on(EVENTS.CUSTOMER_LIST_UPDATE, handleCustomerListUpdate);
  socket.on(EVENTS.USER_JOINED, handleUserJoined);
  socket.on(EVENTS.USER_LEFT, handleUserLeft);
  socket.on(EVENTS.MESSAGE_ERROR, handleMessageError);
  socket.on(EVENTS.ERROR, handleError);

  // Return cleanup function
  return () => {
    socket.off(EVENTS.RECEIVE_MESSAGE, handleReceiveMessage);
    socket.off(EVENTS.CUSTOMER_LIST_UPDATE, handleCustomerListUpdate);
    socket.off(EVENTS.USER_JOINED, handleUserJoined);
    socket.off(EVENTS.USER_LEFT, handleUserLeft);
    socket.off(EVENTS.MESSAGE_ERROR, handleMessageError);
    socket.off(EVENTS.ERROR, handleError);
  };
};
