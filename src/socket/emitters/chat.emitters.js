/**
 * Chat Socket Emitters
 * Functions to emit chat-related events to the server
 */
import * as EVENTS from '../constants/events';

/**
 * Join a chat group
 * @param {Socket} socket - Socket.IO client instance
 * @param {Object} params - Join parameters
 * @param {number} params.groupId - Chat group ID
 * @param {string} params.userType - User type (agent/client)
 * @param {number} params.userId - User ID
 */
export const joinChatGroup = (socket, { groupId, userType, userId }) => {
  if (!socket.connected) {
    console.warn('Socket not connected, cannot join chat group');
    return;
  }

  socket.emit(EVENTS.JOIN_CHAT_GROUP, {
    groupId,
    userType,
    userId
  });

  console.log(`${userType} ${userId} joining chat_group ${groupId}`);
};

/**
 * Leave previous room
 * @param {Socket} socket - Socket.IO client instance
 */
export const leavePreviousRoom = (socket) => {
  if (!socket.connected) {
    console.warn('Socket not connected, cannot leave previous room');
    return;
  }

  socket.emit(EVENTS.LEAVE_PREVIOUS_ROOM);
};

/**
 * Leave a specific room
 * @param {Socket} socket - Socket.IO client instance
 * @param {Object} params - Leave parameters
 * @param {number} params.roomId - Room ID
 * @param {string} params.userType - User type (agent/client)
 * @param {number} params.userId - User ID
 */
export const leaveRoom = (socket, { roomId, userType, userId }) => {
  if (!socket.connected) {
    console.warn('Socket not connected, cannot leave room');
    return;
  }

  socket.emit(EVENTS.LEAVE_ROOM, {
    roomId,
    userType,
    userId
  });

  console.log(`${userType} ${userId} leaving room ${roomId}`);
};

/**
 * Send a message
 * @param {Socket} socket - Socket.IO client instance
 * @param {Object} message - Message data
 * @param {string} message.chat_body - Message content
 * @param {number} message.chat_group_id - Chat group ID
 * @param {number} message.sys_user_id - System user ID
 * @param {number|null} message.client_id - Client ID (null for agent messages)
 */
export const sendMessage = (socket, message) => {
  if (!socket.connected) {
    console.warn('Socket not connected, cannot send message');
    return;
  }

  const { chat_body, chat_group_id, sys_user_id, client_id } = message;

  if (!chat_body || !chat_group_id || !sys_user_id) {
    console.warn('Missing required parameters for sendMessage');
    return;
  }

  console.log('Sending to chat group:', chat_group_id);
  socket.emit(EVENTS.SEND_MESSAGE, {
    chat_body,
    chat_group_id,
    sys_user_id,
    client_id: client_id || null,
  });
};
