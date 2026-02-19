/**
 * Chat and Queue Configuration Constants
 * Centralized configuration for chat/queue functionality
 */

export const CHAT_CONFIG = {
  // Fetch and API settings
  FETCH_COOLDOWN_MS: 1000,
  MESSAGES_PER_PAGE: 10,
  
  // UI timing
  END_CHAT_DELAY_MS: 1500,
  SCROLL_THROTTLE_MS: 300,
  DEBOUNCE_UPDATE_MS: 500,
  SCROLL_TOP_THRESHOLD: 50,
  SCROLL_POSITION_DELAY_MS: 50,
  
  // Default values
  DEFAULT_DEPARTMENT: 'All',
  DEFAULT_SENDER_NAME: 'Unknown',
  
  // Message display
  TIME_FORMAT_OPTIONS: {
    hour: '2-digit',
    minute: '2-digit',
  },
};

export const SOCKET_EVENTS = {
  // Common events
  SEND_MESSAGE: 'sendMessage',
  RECEIVE_MESSAGE: 'receiveMessage',
  JOIN_CHAT_GROUP: 'joinChatGroup',
  LEAVE_ROOM: 'leaveRoom',
  LEAVE_PREVIOUS_ROOM: 'leavePreviousRoom',
  
  // Chat-specific events
  UPDATE_CHAT_GROUPS: 'updateChatGroups',
  CUSTOMER_LIST_UPDATE: 'customerListUpdate',
  
  // Queue-specific events
  ACCEPT_CHAT: 'acceptChat',
  
  // User events
  USER_JOINED: 'userJoined',
  USER_LEFT: 'userLeft',
};

export const PERMISSIONS = {
  CAN_MESSAGE: 'priv_can_message',
  CAN_END_CHAT: 'priv_can_end_chat',
  CAN_TRANSFER: 'priv_can_transfer',
  CAN_USE_CANNED_MESSAGES: 'priv_can_use_canned_mess',
};

export const SENDER_TYPES = {
  USER: 'user',
  SYSTEM: 'system',
  AGENT: 'agent',
  CURRENT_AGENT: 'current_agent',
};

export const VIEW_STATES = {
  CHAT_LIST: 'chatList',
  CONVERSATION: 'conversation',
};

export const CUSTOMER_LIST_UPDATE_TYPES = {
  MOVE_TO_TOP: 'move_to_top',
};
