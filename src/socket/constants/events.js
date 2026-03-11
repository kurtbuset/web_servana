/**
 * Socket Event Constants
 * Centralized event names to prevent typos and enable refactoring
 * 
 * Convention:
 * - OUTGOING: Events emitted by client (client → server)
 * - INCOMING: Events received by client (server → client)
 */

// ============================================
// CHAT EVENTS
// ============================================

// Outgoing (Client → Server)
export const JOIN_CHAT_GROUP = 'joinChatGroup';
export const LEAVE_PREVIOUS_ROOM = 'leavePreviousRoom';
export const LEAVE_ROOM = 'leaveRoom';
export const SEND_MESSAGE = 'sendMessage';

// Incoming (Server → Client)
export const RECEIVE_MESSAGE = 'receiveMessage';
export const MESSAGE_DELIVERED = 'messageDelivered';
export const MESSAGE_ERROR = 'messageError';
export const CUSTOMER_LIST_UPDATE = 'customerListUpdate';
export const USER_JOINED = 'userJoined';
export const USER_LEFT = 'userLeft';
export const JOINED_ROOM = 'joinedRoom';

// ============================================
// TYPING EVENTS
// ============================================

// Outgoing (Client → Server)
export const TYPING = 'typing';
export const STOP_TYPING = 'stopTyping';

// Incoming (Server → Client)
// (Same as outgoing - received from other users)

// ============================================
// AGENT STATUS EVENTS
// ============================================

// Outgoing (Client → Server)
export const AGENT_ONLINE = 'agentOnline';
export const AGENT_OFFLINE = 'agentOffline';
export const AGENT_HEARTBEAT = 'agentHeartbeat';
export const UPDATE_AGENT_STATUS = 'updateAgentStatus';
export const GET_AGENT_STATUSES = 'getAgentStatuses';

// Incoming (Server → Client)
export const AGENT_STATUSES_LIST = 'agentStatusesList';
export const AGENT_STATUS_CHANGED = 'agentStatusChanged';
export const AGENT_STATUS_ERROR = 'agentStatusError';
export const AGENT_STATUS_UPDATE_SUCCESS = 'agentStatusUpdateSuccess';
export const AGENT_HEARTBEAT_ACK = 'agentHeartbeatAck';

// ============================================
// AUTHENTICATION EVENTS
// ============================================

// Incoming (Server → Client)
export const TOKEN_REFRESHED = 'token_refreshed';
export const TOKEN_EXPIRING = 'token_expiring';
export const SESSION_EXPIRED = 'session_expired';
export const TOKEN_REFRESH_REQUIRED = 'token_refresh_required';
export const NEW_TOKEN = 'new_token';

// ============================================
// CONNECTION EVENTS (Socket.IO Built-in)
// ============================================

export const CONNECT = 'connect';
export const DISCONNECT = 'disconnect';
export const CONNECT_ERROR = 'connect_error';
export const RECONNECT = 'reconnect';
export const RECONNECT_ATTEMPT = 'reconnect_attempt';
export const RECONNECT_FAILED = 'reconnect_failed';

// ============================================
// ERROR EVENTS
// ============================================

export const ERROR = 'error';

// ============================================
// GROUPED EXPORTS FOR CONVENIENCE
// ============================================

export const CHAT_EVENTS = {
  JOIN_CHAT_GROUP,
  LEAVE_PREVIOUS_ROOM,
  LEAVE_ROOM,
  SEND_MESSAGE,
  RECEIVE_MESSAGE,
  MESSAGE_DELIVERED,
  MESSAGE_ERROR,
  CUSTOMER_LIST_UPDATE,
  USER_JOINED,
  USER_LEFT,
  JOINED_ROOM
};

export const TYPING_EVENTS = {
  TYPING,
  STOP_TYPING
};

export const AGENT_EVENTS = {
  AGENT_ONLINE,
  AGENT_OFFLINE,
  AGENT_HEARTBEAT,
  UPDATE_AGENT_STATUS,
  GET_AGENT_STATUSES,
  AGENT_STATUSES_LIST,
  AGENT_STATUS_CHANGED,
  AGENT_STATUS_ERROR,
  AGENT_STATUS_UPDATE_SUCCESS,
  AGENT_HEARTBEAT_ACK
};

export const AUTH_EVENTS = {
  TOKEN_REFRESHED,
  TOKEN_EXPIRING,
  SESSION_EXPIRED,
  TOKEN_REFRESH_REQUIRED,
  NEW_TOKEN
};

export const CONNECTION_EVENTS = {
  CONNECT,
  DISCONNECT,
  CONNECT_ERROR,
  RECONNECT,
  RECONNECT_ATTEMPT,
  RECONNECT_FAILED
};
