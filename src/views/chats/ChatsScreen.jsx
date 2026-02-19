import { useState, useRef } from "react";
import TopNavbar from "../../../src/components/TopNavbar";
import Sidebar from "../../../src/components/Sidebar";
import { useChat } from "../../hooks/chats/useChat";
import { useUser } from "../../context/UserContext";
import { useTheme } from "../../context/ThemeContext";
import { groupMessagesByDate } from "../../utils/dateFormatters";
import ProfilePanel from "../../components/chat/ProfilePanel";
import ChatsSidebar from "./components/ChatsSidebar";
import ChatsArea from "./components/ChatsArea";
import ChatsModals from "./components/ChatsModals";
import { useChatHandlers } from "../../hooks/chats/useChatHandlers";
import { useChatEffects } from "../../hooks/chats/useChatEffects";
import { getChatStyles } from "./styles/chatStyles";
import { PERMISSIONS } from "../../constants/permissions";
import "../../App.css";

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

  const { hasPermission } = useUser();
  const { isDark } = useTheme();
  const canMessage = hasPermission(PERMISSIONS.MESSAGE);
  const canEndChat = hasPermission(PERMISSIONS.END_CHAT);
  const canTransfer = hasPermission(PERMISSIONS.TRANSFER);
  const canUseCannedMessages = hasPermission(PERMISSIONS.USE_CANNED_MESS);

  const chatState = useChat();
  const {
    departments, selectedDepartment, setSelectedDepartment, filteredCustomers,
    selectedCustomer, messages, inputMessage, setInputMessage, cannedMessages,
    showCannedMessages, setShowCannedMessages, earliestMessageTime, hasMoreMessages,
    isLoadingMore, loadMessages, loading, chatEnded, endedChats, isTyping, typingUser,
    selectCustomer, sendMessage, endChat, transferChat, bottomRef, textareaRef,
  } = chatState;

  const handlers = useChatHandlers({
    canTransfer, canEndChat, canMessage, isMobile, allDepartments,
    textareaRef, setOpenDropdown, setShowTransferModal, setTransferDepartment,
    selectedDepartment, setShowTransferConfirmModal, setShowEndChatModal,
    setInputMessage, setView, setShowProfilePanel, selectCustomer, sendMessage,
    endChat, transferChat,
  });

  useChatEffects({
    dropdownRef, scrollContainerRef, bottomRef, textareaRef, setOpenDropdown, setShowCannedMessages,
    setAllDepartments, setIsMobile, earliestMessageTime, hasMoreMessages,
    selectedCustomer, loadMessages, isLoadingMore, messages, inputMessage,
  });

  const toggleSidebar = () => setMobileSidebarOpen((prev) => !prev);
  const toggleDropdown = (name) => setOpenDropdown((prev) => (prev === name ? null : name));
  const groupedMessages = groupMessagesByDate(messages);

  return (
    <>
      <style>{getChatStyles(isDark)}</style>
      <div className="flex flex-col h-screen overflow-hidden" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <TopNavbar toggleSidebar={toggleSidebar} />

        <ChatsModals
          state={{
            showEndChatModal,
            showTransferModal,
            showTransferConfirmModal,
            allDepartments,
            transferDepartment,
            selectedDepartment,
          }}
          actions={{
            confirmEndChat: handlers.confirmEndChat,
            cancelEndChat: handlers.cancelEndChat,
            setTransferDepartment,
            handleDepartmentSelect: handlers.handleDepartmentSelect,
            confirmTransfer: () => handlers.confirmTransfer(transferDepartment),
            cancelTransfer: handlers.cancelTransfer,
            cancelTransferConfirm: handlers.cancelTransferConfirm,
          }}
        />

        <div className="flex flex-1 overflow-hidden">
          <Sidebar isMobile={true} isOpen={mobileSidebarOpen} toggleDropdown={toggleDropdown}
            openDropdown={openDropdown} onClose={() => setMobileSidebarOpen(false)} />
          <Sidebar isMobile={false} toggleDropdown={toggleDropdown} openDropdown={openDropdown} />

          <main className="flex-1" style={{ backgroundColor: 'transparent' }}>
            <div className="flex flex-col md:flex-row h-full gap-0 md:gap-3 p-0 md:p-3">
              <ChatsSidebar
                state={{
                  view, loading, filteredCustomers, selectedCustomer,
                  endedChats, departments, selectedDepartment, showDeptDropdown
                }}
                actions={{
                  setSelectedDepartment,
                  setShowDeptDropdown,
                  handleChatClick: handlers.handleChatClick
                }}
              />

              <ChatsArea
                state={{
                  view, isMobile, selectedCustomer, chatEnded, endedChats, groupedMessages,
                  isTyping, typingUser, inputMessage, cannedMessages, showCannedMessages,
                  hasMoreMessages, isLoadingMore, openDropdown
                }}
                actions={{
                  refs: { scrollContainerRef, bottomRef, textareaRef, dropdownRef },
                  handlers,
                  permissions: { canMessage, canEndChat, canTransfer, canUseCannedMessages },
                  toggleDropdown,
                  setShowCannedMessages,
                  setInputMessage
                }}
              />
            </div>
          </main>

          <ProfilePanel customer={selectedCustomer} isOpen={showProfilePanel}
            onClose={handlers.handleCloseProfile} />
        </div>
      </div>
    </>
  );
}
