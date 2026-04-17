/**
 * Socket Connection Lifecycle
 * Handles connect, disconnect, reconnect events
 */

export const setupConnectionEvents = (socket) => {
  socket.on("connect", () => {
    // console.log("✅ Socket connected:", socket.id);
  });

  socket.on("disconnect", (reason) => {
    console.warn("❌ Socket disconnected:", {
      reason,
      socketId: socket.id,
      timestamp: new Date().toISOString(),
    });

    switch (reason) {
      case "io server disconnect":
        console.error("🚨 Server disconnected (auth failure or manual kick)");
        break;
      case "io client disconnect":
        console.log("ℹ️ Client intentionally disconnected");
        break;
      case "ping timeout":
        console.error("🚨 Ping timeout");
        break;
      case "transport close":
        console.error("🚨 Transport closed");
        break;
      case "transport error":
        console.error("🚨 Transport error");
        break;
      default:
        console.warn(`❓ Unknown disconnect reason: ${reason}`);
    }
  });

  socket.on("connect_error", (error) => {
    console.error("❌ Socket connection error:", {
      message: error.message,
      description: error.description,
    });

    if (error.message.includes("Authentication failed")) {
      console.error("🚨 Authentication failed - token may be expired");
    }
  });

  socket.on("reconnect_attempt", (attemptNumber) => {
    console.log(`🔄 Reconnection attempt #${attemptNumber}`);
  });

  socket.on("reconnect", (attemptNumber) => {
    console.log(`✅ Reconnected after ${attemptNumber} attempts`);
  });

  socket.on("reconnect_failed", () => {
    console.error("❌ Reconnection failed after all attempts");
  });
};
