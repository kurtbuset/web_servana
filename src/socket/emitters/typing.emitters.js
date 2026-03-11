/**
 * Typing Indicator Socket Emitters
 * Functions to emit typing indicator events to the server
 */
import * as EVENTS from '../constants/events';

/**
 * Emit typing event
 * @param {Socket} socket - Socket.IO client instance
 * @param {Object} params - Typing parameters
 * @param {number} params.chatGroupId - Chat group ID
 * @param {number} params.userId - User ID
 * @param {string} params.userName - User name
 */
export const emitTyping = (socket, { chatGroupId, userId, userName }) => {
  if (!socket.connected) {
    console.warn('Socket not connected, cannot emit typing');
    return;
  }

  if (!chatGroupId || !userId) {
    console.warn('Missing required parameters for typing event');
    return;
  }

  socket.emit(EVENTS.TYPING, {
    chatGroupId,
    userId,
    userName: userName || 'User'
  });
};

/**
 * Emit stop typing event
 * @param {Socket} socket - Socket.IO client instance
 * @param {Object} params - Stop typing parameters
 * @param {number} params.chatGroupId - Chat group ID
 * @param {number} params.userId - User ID
 */
export const emitStopTyping = (socket, { chatGroupId, userId }) => {
  if (!socket.connected) {
    console.warn('Socket not connected, cannot emit stop typing');
    return;
  }

  if (!chatGroupId || !userId) {
    console.warn('Missing required parameters for stop typing event');
    return;
  }

  socket.emit(EVENTS.STOP_TYPING, {
    chatGroupId,
    userId
  });
};
