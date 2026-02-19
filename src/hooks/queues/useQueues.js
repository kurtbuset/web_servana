/**
 * useQueues - Main hook that composes all queue functionality
 */
import { useQueueGroups } from './useQueueGroups';
import { useQueueMessages } from './useQueueMessages';
import { useQueueActions } from './useQueueActions';
import { useQueueSocket } from './useQueueSocket';

export const useQueues = () => {
  // Queue groups and departments
  const groupsState = useQueueGroups();
  
  // Messages and pagination
  const messagesState = useQueueMessages();
  
  // Queue actions (accept, send, end, select)
  const actionsState = useQueueActions({
    setMessages: messagesState.setMessages,
    setEarliestMessageTime: messagesState.setEarliestMessageTime,
    setHasMoreMessages: messagesState.setHasMoreMessages,
    loadMessages: messagesState.loadMessages,
    setDepartmentCustomers: groupsState.setDepartmentCustomers,
    setDepartments: groupsState.setDepartments,
    departmentCustomers: groupsState.departmentCustomers,
  });
  
  // Socket.IO message handling
  useQueueSocket({
    selectedCustomer: actionsState.selectedCustomer,
    setMessages: messagesState.setMessages,
  });

  return {
    // Queue groups
    ...groupsState,
    
    // Messages
    ...messagesState,
    
    // Actions
    ...actionsState,
  };
};
