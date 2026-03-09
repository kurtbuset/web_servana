import { useEffect, useCallback } from 'react';
import socket from '../socket';

/**
 * useChatSocket hook manages Socket.IO connections and events
 * 
 * Features:
 * - Auto-connect/disconnect Socket.IO
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
 * @returns {Object} Socket actions
 */
export const useChatSocket = ({
  selectedCustomer,
  getUserId,
  onMessageReceived,
  onCustomerListUpdate,
  onUserJoined,
  onUserLeft,
}) => {
  /**
   * Connect to Socket.IO on mount and handle logout events
   */
  useEffect(() => {
    socket.connect();
    console.log('Socket connected');

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
      socket.disconnect();
      console.log('Socket disconnected');
      window.removeEventListener('storage', handleLogout);
    };
  }, []);

  /**
   * Listen for customer list updates via Socket.IO
   */
  useEffect(() => {
    const handleCustomerListUpdate = (updateData) => {
      console.log('Received customerListUpdate:', updateData);
      if (onCustomerListUpdate) {
        onCustomerListUpdate(updateData);
      }
    };

    socket.on('customerListUpdate', handleCustomerListUpdate);

    return () => {
      socket.off('customerListUpdate', handleCustomerListUpdate);
    };
  }, [onCustomerListUpdate]);

  /**
   * Join chat group and listen for messages when customer is selected
   */
  useEffect(() => {
    if (!selectedCustomer) return;

    const userId = getUserId();
    if (!userId) {
      console.warn('No user ID available, cannot join chat group');
      return;
    }

    // Track current room to prevent duplicate joins
    const currentRoomId = selectedCustomer.chat_group_id;

    // Leave previous room if agent was in another room
    socket.emit('leavePreviousRoom');

    // Join new chat group with user info
    socket.emit('joinChatGroup', {
      groupId: currentRoomId,
      userType: 'agent',
      userId: userId
    });

    console.log(`Agent ${userId} switching to chat_group ${currentRoomId}`);

    const handleReceiveMessage = (msg) => {
      if (onMessageReceived) {
        onMessageReceived(msg, userId);
      }
    };

    const handleUserJoined = (data) => {
      console.log(`${data.userType} joined chat_group ${data.chatGroupId}`);
      if (onUserJoined) {
        onUserJoined(data);
      }
    };

    const handleUserLeft = (data) => {
      console.log(`${data.userType} left chat_group ${data.chatGroupId}`);
      if (onUserLeft) {
        onUserLeft(data);
      }
    };

    socket.on('receiveMessage', handleReceiveMessage);
    socket.on('userJoined', handleUserJoined);
    socket.on('userLeft', handleUserLeft);

    return () => {
      socket.off('receiveMessage', handleReceiveMessage);
      socket.off('userJoined', handleUserJoined);
      socket.off('userLeft', handleUserLeft);
      
      // Leave room when component unmounts or customer changes
      socket.emit('leaveRoom', {
        roomId: currentRoomId,
        userType: 'agent',
        userId: userId
      });
      
      console.log(`Agent ${userId} leaving chat_group ${currentRoomId}`);
    };
  }, [selectedCustomer?.chat_group_id, getUserId, onMessageReceived, onUserJoined, onUserLeft]);

  /**
   * Send a message via Socket.IO
   */
  const sendMessage = useCallback((messageBody, chatGroupId, userId) => {
    if (!messageBody || !chatGroupId || !userId) {
      console.warn('Missing required parameters for sendMessage');
      return;
    }

    console.log('Sending to group:', chatGroupId);
    socket.emit('sendMessage', {
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
