import { useState, useEffect, useRef, useCallback } from "react";
import { useUser } from "../../context/UserContext";
import { usePresence } from "../../context/PresenceContext";
import { useChat } from "../../hooks/useChat";
import { ChatService } from "../../services/chat.service";
import { groupMessagesByDate } from "../../utils/dateFormatters";
import socket from "../../socket";
import ChatModals from "./ChatModals";
import ChatSidebar from "./ChatSidebar";
import ChatMainArea from "./ChatMainArea";
import ProfilePanel from "./ProfilePanel";

/**
 * ChatContainer - Main container for the chat interface
 * Manages state and business logic, delegates rendering to child components
 *
 * @param {Object} props
 * @param {string} props.mode - "active" for active chats, "resolved" for resolved chats
 */
export default function ChatContainer({ mode = "active" }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [view, setView] = useState("chatList");
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showEndChatModal, setShowEndChatModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showTransferConfirmModal, setShowTransferConfirmModal] =
    useState(false);
  const [showDeptDropdown, setShowDeptDropdown] = useState(false);
  const [transferDepartment, setTransferDepartment] = useState(null);
  const [transferType, setTransferType] = useState('department');
  const [transferLabel, setTransferLabel] = useState(null);
  const [allDepartments, setAllDepartments] = useState([]);
  const [showProfilePanel, setShowProfilePanel] = useState(false);
  const [departmentAvailability, setDepartmentAvailability] = useState({});
  const [availableAgents, setAvailableAgents] = useState([]);
  const { fetchAvailableByDepartment, allPresences } = usePresence();
  const dropdownRef = useRef(null);
  const scrollContainerRef = useRef(null);

  const { permissions } = useUser();

  const isResolvedMode = mode === "resolved";
  const canMessage = permissions.canMessage && !isResolvedMode;
  const canEndChat = permissions.canEndChat && !isResolvedMode;
  const canTransfer = permissions.canTransfer && !isResolvedMode;
  const canUseCannedMessages = permissions.canUseCannedMess && !isResolvedMode;

  // Use unified hook with mode parameter
  const {
    departments,
    selectedDepartment,
    setSelectedDepartment,
    filteredCustomers,
    selectedCustomer,
    messages,
    inputMessage,
    setInputMessage,
    handleInputChange,
    cannedMessages,
    showCannedMessages,
    setShowCannedMessages,
    earliestMessageTime,
    hasMoreMessages,
    isLoadingMore,
    loadMessages,
    loading,
    chatEnded,
    endedChats,
    isTyping,
    typingUser,
    typingUserImage,
    selectCustomer,
    sendMessage,
    acceptQueuedChat,
    endChat,
    transferChat,
    transferChatToAgent,
    bottomRef,
    textareaRef,
  } = useChat({ mode });

  const toggleDropdown = (name) => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  const handleTransferClick = () => {
    if (!canTransfer) {
      console.warn("User does not have permission to transfer chats");
      return;
    }
    setOpenDropdown(null);
    setShowTransferModal(true);
    setTransferDepartment(selectedDepartment);
  };

  const handleDepartmentSelect = () => {
    if (transferDepartment) {
      setShowTransferModal(false);
      setShowTransferConfirmModal(true);
    }
  };

  const confirmTransfer = async () => {
    setShowTransferConfirmModal(false);

    if (transferType === 'agent') {
      const success = await transferChatToAgent(transferDepartment);
      if (success && isMobile) setView("chatList");
    } else {
      const selectedDept = allDepartments.find(
        (dept) => dept.dept_name === transferDepartment,
      );
      if (selectedDept) {
        const success = await transferChat(selectedDept.dept_id);
        if (success && isMobile) setView("chatList");
      }
    }
  };

  const cancelTransfer = () => {
    setShowTransferModal(false);
    setTransferDepartment(null);
    setTransferType('department');
    setTransferLabel(null);
  };

  const cancelTransferConfirm = () => {
    setShowTransferConfirmModal(false);
  };

  const handleEndChat = () => {
    if (!canEndChat) {
      console.warn("User does not have permission to end chats");
      return;
    }
    setOpenDropdown(null);
    setShowEndChatModal(true);
  };

  const confirmEndChat = () => {
    setShowEndChatModal(false);
    endChat();

    if (isMobile) setView("chatList");
  };

  const cancelEndChat = () => {
    setShowEndChatModal(false);
  };

  const handleSendMessage = () => {
    if (!canMessage) {
      console.warn("User does not have permission to send messages");
      return;
    }
    sendMessage();
  };

  const handleChatClick = async (customer) => {
    await selectCustomer(customer);
    if (isMobile) setView("conversation");
  };

  const handleBackClick = () => {
    setView("chatList");
  };

  const handleProfileClick = () => {
    setShowProfilePanel(true);
  };

  const handleCloseProfile = () => {
    setShowProfilePanel(false);
  };

  // Fetch available agents by department when transfer modal opens
  const refreshTransferPresence = useCallback(() => {
    fetchAvailableByDepartment((data) => {
      if (data?.departments) {
        const availMap = {};
        data.departments.forEach((d) => {
          availMap[d.dept_name] = d.availableCount;
        });
        setDepartmentAvailability(availMap);
      }
      if (data?.availableAgents) {
        setAvailableAgents(data.availableAgents);
      }
    });
  }, [fetchAvailableByDepartment]);

  useEffect(() => {
    if (showTransferModal) {
      refreshTransferPresence();
    }
  }, [showTransferModal, refreshTransferPresence]);

  // Real-time update when presence changes while transfer modal is open
  useEffect(() => {
    if (!showTransferModal) return;

    const handlePresenceChange = () => {
      refreshTransferPresence();
    };

    socket.on("presence:change", handlePresenceChange);
    return () => {
      socket.off("presence:change", handlePresenceChange);
    };
  }, [showTransferModal, refreshTransferPresence]);

  // Fetch all departments on component mount
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const depts = await ChatService.getAllDepartments();
        setAllDepartments(depts);
      } catch (err) {
        console.error("Failed to fetch departments:", err);
      }
    };

    fetchDepartments();
  }, []);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Handle dropdown click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle canned messages click outside (only in active mode)
  useEffect(() => {
    if (isResolvedMode) return;

    function handleClickOutside(e) {
      if (!e.target.closest(".canned-dropdown")) {
        setShowCannedMessages(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setShowCannedMessages, isResolvedMode]);

  // Handle scroll for pagination
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let isThrottled = false;
    const throttleDelay = 300;

    const handleScroll = async () => {
      if (isThrottled || isLoadingMore) return;

      if (container.scrollTop <= 50 && hasMoreMessages && selectedCustomer) {
        isThrottled = true;
        const prevHeight = container.scrollHeight;
        const prevScrollTop = container.scrollTop;

        try {
          // Use chat_group_id if available, otherwise use client id
          const messageId = selectedCustomer.chat_group_id || selectedCustomer.id;
          await loadMessages(messageId, earliestMessageTime, true);

          setTimeout(() => {
            if (container) {
              const newHeight = container.scrollHeight;
              const heightDiff = newHeight - prevHeight;
              container.scrollTop = prevScrollTop + heightDiff;
            }
          }, 50);
        } catch (error) {
          console.error("Error loading more messages:", error);
        }

        setTimeout(() => {
          isThrottled = false;
        }, throttleDelay);
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [
    earliestMessageTime,
    hasMoreMessages,
    selectedCustomer,
    loadMessages,
    isLoadingMore,
  ]);

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <>
      <ChatModals
        showEndChatModal={showEndChatModal}
        showTransferModal={showTransferModal}
        showTransferConfirmModal={showTransferConfirmModal}
        allDepartments={allDepartments}
        allAgents={[]}
        departmentAvailability={departmentAvailability}
        availableAgents={availableAgents}
        transferDepartment={transferDepartment}
        selectedDepartment={selectedDepartment}
        onConfirmEndChat={confirmEndChat}
        onCancelEndChat={cancelEndChat}
        onDepartmentChange={(value, type, label) => {
          setTransferDepartment(value);
          setTransferType(type || 'department');
          setTransferLabel(label || value);
        }}
        onConfirmTransfer={handleDepartmentSelect}
        onCancelTransfer={cancelTransfer}
        onConfirmTransferConfirm={confirmTransfer}
        onCancelTransferConfirm={cancelTransferConfirm}
        transferLabel={transferLabel}
      />

      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-col md:flex-row h-full gap-0 md:gap-3 p-0 md:p-3 flex-1">
          <ChatSidebar
            view={view}
            isMobile={isMobile}
            departments={departments}
            selectedDepartment={selectedDepartment}
            setSelectedDepartment={setSelectedDepartment}
            filteredCustomers={filteredCustomers}
            selectedCustomer={selectedCustomer}
            loading={loading}
            endedChats={endedChats}
            showDeptDropdown={showDeptDropdown}
            setShowDeptDropdown={setShowDeptDropdown}
            onCustomerClick={handleChatClick}
            title={mode === "resolved" ? "Resolved Chats" : "My chats"}
          />

          <ChatMainArea
            view={view}
            isMobile={isMobile}
            selectedCustomer={selectedCustomer}
            groupedMessages={groupedMessages}
            chatEnded={chatEnded}
            endedChats={endedChats}
            inputMessage={inputMessage}
            showCannedMessages={showCannedMessages}
            cannedMessages={cannedMessages}
            isTyping={isTyping}
            typingUser={typingUser}
            typingUserImage={typingUserImage}
            hasMoreMessages={hasMoreMessages}
            isLoadingMore={isLoadingMore}
            openDropdown={openDropdown}
            canMessage={canMessage}
            canEndChat={canEndChat}
            canTransfer={canTransfer}
            canUseCannedMessages={canUseCannedMessages}
            scrollContainerRef={scrollContainerRef}
            textareaRef={textareaRef}
            bottomRef={bottomRef}
            dropdownRef={dropdownRef}
            onBack={handleBackClick}
            onInputChange={handleInputChange}
            onSendMessage={handleSendMessage}
            onToggleCannedMessages={() =>
              setShowCannedMessages((prev) => !prev)
            }
            onSelectCannedMessage={(msg) => {
              setInputMessage(msg);
              setShowCannedMessages(false);
            }}
            onMenuToggle={() => toggleDropdown("customerMenu")}
            onEndChat={handleEndChat}
            onTransfer={handleTransferClick}
            onProfileClick={handleProfileClick}
            onAcceptChat={acceptQueuedChat}
          />
        </div>
      </div>

      <ProfilePanel
        customer={selectedCustomer}
        isOpen={showProfilePanel}
        onClose={handleCloseProfile}
      />
    </>
  );
}
