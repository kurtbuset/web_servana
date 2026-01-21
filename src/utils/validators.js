/**
 * Validation Utilities
 * Common validation functions for form inputs and data validation
 */

/**
 * Validate email format
 * @param {string} email - Email address to validate
 * @returns {boolean} True if valid email format
 */
export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Validate password strength
 * Requirements: At least 8 characters, contains uppercase, lowercase, and number
 * @param {string} password - Password to validate
 * @returns {Object} { isValid: boolean, errors: string[] }
 */
export const validatePassword = (password) => {
  const errors = [];
  
  if (!password || typeof password !== 'string') {
    return { isValid: false, errors: ['Password is required'] };
  }
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate required field
 * @param {any} value - Value to validate
 * @returns {boolean} True if value is not empty
 */
export const isRequired = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
};

/**
 * Validate string length
 * @param {string} value - String to validate
 * @param {number} min - Minimum length
 * @param {number} max - Maximum length
 * @returns {boolean} True if length is within range
 */
export const isValidLength = (value, min = 0, max = Infinity) => {
  if (!value || typeof value !== 'string') return false;
  const length = value.trim().length;
  return length >= min && length <= max;
};

/**
 * Validate phone number format
 * Accepts various formats: (123) 456-7890, 123-456-7890, 1234567890
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid phone format
 */
export const isValidPhone = (phone) => {
  if (!phone || typeof phone !== 'string') return false;
  
  const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  return phoneRegex.test(phone.trim());
};

/**
 * Validate URL format
 * @param {string} url - URL to validate
 * @returns {boolean} True if valid URL format
 */
export const isValidUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validate number range
 * @param {number} value - Number to validate
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {boolean} True if number is within range
 */
export const isInRange = (value, min = -Infinity, max = Infinity) => {
  if (typeof value !== 'number' || isNaN(value)) return false;
  return value >= min && value <= max;
};

/**
 * Validate that value is a positive number
 * @param {number} value - Number to validate
 * @returns {boolean} True if positive number
 */
export const isPositiveNumber = (value) => {
  return typeof value === 'number' && !isNaN(value) && value > 0;
};

/**
 * Validate form data against rules
 * @param {Object} data - Form data to validate
 * @param {Object} rules - Validation rules { fieldName: [validators] }
 * @returns {Object} { isValid: boolean, errors: Object }
 * 
 * @example
 * const rules = {
 *   email: [(v) => isValidEmail(v) || 'Invalid email'],
 *   password: [(v) => isRequired(v) || 'Password required']
 * };
 * const result = validateForm(formData, rules);
 */
export const validateForm = (data, rules) => {
  const errors = {};
  let isValid = true;
  
  Object.keys(rules).forEach((field) => {
    const validators = rules[field];
    const value = data[field];
    
    for (const validator of validators) {
      const result = validator(value);
      if (result !== true) {
        errors[field] = result;
        isValid = false;
        break;
      }
    }
  });
  
  return { isValid, errors };
};

/**
 * Check if string contains only alphanumeric characters
 * @param {string} value - String to validate
 * @returns {boolean} True if alphanumeric
 */
export const isAlphanumeric = (value) => {
  if (!value || typeof value !== 'string') return false;
  return /^[a-zA-Z0-9]+$/.test(value);
};

/**
 * Check if string contains only letters
 * @param {string} value - String to validate
 * @returns {boolean} True if only letters
 */
export const isAlpha = (value) => {
  if (!value || typeof value !== 'string') return false;
  return /^[a-zA-Z]+$/.test(value);
};

/**
 * Check if value is a valid date
 * @param {any} value - Value to validate
 * @returns {boolean} True if valid date
 */
export const isValidDate = (value) => {
  if (!value) return false;
  const date = new Date(value);
  return date instanceof Date && !isNaN(date);
};

/**
 * Check if date is in the past
 * @param {Date|string} date - Date to check
 * @returns {boolean} True if date is in the past
 */
export const isPastDate = (date) => {
  if (!isValidDate(date)) return false;
  return new Date(date) < new Date();
};

/**
 * Check if date is in the future
 * @param {Date|string} date - Date to check
 * @returns {boolean} True if date is in the future
 */
export const isFutureDate = (date) => {
  if (!isValidDate(date)) return false;
  return new Date(date) > new Date();
};

export default {
  isValidEmail,
  validatePassword,
  isRequired,
  isValidLength,
  isValidPhone,
  isValidUrl,
  isInRange,
  isPositiveNumber,
  validateForm,
  isAlphanumeric,
  isAlpha,
  isValidDate,
  isPastDate,
  isFutureDate,
};
