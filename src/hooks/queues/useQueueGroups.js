import QueueService from '../../services/queue.service';
import { SOCKET_EVENTS } from '../../constants/chat.constants';
import { useGroups } from '../shared/useGroups';

/**
 * useQueueGroups - Manage queue groups and departments
 * Handles fetching queued chats, department filtering, and real-time updates
 */
export const useQueueGroups = () => {
  return useGroups({
    fetchService: QueueService.getQueuedChats,
    socketUpdateEvent: SOCKET_EVENTS.UPDATE_CHAT_GROUPS,
    debounceUpdates: true, // Debounce for queues to prevent excessive fetching
  });
};
