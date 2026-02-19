import { useChatGroups } from './useChatGroups';
import { useChatMessages } from './useChatMessages';
import { useChatActions } from './useChatActions';
import { useCannedMessages } from './useCannedMessages';
import { useChatSocket } from './useChatSocket';

/**
 * useChat - Main hook that composes all chat functionality
 * 
 * This hook acts as a composer, bringing together all chat-related functionality.
 * It does NOT contain side effects - those are handled in useChatEffects.
 * 
 * Features:
 * - Fetch chat groups and messages
 * - Real-time message updates via Socket.IO
 * - Canned messages management
 * - Message pagination (load more)
 * - Department filtering
 * - Send messages via Socket.IO
 */
export const useChat = () => {
  // Chat groups and departments
  const groupsState = useChatGroups();
  
  // Messages and pagination
  const messagesState = useChatMessages();
  
  // Canned messages
  const cannedState = useCannedMessages();
  
  // Chat actions (send, end, transfer, select)
  const actionsState = useChatActions({
    setMessages: messagesState.setMessages,
    setEarliestMessageTime: messagesState.setEarliestMessageTime,
    setHasMoreMessages: messagesState.setHasMoreMessages,
    loadMessages: messagesState.loadMessages,
    setDepartmentCustomers: groupsState.setDepartmentCustomers,
    setDepartments: groupsState.setDepartments,
    departmentCustomers: groupsState.departmentCustomers,
  });
  
  // Socket.IO connection and message handling
  useChatSocket({
    selectedCustomer: actionsState.selectedCustomer,
    setMessages: messagesState.setMessages,
    setIsTyping: actionsState.setIsTyping,
    setTypingUser: actionsState.setTypingUser,
  });

  return {
    // Chat groups
    ...groupsState,
    
    // Messages
    ...messagesState,
    
    // Canned messages
    ...cannedState,
    
    // Actions
    ...actionsState,
  };
};
