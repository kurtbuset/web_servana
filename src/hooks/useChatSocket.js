import { useEffect, useRef } from "react";
import socket, {
  registerChatEvents,
  joinChatGroup,
  leaveChatGroup,
} from "../socket";

/**
 * useChatSocket hook manages Socket.IO lifecycle for chat
 *
 * Handles:
 * - Auto join/leave rooms based on selected customer
 * - Register/cleanup event listeners
 * - Reconnect on logout
 * - Message status updates (delivered, read)
 * - Chat transfer notifications
 * - Chat resolved notifications
 *
 * @param {Object} params - Hook parameters
 * @param {Object} params.selectedCustomer - Currently selected customer
 * @param {Function} params.getUserId - Function to get current user ID
 * @param {Function} params.onMessageReceived - Callback when message is received
 * @param {Function} params.onCustomerListUpdate - Callback for customer list updates
 * @param {Function} params.onUserJoined - Callback when user joins room
 * @param {Function} params.onMessageStatusUpdate - Callback for message status updates
 * @param {Function} params.onChatTransferred - Callback when chat is transferred
 * @param {Function} params.onChatResolved - Callback when chat is resolved
 * @param {boolean} params.enabled - Whether socket is enabled (default: true)
 */
export const useChatSocket = ({
  selectedCustomer,
  getUserId,
  onMessageReceived,
  onCustomerListUpdate,
  onUserJoined,
  onMessageStatusUpdate,
  onChatTransferred,
  onChatResolved,
  enabled = true,
}) => {
  // Track the current room to properly leave it
  const currentRoomRef = useRef(null);

  // Handle logout events to reconnect socket with fresh cookies
  useEffect(() => {
    if (!enabled) return;

    const channel = new BroadcastChannel('auth_logout');
    channel.onmessage = (event) => {
      if (event.data?.type === 'LOGOUT') {
        console.log("Logout detected - reconnecting socket");
        socket.disconnect();
        setTimeout(() => socket.connect(), 100);
      }
    };

    return () => channel.close();
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
      onMessageStatusUpdate,
      onChatTransferred,
      onChatResolved,
    });

    return cleanup;
  }, [
    getUserId,
    onMessageReceived,
    onCustomerListUpdate,
    onUserJoined,
    onMessageStatusUpdate,
    onChatTransferred,
    onChatResolved,
    enabled,
  ]);

  // Auto join/leave rooms when customer changes
  useEffect(() => {
    if (!enabled) return;

    const userId = getUserId();
    if (!userId) {
      console.warn("No user ID available, cannot join chat group");
      return;
    }

    // If there's a selected customer, join their room
    if (selectedCustomer?.chat_group_id) {
      const newRoomId = selectedCustomer.chat_group_id;

      // Leave previous room if different
      if (currentRoomRef.current && currentRoomRef.current !== newRoomId) {
        leaveChatGroup(socket, currentRoomRef.current);
      }

      // Join new room
      joinChatGroup(socket, {
        groupId: newRoomId,
        userType: "agent",
        userId: userId,
      });

      currentRoomRef.current = newRoomId;
    } else {
      // No customer selected - leave current room if any
      if (currentRoomRef.current) {
        leaveChatGroup(socket, currentRoomRef.current);
        currentRoomRef.current = null;
      }
    }

    // Cleanup: leave room when component unmounts or customer changes
    return () => {
      if (currentRoomRef.current) {
        leaveChatGroup(socket, currentRoomRef.current);
      }
    };
  }, [selectedCustomer?.chat_group_id, getUserId, enabled]);
};
