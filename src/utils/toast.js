import React from 'react';
import { toast as reactToast } from 'react-toastify';
import Toast from '../components/ui/Toast';

/**
 * Toast Notification Utility
 * 
 * A wrapper around react-toastify with custom Toast component.
 * Provides success, error, warning, and info notifications with modern design.
 */

const defaultOptions = {
  position: "top-right",
  autoClose: 3500,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  closeButton: false, // We use our custom close button
};

/**
 * Show a success toast notification
 * @param {string} message - The message to display
 * @param {object} options - Optional toast configuration
 */
export const showSuccess = (message, options = {}) => {
  reactToast.success(
    ({ closeToast }) => React.createElement(Toast, {
      type: "success",
      title: "Success",
      message: message,
      onClose: closeToast
    }),
    {
      ...defaultOptions,
      ...options,
    }
  );
};

/**
 * Show an error toast notification
 * @param {string} message - The message to display
 * @param {object} options - Optional toast configuration
 */
export const showError = (message, options = {}) => {
  reactToast.error(
    ({ closeToast }) => React.createElement(Toast, {
      type: "error",
      title: "Error",
      message: message,
      onClose: closeToast
    }),
    {
      ...defaultOptions,
      ...options,
    }
  );
};

/**
 * Show a warning toast notification
 * @param {string} message - The message to display
 * @param {object} options - Optional toast configuration
 */
export const showWarning = (message, options = {}) => {
  reactToast.warning(
    ({ closeToast }) => React.createElement(Toast, {
      type: "warning",
      title: "Warning",
      message: message,
      onClose: closeToast
    }),
    {
      ...defaultOptions,
      ...options,
    }
  );
};

/**
 * Show an info toast notification
 * @param {string} message - The message to display
 * @param {object} options - Optional toast configuration
 */
export const showInfo = (message, options = {}) => {
  reactToast.info(
    ({ closeToast }) => React.createElement(Toast, {
      type: "info",
      title: "Information",
      message: message,
      onClose: closeToast
    }),
    {
      ...defaultOptions,
      ...options,
    }
  );
};

/**
 * Show a loading toast notification
 * Returns a toast ID that can be used to update or dismiss the toast
 * @param {string} message - The message to display
 * @param {object} options - Optional toast configuration
 * @returns {string|number} Toast ID
 */
export const showLoading = (message = "Loading...", options = {}) => {
  return reactToast.loading(message, {
    ...defaultOptions,
    autoClose: false,
    closeButton: false,
    ...options,
  });
};

/**
 * Update an existing toast (useful for loading states)
 * @param {string|number} toastId - The ID of the toast to update
 * @param {object} config - Update configuration
 */
export const updateToast = (toastId, config) => {
  reactToast.update(toastId, {
    ...defaultOptions,
    ...config,
  });
};

/**
 * Dismiss a specific toast
 * @param {string|number} toastId - The ID of the toast to dismiss
 */
export const dismissToast = (toastId) => {
  reactToast.dismiss(toastId);
};

/**
 * Dismiss all toasts
 */
export const dismissAll = () => {
  reactToast.dismiss();
};

/**
 * Show a promise-based toast (automatically handles loading, success, and error states)
 * @param {Promise} promise - The promise to track
 * @param {object} messages - Messages for each state { pending, success, error }
 * @param {object} options - Optional toast configuration
 */
export const showPromise = (promise, messages, options = {}) => {
  return reactToast.promise(
    promise,
    {
      pending: messages.pending || "Processing...",
      success: messages.success || "Success!",
      error: messages.error || "Something went wrong",
    },
    {
      ...defaultOptions,
      ...options,
    }
  );
};

// Export the original toast for advanced use cases
export const toast = reactToast;

// Default export with all methods
export default {
  success: showSuccess,
  error: showError,
  warning: showWarning,
  info: showInfo,
  loading: showLoading,
  update: updateToast,
  dismiss: dismissToast,
  dismissAll,
  promise: showPromise,
  toast: reactToast,
};
