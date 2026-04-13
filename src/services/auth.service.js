import api, { setAccessToken, clearAccessToken } from '../api';

/**
 * AuthService handles all authentication-related API calls
 * 
 * Backend endpoints:
 * - POST /auth/login - Login with email/password
 * - POST /auth/logout - Logout current user
 * - GET /auth/me - Get current authenticated user
 * - GET /auth/user-id - Get current user's sys_user_id
 */
export class AuthService {
  /**
   * Login user with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} Login result with user data
   */
  static async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    const { access_token, refresh_token, session_id, user } = response.data;

    // Store tokens
    setAccessToken(access_token);
    sessionStorage.setItem('refresh_token', refresh_token);
    if (session_id) {
      sessionStorage.setItem('session_id', session_id);
    }

    return response.data;
  }

  /**
   * Logout current user
   * Clears authentication tokens
   * @returns {Promise<Object>} Logout result
   */
  static async logout() {
    const sessionId = sessionStorage.getItem('session_id');
    
    try {
      const response = await api.post('/auth/logout', { session_id: sessionId });
      return response.data;
    } finally {
      // Clear tokens regardless of API response
      clearAccessToken();
      sessionStorage.removeItem('refresh_token');
      sessionStorage.removeItem('session_id');
    }
  }

  /**
   * Get current authenticated user
   * Used for checking authentication status
   * @returns {Promise<Object>} User authentication data
   */
  static async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response.data;
  }

  /**
   * Get current user's sys_user_id
   * @returns {Promise<Object>} Object containing sys_user_id
   */
  static async getUserId() {
    const response = await api.get('/auth/user-id');
    return response.data;
  }
}
