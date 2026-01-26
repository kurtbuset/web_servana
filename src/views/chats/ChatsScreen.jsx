import { useState, useEffect, useRef } from "react";
import TopNavbar from "../../../src/components/TopNavbar";
import Sidebar from "../../../src/components/Sidebar";
import { useChat } from "../../hooks/useChat";
import { useUser } from "../../context/UserContext";
import { ChatService } from "../../services/chat.service";
import { groupMessagesByDate } from "../../utils/dateFormatters";
import ConfirmDialog from "../../components/chat/ConfirmDialog";
import TransferModal from "../../components/chat/TransferModal";
import DepartmentFilter from "../../components/chat/DepartmentFilter";
import CustomerList from "../../components/chat/CustomerList";
import ChatHeader from "../../components/chat/ChatHeader";
import ChatMessages from "../../components/chat/ChatMessages";
import MessageInput from "../../components/chat/MessageInput";
import "../../App.css";

/**
 * ChatsScreen - Refactored chat interface
 * 
 * Uses the new useChat hook for business logic and Socket.IO integration
 * while maintaining the exact same UI/UX as the original Chats screen.
 * 
 * Features:
 * - Real-time messaging via Socket.IO
 * - Department filtering
 * - Canned messages
 * - Message pagination (load more)
 * - End chat functionality
 * - Transfer department (UI only)
 * - Mobile responsive with chat list/conversation views
 */
export default function ChatsScreen() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [view, setView] = useState("chatList");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showEndChatModal, setShowEndChatModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showTransferConfirmModal, setShowTransferConfirmModal] = useState(false);
  const [showDeptDropdown, setShowDeptDropdown] = useState(false);
  const [transferDepartment, setTransferDepartment] = useState(null);
  const [allDepartments, setAllDepartments] = useState([]);
  const dropdownRef = useRef(null);
  const scrollContainerRef = useRef(null);

  // Get user permissions
  const { hasPermission } = useUser();
  const canMessage = hasPermission("priv_can_message");
  const canEndChat = hasPermission("priv_can_end_chat");
  const canTransfer = hasPermission("priv_can_transfer");
  const canUseCannedMessages = hasPermission("priv_can_use_canned_mess");

  // Get chat state and actions from hook
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
    loadMessages,
    chatEnded,
    endedChats,
    selectCustomer,
    sendMessage,
    endChat,
    transferChat,
    bottomRef,
    textareaRef,
  } = useChat();

  const toggleSidebar = () => {
    setMobileSidebarOpen((prev) => !prev);
  };

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
    
    // Find the selected department object
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
    
    // Navigate back to chat list in mobile view
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

  useEffect(() => {
    function handleClickOutside(e) {
      if (!e.target.closest(".canned-dropdown")) {
        setShowCannedMessages(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setShowCannedMessages]);

  const groupedMessages = groupMessagesByDate(messages);

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

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleChatClick = async (customer) => {
    await selectCustomer(customer);
    if (isMobile) setView("conversation");
  };

  const handleBackClick = () => {
    setView("chatList");
  };

  // Handle scroll for pagination
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = async () => {
      if (container.scrollTop === 0 && hasMoreMessages && selectedCustomer) {
        const prevHeight = container.scrollHeight;

        await loadMessages(selectedCustomer.id, earliestMessageTime, true);

        // Maintain scroll position
        setTimeout(() => {
          container.scrollTop = container.scrollHeight - prevHeight;
        }, 50);
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [earliestMessageTime, hasMoreMessages, selectedCustomer, loadMessages]);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <TopNavbar toggleSidebar={toggleSidebar} />

      {/* End Chat Modal */}
      <ConfirmDialog
        isOpen={showEndChatModal}
        title="End Chat"
        message="Are you sure you want to end this chat session?"
        onConfirm={confirmEndChat}
        onCancel={cancelEndChat}
        confirmText="Confirm"
        confirmButtonClass="bg-red-500 hover:bg-red-600"
      />

      {/* Transfer Modal */}
      <TransferModal
        isOpen={showTransferModal}
        departments={allDepartments.map(dept => dept.dept_name)}
        selectedDepartment={transferDepartment}
        currentDepartment={selectedDepartment}
        onDepartmentChange={setTransferDepartment}
        onConfirm={handleDepartmentSelect}
        onCancel={cancelTransfer}
      />

      {/* Transfer Confirm Modal */}
      <ConfirmDialog
        isOpen={showTransferConfirmModal}
        title="Confirm Transfer"
        message={`Are you sure you want to transfer this customer to ${transferDepartment}?`}
        onConfirm={confirmTransfer}
        onCancel={cancelTransferConfirm}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          isMobile={true}
          isOpen={mobileSidebarOpen}
          toggleDropdown={toggleDropdown}
          openDropdown={openDropdown}
          onClose={() => setMobileSidebarOpen(false)}
        />

        <Sidebar
          isMobile={false}
          toggleDropdown={toggleDropdown}
          openDropdown={openDropdown}
        />

        <main className="flex-1 bg-white">
          <div className="flex flex-col md:flex-row h-full">
            {/* Chat list */}
            <div
              className={`${
                view === "chatList" ? "block" : "hidden md:block"
              } w-full md:w-[320px] bg-[#F5F5F5] overflow-y-auto`}
            >
              <DepartmentFilter
                departments={departments}
                selectedDepartment={selectedDepartment}
                onDepartmentChange={setSelectedDepartment}
                isOpen={showDeptDropdown}
                onToggle={() => setShowDeptDropdown((prev) => !prev)}
              />

              <CustomerList
                customers={filteredCustomers}
                selectedCustomer={selectedCustomer}
                onCustomerClick={handleChatClick}
                endedChats={endedChats}
              />
            </div>

            {/* Chat area */}
            <div
              className={`${
                view === "conversation" ? "block" : "hidden md:flex"
              } flex-1 flex flex-col`}
            >
              {selectedCustomer ? (
                <>
                  <ChatHeader
                    customer={selectedCustomer}
                    isMobile={isMobile}
                    onBack={handleBackClick}
                    showAcceptButton={false}
                    showMenu={true}
                    chatEnded={chatEnded}
                    menuOpen={openDropdown === "customerMenu"}
                    onMenuToggle={() => toggleDropdown("customerMenu")}
                    onEndChat={handleEndChat}
                    onTransfer={handleTransferClick}
                    dropdownRef={dropdownRef}
                    canEndChat={canEndChat}
                    canTransfer={canTransfer}
                  />

                  <ChatMessages
                    groupedMessages={groupedMessages}
                    selectedCustomer={selectedCustomer}
                    chatEnded={chatEnded}
                    scrollContainerRef={scrollContainerRef}
                    bottomRef={bottomRef}
                    isMobile={isMobile}
                  />

                  <MessageInput
                    inputMessage={inputMessage}
                    onInputChange={handleInputChange}
                    onSendMessage={handleSendMessage}
                    textareaRef={textareaRef}
                    showCannedMessages={showCannedMessages}
                    onToggleCannedMessages={() =>
                      setShowCannedMessages((prev) => !prev)
                    }
                    cannedMessages={cannedMessages}
                    onSelectCannedMessage={(msg) => {
                      setInputMessage(msg);
                      setShowCannedMessages(false);
                    }}
                    disabled={!canMessage || chatEnded}
                    disabledMessage={!canMessage ? "You don't have permission to reply/Chat" : "Message"}
                    chatEnded={chatEnded}
                    canUseCannedMessages={canUseCannedMessages}
                  />
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-gray-400">
                    {endedChats.length > 0
                      ? "Select a customer to start a new chat"
                      : "Select a customer to view chat"}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
