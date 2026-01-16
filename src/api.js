// src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL, // e.g., http://localhost:5000
  withCredentials: true, // send/receive cookies
  headers: { 'Content-Type': 'application/json' },
  timeout: 5000,
});

export default api;
