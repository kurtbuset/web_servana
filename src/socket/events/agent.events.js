/**
 * Agent Status Socket Events
 * Handles agent status changes, status list updates, and errors
 */
import { showError } from '../../utils/toast';
import * as EVENTS from '../constants/events';

/**
 * Register agent status event listeners
 * @param {Socket} socket - Socket.IO client instance
 * @param {Object} callbacks - Event callback functions
 * @param {Function} callbacks.onAgentStatusesList - Called when agent statuses list is received
 * @param {Function} callbacks.onAgentStatusChanged - Called when an agent's status changes
 * @param {Function} callbacks.onAgentStatusError - Called when agent status operation fails
 * @returns {Function} Cleanup function to unregister events
 */
export const registerAgentEvents = (socket, callbacks = {}) => {
  const {
    onAgentStatusesList,
    onAgentStatusChanged,
    onAgentStatusError
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
    
    // Validate data before passing to callback
    if (onAgentStatusChanged) {
      onAgentStatusChanged(data);
    }
  };

  // Agent status error
  const handleAgentStatusError = (error) => {
    console.error('❌ Agent status error:', error);
    const errorMessage = error.error || 'Failed to update agent status';
    showError(errorMessage);
    
    if (onAgentStatusError) {
      onAgentStatusError(error);
    }
  };

  // Register listeners
  socket.on(EVENTS.AGENT_STATUSES_LIST, handleAgentStatusesList);
  socket.on(EVENTS.AGENT_STATUS_CHANGED, handleAgentStatusChanged);
  socket.on(EVENTS.AGENT_STATUS_ERROR, handleAgentStatusError);

  // Return cleanup function
  return () => {
    socket.off(EVENTS.AGENT_STATUSES_LIST, handleAgentStatusesList);
    socket.off(EVENTS.AGENT_STATUS_CHANGED, handleAgentStatusChanged);
    socket.off(EVENTS.AGENT_STATUS_ERROR, handleAgentStatusError);
  };
};
