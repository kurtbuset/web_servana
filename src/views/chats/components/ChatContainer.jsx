import { useState, useEffect, useRef } from "react";
import { useTheme } from "../../../context/ThemeContext";
import { useUser } from "../../../context/UserContext";
import { useDepartmentPanel } from "../../../context/DepartmentPanelContext";
import { useChat } from "../../../hooks/useChat";
import { ChatService } from "../../../services/chat.service";
import { groupMessagesByDate } from "../../../utils/dateFormatters";
import ChatModals from "./ChatModals";
import ChatSidebar from "./ChatSidebar";
import ChatMainArea from "./ChatMainArea";
import ProfilePanel from "../../../components/chat/ProfilePanel";

/**
 * ChatContainer - Main container for the chat interface
 * Manages state and business logic, delegates rendering to child components
 */
export default function ChatContainer() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [view, setView] = useState("chatList");
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showEndChatModal, setShowEndChatModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showTransferConfirmModal, setShowTransferConfirmModal] = useState(false);
  const [showDeptDropdown, setShowDeptDropdown] = useState(false);
  const [transferDepartment, setTransferDepartment] = useState(null);
  const [allDepartments, setAllDepartments] = useState([]);
  const [showProfilePanel, setShowProfilePanel] = useState(false);
  
  const { isOpen: isDepartmentPanelOpen, toggle: toggleDepartmentPanel } = useDepartmentPanel();
  const dropdownRef = useRef(null);
  const scrollContainerRef = useRef(null);

  const { hasPermission } = useUser();
  const { isDark } = useTheme();
  const canMessage = hasPermission("priv_can_message");
  const canEndChat = hasPermission("priv_can_end_chat");
  const canTransfer = hasPermission("priv_can_transfer");
  const canUseCannedMessages = hasPermission("priv_can_use_canned_mess");

  const {
    departments,
    selectedDepartment,
    setSelectedDepartment,
    filteredCustomers,
    selectedCustomer,
    messages,
    inputMessage,
    setInputMessage,
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
    selectCustomer,
    sendMessage,
    endChat,
    transferChat,
    bottomRef,
    textareaRef,
  } = useChat();

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
    
    const selectedDept = allDepartments.find(dept => dept.dept_name === transferDepartment);
    if (selectedDept) {
      const success = await transferChat(selectedDept.dept_id);
      if (success && isMobile) {
        setView("chatList");
      }
    }
  };

  const cancelTransfer = () => {
    setShowTransferModal(false);
    setTransferDepartment(null);
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

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
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

  // Handle canned messages click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (!e.target.closest(".canned-dropdown")) {
        setShowCannedMessages(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setShowCannedMessages]);

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
          await loadMessages(selectedCustomer.id, earliestMessageTime, true);

          setTimeout(() => {
            if (container) {
              const newHeight = container.scrollHeight;
              const heightDiff = newHeight - prevHeight;
              container.scrollTop = prevScrollTop + heightDiff;
            }
          }, 50);
        } catch (error) {
          console.error('Error loading more messages:', error);
        }

        setTimeout(() => {
          isThrottled = false;
        }, throttleDelay);
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [earliestMessageTime, hasMoreMessages, selectedCustomer, loadMessages, isLoadingMore]);

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <>
      <ChatModals
        showEndChatModal={showEndChatModal}
        showTransferModal={showTransferModal}
        showTransferConfirmModal={showTransferConfirmModal}
        allDepartments={allDepartments}
        transferDepartment={transferDepartment}
        selectedDepartment={selectedDepartment}
        onConfirmEndChat={confirmEndChat}
        onCancelEndChat={cancelEndChat}
        onDepartmentChange={setTransferDepartment}
        onConfirmTransfer={handleDepartmentSelect}
        onCancelTransfer={cancelTransfer}
        onConfirmTransferConfirm={confirmTransfer}
        onCancelTransferConfirm={cancelTransferConfirm}
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
            hasMoreMessages={hasMoreMessages}
            isLoadingMore={isLoadingMore}
            openDropdown={openDropdown}
            canMessage={canMessage}
            canEndChat={canEndChat}
            canTransfer={canTransfer}
            canUseCannedMessages={canUseCannedMessages}
            isDepartmentPanelOpen={isDepartmentPanelOpen}
            scrollContainerRef={scrollContainerRef}
            textareaRef={textareaRef}
            bottomRef={bottomRef}
            dropdownRef={dropdownRef}
            onBack={handleBackClick}
            onInputChange={handleInputChange}
            onSendMessage={handleSendMessage}
            onToggleCannedMessages={() => setShowCannedMessages((prev) => !prev)}
            onSelectCannedMessage={(msg) => {
              setInputMessage(msg);
              setShowCannedMessages(false);
            }}
            onMenuToggle={() => toggleDropdown("customerMenu")}
            onEndChat={handleEndChat}
            onTransfer={handleTransferClick}
            onProfileClick={handleProfileClick}
            onToggleDepartmentPanel={toggleDepartmentPanel}
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
