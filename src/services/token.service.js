import api from '../api';

/**
 * TokenService
 * Handles token refresh and session management
 */
class TokenService {
  constructor() {
    this.refreshTimer = null;
    this.isRefreshing = false;
  }

  /**
   * Refresh access token
   * @returns {Promise<Object>} New token data
   */
  async refreshToken() {
    if (this.isRefreshing) {
      console.log('Token refresh already in progress');
      return null;
    }

    this.isRefreshing = true;

    try {
      const response = await api.post('/auth/refresh', {}, { withCredentials: true });
      
      if (response.data) {
        console.log('✅ Token refreshed successfully');
        return response.data;
      }
      
      return null;
    } catch (error) {
      console.error('❌ Token refresh failed:', error);
      
      // If refresh fails, redirect to login
      if (error.response?.status === 401) {
        this.handleSessionExpired();
      }
      
      throw error;
    } finally {
      this.isRefreshing = false;
    }
  }

  /**
   * Start automatic token refresh
   * Refreshes token every 12 minutes (before 15-minute expiry)
   */
  startAutoRefresh() {
    // Clear existing timer
    this.stopAutoRefresh();

    // Refresh every 12 minutes (3 minutes before expiry)
    this.refreshTimer = setInterval(async () => {
      try {
        await this.refreshToken();
      } catch (error) {
        console.error('Auto-refresh failed:', error);
      }
    }, 12 * 60 * 1000); // 12 minutes
  }

  /**
   * Stop automatic token refresh
   */
  stopAutoRefresh() {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
      this.refreshTimer = null;
      console.log('⏹️ Auto token refresh stopped');
    }
  }

  /**
   * Handle session expiration
   */
  handleSessionExpired() {
    console.log('🔒 Session expired, redirecting to login');
    
    // Stop auto refresh
    this.stopAutoRefresh();
    
    // Redirect to login
    window.location.href = '/login';
  }

  /**
   * Handle token refresh from socket
   * @param {Object} data - Token data from socket
   */
  handleSocketTokenRefresh(data) {
    console.log('🔄 Token refreshed via socket');
    
    // The new token is already set in cookies by the server
    // We just need to acknowledge it
    if (data.expires_at) {
      console.log(`Token expires at: ${new Date(data.expires_at * 1000).toLocaleString()}`);
    }
  }

  /**
   * Handle token expiring warning from socket
   * @param {Object} data - Warning data from socket
   */
  handleTokenExpiring(data) {
    console.warn('⚠️ Token expiring soon:', data.message);
    
    // Attempt immediate refresh
    this.refreshToken().catch(error => {
      console.error('Failed to refresh expiring token:', error);
    });
  }

  /**
   * Handle new token from socket (for mobile clients)
   * @param {Object} data - New token data
   */
  handleNewToken(data) {
    console.log('🔄 New token received from socket');
    
    // For web clients, token is in HTTP-only cookie
    // For mobile clients, they should store this token
    if (data.access_token) {
      console.log('New access token available');
      
      // Mobile clients would store this in secure storage
      // Web clients don't need to do anything (cookie is already set)
    }
    
    if (data.expires_at) {
      console.log(`New token expires at: ${new Date(data.expires_at * 1000).toLocaleString()}`);
    }
  }
}

export default new TokenService();
