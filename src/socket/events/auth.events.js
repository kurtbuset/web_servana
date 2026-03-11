/**
 * Authentication Socket Events
 * Handles token refresh, expiration, and session management
 */
import tokenService from '../../services/token.service';
import { toast } from 'react-toastify';
import * as EVENTS from '../constants/events';

/**
 * Register authentication event listeners
 * @param {Socket} socket - Socket.IO client instance
 */
export const registerAuthEvents = (socket) => {
  // Token refreshed successfully
  socket.on(EVENTS.TOKEN_REFRESHED, (data) => {
    console.log('✅ Token refreshed automatically:', data.message);
    tokenService.handleSocketTokenRefresh(data);
  });

  // Token expiring warning
  socket.on(EVENTS.TOKEN_EXPIRING, (data) => {
    console.warn('⚠️ Token expiring:', data.message);
    toast.warning('Your session is expiring soon. Please save your work.', {
      autoClose: 10000
    });
    tokenService.handleTokenExpiring(data);
  });

  // Session expired
  socket.on(EVENTS.SESSION_EXPIRED, (data) => {
    console.error('❌ Session expired:', data.message || data.reason);
    toast.error('Your session has expired. Please log in again.', {
      autoClose: false
    });
    tokenService.handleSessionExpired();
  });

  // Token refresh required by server
  socket.on(EVENTS.TOKEN_REFRESH_REQUIRED, async (data) => {
    console.log('🔄 Token refresh required by server');
    try {
      await tokenService.refreshToken();
      toast.success('Session renewed successfully');
    } catch (error) {
      console.error('Failed to refresh token:', error);
      toast.error('Failed to renew session. Please log in again.');
    }
  });
  
  // New token provided (for mobile clients)
  socket.on(EVENTS.NEW_TOKEN, (data) => {
    console.log('🔄 New token received from server');
    // Mobile clients should update their stored token
    if (data.access_token) {
      tokenService.handleNewToken(data);
    }
  });
};

/**
 * Unregister authentication event listeners
 * @param {Socket} socket - Socket.IO client instance
 */
export const unregisterAuthEvents = (socket) => {
  socket.off(EVENTS.TOKEN_REFRESHED);
  socket.off(EVENTS.TOKEN_EXPIRING);
  socket.off(EVENTS.SESSION_EXPIRED);
  socket.off(EVENTS.TOKEN_REFRESH_REQUIRED);
  socket.off(EVENTS.NEW_TOKEN);
};
