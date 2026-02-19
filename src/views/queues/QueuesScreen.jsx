import { useState, useRef } from "react";
import TopNavbar from "../../../src/components/TopNavbar";
import Sidebar from "../../../src/components/Sidebar";
import { useQueues } from "../../hooks/queues/useQueues";
import { useUser } from "../../context/UserContext";
import { groupMessagesByDate } from "../../utils/dateFormatters";
import QueuesSidebar from "./components/QueuesSidebar";
import QueuesArea from "./components/QueuesArea";
import QueuesModals from "./components/QueuesModals";
import { useQueuesHandlers } from "../../hooks/queues/useQueuesHandlers";
import { useQueuesEffects } from "../../hooks/queues/useQueuesEffects";
import { getQueueStyles } from "./styles/queueStyles";
import "../../App.css";

export default function QueuesScreen() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [view, setView] = useState("chatList");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
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

  const queueState = useQueues();
  const {
    departments, selectedDepartment, setSelectedDepartment, selectedCustomer,
    messages, earliestMessageTime, hasMoreMessages, isLoadingMore, chatEnded,
    filteredCustomers, loading, selectCustomer, acceptChat,
    sendMessage: sendMessageAction, endChat, loadMessages,
  } = queueState;

  const handlers = useQueuesHandlers({
    canTransfer, canEndChat, canMessage, isMobile, textareaRef,
    setOpenDropdown, setShowTransferModal, setTransferDepartment, selectedDepartment,
    setShowTransferConfirmModal, setShowEndChatModal, setInputMessage, setView,
    selectCustomer, acceptChat, sendMessageAction, endChat,
  });

  useQueuesEffects({
    dropdownRef, bottomRef, textareaRef, scrollContainerRef, setOpenDropdown,
    setIsMobile, messages, inputMessage, earliestMessageTime, hasMoreMessages,
    selectedCustomer, loadMessages, isLoadingMore,
  });

  const toggleSidebar = () => setMobileSidebarOpen((prev) => !prev);
  const toggleDropdown = (name) => setOpenDropdown((prev) => (prev === name ? null : name));
  const groupedMessages = groupMessagesByDate(messages);

  return (
    <>
      <style>{getQueueStyles()}</style>
      <div className="flex flex-col h-screen overflow-hidden" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <TopNavbar toggleSidebar={toggleSidebar} />

        <QueuesModals
          state={{
            showEndChatModal,
            showTransferModal,
            showTransferConfirmModal,
            departments,
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

          <main className="flex-1 bg-transparent">
            <div className="flex flex-col md:flex-row h-full gap-0 md:gap-3 p-0 md:p-3">
              <QueuesSidebar
                state={{
                  view, loading, filteredCustomers, selectedCustomer,
                  departments, selectedDepartment, showDeptDropdown
                }}
                actions={{
                  setSelectedDepartment,
                  setShowDeptDropdown,
                  handleChatClick: handlers.handleChatClick
                }}
              />

              <QueuesArea
                state={{
                  view, isMobile, selectedCustomer, chatEnded, groupedMessages,
                  hasMoreMessages, isLoadingMore, inputMessage, openDropdown
                }}
                actions={{
                  refs: { scrollContainerRef, bottomRef, textareaRef, dropdownRef },
                  handlers,
                  permissions: { canMessage, canEndChat, canTransfer },
                  toggleDropdown
                }}
              />
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
