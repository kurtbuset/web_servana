import ChatHeader from "../../../components/chat/ChatHeader";
import ChatMessages from "../../../components/chat/ChatMessages";
import MessageInput from "../../../components/chat/MessageInput";
import { NoQueueSelectedState } from "./QueuesEmptyStates";

/**
 * QueuesArea - Right side chat area for QueuesScreen
 * 
 * Props are grouped into 2 main objects:
 * - state: All state values (view, chat, messages, UI state)
 * - actions: All handlers, refs, and permissions
 */
export default function QueuesArea({ state, actions }) {
  const {
    view, isMobile, selectedCustomer, chatEnded, groupedMessages,
    hasMoreMessages, isLoadingMore, inputMessage, openDropdown
  } = state;

  const { refs, handlers, permissions, toggleDropdown } = actions;
  const { scrollContainerRef, bottomRef, textareaRef, dropdownRef } = refs;
  const { canMessage } = permissions;

  return (
    <div
      className={`${
        view === "conversation" ? "block" : "hidden md:flex"
      } flex-1 flex flex-col md:rounded-xl shadow-sm border overflow-hidden`}
      style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
    >
      {selectedCustomer ? (
        <>
          <ChatHeader
            customer={selectedCustomer}
            isMobile={isMobile}
            onBack={handlers.handleBackClick}
            showAcceptButton={
              !selectedCustomer.isAccepted && !selectedCustomer.sys_user_id
            }
            onAccept={handlers.handleAcceptChat}
            showMenu={false}
            chatEnded={chatEnded}
          />

          <ChatMessages
            groupedMessages={groupedMessages}
            selectedCustomer={selectedCustomer}
            chatEnded={chatEnded}
            scrollContainerRef={scrollContainerRef}
            bottomRef={bottomRef}
            isMobile={isMobile}
            hasMoreMessages={hasMoreMessages}
            isLoadingMore={isLoadingMore}
          />

          <MessageInput
            inputMessage={inputMessage}
            onInputChange={handlers.handleInputChange}
            onSendMessage={handlers.sendMessage}
            textareaRef={textareaRef}
            showCannedMessages={false}
            onToggleCannedMessages={() => {}}
            cannedMessages={[]}
            onSelectCannedMessage={() => {}}
            disabled={
              !canMessage || 
              (!selectedCustomer.isAccepted && !selectedCustomer.sys_user_id)
            }
            chatEnded={chatEnded}
            showPreviewBanner={
              canMessage &&
              !selectedCustomer.isAccepted &&
              !selectedCustomer.sys_user_id &&
              !chatEnded
            }
            canUseCannedMessages={false}
          />
        </>
      ) : (
        <NoQueueSelectedState />
      )}
    </div>
  );
}
