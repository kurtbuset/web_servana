/**
 * Presence Socket Handlers
 * Emitters and event listeners for user presence functionality
 */

// ============= EMITTERS =============

export const emitPresenceUpdate = (socket, status) => {
  if (!socket.connected) {
    console.warn("Socket not connected");
    return;
  }
  socket.emit("presence:update", { status });
};

export const emitPresenceHeartbeat = (socket) => {
  if (!socket.connected) return;
  socket.emit("presence:heartbeat");
};

export const requestAllPresences = (socket) => {
  if (!socket.connected) return;
  socket.emit("presence:getAll");
};

export const requestAvailableByDepartment = (socket) => {
  if (!socket.connected) return;
  socket.emit("presence:getAvailableByDepartment");
};

// ============= EVENT LISTENERS =============

export const registerPresenceEvents = (socket, callbacks = {}) => {
  const {
    onPresenceChange,
    onPresenceAll,
    onAvailableByDepartment,
  } = callbacks;

  const handlePresenceChange = (data) => {
    if (onPresenceChange) onPresenceChange(data);
  };

  const handlePresenceAll = (data) => {
    if (onPresenceAll) onPresenceAll(data);
  };

  const handleAvailableByDepartment = (data) => {
    if (onAvailableByDepartment) onAvailableByDepartment(data);
  };

  // Register listeners
  socket.on("presence:change", handlePresenceChange);
  socket.on("presence:all", handlePresenceAll);
  socket.on("presence:availableByDepartment", handleAvailableByDepartment);

  // Return cleanup function
  return () => {
    socket.off("presence:change", handlePresenceChange);
    socket.off("presence:all", handlePresenceAll);
    socket.off("presence:availableByDepartment", handleAvailableByDepartment);
  };
};
