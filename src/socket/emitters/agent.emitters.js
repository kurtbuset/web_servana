/**
 * Agent Socket Emitters
 * Functions to emit agent-related events to the server
 */
import * as EVENTS from '../constants/events';

/**
 * Update agent status
 * @param {Socket} socket - Socket.IO client instance
 * @param {string} agentStatus - Agent status (accepting_chats/not_accepting_chats)
 */
export const updateAgentStatus = (socket, agentStatus) => {
  if (!socket.connected) {
    console.warn('Socket not connected, cannot update agent status');
    return;
  }

  const validStatuses = ['accepting_chats', 'not_accepting_chats'];
  if (!validStatuses.includes(agentStatus)) {
    console.error('Invalid agent status:', agentStatus);
    return;
  }

  socket.emit(EVENTS.UPDATE_AGENT_STATUS, { agentStatus });
  console.log('📡 Emitted updateAgentStatus:', agentStatus);
};

/**
 * Send agent heartbeat
 * @param {Socket} socket - Socket.IO client instance
 * @param {number} userId - User ID
 */
export const sendAgentHeartbeat = (socket, userId) => {
  if (!socket.connected) {
    return;
  }

  socket.emit(EVENTS.AGENT_HEARTBEAT, { userId });
  console.log('💓 Agent heartbeat sent');
};

/**
 * Mark agent as offline
 * @param {Socket} socket - Socket.IO client instance
 * @param {number} userId - User ID
 */
export const setAgentOffline = (socket, userId) => {
  if (!socket.connected) {
    return;
  }

  socket.emit(EVENTS.AGENT_OFFLINE, { userId });
  console.log('😴 Agent marked as offline');
};



/**
 * Send user heartbeat
 * @param {Socket} socket - Socket.IO client instance
 * @param {number} userId - User ID
 */
export const sendUserHeartbeat = (socket, userId) => {
  if (!socket.connected) {
    return;
  }

  socket.emit(EVENTS.AGENT_HEARTBEAT, { userId });
  console.log('💓 Heartbeat sent (user active)');
};

/**
 * Mark user as offline
 * @param {Socket} socket - Socket.IO client instance
 * @param {number} userId - User ID
 */
export const setUserOffline = (socket, userId) => {
  if (!socket.connected) {
    return;
  }

  socket.emit(EVENTS.AGENT_OFFLINE, { userId });
  console.log('😴 User marked as offline');
};

/**
 * Emit agent online event
 * @param {Socket} socket - Socket.IO client instance
 * @param {number} userId - User ID
 */
export const setAgentOnline = (socket, userId) => {
  if (!socket.connected) {
    console.warn('Socket not connected, cannot set agent online');
    return;
  }

  socket.emit(EVENTS.AGENT_ONLINE, { userId });
  console.log('📡 Agent online, joining department rooms...');
};

/**
 * Request agent statuses from server
 * @param {Socket} socket - Socket.IO client instance
 */
export const getAgentStatuses = (socket) => {
  if (!socket.connected) {
    console.warn('Socket not connected, cannot get agent statuses');
    return;
  }

  console.log('📡 Requesting agent statuses from server...');
  socket.emit(EVENTS.GET_AGENT_STATUSES);
};
