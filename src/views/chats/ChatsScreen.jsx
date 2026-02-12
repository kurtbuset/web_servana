import { useState, useEffect, useRef } from "react";
import TopNavbar from "../../../src/components/TopNavbar";
import Sidebar from "../../../src/components/Sidebar";
import { useChat } from "../../hooks/useChat";
import { useUser } from "../../context/UserContext";
import { useTheme } from "../../context/ThemeContext";
import { PERMISSIONS } from "../../constants/permissions";
import { ChatService } from "../../services/chat.service";
import { groupMessagesByDate } from "../../utils/dateFormatters";
import ConfirmDialog from "../../components/chat/ConfirmDialog";
import TransferModal from "../../components/chat/TransferModal";
import DepartmentFilter from "../../components/chat/DepartmentFilter";
import CustomerList from "../../components/chat/CustomerList";
import ChatHeader from "../../components/chat/ChatHeader";
import ChatMessages from "../../components/chat/ChatMessages";
import MessageInput from "../../components/chat/MessageInput";
import ProfilePanel from "../../components/chat/ProfilePanel";
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
  const [showProfilePanel, setShowProfilePanel] = useState(false);
  const dropdownRef = useRef(null);
  const scrollContainerRef = useRef(null);

  // Get user permissions
  const { hasPermission } = useUser();
  const { isDark } = useTheme();
  const canMessage = hasPermission(PERMISSIONS.MESSAGE);
  const canEndChat = hasPermission(PERMISSIONS.END_CHAT);
  const canTransfer = hasPermission(PERMISSIONS.TRANSFER);
  const canUseCannedMessages = hasPermission(PERMISSIONS.USE_CANNED_MESS);

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

  const handleProfileClick = () => {
    setShowProfilePanel(true);
  };

  const handleCloseProfile = () => {
    setShowProfilePanel(false);
  };

  // Handle scroll for pagination
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let isThrottled = false;
    const throttleDelay = 300; // 300ms throttle

    const handleScroll = async () => {
      if (isThrottled || isLoadingMore) return;
      
      // Check if scrolled to top (with small buffer for better UX)
      if (container.scrollTop <= 50 && hasMoreMessages && selectedCustomer) {
        isThrottled = true;
        const prevHeight = container.scrollHeight;
        const prevScrollTop = container.scrollTop;

        try {
          await loadMessages(selectedCustomer.id, earliestMessageTime, true);

          // Maintain scroll position after loading
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

        // Reset throttle after delay
        setTimeout(() => {
          isThrottled = false;
        }, throttleDelay);
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [earliestMessageTime, hasMoreMessages, selectedCustomer, loadMessages, isLoadingMore]);

  return (
    <>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${isDark ? '#2a2a2a' : '#f1f1f1'};
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #6237A0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #7A4ED9;
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-in {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
      <div className="flex flex-col h-screen overflow-hidden" style={{ backgroundColor: 'var(--bg-secondary)' }}>
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

        <main className="flex-1" style={{ backgroundColor: 'transparent' }}>
          <div className="flex flex-col md:flex-row h-full gap-0 md:gap-3 p-0 md:p-3">
            {/* Chat list - Enhanced */}
            <div
              className={`${
                view === "chatList" ? "block" : "hidden md:block"
              } w-full md:w-[320px] lg:w-[360px] md:rounded-xl shadow-sm border-0 md:border overflow-hidden flex flex-col`}
              style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
            >
              {/* Header Section */}
              <div className="bg-gradient-to-r from-[#6237A0] to-[#7A4ED9] p-3 md:p-4">
                <h2 className="text-base md:text-lg font-bold text-white mb-0.5 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Active Chats
                </h2>
                <p className="text-purple-100 text-[10px] md:text-xs">
                  {filteredCustomers.length} conversation{filteredCustomers.length !== 1 ? 's' : ''}
                </p>
              </div>

              <DepartmentFilter
                departments={departments}
                selectedDepartment={selectedDepartment}
                onDepartmentChange={setSelectedDepartment}
                isOpen={showDeptDropdown}
                onToggle={() => setShowDeptDropdown((prev) => !prev)}
              />

              <div className="flex-1 overflow-y-auto custom-scrollbar">
                {loading ? (
                  <div className="flex-1 flex items-center justify-center p-6">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-100 to-purple-50 rounded-full flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#6237A0] border-t-transparent"></div>
                      </div>
                      <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                        Loading Chats
                      </h3>
                      <p className="text-xs max-w-xs mx-auto leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        Fetching active conversations...
                      </p>
                    </div>
                  </div>
                ) : filteredCustomers.length > 0 ? (
                  <CustomerList
                    customers={filteredCustomers}
                    selectedCustomer={selectedCustomer}
                    onCustomerClick={handleChatClick}
                    endedChats={endedChats}
                  />
                ) : (
                  <div className="flex-1 flex items-center justify-center p-6">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-100 to-purple-50 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-[#6237A0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                        No Active Chats
                      </h3>
                      <p className="text-xs max-w-xs mx-auto leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        No active conversations at the moment. New chats will appear here automatically.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Chat area - Enhanced */}
            <div
              className={`${
                view === "conversation" ? "block" : "hidden md:flex"
              } flex-1 flex flex-col md:rounded-xl shadow-sm border-0 md:border overflow-hidden`}
              style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
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
                    onProfileClick={handleProfileClick}
                  />

                  <ChatMessages
                    groupedMessages={groupedMessages}
                    selectedCustomer={selectedCustomer}
                    chatEnded={chatEnded}
                    scrollContainerRef={scrollContainerRef}
                    bottomRef={bottomRef}
                    isMobile={isMobile}
                    isTyping={isTyping}
                    typingUser={typingUser}
                    hasMoreMessages={hasMoreMessages}
                    isLoadingMore={isLoadingMore}
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
                <div className="flex-1 flex items-center justify-center p-4">
                  <div className="text-center animate-slide-in">
                    <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-4 bg-gradient-to-br from-purple-100 to-purple-50 rounded-full flex items-center justify-center">
                      <svg className="w-10 h-10 md:w-12 md:h-12 text-[#6237A0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <h3 className="text-base md:text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>No Chat Selected</h3>
                    <p className="text-xs md:text-sm max-w-xs mx-auto" style={{ color: 'var(--text-secondary)' }}>
                      {endedChats.length > 0
                        ? "Select a customer to start a new conversation"
                        : "Select a customer to view chat history"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Profile Panel */}
        <ProfilePanel
          customer={selectedCustomer}
          isOpen={showProfilePanel}
          onClose={handleCloseProfile}
        />
      </div>
    </div>
    </>
  );
}
