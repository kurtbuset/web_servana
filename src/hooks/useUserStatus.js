import { useState, useEffect, useCallback } from 'react';
import socket from '../socket';

/**
 * Hook to manage user online/offline status
 * @param {number} currentUserId - The current logged-in user's ID
 * @returns {Object} - { userStatuses, updateUserStatus }
 */
export const useUserStatus = (currentUserId) => {
  const [userStatuses, setUserStatuses] = useState(new Map());

  // Update a specific user's status
  const updateUserStatus = useCallback((userId, status, lastSeen) => {
    setUserStatuses(prev => {
      const newMap = new Map(prev);
      newMap.set(userId, { status, lastSeen: new Date(lastSeen) });
      return newMap;
    });
  }, []);

  useEffect(() => {
    if (!socket.connected || !currentUserId) return;

    // Emit that current user is online
    socket.emit('userOnline', {
      userId: currentUserId,
      userType: 'agent', // or get from context
      userName: 'Current User' // or get from context
    });

    // Request list of online users
    socket.emit('getOnlineUsers');

    // Listen for online users list
    const handleOnlineUsersList = (users) => {
      const statusMap = new Map();
      users.forEach(user => {
        statusMap.set(user.userId, {
          status: user.status,
          lastSeen: new Date(user.lastSeen)
        });
      });
      setUserStatuses(statusMap);
    };

    // Listen for user status changes
    const handleUserStatusChanged = ({ userId, status, lastSeen }) => {
      updateUserStatus(userId, status, lastSeen);
    };

    socket.on('onlineUsersList', handleOnlineUsersList);
    socket.on('userStatusChanged', handleUserStatusChanged);

    // Cleanup
    return () => {
      socket.off('onlineUsersList', handleOnlineUsersList);
      socket.off('userStatusChanged', handleUserStatusChanged);
      
      // Emit that user is going offline
      if (currentUserId) {
        socket.emit('userOffline', { userId: currentUserId });
      }
    };
  }, [currentUserId, updateUserStatus]);

  return { userStatuses, updateUserStatus };
};
