/**
 * Image utility functions for handling profile pictures
 */

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
const DEFAULT_AVATAR = '/profile_picture/DefaultProfile.jpg';

/**
 * Get the full URL for a profile picture
 * Handles both Supabase URLs and local Docker storage paths
 * 
 * @param {string|null} imgLocation - The image location from database
 * @returns {string} Full URL to the image or default avatar
 */
export function getProfilePictureUrl(imgLocation) {
  if (!imgLocation) {
    return DEFAULT_AVATAR;
  }

  // If it's already a full URL (Supabase), return as-is
  if (imgLocation.startsWith('http://') || imgLocation.startsWith('https://')) {
    return imgLocation;
  }

  // If it's a relative path (Docker storage), prepend backend URL
  if (imgLocation.startsWith('uploads/')) {
    return `${BACKEND_URL}/${imgLocation}`;
  }

  // Fallback to default
  return DEFAULT_AVATAR;
}

/**
 * Get avatar URL from user data object
 * 
 * @param {object} userData - User data object with image property
 * @returns {string} Full URL to the avatar
 */
export function getAvatarUrl(userData) {
  return getProfilePictureUrl(userData?.image?.img_location);
}

/**
 * Preload an image to avoid flickering
 * 
 * @param {string} url - Image URL to preload
 * @returns {Promise<string>} Resolves with URL when loaded
 */
export function preloadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(url);
    img.onerror = reject;
    img.src = url;
  });
}

/**
 * Get initials from name for avatar placeholder
 * 
 * @param {string} name - Full name
 * @returns {string} Initials (max 2 characters)
 */
export function getInitials(name) {
  if (!name) return 'U';
  
  const parts = name.trim().split(' ');
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

/**
 * Generate a placeholder avatar URL using UI Avatars service
 * 
 * @param {string} name - Name to display
 * @param {string} background - Background color (hex without #)
 * @param {string} color - Text color (hex without #)
 * @returns {string} Avatar URL
 */
export function getPlaceholderAvatar(name = 'User', background = '6237A0', color = 'fff') {
  const encodedName = encodeURIComponent(name);
  return `https://ui-avatars.com/api/?name=${encodedName}&background=${background}&color=${color}&size=128`;
}
