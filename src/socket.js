import { io } from "socket.io-client";
import tokenService from "./services/token.service";

let socketInstance = null;

// Create socket with credentials
const createSocket = () => {
  if (socketInstance) {
    return socketInstance;
  }

  socketInstance = io(import.meta.env.VITE_BACKEND_URL, {
    autoConnect: false,
    withCredentials: true, // ✅ important to send cookies
  });

  // Handle token refresh events
  socketInstance.on('token_refreshed', (data) => {
    console.log('✅ Token refreshed automatically:', data.message);
    tokenService.handleSocketTokenRefresh(data);
  });

  socketInstance.on('token_expiring', (data) => {
    console.warn('⚠️ Token expiring:', data.message);
    tokenService.handleTokenExpiring(data);
  });

  socketInstance.on('session_expired', (data) => {
    console.error('❌ Session expired:', data.message || data.reason);
    tokenService.handleSessionExpired();
  });

  socketInstance.on('token_refresh_required', async (data) => {
    console.log('🔄 Token refresh required by server');
    try {
      await tokenService.refreshToken();
    } catch (error) {
      console.error('Failed to refresh token:', error);
    }
  });

  return socketInstance;
};

// Function to clear socket (called during logout)
export const clearSocket = () => {
  console.log("🔌 Clearing web socket during logout");
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
};

// Get or create socket instance
const socket = createSocket();

export default socket;
