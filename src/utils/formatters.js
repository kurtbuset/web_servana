/**
 * Formatting Utilities
 * Common formatting functions for displaying data
 */

/**
 * Format date to readable string
 * @param {Date|string} date - Date to format
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 * 
 * @example
 * formatDate(new Date()) // "Jan 16, 2026"
 * formatDate(new Date(), { dateStyle: 'full' }) // "Friday, January 16, 2026"
 */
export const formatDate = (date, options = {}) => {
  if (!date) return '';
  
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  };
  
  try {
    return new Intl.DateTimeFormat('en-US', defaultOptions).format(new Date(date));
  } catch {
    return '';
  }
};

/**
 * Format date and time to readable string
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date and time string
 * 
 * @example
 * formatDateTime(new Date()) // "Jan 16, 2026, 3:45 PM"
 */
export const formatDateTime = (date) => {
  if (!date) return '';
  
  try {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(new Date(date));
  } catch {
    return '';
  }
};

/**
 * Format time to readable string
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted time string
 * 
 * @example
 * formatTime(new Date()) // "3:45 PM"
 */
export const formatTime = (date) => {
  if (!date) return '';
  
  try {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(new Date(date));
  } catch {
    return '';
  }
};

/**
 * Format relative time (e.g., "2 hours ago")
 * @param {Date|string} date - Date to format
 * @returns {string} Relative time string
 * 
 * @example
 * formatRelativeTime(new Date(Date.now() - 3600000)) // "1 hour ago"
 */
export const formatRelativeTime = (date) => {
  if (!date) return '';
  
  try {
    const now = new Date();
    const past = new Date(date);
    const diffInSeconds = Math.floor((now - past) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
    return `${Math.floor(diffInSeconds / 31536000)} years ago`;
  } catch {
    return '';
  }
};

/**
 * Format name to title case
 * @param {string} name - Name to format
 * @returns {string} Formatted name
 * 
 * @example
 * formatName('john doe') // "John Doe"
 */
export const formatName = (name) => {
  if (!name || typeof name !== 'string') return '';
  
  return name
    .trim()
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Format phone number to standard format
 * @param {string} phone - Phone number to format
 * @returns {string} Formatted phone number
 * 
 * @example
 * formatPhone('1234567890') // "(123) 456-7890"
 */
export const formatPhone = (phone) => {
  if (!phone || typeof phone !== 'string') return '';
  
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  if (cleaned.length === 11 && cleaned[0] === '1') {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  
  return phone;
};

/**
 * Format number with thousand separators
 * @param {number} num - Number to format
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted number
 * 
 * @example
 * formatNumber(1234567.89) // "1,234,567.89"
 */
export const formatNumber = (num, decimals = 2) => {
  if (typeof num !== 'number' || isNaN(num)) return '0';
  
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
};

/**
 * Format currency
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: USD)
 * @returns {string} Formatted currency
 * 
 * @example
 * formatCurrency(1234.56) // "$1,234.56"
 */
export const formatCurrency = (amount, currency = 'USD') => {
  if (typeof amount !== 'number' || isNaN(amount)) return '$0.00';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

/**
 * Format percentage
 * @param {number} value - Value to format (0-1 or 0-100)
 * @param {boolean} isDecimal - Whether value is decimal (0-1) or percentage (0-100)
 * @returns {string} Formatted percentage
 * 
 * @example
 * formatPercentage(0.75, true) // "75%"
 * formatPercentage(75, false) // "75%"
 */
export const formatPercentage = (value, isDecimal = true) => {
  if (typeof value !== 'number' || isNaN(value)) return '0%';
  
  const percentage = isDecimal ? value * 100 : value;
  return `${percentage.toFixed(1)}%`;
};

/**
 * Format file size
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 * 
 * @example
 * formatFileSize(1024) // "1.00 KB"
 * formatFileSize(1048576) // "1.00 MB"
 */
export const formatFileSize = (bytes) => {
  if (typeof bytes !== 'number' || bytes < 0) return '0 B';
  
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(2)} ${units[unitIndex]}`;
};

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 * 
 * @example
 * truncateText('This is a long text', 10) // "This is a..."
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text || typeof text !== 'string') return '';
  if (text.length <= maxLength) return text;
  
  return text.slice(0, maxLength).trim() + '...';
};

/**
 * Format initials from name
 * @param {string} name - Full name
 * @returns {string} Initials
 * 
 * @example
 * formatInitials('John Doe') // "JD"
 */
export const formatInitials = (name) => {
  if (!name || typeof name !== 'string') return '';
  
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

/**
 * Format array to comma-separated string
 * @param {Array} arr - Array to format
 * @param {string} separator - Separator (default: ', ')
 * @returns {string} Formatted string
 * 
 * @example
 * formatList(['apple', 'banana', 'orange']) // "apple, banana, orange"
 */
export const formatList = (arr, separator = ', ') => {
  if (!Array.isArray(arr)) return '';
  return arr.filter(Boolean).join(separator);
};

/**
 * Format boolean to Yes/No
 * @param {boolean} value - Boolean value
 * @returns {string} "Yes" or "No"
 */
export const formatBoolean = (value) => {
  return value ? 'Yes' : 'No';
};

/**
 * Capitalize first letter of string
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 * 
 * @example
 * capitalize('hello world') // "Hello world"
 */
export const capitalize = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export default {
  formatDate,
  formatDateTime,
  formatTime,
  formatRelativeTime,
  formatName,
  formatPhone,
  formatNumber,
  formatCurrency,
  formatPercentage,
  formatFileSize,
  truncateText,
  formatInitials,
  formatList,
  formatBoolean,
  capitalize,
};
