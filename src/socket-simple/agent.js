/**
 * Agent Status Socket Handlers
 */

// ============= EMITTERS =============

export const updateAgentStatus = (socket, agentStatus) => {
  if (!socket.connected) {
    console.warn("Socket not connected");
    return;
  }
  const validStatuses = ["accepting_chats", "not_accepting_chats"];
  if (!validStatuses.includes(agentStatus)) {
    console.error("Invalid agent status:", agentStatus);
    return;
  }
  socket.emit("updateAgentStatus", { agentStatus });
  console.log("📡 Emitted updateAgentStatus:", agentStatus);
};

export const sendAgentHeartbeat = (socket, userId) => {
  if (!socket.connected) return;
  socket.emit("agentHeartbeat", { userId });
  console.log("💓 Agent heartbeat sent");
};

export const setAgentOffline = (socket, userId) => {
  if (!socket.connected) return;
  socket.emit("agentOffline", { userId });
  console.log("😴 Agent marked as offline");
};

export const setAgentOnline = (socket, userId) => {
  if (!socket.connected) {
    console.warn("Socket not connected");
    return;
  }
  socket.emit("agentOnline", { userId });
};

export const getAgentStatuses = (socket) => {
  if (!socket.connected) {
    console.warn("Socket not connected");
    return;
  }
  socket.emit("getAgentStatuses");
};

// User heartbeat/offline (for activity tracking)
export const sendUserHeartbeat = (socket, userId) => {
  if (!socket.connected) return;
  socket.emit("agentHeartbeat", { userId });
};

export const setUserOffline = (socket, userId) => {
  if (!socket.connected) return;
  socket.emit("agentOffline", { userId });
};

// ============= EVENT LISTENERS =============

export const registerAgentEvents = (socket, callbacks = {}) => {
  const {
    onAgentStatusesList,
    onAgentStatusChanged,
    onAgentStatusError,
    onAgentOnline,
    onAgentOffline,
  } = callbacks;

  const handleAgentStatusesList = (agents) => {
    if (onAgentStatusesList) onAgentStatusesList(agents);
  };

  const handleAgentStatusChanged = (data) => {
    if (onAgentStatusChanged) onAgentStatusChanged(data);
  };

  const handleAgentStatusError = (error) => {
    console.error("❌ Agent status error:", error);
    if (onAgentStatusError) onAgentStatusError(error);
  };

  const handleAgentOnline = (data) => {
    if (onAgentOnline) onAgentOnline(data);
  };

  const handleAgentOffline = (data) => {
    if (onAgentOffline) onAgentOffline(data);
  };

  socket.on("agentStatuses", handleAgentStatusesList);
  socket.on("agentStatusUpdate", handleAgentStatusChanged);
  socket.on("agentStatusError", handleAgentStatusError);
  socket.on("agentOnline", handleAgentOnline);
  socket.on("agentOffline", handleAgentOffline);

  return () => {
    socket.off("agentStatuses", handleAgentStatusesList);
    socket.off("agentStatusUpdate", handleAgentStatusChanged);
    socket.off("agentStatusError", handleAgentStatusError);
    socket.off("agentOnline", handleAgentOnline);
    socket.off("agentOffline", handleAgentOffline);
  };
};
