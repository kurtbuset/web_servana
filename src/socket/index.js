/**
 * Socket.IO Client - Simplified
 * Main socket singleton with minimal abstraction
 */
import { io } from "socket.io-client";
import { socketConfig, getSocketUrl } from "./config";
import { setupConnectionEvents } from "./connection";
import { registerAuthEvents } from "./auth";

// Create socket singleton
const socket = io(getSocketUrl(), socketConfig);

// Setup connection lifecycle events
setupConnectionEvents(socket);

// Register authentication events
registerAuthEvents(socket);

export default socket;

// Re-export everything for convenience
export * from "./chat";
export * from "./typing";
export * from "./agent";
export * from "./config";
