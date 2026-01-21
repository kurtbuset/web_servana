/**
 * Application Configuration
 * Centralized app settings and feature flags
 */

// Environment
export const ENV = {
  MODE: import.meta.env.MODE || 'development',
  IS_DEV: import.meta.env.DEV || false,
  IS_PROD: import.meta.env.PROD || false,
};

// Application Info
export const APP_INFO = {
  NAME: 'Servana',
  VERSION: '1.0.0',
  DESCRIPTION: 'Customer Support Platform',
};

// Feature Flags
export const FEATURES = {
  ENABLE_SOCKET: true,
  ENABLE_NOTIFICATIONS: true,
  ENABLE_FILE_UPLOAD: true,
  ENABLE_DARK_MODE: false,
  ENABLE_ANALYTICS: false,
  ENABLE_DEBUG_MODE: ENV.IS_DEV,
};

// UI Configuration
export const UI_CONFIG = {
  // Sidebar
  SIDEBAR_WIDTH: 250,
  SIDEBAR_COLLAPSED_WIDTH: 60,
  
  // Toast Notifications
  TOAST_POSITION: 'top-right',
  TOAST_AUTO_CLOSE: 3000,
  TOAST_AUTO_CLOSE_SUCCESS: 3000,
  TOAST_AUTO_CLOSE_ERROR: 5000,
  
  // Pagination
  DEFAULT_PAGE_SIZE: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
  
  // Tables
  MAX_TABLE_HEIGHT: '65vh',
  
  // Modals
  MODAL_ANIMATION_DURATION: 300,
  
  // Forms
  INPUT_DEBOUNCE_DELAY: 300,
  SEARCH_DEBOUNCE_DELAY: 500,
};

// Date/Time Configuration
export const DATE_CONFIG = {
  DEFAULT_FORMAT: 'MMM DD, YYYY',
  DATETIME_FORMAT: 'MMM DD, YYYY, h:mm A',
  TIME_FORMAT: 'h:mm A',
  DATE_LOCALE: 'en-US',
};

// File Upload Configuration
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
};

// Validation Rules
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 50,
  EMAIL_MAX_LENGTH: 255,
  NAME_MAX_LENGTH: 100,
  MESSAGE_MAX_LENGTH: 5000,
  DESCRIPTION_MAX_LENGTH: 500,
};

// Role IDs (for backward compatibility)
export const ROLE_IDS = {
  ADMIN: 1,
  CLIENT: 2,
  AGENT: 3,
};

// Role Names
export const ROLE_NAMES = {
  ADMIN: 'Admin',
  CLIENT: 'Client',
  AGENT: 'Agent',
};

// Status Values
export const STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

// Chat Status
export const CHAT_STATUS = {
  OPEN: 'open',
  CLOSED: 'closed',
  QUEUED: 'queued',
  IN_PROGRESS: 'in_progress',
};

// Priority Levels
export const PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
};

// Colors (for UI consistency)
export const COLORS = {
  PRIMARY: '#6237A0',
  SECONDARY: '#8B5CF6',
  SUCCESS: '#10B981',
  WARNING: '#F59E0B',
  ERROR: '#EF4444',
  INFO: '#3B82F6',
  GRAY: '#6B7280',
  LIGHT_GRAY: '#F3F4F6',
  DARK_GRAY: '#1F2937',
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language',
  SIDEBAR_STATE: 'sidebar_state',
  SHOW_LOGIN_TOAST: 'showLoginToast',
};

// Session Storage Keys
export const SESSION_KEYS = {
  REDIRECT_URL: 'redirect_url',
  TEMP_DATA: 'temp_data',
};

// Regex Patterns
export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
  URL: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
  ALPHANUMERIC: /^[a-zA-Z0-9]+$/,
  ALPHA: /^[a-zA-Z]+$/,
  NUMERIC: /^[0-9]+$/,
};

// Error Codes
export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  DUPLICATE_ENTRY: 'DUPLICATE_ENTRY',
  SERVER_ERROR: 'SERVER_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
};

// Socket Configuration
export const SOCKET_CONFIG = {
  RECONNECTION: true,
  RECONNECTION_ATTEMPTS: 5,
  RECONNECTION_DELAY: 1000,
  RECONNECTION_DELAY_MAX: 5000,
  TIMEOUT: 20000,
};

// Logging Configuration
export const LOGGING = {
  ENABLED: ENV.IS_DEV,
  LEVEL: ENV.IS_DEV ? 'debug' : 'error',
  LOG_API_CALLS: ENV.IS_DEV,
  LOG_SOCKET_EVENTS: ENV.IS_DEV,
};

// Performance Configuration
export const PERFORMANCE = {
  ENABLE_LAZY_LOADING: true,
  ENABLE_CODE_SPLITTING: true,
  ENABLE_CACHING: true,
  CACHE_DURATION: 300000, // 5 minutes
};

// Security Configuration
export const SECURITY = {
  ENABLE_CSRF_PROTECTION: true,
  ENABLE_XSS_PROTECTION: true,
  SESSION_TIMEOUT: 3600000, // 1 hour
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 900000, // 15 minutes
};

/**
 * Get configuration value by key
 * @param {string} key - Configuration key (dot notation supported)
 * @param {any} defaultValue - Default value if key not found
 * @returns {any} Configuration value
 * 
 * @example
 * getConfig('UI_CONFIG.TOAST_POSITION') // 'top-right'
 */
export const getConfig = (key, defaultValue = null) => {
  const keys = key.split('.');
  let value = { 
    ENV, 
    APP_INFO, 
    FEATURES, 
    UI_CONFIG, 
    DATE_CONFIG, 
    FILE_UPLOAD, 
    VALIDATION,
    ROLE_IDS,
    ROLE_NAMES,
    STATUS,
    CHAT_STATUS,
    PRIORITY,
    COLORS,
    STORAGE_KEYS,
    SESSION_KEYS,
    REGEX,
    ERROR_CODES,
    SOCKET_CONFIG,
    LOGGING,
    PERFORMANCE,
    SECURITY,
  };
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return defaultValue;
    }
  }
  
  return value;
};

/**
 * Check if feature is enabled
 * @param {string} featureName - Feature name
 * @returns {boolean} True if feature is enabled
 */
export const isFeatureEnabled = (featureName) => {
  return FEATURES[featureName] === true;
};

export default {
  ENV,
  APP_INFO,
  FEATURES,
  UI_CONFIG,
  DATE_CONFIG,
  FILE_UPLOAD,
  VALIDATION,
  ROLE_IDS,
  ROLE_NAMES,
  STATUS,
  CHAT_STATUS,
  PRIORITY,
  COLORS,
  STORAGE_KEYS,
  SESSION_KEYS,
  REGEX,
  ERROR_CODES,
  SOCKET_CONFIG,
  LOGGING,
  PERFORMANCE,
  SECURITY,
  getConfig,
  isFeatureEnabled,
};
