/**
 * Socket Configuration
 * Centralized socket.io-client configuration
 */

/**
 * Get access token from cookies
 * Note: This only works if the cookie is not HTTP-only
 */
export const getAccessTokenFromCookie = () => {
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'access_token') {
      return decodeURIComponent(value);
    }
  }
  return null;
};

/**
 * Socket.IO client configuration
 */
export const socketConfig = {
  autoConnect: false,
  withCredentials: true, // ✅ Automatically sends HTTP-only cookies
  
  // Reconnection strategy
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  randomizationFactor: 0.5,
  
  // Timeout settings
  timeout: 20000,
  
  auth: (cb) => {
    // Try to get token from cookie (fallback if cookies are not HTTP-only)
    const token = getAccessTokenFromCookie();
    cb({
      token: token || undefined,
      timestamp: Date.now()
    });
  }
};

/**
 * Get socket URL from environment
 */
export const getSocketUrl = () => {
  return import.meta.env.VITE_BACKEND_URL;
};
