import { useEffect, useCallback } from 'react';
import socket from '../socket/index';
import { registerChatEvents } from '../socket/events';
import { joinChatGroup, leavePreviousRoom, leaveRoom, sendMessage as sendMessageEmitter } from '../socket/emitters';

/**
 * useChatSocket hook manages Socket.IO connections and events
 * 
 * Features:
 * - Join/leave chat rooms
 * - Listen for real-time messages
 * - Listen for customer list updates
 * - Send messages via Socket.IO
 * 
 * @param {Object} params - Hook parameters
 * @param {Object} params.selectedCustomer - Currently selected customer
 * @param {Function} params.getUserId - Function to get current user ID
 * @param {Function} params.onMessageReceived - Callback when message is received
 * @param {Function} params.onCustomerListUpdate - Callback for customer list updates
 * @param {Function} params.onUserJoined - Callback when user joins room
 * @param {Function} params.onUserLeft - Callback when user leaves room
 * @param {boolean} params.enabled - Whether socket is enabled (default: true)
 * @returns {Object} Socket actions
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
  /**
   * Handle logout events to reconnect socket with fresh cookies
   */
  useEffect(() => {
    if (!enabled) return;

    // Listen for logout events to reconnect socket with fresh cookies
    const handleLogout = () => {
      console.log('Logout detected - reconnecting socket');
      socket.disconnect();
      // Small delay to ensure cookies are cleared
      setTimeout(() => {
        socket.connect();
      }, 100);
    };

    window.addEventListener('storage', (event) => {
      if (event.key === 'logout') {
        handleLogout();
      }
    });

    return () => {
      window.removeEventListener('storage', handleLogout);
    };
  }, []);

  /**
   * Listen for chat events via Socket.IO
   */
  useEffect(() => {
    if (!enabled) return;

    const cleanup = registerChatEvents(socket, {
      onMessageReceived: (msg) => {
        const userId = getUserId();
        if (onMessageReceived) {
          onMessageReceived(msg, userId);
        }
      },
      onCustomerListUpdate,
      onUserJoined,
      onUserLeft
    });

    return cleanup;
  }, [getUserId, onMessageReceived, onCustomerListUpdate, onUserJoined, onUserLeft, enabled]);

  /**
   * Join chat group and listen for messages when customer is selected
   */
  useEffect(() => {
    if (!enabled || !selectedCustomer) return;

    const userId = getUserId();
    if (!userId) {
      console.warn('No user ID available, cannot join chat group');
      return;
    }

    // Track current room to prevent duplicate joins
    const currentRoomId = selectedCustomer.chat_group_id;

    // Leave previous room if agent was in another room
    leavePreviousRoom(socket);

    // Join new chat group with user info
    joinChatGroup(socket, {
      groupId: currentRoomId,
      userType: 'agent',
      userId: userId
    });

    return () => {
      // Leave room when component unmounts or customer changes
      leaveRoom(socket, {
        roomId: currentRoomId,
        userType: 'agent',
        userId: userId
      });
    };
  }, [selectedCustomer?.chat_group_id, getUserId, enabled]);

  /**
   * Send a message via Socket.IO
   */
  const sendMessage = useCallback((messageBody, chatGroupId, userId) => {
    sendMessageEmitter(socket, {
      chat_body: messageBody,
      chat_group_id: chatGroupId,
      sys_user_id: userId,
      client_id: null,
    });
  }, []);

  return {
    sendMessage,
  };
};
