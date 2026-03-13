import { useEffect } from "react";
import socket, {
  registerChatEvents,
  joinChatGroup,
  leaveRoom,
} from "../socket-simple";

/**
 * useChatSocket hook manages Socket.IO lifecycle for chat
 *
 * Handles:
 * - Auto join/leave rooms based on selected customer
 * - Register/cleanup event listeners
 * - Reconnect on logout
 *
 * @param {Object} params - Hook parameters
 * @param {Object} params.selectedCustomer - Currently selected customer
 * @param {Function} params.getUserId - Function to get current user ID
 * @param {Function} params.onMessageReceived - Callback when message is received
 * @param {Function} params.onCustomerListUpdate - Callback for customer list updates
 * @param {Function} params.onUserJoined - Callback when user joins room
 * @param {Function} params.onUserLeft - Callback when user leaves room
 * @param {boolean} params.enabled - Whether socket is enabled (default: true)
 */
export const useChatSocket = ({
  selectedCustomer,
  getUserId,
  onMessageReceived,
  onCustomerListUpdate,
  onUserJoined,
  onUserLeft,
  enabled = true,
}) => {
  // Handle logout events to reconnect socket with fresh cookies
  useEffect(() => {
    if (!enabled) return;

    const handleLogout = () => {
      console.log("Logout detected - reconnecting socket");
      socket.disconnect();
      setTimeout(() => socket.connect(), 100);
    };

    const handleStorage = (event) => {
      if (event.key === "logout") handleLogout();
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [enabled]);

  // Register chat event listeners
  useEffect(() => {
    if (!enabled) return;

    const cleanup = registerChatEvents(socket, {
      onMessageReceived: (msg) => {
        const userId = getUserId();
        if (onMessageReceived) onMessageReceived(msg, userId);
      },
      onCustomerListUpdate,
      onUserJoined,
      onUserLeft,
    });

    return cleanup;
  }, [
    getUserId,
    onMessageReceived,
    onCustomerListUpdate,
    onUserJoined,
    onUserLeft,
    enabled,
  ]);

  // Auto join/leave rooms when customer changes
  useEffect(() => {
    if (!enabled || !selectedCustomer) return;

    const userId = getUserId();
    if (!userId) {
      console.warn("No user ID available, cannot join chat group");
      return;
    }

    const currentRoomId = selectedCustomer.chat_group_id;

    // Join chat group (backend automatically leaves previous room)
    joinChatGroup(socket, {
      groupId: currentRoomId,
      userType: "agent",
      userId: userId,
    });

    // Cleanup: leave room on unmount or customer change
    return () => {
      leaveRoom(socket, {
        roomId: currentRoomId,
        userType: "agent",
        userId: userId,
      });
    };
  }, [selectedCustomer?.chat_group_id, getUserId, enabled]);
};
