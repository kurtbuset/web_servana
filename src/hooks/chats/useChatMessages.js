import { ChatService } from '../../services/chat.service';
import { useMessages } from '../shared/useMessages';

/**
 * useChatMessages - Message loading and pagination for chats
 * Handles fetching messages, pagination, and message deduplication
 */
export const useChatMessages = () => {
  return useMessages({
    fetchService: ChatService.getMessages,
  });
};
