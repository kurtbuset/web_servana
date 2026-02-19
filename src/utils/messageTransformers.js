import { CHAT_CONFIG, SENDER_TYPES } from '../constants/chat.constants';

/**
 * Format message timestamp for display
 * @param {string} timestamp - ISO timestamp string
 * @returns {string} Formatted time string
 */
export const formatMessageTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString([], CHAT_CONFIG.TIME_FORMAT_OPTIONS);
};

/**
 * Determine frontend sender type from message
 * @param {Object} msg - Message object from API
 * @param {string} currentUserId - Current user's ID (optional, for agent messages)
 * @returns {string} 'user' or 'system'
 */
export const determineSenderType = (msg, currentUserId = null) => {
  if (msg.sender_type === SENDER_TYPES.CURRENT_AGENT) {
    return SENDER_TYPES.USER;
  }
  
  if (currentUserId && msg.sender_type === SENDER_TYPES.AGENT && msg.sender_id === currentUserId) {
    return SENDER_TYPES.USER;
  }
  
  return SENDER_TYPES.SYSTEM;
};

/**
 * Transform API message to frontend message format
 * @param {Object} msg - Raw message from API
 * @param {number} index - Message index (fallback for ID)
 * @param {string} currentUserId - Current user's ID (optional)
 * @returns {Object} Transformed message object
 */
export const transformMessage = (msg, index, currentUserId = null) => ({
  id: msg.chat_id || index,
  sender: determineSenderType(msg, currentUserId),
  content: msg.chat_body,
  timestamp: msg.chat_created_at,
  sender_name: msg.sender_name || CHAT_CONFIG.DEFAULT_SENDER_NAME,
  sender_type: msg.sender_type || SENDER_TYPES.SYSTEM,
  sender_image: msg.sender_image || null,
  displayTime: formatMessageTime(msg.chat_created_at),
});

/**
 * Transform array of API messages to frontend format
 * @param {Array} messages - Array of raw messages from API
 * @param {string} currentUserId - Current user's ID (optional)
 * @returns {Array} Array of transformed messages
 */
export const transformMessages = (messages, currentUserId = null) => {
  return messages.map((msg, index) => transformMessage(msg, index, currentUserId));
};

/**
 * Deduplicate messages by ID
 * @param {Array} messages - Array of messages
 * @returns {Array} Deduplicated messages
 */
export const deduplicateMessages = (messages) => {
  const uniqueMessages = [];
  const seenIds = new Set();

  for (const msg of messages) {
    if (!seenIds.has(msg.id)) {
      seenIds.add(msg.id);
      uniqueMessages.push(msg);
    }
  }

  return uniqueMessages;
};

/**
 * Create system message (for chat end, etc.)
 * @param {string} content - Message content
 * @returns {Object} System message object
 */
export const createSystemMessage = (content) => {
  const now = new Date();
  return {
    id: Date.now(),
    sender: SENDER_TYPES.SYSTEM,
    content,
    timestamp: now.toISOString(),
    displayTime: formatMessageTime(now.toISOString()),
  };
};
