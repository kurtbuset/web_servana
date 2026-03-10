/**
 * Socket.IO Client Instance
 * Main socket singleton with configuration and event registration
 */
import { io } from 'socket.io-client';
import { socketConfig, getSocketUrl } from './config';
import { registerAuthEvents } from './events';

// Create socket singleton
const socket = io(getSocketUrl(), socketConfig);

// Register authentication events (always active)
registerAuthEvents(socket);

/**
 * Connect socket manually
 * @deprecated Use socket.connect() directly or let UserContext handle it
 */
export const socketConnection = () => {
  socket.connect();
};

// Export socket instance as default
export default socket;

// Re-export utilities for convenience
export * from './events';
export * from './emitters';
export { socketConfig, getSocketUrl } from './config';
