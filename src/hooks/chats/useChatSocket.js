import { useEffect, useRef } from 'react';
import socket from '../../socket';
import { useUser } from '../../context/UserContext';

/**
 * useChatSocket - Socket.IO connection and message handling for chats
 * Handles socket connection, room management, and real-time message updates
 */
export const useChatSocket = ({
  selectedCustomer,
  setMessages,
  setIsTyping,
  setTypingUser,
}) => {
  const { getUserId } = useUser();
  const typingTimeoutRef = useRef(null);

  // Connect socket on mount
  useEffect(() => {
    socket.connect();

    const handleLogout = () => {
      socket.disconnect();
      setTimeout(() => socket.connect(), 100);
    };

    const handleStorageChange = (event) => {
      if (event.key === 'logout') handleLogout();
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      socket.disconnect();
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Join chat group when customer selected
  useEffect(() => {
    if (!selectedCustomer) return;

    const userId = getUserId();
    if (!userId) {
      console.warn('No user ID available, cannot join chat group');
      return;
    }

    const currentRoomId = selectedCustomer.chat_group_id;
    socket.emit('leavePreviousRoom');
    socket.emit('joinChatGroup', {
      groupId: currentRoomId,
      userType: 'agent',
      userId: userId
    });

    const handleReceiveMessage = (msg) => {
      setIsTyping(false);
      setTypingUser(null);

      setMessages((prev) => {
        const exists = prev.some((m) => m.id === msg.chat_id);
        if (exists) return prev;

        return [
          ...prev,
          {
            id: msg.chat_id,
            sender: msg.sender_type === 'agent' && msg.sender_id === userId ? 'user' : 'system',
            content: msg.chat_body,
            timestamp: msg.chat_created_at,
            sender_name: msg.sender_name || 'Unknown',
            sender_type: msg.sender_type || 'system',
            sender_image: msg.sender_image || null,
            displayTime: new Date(msg.chat_created_at).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
          },
        ];
      });
    };

    socket.on('receiveMessage', handleReceiveMessage);

    return () => {
      socket.off('receiveMessage', handleReceiveMessage);
      
      socket.emit('leaveRoom', {
        roomId: currentRoomId,
        userType: 'agent',
        userId: userId
      });
    };
  }, [selectedCustomer?.chat_group_id, getUserId, setMessages, setIsTyping, setTypingUser]);

  return { socket };
};
