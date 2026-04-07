/**
 * Socket Configuration
 */

const getAccessTokenFromCookie = () => {
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === "access_token") {
      return decodeURIComponent(value);
    }
  }
  return null;
};

export const socketConfig = {
  autoConnect: false,
  withCredentials: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  randomizationFactor: 0.5,
  timeout: 20000,
  auth: (cb) => {
    const token = getAccessTokenFromCookie();
    cb({
      token: token || undefined,
      timestamp: Date.now(),
    });
  },
};

export const getSocketUrl = () => {
  return import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_BACKEND_URL;
};
