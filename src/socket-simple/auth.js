/**
 * Authentication Socket Events
 */
import tokenService from "../services/token.service";
import { toast } from "react-toastify";

export const registerAuthEvents = (socket) => {
  // Token refreshed successfully
  socket.on("tokenRefreshed", (data) => {
    console.log("✅ Token refreshed automatically:", data.message);
    tokenService.handleSocketTokenRefresh(data);
  });

  // Token expiring warning
  socket.on("tokenExpiring", (data) => {
    console.warn("⚠️ Token expiring:", data.message);
    toast.warning("Your session is expiring soon. Please save your work.", {
      autoClose: 10000,
    });
    tokenService.handleTokenExpiring(data);
  });

  // Session expired
  socket.on("sessionExpired", (data) => {
    console.error("❌ Session expired:", data.message || data.reason);
    toast.error("Your session has expired. Please log in again.", {
      autoClose: false,
    });
    tokenService.handleSessionExpired();
  });

  // Token refresh required by server
  socket.on("tokenRefreshRequired", async (data) => {
    console.log("🔄 Token refresh required by server");
    try {
      await tokenService.refreshToken();
      toast.success("Session renewed successfully");
    } catch (error) {
      console.error("Failed to refresh token:", error);
      toast.error("Failed to renew session. Please log in again.");
    }
  });

  // New token provided (for mobile clients)
  socket.on("newToken", (data) => {
    console.log("🔄 New token received from server");
    if (data.access_token) {
      tokenService.handleNewToken(data);
    }
  });

  // Generic auth events
  socket.on("authenticated", (data) => {
    console.log("✅ Socket authenticated:", data);
  });

  socket.on("unauthorized", (error) => {
    console.error("❌ Socket unauthorized:", error);
  });
};
