import { useEffect } from 'react';
import socket from '../../socket';
import { useUser } from '../../context/UserContext';

/**
 * useQueueSocket - Socket.IO message handling for queues
 */
export const useQueueSocket = ({
  selectedCustomer,
  setMessages,
}) => {
  const { getUserId } = useUser();

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

    console.log(`Agent ${userId} switching to chat_group ${currentRoomId}`);

    const handleReceiveMessage = (msg) => {
      setMessages((prev) => {
        const exists = prev.some((m) => m.id === msg.chat_id);
        if (exists) return prev;

        return [
          ...prev,
          {
            id: msg.chat_id,
            sender: msg.sender_type === 'agent' && msg.sender_id === getUserId() ? 'user' : 'system',
            content: msg.chat_body,
            timestamp: msg.chat_created_at,
            sender_name: msg.sender_name || 'Unknown',
            sender_type: msg.sender_type || 'system',
            sender_image: msg.sender_image || null,
            displayTime: new Date(msg.chat_created_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ];
      });
    };

    const handleUserJoined = (data) => {
      console.log(`${data.userType} joined chat_group ${data.chatGroupId}`);
    };

    const handleUserLeft = (data) => {
      console.log(`${data.userType} left chat_group ${data.chatGroupId}`);
    };

    socket.on("receiveMessage", handleReceiveMessage);
    socket.on('userJoined', handleUserJoined);
    socket.on('userLeft', handleUserLeft);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
      socket.off('userJoined', handleUserJoined);
      socket.off('userLeft', handleUserLeft);
      
      socket.emit('leaveRoom', {
        roomId: currentRoomId,
        userType: 'agent',
        userId: userId
      });
      
      console.log(`Agent ${userId} leaving chat_group ${currentRoomId}`);
    };
  }, [selectedCustomer?.chat_group_id, getUserId, setMessages]);
};
