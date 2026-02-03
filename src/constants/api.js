/**
 * API Constants
 * Centralized API configuration and endpoint definitions
 */

// API Base URLs
export const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

// API Timeouts (in milliseconds)
export const API_TIMEOUT = {
  DEFAULT: 10000, // 10 seconds
  UPLOAD: 30000,  // 30 seconds for file uploads
  LONG: 60000,    // 60 seconds for long operations
};

// Common Headers
export const API_HEADERS = {
  JSON: {
    'Content-Type': 'application/json',
  },
  FORM_DATA: {
    'Content-Type': 'multipart/form-data',
  },
  TEXT: {
    'Content-Type': 'text/plain',
  },
};

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    REFRESH: '/auth/refresh',
  },
  
  // Profile
  PROFILE: {
    GET: '/profile',
    UPDATE: '/profile',
    UPLOAD_IMAGE: '/profile/upload',
  },
  
  // Dashboard
  DASHBOARD: {
    STATS: '/dashboard/stats',
    ADMIN_STATS: '/dashboard/admin',
    AGENT_STATS: '/dashboard/agent',
    CLIENT_STATS: '/dashboard/client',
  },
  
  // Chat
  CHAT: {
    GROUPS: '/chat/groups',
    MESSAGES: '/chat/messages',
    SEND: '/chat/send',
    CANNED: '/chat/canned',
  },
  
  // Queue
  QUEUE: {
    LIST: '/queues',
    ACCEPT: '/queues/accept',
    REJECT: '/queues/reject',
  },
  
  // Departments
  DEPARTMENT: {
    LIST: '/department',
    CREATE: '/department',
    UPDATE: (id) => `/department/${id}`,
    DELETE: (id) => `/department/${id}`,
    TOGGLE: (id) => `/department/${id}/toggle`,
  },
  
  // Agents
  AGENT: {
    LIST: '/manage-agents',
    CREATE: '/manage-agents',
    UPDATE: (id) => `/manage-agents/${id}`,
    DELETE: (id) => `/manage-agents/${id}`,
  },
  
  // Roles
  ROLE: {
    LIST: '/role',
    CREATE: '/role',
    UPDATE: (id) => `/role/${id}`,
    DELETE: (id) => `/role/${id}`,
    USERS: '/role/users',
    ASSIGN: '/change-role',
  },
  
  // Auto-replies
  AUTO_REPLY: {
    LIST: '/auto-replies',
    CREATE: '/auto-replies',
    UPDATE: (id) => `/auto-replies/${id}`,
    DELETE: (id) => `/auto-replies/${id}`,
    TOGGLE: (id) => `/auto-replies/${id}/toggle`,
  },
  
  // Macros
  MACRO: {
    AGENTS: {
      LIST: '/agents',
      CREATE: '/agents',
      UPDATE: (id) => `/agents/${id}`,
      DELETE: (id) => `/agents/${id}`,
    },
    CLIENTS: {
      LIST: '/clients',
      CREATE: '/clients',
      UPDATE: (id) => `/clients/${id}`,
      DELETE: (id) => `/clients/${id}`,
    },
  },
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

// API Error Messages
export const API_ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  TIMEOUT: 'Request timeout. Please try again.',
  UNAUTHORIZED: 'You are not authorized. Please login.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNKNOWN: 'An unexpected error occurred.',
};

// Request Methods
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
};

// Socket Events
export const SOCKET_EVENTS = {
  // Connection
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  ERROR: 'error',
  
  // Chat
  JOIN_CHAT: 'joinChatGroup',
  LEAVE_CHAT: 'leaveChatGroup',
  RECEIVE_MESSAGE: 'receiveMessage',
  SEND_MESSAGE: 'sendMessage',
  MESSAGE_DELIVERED: 'messageDelivered',
  MESSAGE_ERROR: 'messageError',
  
  // Queue
  QUEUE_UPDATE: 'queueUpdate',
  NEW_QUEUE_ITEM: 'newQueueItem',
  QUEUE_ACCEPTED: 'queueAccepted',
  QUEUE_REJECTED: 'queueRejected',
  
  // Notifications
  NOTIFICATION: 'notification',
  USER_ONLINE: 'userOnline',
  USER_OFFLINE: 'userOffline',
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
};

// Cache Keys
export const CACHE_KEYS = {
  USER: 'user',
  PROFILE: 'profile',
  DEPARTMENTS: 'departments',
  ROLES: 'roles',
  AGENTS: 'agents',
};

// Cache Durations (in milliseconds)
export const CACHE_DURATION = {
  SHORT: 60000,      // 1 minute
  MEDIUM: 300000,    // 5 minutes
  LONG: 900000,      // 15 minutes
  VERY_LONG: 3600000, // 1 hour
};

/**
 * Build URL with query parameters
 * @param {string} baseUrl - Base URL
 * @param {Object} params - Query parameters
 * @returns {string} URL with query string
 */
export const buildUrl = (baseUrl, params = {}) => {
  const url = new URL(baseUrl, API_BASE_URL);
  Object.keys(params).forEach((key) => {
    if (params[key] !== null && params[key] !== undefined) {
      url.searchParams.append(key, params[key]);
    }
  });
  return url.toString();
};

/**
 * Get error message from API error
 * @param {Error} error - API error
 * @returns {string} Error message
 */
export const getErrorMessage = (error) => {
  if (error.response) {
    // Server responded with error status
    const status = error.response.status;
    const message = error.response.data?.error || error.response.data?.message;
    
    if (message) return message;
    
    switch (status) {
      case HTTP_STATUS.UNAUTHORIZED:
        return API_ERROR_MESSAGES.UNAUTHORIZED;
      case HTTP_STATUS.FORBIDDEN:
        return API_ERROR_MESSAGES.FORBIDDEN;
      case HTTP_STATUS.NOT_FOUND:
        return API_ERROR_MESSAGES.NOT_FOUND;
      case HTTP_STATUS.INTERNAL_SERVER_ERROR:
        return API_ERROR_MESSAGES.SERVER_ERROR;
      default:
        return API_ERROR_MESSAGES.UNKNOWN;
    }
  } else if (error.request) {
    // Request made but no response
    return API_ERROR_MESSAGES.NETWORK_ERROR;
  } else if (error.code === 'ECONNABORTED') {
    // Request timeout
    return API_ERROR_MESSAGES.TIMEOUT;
  }
  
  return error.message || API_ERROR_MESSAGES.UNKNOWN;
};

export default {
  API_BASE_URL,
  SOCKET_URL,
  API_TIMEOUT,
  API_HEADERS,
  API_ENDPOINTS,
  HTTP_STATUS,
  API_ERROR_MESSAGES,
  HTTP_METHODS,
  SOCKET_EVENTS,
  PAGINATION,
  CACHE_KEYS,
  CACHE_DURATION,
  buildUrl,
  getErrorMessage,
};
