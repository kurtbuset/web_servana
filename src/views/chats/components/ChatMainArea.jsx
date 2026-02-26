import ChatHeader from "../../../components/chat/ChatHeader";
import ChatMessages from "../../../components/chat/ChatMessages";
import MessageInput from "../../../components/chat/MessageInput";
import ChatMainEmpty from "./ChatMainEmpty";

/**
 * ChatMainArea - Main chat conversation area
 */
export default function ChatMainArea({
  view,
  isMobile,
  selectedCustomer,
  groupedMessages,
  chatEnded,
  endedChats,
  inputMessage,
  showCannedMessages,
  cannedMessages,
  isTyping,
  typingUser,
  typingUserImage,
  hasMoreMessages,
  isLoadingMore,
  openDropdown,
  canMessage,
  canEndChat,
  canTransfer,
  canUseCannedMessages,
  isDepartmentPanelOpen,
  scrollContainerRef,
  textareaRef,
  bottomRef,
  dropdownRef,
  onBack,
  onInputChange,
  onSendMessage,
  onToggleCannedMessages,
  onSelectCannedMessage,
  onMenuToggle,
  onEndChat,
  onTransfer,
  onProfileClick,
  onToggleDepartmentPanel,
}) {
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
            onBack={onBack}
            showAcceptButton={false}
            showMenu={true}
            chatEnded={chatEnded}
            menuOpen={openDropdown === "customerMenu"}
            onMenuToggle={onMenuToggle}
            onEndChat={onEndChat}
            onTransfer={onTransfer}
            dropdownRef={dropdownRef}
            canEndChat={canEndChat}
            canTransfer={canTransfer}
            onProfileClick={onProfileClick}
            onToggleDepartmentPanel={onToggleDepartmentPanel}
            isDepartmentPanelOpen={isDepartmentPanelOpen}
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
            typingUserImage={typingUserImage}
            hasMoreMessages={hasMoreMessages}
            isLoadingMore={isLoadingMore}
          />

          <MessageInput
            inputMessage={inputMessage}
            onInputChange={onInputChange}
            onSendMessage={onSendMessage}
            textareaRef={textareaRef}
            showCannedMessages={showCannedMessages}
            onToggleCannedMessages={onToggleCannedMessages}
            cannedMessages={cannedMessages}
            onSelectCannedMessage={onSelectCannedMessage}
            disabled={!canMessage || chatEnded}
            disabledMessage={!canMessage ? "You don't have permission to reply/Chat" : "Message"}
            chatEnded={chatEnded}
            canUseCannedMessages={canUseCannedMessages}
          />
        </>
      ) : (
        <ChatMainEmpty endedChats={endedChats} />
      )}
    </div>
  );
}
