/**
 * Socket.IO Client Instance
 * Main socket singleton with configuration and event registration
 */
import { io } from 'socket.io-client';
import { socketConfig, getSocketUrl } from './config';
import { registerAuthEvents } from './events';
import * as EVENTS from './constants/events';

// Create socket singleton
const socket = io(getSocketUrl(), socketConfig);

// Register authentication events (always active)
registerAuthEvents(socket);

// Connection lifecycle events
socket.on(EVENTS.CONNECT, () => {
  console.log('✅ Socket connected:', socket.id);
});

socket.on(EVENTS.DISCONNECT, (reason) => {
  const disconnectInfo = {
    reason,
    socketId: socket.id,
    timestamp: new Date().toISOString(),
    wasConnected: socket.connected
  };
  
  console.warn('❌ Socket disconnected:', disconnectInfo);
  
  // Handle different disconnect reasons with user-friendly messages
  switch (reason) {
    case 'io server disconnect':
      console.error('🚨 Server disconnected the socket (auth failure or manual kick)');
      // Server will not auto-reconnect - user needs to refresh or re-login
      break;
      
    case 'io client disconnect':
      console.log('ℹ️ Client intentionally disconnected (logout or manual disconnect)');
      // Intentional disconnect - no reconnection needed
      break;
      
    case 'ping timeout':
      console.error('🚨 Ping timeout - server did not receive pong in time');
      // Will auto-reconnect
      break;
      
    case 'transport close':
      console.error('🚨 Transport closed - network issue or server restart');
      // Will auto-reconnect
      break;
      
    case 'transport error':
      console.error('🚨 Transport error - connection failed');
      // Will auto-reconnect
      break;
      
    default:
      console.warn(`❓ Unknown disconnect reason: ${reason}`);
  }
});

socket.on(EVENTS.CONNECT_ERROR, (error) => {
  console.error('❌ Socket connection error:', {
    message: error.message,
    description: error.description,
    context: error.context,
    type: error.type
  });
  
  // Handle specific connection errors
  if (error.message.includes('Authentication failed')) {
    console.error('🚨 Authentication failed - token may be expired');
  } else if (error.message.includes('xhr poll error')) {
    console.error('🚨 XHR poll error - cookie may have expired');
  }
});

socket.on(EVENTS.RECONNECT_ATTEMPT, (attemptNumber) => {
  console.log(`🔄 Reconnection attempt #${attemptNumber}`);
});

socket.on(EVENTS.RECONNECT, (attemptNumber) => {
  console.log(`✅ Reconnected after ${attemptNumber} attempts`);
});

socket.on(EVENTS.RECONNECT_FAILED, () => {
  console.error('❌ Reconnection failed after all attempts');
});

// Export socket instance as default
export default socket;

// Re-export utilities for convenience
export * from './events';
export * from './emitters';
export { socketConfig, getSocketUrl } from './config';
