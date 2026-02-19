// src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL, // e.g., http://localhost:5000
  withCredentials: true, // send/receive cookies
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000, // Increased to 30 seconds for slow queries
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout:', error.config.url);
    } else if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      // Request made but no response
      console.error('No response from server:', error.request);
    }
    return Promise.reject(error);
  }
);

export default api;
