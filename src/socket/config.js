/**
 * Socket Configuration
 */
import { getAccessToken } from '../api';

export const socketConfig = {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  randomizationFactor: 0.5,
  timeout: 20000,
  auth: (cb) => {
    const token = getAccessToken();
    cb({
      token: token || undefined,
      timestamp: Date.now(),
    });
  },
  extraHeaders: {
    get Authorization() {
      const token = getAccessToken();
      return token ? `Bearer ${token}` : undefined;
    }
  }
};

export const getSocketUrl = () => {
  return import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_BACKEND_URL;
};
