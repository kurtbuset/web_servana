/**
 * Format last seen time like Facebook/Instagram
 * @param {Date|string} lastSeenDate - The last seen timestamp
 * @returns {string} - Formatted string like "online", "offline just now", "5m ago", etc.
 */
export const formatLastSeen = (lastSeenDate) => {
  if (!lastSeenDate) return 'offline';
  
  const now = new Date();
  const lastSeen = new Date(lastSeenDate);
  const diffMs = now - lastSeen;
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  // Online if last seen within 2 minutes (120 seconds)
  if (diffSeconds < 120) {
    return 'online';
  }
  
  // "offline just now" if within 30 seconds after going offline (2-2.5 min range)
  if (diffSeconds >= 120 && diffSeconds < 150) {
    return 'offline just now';
  }
  
  // Minutes ago
  if (diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  }
  
  // Hours ago
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }
  
  // Yesterday
  if (diffDays === 1) {
    return 'yesterday';
  }
  
  // Days ago (up to 7 days)
  if (diffDays < 7) {
    return `${diffDays}d ago`;
  }
  
  // Weeks ago
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks}w ago`;
  }
  
  // More than a month - show date
  return lastSeen.toLocaleDateString();
};

/**
 * Get status color based on last seen
 * @param {Date|string} lastSeenDate - The last seen timestamp
 * @returns {string} - Color class or hex color
 */
export const getStatusColor = (lastSeenDate) => {
  if (!lastSeenDate) return '#6b7280'; // gray
  
  const now = new Date();
  const lastSeen = new Date(lastSeenDate);
  const diffSeconds = Math.floor((now - lastSeen) / 1000);
  
  // Online (green) - within 2 minutes
  if (diffSeconds < 120) {
    return '#10b981'; // green-500
  }
  
  // Recently active (yellow/orange) - within 5 minutes
  if (diffSeconds < 300) {
    return '#f59e0b'; // amber-500
  }
  
  // Offline (gray)
  return '#6b7280'; // gray-500
};

/**
 * Check if user is currently online
 * @param {Date|string} lastSeenDate - The last seen timestamp
 * @returns {boolean}
 */
export const isUserOnline = (lastSeenDate) => {
  if (!lastSeenDate) return false;
  
  const now = new Date();
  const lastSeen = new Date(lastSeenDate);
  const diffSeconds = Math.floor((now - lastSeen) / 1000);
  
  // Online if last seen within 2 minutes (120 seconds)
  return diffSeconds < 120;
};
