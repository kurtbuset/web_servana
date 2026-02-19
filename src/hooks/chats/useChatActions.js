import { useState, useCallback, useRef } from 'react';
import { ChatService } from '../../services/chat.service';
import socket from '../../socket';
import { useUser } from '../../context/UserContext';
import { CHAT_CONFIG, SOCKET_EVENTS, PERMISSIONS } from '../../constants/chat.constants';
import { createSystemMessage } from '../../utils/messageTransformers';
import { handlePermissionError, handleApiError, showSuccess } from '../../utils/errorHandler';

/**
 * useChatActions - Chat actions (send, end, transfer, select)
 * Handles customer selection, messaging, ending chats, and transfers
 */
export const useChatActions = ({
  setMessages,
  setEarliestMessageTime,
  setHasMoreMessages,
  loadMessages,
  setDepartmentCustomers,
  setDepartments,
  departmentCustomers,
}) => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [inputMessage, setInputMessage] = useState('');
  const [chatEnded, setChatEnded] = useState(false);
  const [endedChats, setEndedChats] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState(null);
  
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);
  
  const { hasPermission, getUserId } = useUser();

  const selectCustomer = useCallback(async (customer) => {
    setSelectedCustomer(customer);
    setChatEnded(endedChats.some((chat) => chat.id === customer.id));
    setMessages([]);
    setEarliestMessageTime(null);
    setHasMoreMessages(true);

    await loadMessages(customer.id);
  }, [endedChats, loadMessages, setMessages, setEarliestMessageTime, setHasMoreMessages]);

  const sendMessage = useCallback(() => {
    if (!hasPermission(PERMISSIONS.CAN_MESSAGE)) {
      handlePermissionError('send messages');
      return;
    }

    const trimmedMessage = inputMessage.replace(/\n+$/, '');
    if (!trimmedMessage.trim() || !selectedCustomer) return;

    setInputMessage('');

    socket.emit(SOCKET_EVENTS.SEND_MESSAGE, {
      chat_body: trimmedMessage,
      chat_group_id: selectedCustomer.chat_group_id,
      sys_user_id: getUserId(),
      client_id: null,
    });
  }, [inputMessage, selectedCustomer, hasPermission, getUserId]);

  const endChat = useCallback(() => {
    if (!hasPermission(PERMISSIONS.CAN_END_CHAT)) {
      handlePermissionError('end chats');
      return;
    }

    if (!selectedCustomer) return;

    setChatEnded(true);

    const endMessage = createSystemMessage('Thank you for your patience. Your chat has ended.');
    setMessages((prev) => [...prev, endMessage]);

    setEndedChats((prev) => [
      ...prev,
      {
        ...selectedCustomer,
        messages: [...prev.find(c => c.id === selectedCustomer.id)?.messages || [], endMessage],
        endedAt: endMessage.timestamp,
      },
    ]);

    // Clear selection after a brief delay to show end message
    setTimeout(() => {
      setSelectedCustomer(null);
      setMessages([]);
    }, CHAT_CONFIG.END_CHAT_DELAY_MS);
  }, [selectedCustomer, hasPermission, setMessages]);

  const transferChat = useCallback(async (deptId) => {
    if (!selectedCustomer) return false;

    try {
      const response = await ChatService.transferChatGroup(selectedCustomer.chat_group_id, deptId);
      
      if (response.success) {
        // Remove transferred customer from current department
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

        setSelectedCustomer(null);
        setMessages([]);
        setChatEnded(false);

        showSuccess("Chat transferred successfully");
        return true;
      }
      return false;
    } catch (err) {
      handleApiError(err, "Failed to transfer chat", { context: 'useChatActions.transferChat' });
      return false;
    }
  }, [selectedCustomer, departmentCustomers, setDepartmentCustomers, setDepartments, setMessages]);

  return {
    selectedCustomer,
    inputMessage,
    setInputMessage,
    chatEnded,
    endedChats,
    isTyping,
    setIsTyping,
    typingUser,
    setTypingUser,
    bottomRef,
    textareaRef,
    selectCustomer,
    sendMessage,
    endChat,
    transferChat,
  };
};
