import { useState, useEffect, useCallback } from 'react';
import QueueService from '../services/queue.service';

/**
 * useQueues Hook
 * Manages pending chat queues data with sync-based updates (no sockets)
 */
export const useQueues = () => {
  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Fetch queued chats
  const fetchQueues = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      
      const data = await QueueService.getQueuedChats();
      
      // Ensure data is an array
      const queueData = Array.isArray(data) ? data : [];
      
      // Transform the data to match the expected format for QueuesList component
      const transformedQueues = queueData.map(chatGroup => ({
        id: chatGroup.chat_group_id,
        client: chatGroup.chat_group_name || chatGroup.customer?.name || `Client ${chatGroup.customer?.id}`,
        message: 'New conversation', // Backend doesn't provide last message in this endpoint
        department: chatGroup.department || 'General',
        waitTime: calculateWaitTime(chatGroup.latestMessageTime || new Date().toISOString()),
        timestamp: formatTimestamp(chatGroup.latestMessageTime || new Date().toISOString()),
        chatGroupId: chatGroup.chat_group_id,
        clientId: chatGroup.customer?.id,
        // Keep the original data structure for the PendingQueuesCard
        chat_group_name: chatGroup.chat_group_name,
        customer: chatGroup.customer
      }));
      
      setQueues(transformedQueues);
    } catch (err) {
      console.error('Error fetching queues:', err);
      setError(err.message || 'Failed to fetch queues');
      setQueues([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Refresh function for external use
  const refreshQueues = useCallback(() => {
    console.log('🔄 Refreshing queues due to external trigger');
    fetchQueues(true);
  }, [fetchQueues]);

  // Calculate wait time from created_at timestamp
  const calculateWaitTime = (createdAt) => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffMs = now - created;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d`;
  };

  // Format timestamp for display
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 60) {
      return `${diffMins}m ago`;
    }
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) {
      return `${diffHours}h ago`;
    }
    
    return date.toLocaleDateString();
  };

  // Accept a chat from the queue
  const acceptChat = useCallback(async (chatGroupId) => {
    try {
      const result = await QueueService.acceptChat(chatGroupId);
      
      // Remove the accepted chat from the queue
      setQueues(prev => prev.filter(queue => queue.chatGroupId !== chatGroupId));
      
      return result;
    } catch (err) {
      console.error('Error accepting chat:', err);
      throw err;
    }
  }, []);

  // Initial fetch only - no auto-refresh
  useEffect(() => {
    fetchQueues();
  }, [fetchQueues]);

  return {
    queues,
    loading,
    refreshing,
    error,
    acceptChat,
    refreshQueues,
    totalQueues: queues.length
  };
};

export default useQueues;