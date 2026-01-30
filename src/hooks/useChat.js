import { useState, useCallback, useEffect, useRef } from 'react';
import { ChatService } from '../services/chat.service';
import { useUser } from '../context/UserContext';
import { toast } from 'react-toastify';
import socket from '../socket';

/**
 * useChat hook manages chat state and real-time Socket.IO communication
 * 
 * Features:
 * - Fetch chat groups and messages
 * - Real-time message updates via Socket.IO
 * - Canned messages management
 * - Message pagination (load more)
 * - Department filtering
 * - Send messages via Socket.IO
 * - Auto-connect/disconnect Socket.IO
 * 
 * @returns {Object} Chat state and actions
 */
export const useChat = () => {
  // Get user permissions and ID
  const { hasPermission, getUserId } = useUser();
  
  // Chat groups and filtering
  const [departmentCustomers, setDepartmentCustomers] = useState({});
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  
  // Selected chat
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  
  // Canned messages
  const [cannedMessages, setCannedMessages] = useState([]);
  const [showCannedMessages, setShowCannedMessages] = useState(false);
  
  // Pagination
  const [earliestMessageTime, setEarliestMessageTime] = useState(null);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chatEnded, setChatEnded] = useState(false);
  const [endedChats, setEndedChats] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState(null);
  
  // Refs
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  /**
   * Connect to Socket.IO on mount and handle logout events
   */
  useEffect(() => {
    socket.connect();
    console.log('Socket connected');

    // Listen for logout events to reconnect socket with fresh cookies
    const handleLogout = () => {
      console.log('Logout detected - reconnecting socket');
      socket.disconnect();
      // Small delay to ensure cookies are cleared
      setTimeout(() => {
        socket.connect();
      }, 100);
    };

    window.addEventListener('storage', (event) => {
      if (event.key === 'logout') {
        handleLogout();
      }
    });

    return () => {
      socket.disconnect();
      console.log('Socket disconnected');
      window.removeEventListener('storage', handleLogout);
    };
  }, []);

  /**
   * Fetch chat groups from API
   */
  const fetchChatGroups = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const chatGroups = await ChatService.getChatGroups();
      const deptMap = {};

      chatGroups.forEach((group) => {
        const dept = group.department;
        if (!deptMap[dept]) deptMap[dept] = [];
        const customerWithDept = { ...group.customer, department: dept };
        deptMap[dept].push(customerWithDept);
      });

      setDepartmentCustomers(deptMap);
      const departmentList = ['All', ...Object.keys(deptMap)];
      setDepartments(departmentList);
      setSelectedDepartment((prev) => prev || 'All');
      
      return deptMap;
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to load chat groups';
      setError(errorMessage);
      console.error('Failed to load chat groups:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Listen for chat group updates via Socket.IO
   */
  useEffect(() => {
    fetchChatGroups(); // Initial load

    socket.on('updateChatGroups', () => {
      console.log('Received updateChatGroups from server');
      fetchChatGroups();
    });

    return () => {
      socket.off('updateChatGroups');
    };
  }, [fetchChatGroups]);

  /**
   * Fetch canned messages for current user's role
   */
  const fetchCannedMessages = useCallback(async () => {
    // Check permission before fetching
    if (!hasPermission("priv_can_use_canned_mess")) {
      console.log("User does not have permission to use canned messages");
      setCannedMessages([]);
      return;
    }

    try {
      const data = await ChatService.getCannedMessages();
      if (Array.isArray(data)) {
        setCannedMessages(data.map((msg) => msg.canned_message));
      }
    } catch (err) {
      console.error('Failed to load canned messages:', err);
      // Don't show error toast for canned messages - not critical
    }
  }, [hasPermission]);

  /**
   * Load canned messages on mount
   */
  useEffect(() => {
    fetchCannedMessages();
  }, [fetchCannedMessages]);

  /**
   * Join chat group and listen for messages when customer is selected
   */
  useEffect(() => {
    if (!selectedCustomer) return;

    const userId = getUserId();
    if (!userId) {
      console.warn('No user ID available, cannot join chat group');
      return;
    }

    // Leave previous room if agent was in another room
    socket.emit('leavePreviousRoom');

    // Join new chat group with user info
    socket.emit('joinChatGroup', {
      groupId: selectedCustomer.chat_group_id,
      userType: 'agent',
      userId: userId
    });

    console.log(`Agent ${userId} switching to chat_group ${selectedCustomer.chat_group_id}`);

    const handleReceiveMessage = (msg) => {
      // Clear typing indicator when message is received
      setIsTyping(false);
      setTypingUser(null);

      // Skip own messages to prevent duplicates (optimistic updates handle them)
      const currentUserId = getUserId();
      if (msg.sys_user_id === currentUserId) {
        return;
      }

      setMessages((prev) => {
        const exists = prev.some((m) => m.id === msg.chat_id);
        if (exists) return prev;

        return [
          ...prev,
          {
            id: msg.chat_id,
            sender: msg.sys_user_id ? 'user' : 'system',
            content: msg.chat_body,
            timestamp: msg.chat_created_at,
            displayTime: new Date(msg.chat_created_at).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
          },
        ];
      });
    };

    const handleUserJoined = (data) => {
      console.log(`${data.userType} joined chat_group ${data.chatGroupId}`);
    };

    const handleUserLeft = (data) => {
      console.log(`${data.userType} left chat_group ${data.chatGroupId}`);
    };

    socket.on('receiveMessage', handleReceiveMessage);
    socket.on('userJoined', handleUserJoined);
    socket.on('userLeft', handleUserLeft);

    // Listen for message delivery confirmation
    socket.on('messageDelivered', (data) => {
      console.log('✅ Message delivered:', data.chat_id);
    });

    // Listen for message errors
    socket.on('messageError', (error) => {
      console.error('❌ Message error:', error);
    });

    return () => {
      socket.off('receiveMessage', handleReceiveMessage);
      socket.off('messageDelivered');
      socket.off('messageError');
      socket.off('userJoined', handleUserJoined);
      socket.off('userLeft', handleUserLeft);
      
      // Leave room when component unmounts or customer changes
      if (selectedCustomer) {
        const userId = getUserId();
        
        // Emit leave with proper user info to avoid "undefined undefined"
        socket.emit('leaveRoom', {
          roomId: selectedCustomer.chat_group_id,
          userType: 'agent',
          userId: userId
        });
        
        console.log(`Agent ${userId || 'unknown'} leaving chat_group ${selectedCustomer.chat_group_id}`);
      }
    };
  }, [selectedCustomer, getUserId]);

  /**
   * Determine frontend sender type for message display
   */
  const determineFrontendSender = useCallback((msg) => {
    // For UI compatibility:
    // - client and previous_agent messages go to left (system)
    // - current_agent messages go to right (user)
    if (msg.sender_type === 'current_agent') {
      return 'user';
    } else {
      return 'system'; // client, previous_agent, system all go to left
    }
  }, []);

  /**
   * Load messages for a specific client
   * @param {number} clientId - Client ID
   * @param {string} before - ISO timestamp for pagination
   * @param {boolean} append - Whether to append to existing messages (for pagination)
   */
  const loadMessages = useCallback(async (clientId, before = null, append = false) => {
    if (append) {
      setIsLoadingMore(true);
    }
    
    try {
      const response = await ChatService.getMessages(clientId, before, 10);
      const newMessages = response.messages.map((msg, index) => ({
        id: msg.chat_id || index,
        sender: determineFrontendSender(msg),
        content: msg.chat_body,
        timestamp: msg.chat_created_at,
        sender_name: msg.sender_name || 'Unknown',
        sender_type: msg.sender_type || 'system',
        displayTime: new Date(msg.chat_created_at).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      }));

      setMessages((prev) => {
        const combined = append ? [...newMessages, ...prev] : [...newMessages];

        // Deduplicate based on message ID
        const uniqueMessages = [];
        const seenIds = new Set();

        for (const m of combined) {
          if (!seenIds.has(m.id)) {
            seenIds.add(m.id);
            uniqueMessages.push(m);
          }
        }

        return uniqueMessages;
      });

      if (newMessages.length > 0) {
        setEarliestMessageTime(newMessages[0].timestamp);
      }
      if (newMessages.length < 10) {
        setHasMoreMessages(false);
      }
    } catch (err) {
      console.error('Error loading messages:', err);
      toast.error('Failed to load messages');
    } finally {
      if (append) {
        setIsLoadingMore(false);
      }
    }
  }, [determineFrontendSender]);

  /**
   * Select a customer and load their messages
   * @param {Object} customer - Customer object
   */
  const selectCustomer = useCallback(async (customer) => {
    setSelectedCustomer(customer);
    setChatEnded(endedChats.some((chat) => chat.id === customer.id));
    setMessages([]);
    setEarliestMessageTime(null);
    setHasMoreMessages(true);

    await loadMessages(customer.id);
  }, [endedChats, loadMessages]);

  /**
   * Send a message via Socket.IO with optimistic updates
   */
  const sendMessage = useCallback(() => {
    // Check permission first
    if (!hasPermission("priv_can_message")) {
      console.warn("User does not have permission to send messages");
      toast.error("You don't have permission to send messages");
      return;
    }

    const trimmedMessage = inputMessage.replace(/\n+$/, '');
    if (trimmedMessage.trim() === '') return;
    if (!selectedCustomer) return;

    const userId = getUserId();
    const tempId = `temp_${Date.now()}_${Math.random()}`;
    const now = new Date();

    // Optimistic update - add message immediately to UI
    const optimisticMessage = {
      id: tempId,
      sender: 'user', // Agent messages appear on right
      content: trimmedMessage,
      timestamp: now.toISOString(),
      displayTime: now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      isPending: true, // Mark as pending
    };

    setMessages((prev) => [...prev, optimisticMessage]);

    // Clear input immediately for better UX
    setInputMessage('');

    // Send via socket
    console.log('Sending to group:', selectedCustomer.chat_group_id);
    socket.emit('sendMessage', {
      chat_body: trimmedMessage,
      chat_group_id: selectedCustomer.chat_group_id,
      sys_user_id: userId,
      client_id: null,
      tempId: tempId, // Include temp ID for confirmation
    });

    // Handle delivery confirmation
    const handleMessageDelivered = (data) => {
      if (data.tempId === tempId) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === tempId
              ? { ...msg, id: data.chat_id, isPending: false }
              : msg
          )
        );
        socket.off('messageDelivered', handleMessageDelivered);
      }
    };

    // Handle message error
    const handleMessageError = (error) => {
      if (error.tempId === tempId) {
        // Remove failed message from UI
        setMessages((prev) => prev.filter((msg) => msg.id !== tempId));
        toast.error('Failed to send message');
        socket.off('messageError', handleMessageError);
      }
    };

    socket.on('messageDelivered', handleMessageDelivered);
    socket.on('messageError', handleMessageError);

    // Cleanup listeners after timeout
    setTimeout(() => {
      socket.off('messageDelivered', handleMessageDelivered);
      socket.off('messageError', handleMessageError);
    }, 10000);
  }, [inputMessage, selectedCustomer, hasPermission, getUserId]);

  /**
   * End the current chat
   */
  const endChat = useCallback(() => {
    // Check permission first
    if (!hasPermission("priv_can_end_chat")) {
      console.warn("User does not have permission to end chats");
      toast.error("You don't have permission to end chats");
      return;
    }

    if (!selectedCustomer) return;

    setChatEnded(true);

    const now = new Date();
    const endMessage = {
      id: messages.length + 1,
      sender: 'system',
      content: 'Thank you for your patience. Your chat has ended.',
      timestamp: now.toISOString(),
      displayTime: now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setMessages((prev) => [...prev, endMessage]);

    setEndedChats((prev) => [
      ...prev,
      {
        ...selectedCustomer,
        messages: [...messages, endMessage],
        endedAt: now.toISOString(),
      },
    ]);

    setSelectedCustomer(null);
    setMessages([]);
  }, [selectedCustomer, messages, hasPermission]);

  /**
   * Transfer chat to another department
   * @param {number} deptId - Target department ID
   */
  const transferChat = useCallback(async (deptId) => {
    if (!selectedCustomer) return false;

    try {
      const response = await ChatService.transferChatGroup(selectedCustomer.chat_group_id, deptId);
      
      if (response.success) {
        // Remove the transferred chat from current user's list
        setDepartmentCustomers((prevDeptCustomers) => {
          const updatedDeptCustomers = { ...prevDeptCustomers };
          
          // Find and remove the transferred customer from all departments
          Object.keys(updatedDeptCustomers).forEach((dept) => {
            updatedDeptCustomers[dept] = updatedDeptCustomers[dept].filter(
              (customer) => customer.chat_group_id !== selectedCustomer.chat_group_id
            );
            
            // Remove empty departments
            if (updatedDeptCustomers[dept].length === 0) {
              delete updatedDeptCustomers[dept];
            }
          });
          
          return updatedDeptCustomers;
        });

        // Update departments list
        setDepartments((prevDepartments) => {
          const activeDepartments = Object.keys(departmentCustomers).filter(
            (dept) => departmentCustomers[dept] && departmentCustomers[dept].length > 0
          );
          return ["All", ...activeDepartments];
        });

        // Clear selection
        setSelectedCustomer(null);
        setMessages([]);
        setChatEnded(false);

        toast.success("Chat transferred successfully");
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error transferring chat:", err);
      toast.error("Failed to transfer chat");
      return false;
    }
  }, [selectedCustomer, departmentCustomers]);

  /**
   * Clear selected customer
   */
  const clearSelection = useCallback(() => {
    setSelectedCustomer(null);
    setMessages([]);
    setChatEnded(false);
  }, []);

  /**
   * Auto-scroll to bottom when messages change
   */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [messages]);

  /**
   * Auto-resize textarea
   */
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputMessage]);

  // Get filtered customers based on selected department
  const allCustomers = Object.values(departmentCustomers).flat();
  const filteredCustomers =
    selectedDepartment === 'All'
      ? allCustomers
      : departmentCustomers[selectedDepartment] || [];

  return {
    // Chat groups
    departmentCustomers,
    departments,
    selectedDepartment,
    setSelectedDepartment,
    filteredCustomers,
    
    // Selected chat
    selectedCustomer,
    messages,
    inputMessage,
    setInputMessage,
    
    // Canned messages
    cannedMessages,
    showCannedMessages,
    setShowCannedMessages,
    
    // Pagination
    earliestMessageTime,
    hasMoreMessages,
    isLoadingMore,
    loadMessages,
    
    // UI state
    loading,
    error,
    chatEnded,
    endedChats,
    isTyping,
    typingUser,
    
    // Actions
    fetchChatGroups,
    selectCustomer,
    sendMessage,
    
    endChat,
    transferChat,
    clearSelection,
    
    // Refs
    bottomRef,
    textareaRef,
  };
};
