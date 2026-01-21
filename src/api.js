// src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL, // e.g., http://localhost:3000
  withCredentials: true, // send/receive cookies
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000, // Increased to 10 seconds
});

export default api;
