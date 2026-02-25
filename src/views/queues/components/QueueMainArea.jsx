import ChatHeader from "../../../components/chat/ChatHeader";
import ChatMessages from "../../../components/chat/ChatMessages";
import MessageInput from "../../../components/chat/MessageInput";
import QueueMainEmpty from "./QueueMainEmpty";

/**
 * QueueMainArea - Main queue conversation area
 */
export default function QueueMainArea({
  view,
  isMobile,
  selectedCustomer,
  groupedMessages,
  chatEnded,
  inputMessage,
  hasMoreMessages,
  isLoadingMore,
  openDropdown,
  canMessage,
  canEndChat,
  canTransfer,
  scrollContainerRef,
  textareaRef,
  bottomRef,
  dropdownRef,
  onBack,
  onInputChange,
  onSendMessage,
  onAccept,
  onMenuToggle,
  onEndChat,
  onTransfer,
}) {
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
            onBack={onBack}
            showAcceptButton={
              !selectedCustomer.isAccepted && !selectedCustomer.sys_user_id
            }
            onAccept={onAccept}
            showMenu={
              selectedCustomer.isAccepted || selectedCustomer.sys_user_id
            }
            chatEnded={chatEnded}
            menuOpen={openDropdown === "customerMenu"}
            onMenuToggle={onMenuToggle}
            onEndChat={onEndChat}
            onTransfer={onTransfer}
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
            hasMoreMessages={hasMoreMessages}
            isLoadingMore={isLoadingMore}
          />

          <MessageInput
            inputMessage={inputMessage}
            onInputChange={onInputChange}
            onSendMessage={onSendMessage}
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
        <QueueMainEmpty />
      )}
    </div>
  );
}
