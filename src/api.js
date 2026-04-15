// src/api.js
import axios from 'axios';

// Token storage in memory (cleared on page refresh - most secure)
let accessToken = null;
let tokenRestorePromise = null;

// Helper functions for token management
export const setAccessToken = (token) => {
  accessToken = token;
};

export const getAccessToken = () => {
  return accessToken;
};

export const clearAccessToken = () => {
  accessToken = null;
  tokenRestorePromise = null;
};

// Restore access token using refresh token cookie on page load
export const restoreAccessToken = async () => {
  // If already restoring, wait for that promise
  if (tokenRestorePromise) {
    return tokenRestorePromise;
  }

  // If already have token, return it
  if (accessToken) {
    return accessToken;
  }

  // Create promise and cache it so multiple calls wait for same restore
  tokenRestorePromise = (async () => {
    try {
      // Browser sends refresh_token cookie automatically via withCredentials
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/refresh`,
        {},
        { withCredentials: true }
      );

      const { access_token } = response.data.data || response.data;

      setAccessToken(access_token);
      console.log('✅ Access token restored from refresh token cookie');
      return access_token;
    } catch (error) {
      console.error('❌ Failed to restore access token:', error);
      clearAccessToken();
      return null;
    } finally {
      tokenRestorePromise = null;
    }
  })();

  return tokenRestorePromise;
};

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
  withCredentials: true,
});

// Request interceptor - Add Authorization header to all requests
api.interceptors.request.use(
  async (config) => {
    // Skip token restore for refresh endpoint to avoid infinite loop
    if (config.url?.includes('/auth/refresh')) {
      return config;
    }

    // Wait for token restoration if needed
    if (!accessToken) {
      await restoreAccessToken();
    }
    
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle token refresh and unwrap data
api.interceptors.response.use(
  (response) => {
    // Unwrap { data: ... } envelope
    if (response.data && response.data.data !== undefined) {
      response.data = response.data.data;
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If 401 and we haven't retried yet, try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Browser sends refresh_token cookie automatically via withCredentials
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const { access_token } = response.data.data || response.data;

        setAccessToken(access_token);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed - clear tokens and redirect to login if not already there
        clearAccessToken();
        if (window.location.pathname !== '/') {
          window.location.href = '/';
        }
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout:', error.config.url);
    } else if (error.response) {
      console.error('API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('No response from server:', error.request);
    }

    return Promise.reject(error);
  }
);

export default api;
