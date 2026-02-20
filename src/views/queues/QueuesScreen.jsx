import { useState, useRef } from "react";
import Layout from "../../components/Layout";
import { AnimatedBackground } from "../../components/ui";
import { useQueues } from "../../hooks/queues/useQueues";
import { useUser } from "../../context/UserContext";
import { groupMessagesByDate } from "../../utils/dateFormatters";
import QueuesSidebar from "./components/QueuesSidebar";
import QueuesArea from "./components/QueuesArea";
import { useQueuesHandlers } from "../../hooks/queues/useQueuesHandlers";
import { useQueuesEffects } from "../../hooks/queues/useQueuesEffects";
import { getQueueStyles } from "./styles/queueStyles";
import { PERMISSIONS } from "../../constants/permissions";
import "../../App.css";
import ScreenContainer from "../../components/ScreenContainer";

export default function QueuesScreen() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [view, setView] = useState("chatList");
  const [openDropdown, setOpenDropdown] = useState(null);
  const [inputMessage, setInputMessage] = useState("");
  const [showDeptDropdown, setShowDeptDropdown] = useState(false);

  const dropdownRef = useRef(null);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);
  const scrollContainerRef = useRef(null);

  const { hasPermission } = useUser();
  const canMessage = hasPermission(PERMISSIONS.MESSAGE);

  const queueState = useQueues();
  const {
    departments, selectedDepartment, setSelectedDepartment, selectedCustomer,
    messages, earliestMessageTime, hasMoreMessages, isLoadingMore, chatEnded,
    filteredCustomers, loading, selectCustomer, acceptChat,
    sendMessage: sendMessageAction, loadMessages,
  } = queueState;

  const handlers = useQueuesHandlers({
    canMessage, isMobile, textareaRef,
    setInputMessage, setView,
    selectCustomer, acceptChat, sendMessageAction,
  });

  useQueuesEffects({
    dropdownRef, bottomRef, textareaRef, scrollContainerRef, setOpenDropdown,
    setIsMobile, messages, inputMessage, earliestMessageTime, hasMoreMessages,
    selectedCustomer, loadMessages, isLoadingMore,
  });

  const toggleDropdown = (name) => setOpenDropdown((prev) => (prev === name ? null : name));
  const groupedMessages = groupMessagesByDate(messages);

  return (
    <Layout>
      <ScreenContainer>
        <style>{getQueueStyles()}</style>
        <div className="flex flex-col h-full overflow-hidden">
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
                permissions: { canMessage },
                toggleDropdown
              }}
            />
          </div>
        </div>
      </ScreenContainer>
    </Layout>
  );
}
