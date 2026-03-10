/**
 * Authentication Socket Events
 * Handles token refresh, expiration, and session management
 */
import tokenService from '../../services/token.service';

/**
 * Register authentication event listeners
 * @param {Socket} socket - Socket.IO client instance
 */
export const registerAuthEvents = (socket) => {
  // Token refreshed successfully
  socket.on('token_refreshed', (data) => {
    console.log('✅ Token refreshed automatically:', data.message);
    tokenService.handleSocketTokenRefresh(data);
  });

  // Token expiring warning
  socket.on('token_expiring', (data) => {
    console.warn('⚠️ Token expiring:', data.message);
    tokenService.handleTokenExpiring(data);
  });

  // Session expired
  socket.on('session_expired', (data) => {
    console.error('❌ Session expired:', data.message || data.reason);
    tokenService.handleSessionExpired();
  });

  // Token refresh required by server
  socket.on('token_refresh_required', async (data) => {
    console.log('🔄 Token refresh required by server');
    try {
      await tokenService.refreshToken();
    } catch (error) {
      console.error('Failed to refresh token:', error);
    }
  });
};

/**
 * Unregister authentication event listeners
 * @param {Socket} socket - Socket.IO client instance
 */
export const unregisterAuthEvents = (socket) => {
  socket.off('token_refreshed');
  socket.off('token_expiring');
  socket.off('session_expired');
  socket.off('token_refresh_required');
};
