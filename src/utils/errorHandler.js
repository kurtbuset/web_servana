import { toast } from 'react-toastify';

/**
 * Centralized error handling utility
 * Provides consistent error logging and user feedback
 */

/**
 * Handle errors with consistent logging and user feedback
 * @param {Error} error - The error object
 * @param {string} userMessage - User-friendly error message
 * @param {Object} options - Additional options
 * @param {boolean} options.showToast - Whether to show toast notification (default: true)
 * @param {boolean} options.logToConsole - Whether to log to console (default: true)
 * @param {string} options.context - Additional context for logging
 */
export const handleError = (error, userMessage, options = {}) => {
  const {
    showToast = true,
    logToConsole = true,
    context = '',
  } = options;

  // Log to console
  if (logToConsole) {
    const logMessage = context ? `[${context}] ${userMessage}` : userMessage;
    console.error(logMessage, error);
  }

  // Show user feedback
  if (showToast) {
    toast.error(userMessage);
  }

  // Future: Send to error tracking service (Sentry, etc.)
  // if (options.logToService) {
  //   errorTrackingService.log(error, { userMessage, context });
  // }
};

/**
 * Handle API errors with response parsing
 * @param {Error} error - The error object
 * @param {string} defaultMessage - Default user message
 * @param {Object} options - Additional options
 */
export const handleApiError = (error, defaultMessage, options = {}) => {
  const userMessage = error.response?.data?.error || 
                     error.response?.data?.message || 
                     defaultMessage;
  
  handleError(error, userMessage, options);
};

/**
 * Handle permission errors
 * @param {string} action - The action that was attempted
 */
export const handlePermissionError = (action) => {
  toast.error(`You don't have permission to ${action}`);
};

/**
 * Success notification helper
 * @param {string} message - Success message
 */
export const showSuccess = (message) => {
  toast.success(message);
};

/**
 * Info notification helper
 * @param {string} message - Info message
 */
export const showInfo = (message) => {
  toast.info(message);
};
