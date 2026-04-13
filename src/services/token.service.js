import api, { getAccessToken, setAccessToken } from '../api';

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
      const refreshToken = sessionStorage.getItem('refresh_token');
      const sessionId = sessionStorage.getItem('session_id');

      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await api.post('/auth/refresh', 
        { session_id: sessionId },
        {
          headers: {
            'Authorization': `Bearer ${refreshToken}`
          }
        }
      );
      
      if (response.data) {
        const { access_token, refresh_token } = response.data;
        
        // Update tokens
        setAccessToken(access_token);
        sessionStorage.setItem('refresh_token', refresh_token);
        
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
    
    // Clear tokens
    sessionStorage.removeItem('refresh_token');
    sessionStorage.removeItem('session_id');
    
    // Redirect to login
    window.location.href = '/login';
  }

  /**
   * Handle token refresh from socket
   * @param {Object} data - Token data from socket
   */
  handleSocketTokenRefresh(data) {
    console.log('🔄 Token refreshed via socket');
    
    if (data.access_token) {
      setAccessToken(data.access_token);
    }
    
    if (data.refresh_token) {
      sessionStorage.setItem('refresh_token', data.refresh_token);
    }
    
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
    
    if (data.access_token) {
      setAccessToken(data.access_token);
      console.log('New access token stored');
    }
    
    if (data.refresh_token) {
      sessionStorage.setItem('refresh_token', data.refresh_token);
    }
    
    if (data.expires_at) {
      console.log(`New token expires at: ${new Date(data.expires_at * 1000).toLocaleString()}`);
    }
  }
}

export default new TokenService();
