/**
 * Reconnect Recovery Hook
 * Recovers state after reconnection (rejoin rooms, refresh data)
 */
import { useEffect, useCallback } from 'react';
import socket from '../socket';
import { useSocketConnection } from './useSocketConnection';
import { emitJoinChatRoom } from '../socket/emitters/chat.emitters';
import { emitGetAgentStatuses } from '../socket/emitters/agent.emitters';

export const useReconnectRecovery = ({ 
  currentChatGroupId, 
  onReconnect 
} = {}) => {
  const { isConnected } = useSocketConnection();

  // Recovery actions after reconnection
  const performRecovery = useCallback(() => {
    console.log('🔄 Performing reconnection recovery...');

    // 1. Rejoin current chat room if any
    if (currentChatGroupId) {
      console.log(`Rejoining chat room: ${currentChatGroupId}`);
      emitJoinChatRoom(currentChatGroupId);
    }

    // 2. Refresh agent statuses
    console.log('Refreshing agent statuses');
    emitGetAgentStatuses();

    // 3. Call custom recovery callback
    if (onReconnect) {
      onReconnect();
    }

    console.log('✅ Reconnection recovery complete');
  }, [currentChatGroupId, onReconnect]);

  // Track previous connection state
  useEffect(() => {
    let wasDisconnected = false;

    const handleDisconnect = () => {
      wasDisconnected = true;
    };

    const handleConnect = () => {
      // Only perform recovery if we were previously disconnected
      if (wasDisconnected) {
        performRecovery();
        wasDisconnected = false;
      }
    };

    socket.on('disconnect', handleDisconnect);
    socket.on('connect', handleConnect);

    return () => {
      socket.off('disconnect', handleDisconnect);
      socket.off('connect', handleConnect);
    };
  }, [performRecovery]);

  return {
    isConnected,
    performRecovery
  };
};
