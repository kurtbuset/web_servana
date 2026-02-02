import { useState, useEffect, useCallback, useRef } from "react";
import QueueService from "../services/queue.service";
import socket from "../socket";
import { useUser } from "../context/UserContext";
import { toast } from "react-toastify";

/**
 * useQueues Hook
 * Manages queue data with Socket.IO real-time updates
 */
export const useQueues = () => {
  // Get user permissions and ID
  const { hasPermission, getUserId } = useUser();
  
  const [departmentCustomers, setDepartmentCustomers] = useState({});
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [messages, setMessages] = useState([]);
  const [cannedMessages, setCannedMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [earliestMessageTime, setEarliestMessageTime] = useState(null);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [chatEnded, setChatEnded] = useState(false);
  const [endedChats, setEndedChats] = useState([]);

  // Refs for debouncing
  const fetchInProgressRef = useRef(false);
  const lastFetchTimeRef = useRef(0);
  const loadMessagesInProgressRef = useRef(false);
  const FETCH_COOLDOWN = 1000; // 1 second cooldown between fetches

  /**
   * Fetch all queued chat groups with debouncing
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
      const chatGroups = await QueueService.getQueuedChats();
      const deptMap = {};

      chatGroups.forEach((group) => {
        const dept = group.department;
        if (!deptMap[dept]) deptMap[dept] = [];
        const customerWithDept = { ...group.customer, department: dept };
        deptMap[dept].push(customerWithDept);
      });

      setDepartmentCustomers(deptMap);
      const departmentList = ["All", ...Object.keys(deptMap)];
      setDepartments(departmentList);
      setSelectedDepartment((prev) => prev || "All");
    } catch (err) {
      console.error("Failed to load chat groups:", err);
      setError(err.message || "Failed to load chat groups");
    } finally {
      setLoading(false);
      fetchInProgressRef.current = false;
    }
  }, []);

  /**
   * Fetch canned messages with error handling
   */
  const fetchCannedMessages = useCallback(async () => {
    // Check permission before fetching
    if (!hasPermission("priv_can_use_canned_mess")) {
      console.log("User does not have permission to use canned messages");
      setCannedMessages([]);
      return;
    }

    try {
      const data = await QueueService.getCannedMessages();
      if (Array.isArray(data)) {
        setCannedMessages(data.map((msg) => msg.canned_message));
      }
    } catch (err) {
      // Don't log error if it's just a permission issue or 404
      if (err.response?.status !== 403 && err.response?.status !== 404) {
        console.error("Failed to load canned messages:", err.message);
      }
      setCannedMessages([]);
    }
  }, [hasPermission]);

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
   */
  const loadMessages = useCallback(
    async (clientId, before = null, append = false) => {
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
        const response = await QueueService.getMessages(clientId, before, 10);
        const newMessages = response.messages.map((msg, index) => ({
          id: msg.chat_id || index,
          sender: determineFrontendSender(msg),
          content: msg.chat_body,
          timestamp: msg.chat_created_at,
          sender_name: msg.sender_name || 'Unknown',
          sender_type: msg.sender_type || 'system',
          displayTime: new Date(msg.chat_created_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
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
        console.error("Error loading messages:", err);
        toast.error('Failed to load messages');
      } finally {
        if (append) {
          setIsLoadingMore(false);
        }
        loadMessagesInProgressRef.current = false;
      }
    },
    [determineFrontendSender]
  );

  /**
   * Select a customer and load their messages
   */
  const selectCustomer = useCallback(
    async (customer) => {
      setSelectedCustomer(customer);
      setChatEnded(endedChats.some((chat) => chat.id === customer.id));
      setMessages([]);
      setEarliestMessageTime(null);
      setHasMoreMessages(true);

      // Load messages for preview
      await loadMessages(customer.id);
    },
    [endedChats, loadMessages]
  );

  /**
   * Accept a chat from the queue
   */
  const acceptChat = useCallback(async () => {
    if (!selectedCustomer) return false;
    console.log('selectedCustomer: ', selectedCustomer)
    try {
      const response = await QueueService.acceptChat(
        selectedCustomer.chat_group_id
      );

      if (response.success) {
        // Emit socket event to update all clients
        socket.emit("acceptChat", {
          chatGroupId: selectedCustomer.chat_group_id,
          agentId: response.data.sys_user_id,
        });

        // Remove the accepted chat from the queue immediately
        setDepartmentCustomers((prevDeptCustomers) => {
          const updatedDeptCustomers = { ...prevDeptCustomers };
          
          // Find and remove the accepted customer from all departments
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

        // Update departments list to remove empty departments
        setDepartments((prevDepartments) => {
          const activeDepartments = Object.keys(departmentCustomers).filter(
            (dept) => departmentCustomers[dept] && departmentCustomers[dept].length > 0
          );
          return ["All", ...activeDepartments];
        });

        // Clear chat messages when accepting a chat
        setMessages([]);
        setEarliestMessageTime(null);
        setHasMoreMessages(true);
        setChatEnded(false); // Reset chat ended status for fresh conversation

        // Update selected customer to mark as accepted
        setSelectedCustomer((prev) => ({
          ...prev,
          isAccepted: true,
          sys_user_id: response.data.sys_user_id,
        }));

        // Clear selection if no customers left in current department
        const currentDeptCustomers = departmentCustomers[selectedDepartment] || [];
        const remainingCustomers = currentDeptCustomers.filter(
          (customer) => customer.chat_group_id !== selectedCustomer.chat_group_id
        );
        
        if (remainingCustomers.length === 0 && selectedDepartment !== "All") {
          setSelectedDepartment("All");
        }

        return true;
      }
      return false;
    } catch (err) {
      console.error("Error accepting chat:", err);
      return false;
    }
  }, [selectedCustomer, selectedDepartment, departmentCustomers]);

  /**
   * Send a message
   */
  const sendMessage = useCallback(
    (messageContent) => {
      // Check permission first
      if (!hasPermission("priv_can_message")) {
        console.warn("User does not have permission to send messages");
        toast.error("You don't have permission to send messages");
        return;
      }

      if (!selectedCustomer || !messageContent.trim()) return;

      // Emit via socket - message will be added to UI when we receive it back
      console.log('Sending to group:', selectedCustomer.chat_group_id);
      socket.emit("sendMessage", {
        chat_body: messageContent,
        chat_group_id: selectedCustomer.chat_group_id,
        sys_user_id: getUserId(),
        client_id: null,
      });
    },
    [selectedCustomer, hasPermission, getUserId]
  );

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
      sender: "system",
      content: "Thank you for your patience. Your chat has ended.",
      timestamp: now.toISOString(),
      displayTime: now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
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

  // Initialize: Connect socket and fetch initial data ONCE
  useEffect(() => {
    // Only connect if not already connected
    if (!socket.connected) {
      socket.connect();
    }
    
    // Fetch initial data only once
    fetchChatGroups();
    fetchCannedMessages();

    // Don't disconnect socket on unmount - it's shared across the app
    // The socket should stay connected for real-time updates
    return () => {
      // Cleanup is handled by socket itself
    };
  }, []); // Empty dependency array - run only once on mount

  // Listen for chat group updates with debouncing
  useEffect(() => {
    let updateTimeout = null;
    
    const handleUpdateChatGroups = () => {
      console.log("Received updateChatGroups from server");
      
      // Debounce the fetch call - wait 500ms before fetching
      if (updateTimeout) {
        clearTimeout(updateTimeout);
      }
      
      updateTimeout = setTimeout(() => {
        fetchChatGroups();
      }, 500);
    };

    socket.on("updateChatGroups", handleUpdateChatGroups);

    return () => {
      if (updateTimeout) {
        clearTimeout(updateTimeout);
      }
      socket.off("updateChatGroups", handleUpdateChatGroups);
    };
  }, []); // Empty dependency - fetchChatGroups is stable with useCallback

  // Join chat group and listen for messages when customer is selected
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
      setMessages((prev) => {
        const exists = prev.some((m) => m.id === msg.chat_id);
        if (exists) return prev;

        return [
          ...prev,
          {
            id: msg.chat_id,
            sender: msg.sys_user_id ? "user" : "system",
            content: msg.chat_body,
            timestamp: msg.chat_created_at,
            displayTime: new Date(msg.chat_created_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
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

    socket.on("receiveMessage", handleReceiveMessage);
    socket.on('userJoined', handleUserJoined);
    socket.on('userLeft', handleUserLeft);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
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

  // Get filtered customers based on selected department
  const allCustomers = Object.values(departmentCustomers).flat();
  const filteredCustomers =
    selectedDepartment === "All"
      ? allCustomers
      : departmentCustomers[selectedDepartment] || [];

  return {
    // State
    departments,
    selectedDepartment,
    setSelectedDepartment,
    selectedCustomer,
    messages,
    cannedMessages,
    loading,
    error,
    earliestMessageTime,
    hasMoreMessages,
    isLoadingMore,
    chatEnded,
    endedChats,
    filteredCustomers,
    allCustomers,

    // Actions
    fetchChatGroups,
    selectCustomer,
    acceptChat,
    sendMessage,
    endChat,
    loadMessages,
  };
};
