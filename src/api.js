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

// Restore access token from refresh token on page load
export const restoreAccessToken = async () => {
  // If already restoring, wait for that promise
  if (tokenRestorePromise) {
    return tokenRestorePromise;
  }
  
  // If already have token, return it
  if (accessToken) {
    return accessToken;
  }
  
  const refreshToken = sessionStorage.getItem('refresh_token');
  if (!refreshToken) {
    return null;
  }

  // Create promise and cache it so multiple calls wait for same restore
  tokenRestorePromise = (async () => {
    try {
      const sessionId = sessionStorage.getItem('session_id');
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/refresh`,
        { session_id: sessionId },
        {
          headers: {
            'Authorization': `Bearer ${refreshToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const { access_token, refresh_token } = response.data.data || response.data;
      
      setAccessToken(access_token);
      sessionStorage.setItem('refresh_token', refresh_token);
      
      console.log('✅ Access token restored from refresh token');
      return access_token;
    } catch (error) {
      console.error('❌ Failed to restore access token:', error);
      // Clear invalid tokens
      clearAccessToken();
      sessionStorage.removeItem('refresh_token');
      sessionStorage.removeItem('session_id');
      return null;
    } finally {
      // Clear promise after completion
      tokenRestorePromise = null;
    }
  })();

  return tokenRestorePromise;
};

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
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
        const refreshToken = sessionStorage.getItem('refresh_token');
        const sessionId = sessionStorage.getItem('session_id');

        if (refreshToken) {
          const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/auth/refresh`,
            { session_id: sessionId },
            {
              headers: {
                'Authorization': `Bearer ${refreshToken}`,
                'Content-Type': 'application/json'
              }
            }
          );

          const { access_token, refresh_token } = response.data.data || response.data;

          // Update tokens
          setAccessToken(access_token);
          sessionStorage.setItem('refresh_token', refresh_token);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed - clear tokens and redirect to login
        clearAccessToken();
        sessionStorage.removeItem('refresh_token');
        sessionStorage.removeItem('session_id');
        window.location.href = '/login';
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
