/**
 * Agent Status Socket Events
 * Handles agent status changes and status list updates
 */

/**
 * Register agent status event listeners
 * @param {Socket} socket - Socket.IO client instance
 * @param {Object} callbacks - Event callback functions
 * @param {Function} callbacks.onAgentStatusesList - Called when agent statuses list is received
 * @param {Function} callbacks.onAgentStatusChanged - Called when an agent's status changes
 * @returns {Function} Cleanup function to unregister events
 */
export const registerAgentEvents = (socket, callbacks = {}) => {
  const {
    onAgentStatusesList,
    onAgentStatusChanged
  } = callbacks;

  // Agent statuses list received
  const handleAgentStatusesList = (agents) => {
    console.log('📋 Received agent statuses list:', agents);
    console.log('📋 Number of agents:', Object.keys(agents || {}).length);
    
    if (onAgentStatusesList) {
      onAgentStatusesList(agents);
    }
  };

  // Agent status changed
  const handleAgentStatusChanged = (data) => {
    console.log('🔄 Agent status changed:', data);
    
    if (onAgentStatusChanged) {
      onAgentStatusChanged(data);
    }
  };

  // Register listeners
  socket.on('agentStatusesList', handleAgentStatusesList);
  socket.on('agentStatusChanged', handleAgentStatusChanged);

  // Return cleanup function
  return () => {
    socket.off('agentStatusesList', handleAgentStatusesList);
    socket.off('agentStatusChanged', handleAgentStatusChanged);
  };
};
