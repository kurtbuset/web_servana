import { useState, useEffect, useCallback, useRef } from "react";
import QueueService from "../services/queue.service";
import SocketService from "../services/socket.service";

/**
 * useQueues Hook
 * Manages queue data with Socket.IO real-time updates
 */
export const useQueues = () => {
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
  const [chatEnded, setChatEnded] = useState(false);
  const [endedChats, setEndedChats] = useState([]);

  /**
   * Fetch all queued chat groups
   */
  const fetchChatGroups = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const chatGroups = await QueueService.getQueuedChats();
      const deptMap = {};
      console.log('chatGroups: ', chatGroups)

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
    }
  }, []);

  /**
   * Fetch canned messages
   */
  const fetchCannedMessages = useCallback(async () => {
    try {
      const data = await QueueService.getCannedMessages();
      if (Array.isArray(data)) {
        setCannedMessages(data.map((msg) => msg.canned_message));
      }
    } catch (err) {
      console.error("Failed to load canned messages:", err);
    }
  }, []);

  /**
   * Load messages for a specific client
   */
  const loadMessages = useCallback(
    async (clientId, before = null, append = false) => {
      try {
        const response = await QueueService.getMessages(clientId, before, 10);
        const newMessages = response.messages.map((msg, index) => ({
          id: msg.chat_id || index,
          sender: msg.sys_user_id ? "user" : "system",
          content: msg.chat_body,
          timestamp: msg.chat_created_at,
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
      }
    },
    []
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
        SocketService.emit("acceptChat", {
          chatGroupId: selectedCustomer.chat_group_id,
          agentId: response.agentId,
        });

        // Update local state - mark as accepted
        setSelectedCustomer((prev) => ({
          ...prev,
          isAccepted: true,
          sys_user_id: response.agentId,
        }));

        return true;
      }
      return false;
    } catch (err) {
      console.error("Error accepting chat:", err);
      return false;
    }
  }, [selectedCustomer]);

  /**
   * Send a message
   */
  const sendMessage = useCallback(
    (messageContent) => {
      if (!selectedCustomer || !messageContent.trim()) return;

      const now = new Date();
      const newMessage = {
        sender: "user",
        content: messageContent,
        timestamp: now.toISOString(),
        displayTime: now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, newMessage]);

      // Emit via socket
      SocketService.emit("sendMessage", {
        chat_body: messageContent,
        chat_group_id: selectedCustomer.chat_group_id,
        sys_user_id: 1, // TODO: Get from auth context
        client_id: null,
      });
    },
    [selectedCustomer]
  );

  /**
   * End the current chat
   */
  const endChat = useCallback(() => {
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
  }, [selectedCustomer, messages]);

  // Initialize: Connect socket and fetch initial data
  useEffect(() => {
    SocketService.connect(import.meta.env.VITE_BACKEND_URL);
    fetchChatGroups();
    fetchCannedMessages();

    return () => {
      SocketService.disconnect();
    };
  }, [fetchChatGroups, fetchCannedMessages]);

  // Listen for chat group updates
  useEffect(() => {
    const handleUpdateChatGroups = () => {
      console.log("Received updateChatGroups from server");
      fetchChatGroups();
    };

    SocketService.on("updateChatGroups", handleUpdateChatGroups);

    return () => {
      SocketService.off("updateChatGroups");
    };
  }, [fetchChatGroups]);

  // Join chat group and listen for messages when customer is selected
  useEffect(() => {
    if (!selectedCustomer) return;

    SocketService.emit("joinChatGroup", selectedCustomer.chat_group_id);

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

    SocketService.on("receiveMessage", handleReceiveMessage);

    return () => {
      SocketService.off("receiveMessage");
    };
  }, [selectedCustomer]);

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
