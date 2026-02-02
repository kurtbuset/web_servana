import { io } from "socket.io-client";

let socketInstance = null;

// Create socket with credentials
const createSocket = () => {
  if (socketInstance) {
    return socketInstance;
  }

  socketInstance = io(import.meta.env.VITE_BACKEND_URL, {
    autoConnect: false,
    withCredentials: true, // ✅ important to send cookies
  });

  return socketInstance;
};

// Function to clear socket (called during logout)
export const clearSocket = () => {
  console.log("🔌 Clearing web socket during logout");
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
};

// Get or create socket instance
const socket = createSocket();

export default socket;
