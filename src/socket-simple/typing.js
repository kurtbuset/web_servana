/**
 * Typing Indicators
 */

// ============= EMITTERS =============

export const emitTyping = (socket, { chatGroupId, userId, userName }) => {
  if (!socket.connected) return;
  socket.emit("typing", { chatGroupId, userId, userName });
};

export const emitStopTyping = (socket, { chatGroupId, userId }) => {
  if (!socket.connected) return;
  socket.emit("stopTyping", { chatGroupId, userId });
};

// ============= EVENT LISTENERS =============

export const registerTypingEvents = (socket, callbacks = {}) => {
  const { onTyping, onStopTyping } = callbacks;

  const handleTyping = (data) => {
    if (onTyping) onTyping(data);
  };

  const handleStopTyping = (data) => {
    if (onStopTyping) onStopTyping(data);
  };

  socket.on("typing", handleTyping);
  socket.on("stopTyping", handleStopTyping);

  return () => {
    socket.off("typing", handleTyping);
    socket.off("stopTyping", handleStopTyping);
  };
};
