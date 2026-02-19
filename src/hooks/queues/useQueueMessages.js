import QueueService from '../../services/queue.service';
import { useMessages } from '../shared/useMessages';

/**
 * useQueueMessages - Message loading and pagination for queues
 * Handles fetching messages, pagination, and message deduplication
 */
export const useQueueMessages = () => {
  return useMessages({
    fetchService: QueueService.getMessages,
  });
};
