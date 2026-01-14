import { io } from "socket.io-client";
const socket = io(import.meta.env.VITE_BACKEND_URL, {
  autoConnect: false,
  withCredentials: true, // ✅ important to send cookies
});
export default socket;
