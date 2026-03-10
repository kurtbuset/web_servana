/**
 * Typing Indicator Socket Events
 * Handles typing and stop typing events
 */

/**
 * Register typing event listeners
 * @param {Socket} socket - Socket.IO client instance
 * @param {Object} callbacks - Event callback functions
 * @param {Function} callbacks.onTyping - Called when someone starts typing
 * @param {Function} callbacks.onStopTyping - Called when someone stops typing
 * @returns {Function} Cleanup function to unregister events
 */
export const registerTypingEvents = (socket, callbacks = {}) => {
  const {
    onTyping,
    onStopTyping
  } = callbacks;

  // User started typing
  const handleTyping = (data) => {
    if (onTyping) {
      onTyping(data);
    }
  };

  // User stopped typing
  const handleStopTyping = (data) => {
    if (onStopTyping) {
      onStopTyping(data);
    }
  };

  // Register listeners
  socket.on('typing', handleTyping);
  socket.on('stopTyping', handleStopTyping);

  // Return cleanup function
  return () => {
    socket.off('typing', handleTyping);
    socket.off('stopTyping', handleStopTyping);
  };
};
