import { useState, useEffect, useRef } from "react";
import TopNavbar from "../../../src/components/TopNavbar";
import Sidebar from "../../../src/components/Sidebar";
import { useQueues } from "../../hooks/useQueues";
import { groupMessagesByDate } from "../../utils/dateFormatters";
import ConfirmDialog from "../../components/chat/ConfirmDialog";
import TransferModal from "../../components/chat/TransferModal";
import DepartmentFilter from "../../components/chat/DepartmentFilter";
import CustomerList from "../../components/chat/CustomerList";
import ChatHeader from "../../components/chat/ChatHeader";
import ChatMessages from "../../components/chat/ChatMessages";
import MessageInput from "../../components/chat/MessageInput";
import "../../App.css";

export default function QueuesScreen() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [view, setView] = useState("chatList");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showEndChatModal, setShowEndChatModal] = useState(false);
  const [showCannedMessages, setShowCannedMessages] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showTransferConfirmModal, setShowTransferConfirmModal] = useState(false);
  const [showDeptDropdown, setShowDeptDropdown] = useState(false);
  const [transferDepartment, setTransferDepartment] = useState(null);

  const dropdownRef = useRef(null);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);
  const scrollContainerRef = useRef(null);

  const {
    departments,
    selectedDepartment,
    setSelectedDepartment,
    selectedCustomer,
    messages,
    cannedMessages,
    earliestMessageTime,
    hasMoreMessages,
    chatEnded,
    filteredCustomers,
    selectCustomer,
    acceptChat,
    sendMessage: sendMessageAction,
    endChat,
    loadMessages,
  } = useQueues();

  const toggleSidebar = () => setMobileSidebarOpen((prev) => !prev);

  const toggleDropdown = (name) => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  const handleTransferClick = () => {
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
      alert("Chat accepted! You can now communicate with the client.");
    } else {
      alert("Failed to accept chat. Please try again.");
    }
  };

  const handleBackClick = () => {
    setView("chatList");
  };

  // Handle scroll for loading more messages
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = async () => {
      if (container.scrollTop === 0 && hasMoreMessages && selectedCustomer) {
        const prevHeight = container.scrollHeight;
        await loadMessages(selectedCustomer.id, earliestMessageTime, true);
        setTimeout(() => {
          container.scrollTop = container.scrollHeight - prevHeight;
        }, 50);
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [earliestMessageTime, hasMoreMessages, selectedCustomer, loadMessages]);

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

  // Handle click outside canned messages
  useEffect(() => {
    function handleClickOutside(e) {
      if (!e.target.closest(".canned-dropdown")) {
        setShowCannedMessages(false);
      }
    }
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
        departments={departments}
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
            {/* Queues list */}
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
                    showAcceptButton={
                      !selectedCustomer.isAccepted && !selectedCustomer.sys_user_id
                    }
                    onAccept={handleAcceptChat}
                    showMenu={
                      selectedCustomer.isAccepted || selectedCustomer.sys_user_id
                    }
                    chatEnded={chatEnded}
                    menuOpen={openDropdown === "customerMenu"}
                    onMenuToggle={() => toggleDropdown("customerMenu")}
                    onEndChat={handleEndChat}
                    onTransfer={handleTransferClick}
                    dropdownRef={dropdownRef}
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
                    onSendMessage={sendMessage}
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
                    disabled={
                      !selectedCustomer.isAccepted && !selectedCustomer.sys_user_id
                    }
                    chatEnded={chatEnded}
                    disabledMessage="Accept chat to send messages"
                    showPreviewBanner={
                      !selectedCustomer.isAccepted &&
                      !selectedCustomer.sys_user_id &&
                      !chatEnded
                    }
                  />
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-gray-400">
                    Select a customer to view chat
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
