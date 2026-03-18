import { useState, useCallback, useEffect, useRef } from "react";
import { ChatService } from "../services/chat.service";
import QueueService from "../services/queue.service";
import { useUser } from "../context/UserContext";
import toast from "../utils/toast";
import { useChatSocket } from "./useChatSocket";
import { useTyping } from "./useTyping";
import { useCustomerListUpdates } from "./useCustomerListUpdates";
import socket, { sendMessage as socketSendMessage } from "../socket-simple";

/**
 * useChat hook manages chat state and data
 *
 * Features:
 * - Fetch chat groups and messages
 * - Canned messages management
 * - Message pagination (load more)
 * - Department filtering
 * - Pure state management (no socket logic)
 * - Supports both active and resolved chat modes
 *
 * @param {Object} options - Configuration options
 * @param {string} options.mode - Chat mode: 'active' or 'resolved' (default: 'active')
 * @returns {Object} Chat state and actions
 */
export const useChat = ({ mode = "active" } = {}) => {
  // Get user permissions and ID
  const { hasPermission, getUserId } = useUser();

  const isResolvedMode = mode === "resolved";

  // Chat groups and filtering
  const [departmentCustomers, setDepartmentCustomers] = useState({});
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("All");

  // Selected chat
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");

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

  // Refs
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);
  const fetchInProgressRef = useRef(false);
  const lastFetchTimeRef = useRef(0);
  const loadMessagesInProgressRef = useRef(false);
  const FETCH_COOLDOWN = 1000; // 1 second cooldown between fetches

  // Initialize customer list update handlers
  const { handleCustomerListUpdate } = useCustomerListUpdates(
    setDepartmentCustomers,
    setSelectedCustomer,
    getUserId,
  );

  /**
   * Fetch chat groups from API with debouncing
   * Fetches both active chats (assigned to me) and queued chats (in my departments)
   * Or fetches resolved chats if in resolved mode
   */
  const fetchChatGroups = useCallback(async () => {
    // Prevent simultaneous requests
    if (fetchInProgressRef.current) {
      console.log("⏳ Fetch already in progress, skipping...");
      return;
    }

    // Cooldown check - prevent rapid successive calls
    const now = Date.now();
    if (now - lastFetchTimeRef.current < FETCH_COOLDOWN) {
      console.log("⏳ Fetch cooldown active, skipping...");
      return;
    }

    fetchInProgressRef.current = true;
    lastFetchTimeRef.current = now;
    setLoading(true);
    setError(null);

    try {
      if (isResolvedMode) {
        // Fetch resolved chats only
        const resolvedChatGroups = await ChatService.getResolvedChatGroups();

        const deptMap = {};

        // Process resolved chats
        resolvedChatGroups.forEach((group) => {
          const dept = group.department;
          if (!deptMap[dept]) deptMap[dept] = [];
          const customerWithDept = {
            ...group.customer,
            department: dept,
            chat_type: "resolved",
            status: "resolved",
          };
          deptMap[dept].push(customerWithDept);
        });

        setDepartmentCustomers(deptMap);
        const departmentList = ["All", ...Object.keys(deptMap)];
        setDepartments(departmentList);
        setSelectedDepartment((prev) => prev || "All");

        return deptMap;
      } else {
        // Fetch both active and queued chats in parallel
        const [activeChatGroups, queuedChatGroups] = await Promise.all([
          ChatService.getChatGroups(),
          QueueService.getQueuedChats(),
        ]);

        const deptMap = {};

        // Process active chats (assigned to me)
        activeChatGroups.forEach((group) => {
          const dept = group.department;
          if (!deptMap[dept]) deptMap[dept] = [];
          const customerWithDept = {
            ...group.customer,
            department: dept,
            chat_type: "active", // Mark as active chat
            status: "active",
          };
          deptMap[dept].push(customerWithDept);
        });

        // Process queued chats (in my departments)
        queuedChatGroups.forEach((group) => {
          const dept = group.department;
          if (!deptMap[dept]) deptMap[dept] = [];
          const customerWithDept = {
            ...group.customer,
            department: dept,
            chat_type: "queued", // Mark as queued chat
            status: group.customer.status || "queued",
          };
          deptMap[dept].push(customerWithDept);
        });

        // Sort each department's chats: queued first, then active
        Object.keys(deptMap).forEach((dept) => {
          deptMap[dept].sort((a, b) => {
            // Queued chats first
            if (a.chat_type === "queued" && b.chat_type === "active") return -1;
            if (a.chat_type === "active" && b.chat_type === "queued") return 1;
            // Within same type, sort by time (most recent first)
            return 0;
          });
        });

        setDepartmentCustomers(deptMap);
        const departmentList = ["All", ...Object.keys(deptMap)];
        setDepartments(departmentList);
        setSelectedDepartment((prev) => prev || "All");

        return deptMap;
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        `Failed to load ${isResolvedMode ? "resolved" : "active"} chat groups`;
      setError(errorMessage);
      console.error(
        `Failed to load ${isResolvedMode ? "resolved" : "active"} chat groups:`,
        err,
      );
      throw err;
    } finally {
      setLoading(false);
      fetchInProgressRef.current = false;
    }
  }, [isResolvedMode]);

  /**
   * Handle message received from socket
   */
  const handleMessageReceived = useCallback((msg, currentUserId) => {
    setMessages((prev) => {
      const exists = prev.some((m) => m.id === msg.chat_id);
      if (exists) return prev;

      // Determine if this message is from the current user
      const isCurrentUser =
        (msg.sys_user_id && msg.sys_user_id === currentUserId) ||
        (msg.sender_type === "agent" && msg.sender_id === currentUserId);

      // Determine message status for display
      let messageStatus = "sent";
      if (isCurrentUser) {
        // For current user's messages, check delivery/read status
        if (msg.chat_read_at) {
          messageStatus = "read";
        }
      }

      return [
        ...prev,
        {
          id: msg.chat_id,
          sender: isCurrentUser ? "user" : "system",
          content: msg.chat_body,
          timestamp: msg.chat_created_at,
          sender_name: msg.sender_name || "Unknown",
          sender_type: msg.sender_type || "system",
          sender_image: msg.sender_image || null,
          status: messageStatus,
          displayTime: new Date(msg.chat_created_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ];
    });
  }, []);

  /**
   * Handle message status updates from socket (including auto-updates)
   */
  const handleMessageStatusUpdate = useCallback((data) => {
    setMessages((prev) => 
      prev.map(msg => 
        msg.id === data.chatId
          ? { ...msg, status: data.status }
          : msg
      )
    );

    console.log("data sa useChat: ", data)
    
    if (data.updatedByType === "auto") {
      console.log(`🤖 Auto-updated message ${data.chatId} to ${data.status}`);
    }
  }, []);

  // Initialize socket connection and listeners (only for active mode)
  useChatSocket({
    selectedCustomer,
    getUserId,
    onMessageReceived: handleMessageReceived,
    onCustomerListUpdate: handleCustomerListUpdate,
    onMessageStatusUpdate: handleMessageStatusUpdate,
    enabled: !isResolvedMode, // Disable socket for resolved mode
  });

  // Initialize typing indicators (only for active mode)
  const { isTyping, typingUser, typingUserImage, handleTypingWithTimeout } =
    useTyping(selectedCustomer, getUserId, !isResolvedMode);

  /**
   * Initial fetch on mount
   */
  useEffect(() => {
    fetchChatGroups();
  }, [fetchChatGroups]);

  /**
   * Fetch canned messages for current user's role (only in active mode)
   */
  const fetchCannedMessages = useCallback(async () => {
    // Skip if in resolved mode
    if (isResolvedMode) {
      setCannedMessages([]);
      return;
    }

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
      console.error("Failed to load canned messages:", err);
      // Don't show error toast for canned messages - not critical
    }
  }, [hasPermission, isResolvedMode]);

  /**
   * Load canned messages on mount only (skip in resolved mode)
   */
  useEffect(() => {
    // Skip if in resolved mode
    if (isResolvedMode) {
      setCannedMessages([]);
      return;
    }

    // Only fetch if user has permission
    if (hasPermission("priv_can_use_canned_mess")) {
      fetchCannedMessages();
    } else {
      setCannedMessages([]);
    }
  }, [hasPermission, fetchCannedMessages, isResolvedMode]);

  /**
   * Determine frontend sender type for message display
   */
  const determineFrontendSender = useCallback((msg) => {
    // For UI compatibility:
    // - client and previous_agent messages go to left (system)
    // - current_agent messages go to right (user)
    if (msg.sender_type === "current_agent") {
      return "user";
    } else {
      return "system"; // client, previous_agent, system all go to left
    }
  }, []);

  /**
   * Load messages for a specific client with debouncing
   * @param {number} clientId - Client ID
   * @param {string} before - ISO timestamp for pagination
   * @param {boolean} append - Whether to append to existing messages (for pagination)
   */
  const loadMessages = useCallback(
    async (clientId, before = null, append = false) => {
      // Prevent simultaneous message loads (except for pagination)
      if (!append && loadMessagesInProgressRef.current) {
        console.log("⏳ Message load already in progress, skipping...");
        return;
      }

      loadMessagesInProgressRef.current = true;

      if (append) {
        setIsLoadingMore(true);
      }

      try {
        const response = await ChatService.getMessages(clientId, before, 10);
        const currentUserId = getUserId();
        
        const newMessages = response.messages.map((msg, index) => {
          // Determine if this message is from the current user
          const isCurrentUser = determineFrontendSender(msg) === "user";
          
          console.log(`isCurrentUser: ${isCurrentUser}`)
          console.log('msg: ', msg)
          // Determine message status for display
          let messageStatus = "sent";
          if (isCurrentUser) {
            // For current user's messages (agent messages), check client status
            if (msg.chat_read_at) {
              messageStatus = "read";
            } else if (msg.chat_delivered_at) {
              messageStatus = "delivered";
            }
          }

          return {
            id: msg.chat_id || index,
            sender: determineFrontendSender(msg),
            content: msg.chat_body,
            timestamp: msg.chat_created_at,
            sender_name: msg.sender_name || "Unknown",
            sender_type: msg.sender_type || "system",
            sender_image: msg.sender_image || null,
            status: messageStatus,
            displayTime: new Date(msg.chat_created_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          };
        });

        setMessages((prev) => {
          const combined = append
            ? [...newMessages, ...prev]
            : [...newMessages];

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
        toast.error("Failed to load messages");
      } finally {
        if (append) {
          setIsLoadingMore(false);
        }
        loadMessagesInProgressRef.current = false;
      }
    },
    [determineFrontendSender, getUserId],
  );

  /**
   * Select a customer and load their messages
   * @param {Object} customer - Customer object
   */
  const selectCustomer = useCallback(
    async (customer) => {
      setSelectedCustomer(customer);
      // Check if chat is ended: either in endedChats array or has resolved status
      const isEnded =
        endedChats.some((chat) => chat.chat_group_id === customer.chat_group_id) ||
        customer.status === "resolved" ||
        customer.chat_type === "resolved";
      setChatEnded(isEnded);
      setMessages([]);
      setEarliestMessageTime(null);
      setHasMoreMessages(true);

      // Use chat_group_id if available (for department-specific chats), otherwise use client id
      const messageId = customer.chat_group_id || customer.id;
      await loadMessages(messageId);
    },
    [endedChats, loadMessages, isResolvedMode],
  );

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

    const trimmedMessage = inputMessage.replace(/\n+$/, "");
    if (trimmedMessage.trim() === "") return;
    if (!selectedCustomer) return;

    // Clear input immediately for better UX
    setInputMessage("");

    // Send via socket - import directly from socket-simple
    socketSendMessage(socket, {
      chat_body: trimmedMessage,
      chat_group_id: selectedCustomer.chat_group_id,
      sys_user_id: getUserId(),
      client_id: null,
    });
  }, [inputMessage, selectedCustomer, hasPermission, getUserId]);

  /**
   * End the current chat
   */
  const endChat = useCallback(async () => {
    // Check permission first
    if (!hasPermission("priv_can_end_chat")) {
      console.warn("User does not have permission to end chats");
      toast.error("You don't have permission to end chats");
      return;
    }

    if (!selectedCustomer) return;

    try {
      // Call API to resolve the chat in the database
      await ChatService.resolveChat(selectedCustomer.chat_group_id);

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

      // Refresh chat groups to remove the ended chat from active list
      fetchChatGroups();

      toast.success("Chat ended successfully");
    } catch (err) {
      console.error("Error ending chat:", err);
      toast.error("Failed to end chat");
    }
  }, [selectedCustomer, messages, hasPermission, fetchChatGroups]);

  /**
   * Transfer chat to another department
   * @param {number} deptId - Target department ID
   */
  const transferChat = useCallback(
    async (deptId) => {
      if (!selectedCustomer) return false;

      try {
        const response = await ChatService.transferChatGroup(
          selectedCustomer.chat_group_id,
          deptId,
        );

        if (response.success) {
          // Remove the transferred chat from current user's list
          setDepartmentCustomers((prevDeptCustomers) => {
            const updatedDeptCustomers = { ...prevDeptCustomers };

            // Find and remove the transferred customer from all departments
            Object.keys(updatedDeptCustomers).forEach((dept) => {
              updatedDeptCustomers[dept] = updatedDeptCustomers[dept].filter(
                (customer) =>
                  customer.chat_group_id !== selectedCustomer.chat_group_id,
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
              (dept) =>
                departmentCustomers[dept] &&
                departmentCustomers[dept].length > 0,
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
    },
    [selectedCustomer, departmentCustomers],
  );

  /**
   * Accept/Take a queued chat (assign to current agent)
   * @param {number} chatGroupId - Chat group ID
   */
  const acceptQueuedChat = useCallback(
    async (chatGroupId) => {
      try {
        const response = await QueueService.acceptChat(chatGroupId);

        if (response.success) {
          toast.success("Chat accepted successfully");

          // Update the chat from queued to active in local state
          setDepartmentCustomers((prevDeptCustomers) => {
            const updatedDeptCustomers = { ...prevDeptCustomers };
            let acceptedCustomer = null;

            Object.keys(updatedDeptCustomers).forEach((dept) => {
              updatedDeptCustomers[dept] = updatedDeptCustomers[dept].map(
                (customer) => {
                  if (customer.chat_group_id === chatGroupId) {
                    acceptedCustomer = {
                      ...customer,
                      chat_type: "active",
                      status: "active",
                    };
                    return acceptedCustomer;
                  }
                  return customer;
                },
              );

              // Re-sort: queued chats first
              updatedDeptCustomers[dept].sort((a, b) => {
                if (a.chat_type === "queued" && b.chat_type === "active")
                  return -1;
                if (a.chat_type === "active" && b.chat_type === "queued")
                  return 1;
                return 0;
              });
            });

            // Update selected customer if it's the one we just accepted
            if (
              acceptedCustomer &&
              selectedCustomer?.chat_group_id === chatGroupId
            ) {
              setSelectedCustomer(acceptedCustomer);
            }

            return updatedDeptCustomers;
          });

          // Refresh to get updated data
          fetchChatGroups();

          return true;
        }
        return false;
      } catch (err) {
        console.error("Error accepting queued chat:", err);
        toast.error("Failed to accept chat");
        return false;
      }
    },
    [fetchChatGroups, selectedCustomer],
  );

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
    bottomRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages]);

  /**
   * Handle input change with typing indicator emission
   */
  const handleInputChange = useCallback(
    (e) => {
      const value = e.target.value;
      setInputMessage(value);

      // Emit typing indicator
      handleTypingWithTimeout(value.length > 0);
    },
    [handleTypingWithTimeout],
  );

  /**
   * Auto-resize textarea
   */
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputMessage]);

  // Get filtered customers based on selected department
  const allCustomers = Object.values(departmentCustomers).flat();
  const filteredCustomers =
    selectedDepartment === "All"
      ? allCustomers
      : departmentCustomers[selectedDepartment] || [];

  return {
    // Mode
    mode,
    isResolvedMode,

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
    handleInputChange,

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
    typingUserImage,

    // Actions
    fetchChatGroups,
    selectCustomer,
    sendMessage,
    acceptQueuedChat,
    endChat,
    transferChat,
    clearSelection,

    // Refs
    bottomRef,
    textareaRef,
  };
};
