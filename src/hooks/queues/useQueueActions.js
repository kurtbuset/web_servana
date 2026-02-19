import { useState, useCallback } from 'react';
import QueueService from '../../services/queue.service';
import socket from '../../socket';
import { useUser } from '../../context/UserContext';
import { CHAT_CONFIG, SOCKET_EVENTS } from '../../constants/chat.constants';
import { createSystemMessage } from '../../utils/messageTransformers';
import { handlePermissionError, handleApiError } from '../../utils/errorHandler';
import { PERMISSIONS } from '../../constants/permissions';

/**
 * useQueueActions - Queue actions (accept, send, end, select)
 * Handles customer selection, chat acceptance, messaging, and ending chats
 */
export const useQueueActions = ({
  setMessages,
  setEarliestMessageTime,
  setHasMoreMessages,
  loadMessages,
  setDepartmentCustomers,
  setDepartments,
  departmentCustomers,
}) => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [chatEnded, setChatEnded] = useState(false);
  
  const { hasPermission, getUserId } = useUser();

  const selectCustomer = useCallback(
    async (customer) => {
      setSelectedCustomer(customer);
      setChatEnded(false);
      setMessages([]);
      setEarliestMessageTime(null);
      setHasMoreMessages(true);

      await loadMessages(customer.id);
    },
    [loadMessages, setMessages, setEarliestMessageTime, setHasMoreMessages]
  );

  const acceptChat = useCallback(async () => {
    if (!selectedCustomer) return false;
    
    try {
      const response = await QueueService.acceptChat(selectedCustomer.chat_group_id);

      if (response.success) {
        // Notify server about chat acceptance
        socket.emit(SOCKET_EVENTS.ACCEPT_CHAT, {
          chatGroupId: selectedCustomer.chat_group_id,
          agentId: response.data.sys_user_id,
        });

        // Remove accepted customer from queue
        setDepartmentCustomers((prevDeptCustomers) => {
          const updatedDeptCustomers = { ...prevDeptCustomers };
          
          Object.keys(updatedDeptCustomers).forEach((dept) => {
            updatedDeptCustomers[dept] = updatedDeptCustomers[dept].filter(
              (customer) => customer.chat_group_id !== selectedCustomer.chat_group_id
            );
            
            if (updatedDeptCustomers[dept].length === 0) {
              delete updatedDeptCustomers[dept];
            }
          });
          
          return updatedDeptCustomers;
        });

        // Update departments list
        setDepartments(() => {
          const activeDepartments = Object.keys(departmentCustomers).filter(
            (dept) => departmentCustomers[dept]?.length > 0
          );
          return [CHAT_CONFIG.DEFAULT_DEPARTMENT, ...activeDepartments];
        });

        // Reset message state
        setMessages([]);
        setEarliestMessageTime(null);
        setHasMoreMessages(true);
        setChatEnded(false);

        // Update selected customer with acceptance status
        setSelectedCustomer((prev) => ({
          ...prev,
          isAccepted: true,
          sys_user_id: response.data.sys_user_id,
        }));

        return true;
      }
      return false;
    } catch (err) {
      handleApiError(err, "Failed to accept chat", { context: 'useQueueActions.acceptChat' });
      return false;
    }
  }, [selectedCustomer, departmentCustomers, setDepartmentCustomers, setDepartments, setMessages, setEarliestMessageTime, setHasMoreMessages]);

  const sendMessage = useCallback(
    (messageContent) => {
      if (!hasPermission(PERMISSIONS.MESSAGE)) {
        handlePermissionError('send messages');
        return;
      }

      if (!selectedCustomer || !messageContent.trim()) return;

      socket.emit(SOCKET_EVENTS.SEND_MESSAGE, {
        chat_body: messageContent,
        chat_group_id: selectedCustomer.chat_group_id,
        sys_user_id: getUserId(),
        client_id: null,
      });
    },
    [selectedCustomer, hasPermission, getUserId]
  );

  return {
    selectedCustomer,
    chatEnded,
    selectCustomer,
    acceptChat,
    sendMessage,
  };
};
