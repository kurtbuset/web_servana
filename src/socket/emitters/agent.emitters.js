/**
 * Agent Socket Emitters
 * Functions to emit agent-related events to the server
 */

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

  socket.emit('updateAgentStatus', { agentStatus });
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

  socket.emit('agentHeartbeat', { userId });
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

  socket.emit('agentOffline', { userId });
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

  socket.emit('userHeartbeat', { userId });
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

  socket.emit('userOffline', { userId });
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

  socket.emit('agentOnline', { userId });
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
  socket.emit('getAgentStatuses');
};
