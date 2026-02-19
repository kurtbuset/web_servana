import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { showSuccess, showError } from '../utils/toast';
import { AuthService } from '../services/auth.service';

/**
 * useAuth hook manages authentication state and actions
 * 
 * Features:
 * - Login with email/password
 * - Logout
 * - Loading and error state management
 * - Toast notifications for user feedback
 * - Automatic navigation after login
 * 
 * @returns {Object} Auth state and actions
 */
export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  /**
   * Login user with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} User data
   */
  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const result = await AuthService.login(email, password);
      showSuccess('Login successful');
      navigate('/dashboard');
      return result;
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Login failed';
      setError(errorMessage);
      showError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  /**
   * Logout current user
   * Clears authentication and navigates to login
   * @returns {Promise<void>}
   */
  const logout = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await AuthService.logout();
      showSuccess('Logged out successfully');
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
      // Even if logout fails on backend, navigate to login
      navigate('/login');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  /**
   * Get current user authentication status
   * @returns {Promise<Object>} User authentication data
   */
  const getCurrentUser = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await AuthService.getCurrentUser();
      return result;
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to get user';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get current user's sys_user_id
   * @returns {Promise<Object>} Object containing sys_user_id
   */
  const getUserId = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await AuthService.getUserId();
      return result;
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to get user ID';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    login,
    logout,
    getCurrentUser,
    getUserId,
    loading,
    error
  };
};
