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
  const fetchInProgressRef = useRef(false);
  const lastFetchTimeRef = useRef(0);
  const loadMessagesInProgressRef = useRef(false);
  const FETCH_COOLDOWN = 1000; // 1 second cooldown between fetches

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
   * Fetch chat groups from API with debouncing
   */
  const fetchChatGroups = useCallback(async () => {
    // Prevent simultaneous requests
    if (fetchInProgressRef.current) {
      console.log('⏳ Fetch already in progress, skipping...');
      return;
    }

    // Cooldown check - prevent rapid successive calls
    const now = Date.now();
    if (now - lastFetchTimeRef.current < FETCH_COOLDOWN) {
      console.log('⏳ Fetch cooldown active, skipping...');
      return;
    }

    fetchInProgressRef.current = true;
    lastFetchTimeRef.current = now;
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
      fetchInProgressRef.current = false;
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

    // Listen for real-time customer list updates
    socket.on('customerListUpdate', (updateData) => {
      console.log('Received customerListUpdate:', updateData);
      handleCustomerListUpdate(updateData);
    });

    return () => {
      socket.off('updateChatGroups');
      socket.off('customerListUpdate');
    };
  }, [fetchChatGroups]);

  /**
   * Handle real-time customer list updates
   */
  const handleCustomerListUpdate = useCallback((updateData) => {
    if (updateData.type === 'move_to_top') {
      const { customer, department_id } = updateData.data;
      
      setDepartmentCustomers((prevDeptCustomers) => {
        const updatedDeptCustomers = { ...prevDeptCustomers };
        
        // Find the customer in all departments and remove them
        Object.keys(updatedDeptCustomers).forEach((dept) => {
          updatedDeptCustomers[dept] = updatedDeptCustomers[dept].filter(
            (existingCustomer) => existingCustomer.chat_group_id !== customer.chat_group_id
          );
        });
        
        // Find the department name for this customer
        const departmentName = customer.department || 'Unknown';
        
        // Add the customer to the top of their department
        if (!updatedDeptCustomers[departmentName]) {
          updatedDeptCustomers[departmentName] = [];
        }
        
        // Add customer to the beginning of the array (top of list)
        updatedDeptCustomers[departmentName].unshift(customer);
        
        return updatedDeptCustomers;
      });
    }
  }, []);

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

    // Track current room to prevent duplicate joins
    const currentRoomId = selectedCustomer.chat_group_id;

    // Leave previous room if agent was in another room
    socket.emit('leavePreviousRoom');

    // Join new chat group with user info
    socket.emit('joinChatGroup', {
      groupId: currentRoomId,
      userType: 'agent',
      userId: userId
    });

    console.log(`Agent ${userId} switching to chat_group ${currentRoomId}`);

    const handleReceiveMessage = (msg) => {
      // Clear typing indicator when message is received
      setIsTyping(false);
      setTypingUser(null);

      setMessages((prev) => {
        const exists = prev.some((m) => m.id === msg.chat_id);
        if (exists) return prev;

        return [
          ...prev,
          {
            id: msg.chat_id,
            sender: msg.sender_type === 'agent' && msg.sender_id === userId ? 'user' : 'system',
            content: msg.chat_body,
            timestamp: msg.chat_created_at,
            sender_name: msg.sender_name || 'Unknown',
            sender_type: msg.sender_type || 'system',
            sender_image: msg.sender_image || null,
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

    return () => {
      socket.off('receiveMessage', handleReceiveMessage);
      socket.off('userJoined', handleUserJoined);
      socket.off('userLeft', handleUserLeft);
      
      // Leave room when component unmounts or customer changes
      socket.emit('leaveRoom', {
        roomId: currentRoomId,
        userType: 'agent',
        userId: userId
      });
      
      console.log(`Agent ${userId} leaving chat_group ${currentRoomId}`);
    };
  }, [selectedCustomer?.chat_group_id]); // Only depend on chat_group_id, not the whole object or getUserId

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
   * Load messages for a specific client with debouncing
   * @param {number} clientId - Client ID
   * @param {string} before - ISO timestamp for pagination
   * @param {boolean} append - Whether to append to existing messages (for pagination)
   */
  const loadMessages = useCallback(async (clientId, before = null, append = false) => {
    // Prevent simultaneous message loads (except for pagination)
    if (!append && loadMessagesInProgressRef.current) {
      console.log('⏳ Message load already in progress, skipping...');
      return;
    }

    loadMessagesInProgressRef.current = true;
    
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
        sender_image: msg.sender_image || null,
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
      loadMessagesInProgressRef.current = false;
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
   * Send a message via Socket.IO
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

    // Clear input immediately for better UX
    setInputMessage('');

    // Emit via socket - message will be added to UI when we receive it back
    console.log('Sending to group:', selectedCustomer.chat_group_id);
    socket.emit('sendMessage', {
      chat_body: trimmedMessage,
      chat_group_id: selectedCustomer.chat_group_id,
      sys_user_id: getUserId(),
      client_id: null,
    });
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
