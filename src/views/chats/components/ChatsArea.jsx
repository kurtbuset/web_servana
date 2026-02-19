import ChatHeader from "../../../components/chat/ChatHeader";
import ChatMessages from "../../../components/chat/ChatMessages";
import MessageInput from "../../../components/chat/MessageInput";
import { NoChatSelectedState } from "./ChatsEmptyStates";

/**
 * ChatsArea - Right side chat conversation area for ChatsScreen
 * 
 * Props are grouped into 2 main objects:
 * - state: All state values (view, chat, messages, UI state)
 * - actions: All handlers, refs, and permissions
 */
export default function ChatsArea({ state, actions }) {
  const {
    view, isMobile, selectedCustomer, chatEnded, endedChats, groupedMessages,
    isTyping, typingUser, inputMessage, cannedMessages, showCannedMessages,
    hasMoreMessages, isLoadingMore, openDropdown
  } = state;

  const {
    refs, handlers, permissions, toggleDropdown, setShowCannedMessages, setInputMessage
  } = actions;

  const { scrollContainerRef, bottomRef, textareaRef, dropdownRef } = refs;
  const { canMessage, canEndChat, canTransfer, canUseCannedMessages } = permissions;

  return (
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
            onBack={handlers.handleBackClick}
            showAcceptButton={false}
            showMenu={true}
            chatEnded={chatEnded}
            menuOpen={openDropdown === "customerMenu"}
            onMenuToggle={() => toggleDropdown("customerMenu")}
            onEndChat={handlers.handleEndChat}
            onTransfer={handlers.handleTransferClick}
            dropdownRef={dropdownRef}
            canEndChat={canEndChat}
            canTransfer={canTransfer}
            onProfileClick={handlers.handleProfileClick}
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
            onInputChange={handlers.handleInputChange}
            onSendMessage={handlers.handleSendMessage}
            textareaRef={textareaRef}
            showCannedMessages={showCannedMessages}
            onToggleCannedMessages={() => setShowCannedMessages((prev) => !prev)}
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
        <NoChatSelectedState endedChats={endedChats} />
      )}
    </div>
  );
}
