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
    const { access_token } = response.data;

    // Store access token in memory; refresh_token and session_id are in httpOnly cookies set by backend
    setAccessToken(access_token);

    return response.data;
  }

  /**
   * Logout current user
   * Clears authentication tokens
   * @returns {Promise<Object>} Logout result
   */
  static async logout() {
    try {
      // Backend reads session_id from httpOnly cookie and clears both cookies
      const response = await api.post('/auth/logout');
      return response.data;
    } finally {
      clearAccessToken();
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
