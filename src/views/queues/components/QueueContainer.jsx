import { useState, useEffect, useRef } from "react";
import { useQueues } from "../../../hooks/useQueues";
import { useUser } from "../../../context/UserContext";
import { groupMessagesByDate } from "../../../utils/dateFormatters";
import toast from "../../../utils/toast";
import QueueModals from "./QueueModals";
import QueueSidebar from "./QueueSidebar";
import QueueMainArea from "./QueueMainArea";

/**
 * QueueContainer - Main container for the queue interface
 * Manages state and business logic, delegates rendering to child components
 */
export default function QueueContainer() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [view, setView] = useState("chatList");
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showEndChatModal, setShowEndChatModal] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showTransferConfirmModal, setShowTransferConfirmModal] = useState(false);
  const [showDeptDropdown, setShowDeptDropdown] = useState(false);
  const [transferDepartment, setTransferDepartment] = useState(null);

  const dropdownRef = useRef(null);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);
  const scrollContainerRef = useRef(null);

  const { hasPermission } = useUser();
  const canMessage = hasPermission("priv_can_message");
  const canEndChat = hasPermission("priv_can_end_chat");
  const canTransfer = hasPermission("priv_can_transfer");

  const {
    departments,
    selectedDepartment,
    setSelectedDepartment,
    selectedCustomer,
    messages,
    earliestMessageTime,
    hasMoreMessages,
    isLoadingMore,
    chatEnded,
    filteredCustomers,
    loading,
    selectCustomer,
    acceptChat,
    sendMessage: sendMessageAction,
    endChat,
    loadMessages,
  } = useQueues();

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

  const confirmTransfer = () => {
    setShowTransferConfirmModal(false);
    console.log(`Transferring to ${transferDepartment}`);
    alert(`Customer transferred to ${transferDepartment}`);
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
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  };

  const sendMessage = () => {
    if (!canMessage) {
      console.warn("User does not have permission to send messages");
      return;
    }
    
    const trimmedMessage = inputMessage.replace(/\n+$/, "");
    if (trimmedMessage.trim() === "") return;

    sendMessageAction(trimmedMessage);
    setInputMessage("");
  };

  const handleChatClick = async (customer) => {
    await selectCustomer(customer);
    if (isMobile) setView("conversation");
  };

  const handleAcceptChat = async () => {
    const success = await acceptChat();
    if (success) {
      toast.success("Chat accepted! You can now communicate with the client.");
    } else {
      toast.error("Failed to accept chat. Please try again.");
    }
  };

  const handleBackClick = () => {
    setView("chatList");
  };

  // Handle scroll for loading more messages
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

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputMessage]);

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <>
      <QueueModals
        showEndChatModal={showEndChatModal}
        showTransferModal={showTransferModal}
        showTransferConfirmModal={showTransferConfirmModal}
        departments={departments}
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
          <QueueSidebar
            view={view}
            departments={departments}
            selectedDepartment={selectedDepartment}
            setSelectedDepartment={setSelectedDepartment}
            filteredCustomers={filteredCustomers}
            selectedCustomer={selectedCustomer}
            loading={loading}
            showDeptDropdown={showDeptDropdown}
            setShowDeptDropdown={setShowDeptDropdown}
            onCustomerClick={handleChatClick}
          />

          <QueueMainArea
            view={view}
            isMobile={isMobile}
            selectedCustomer={selectedCustomer}
            groupedMessages={groupedMessages}
            chatEnded={chatEnded}
            inputMessage={inputMessage}
            hasMoreMessages={hasMoreMessages}
            isLoadingMore={isLoadingMore}
            openDropdown={openDropdown}
            canMessage={canMessage}
            canEndChat={canEndChat}
            canTransfer={canTransfer}
            scrollContainerRef={scrollContainerRef}
            textareaRef={textareaRef}
            bottomRef={bottomRef}
            dropdownRef={dropdownRef}
            onBack={handleBackClick}
            onInputChange={handleInputChange}
            onSendMessage={sendMessage}
            onAccept={handleAcceptChat}
            onMenuToggle={() => toggleDropdown("customerMenu")}
            onEndChat={handleEndChat}
            onTransfer={handleTransferClick}
          />
        </div>
      </div>
    </>
  );
}
