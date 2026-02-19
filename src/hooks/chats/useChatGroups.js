import { ChatService } from '../../services/chat.service';
import { SOCKET_EVENTS } from '../../constants/chat.constants';
import { useGroups } from '../shared/useGroups';

/**
 * useChatGroups - Manage chat groups and departments
 * Handles fetching active chats, department filtering, and real-time updates
 */
export const useChatGroups = () => {
  return useGroups({
    fetchService: ChatService.getChatGroups,
    socketUpdateEvent: SOCKET_EVENTS.UPDATE_CHAT_GROUPS,
    debounceUpdates: false,
  });
};
