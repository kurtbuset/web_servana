import { Send, Menu } from "react-feather";

/**
 * MessageInput - Input area for sending messages with canned messages support
 */
export default function MessageInput({
  inputMessage,
  onInputChange,
  onSendMessage,
  textareaRef,
  showCannedMessages,
  onToggleCannedMessages,
  cannedMessages,
  onSelectCannedMessage,
  disabled,
  chatEnded,
  disabledMessage = "Message",
  showPreviewBanner = false,
  canUseCannedMessages = true,
}) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!disabled) {
        onSendMessage();
      }
    }
  };

  const handleToggleCannedMessages = () => {
    if (!canUseCannedMessages) {
      console.warn("User does not have permission to use canned messages");
      return;
    }
    onToggleCannedMessages();
  };

  if (showCannedMessages && canUseCannedMessages) {
    return (
      <div className="border-t border-gray-200 pt-4 bg-white canned-dropdown">
        <div className="flex items-center gap-2 px-4 pb-3">
          <button
            className={`p-3 rounded-full ${
              disabled
                ? "text-gray-400 cursor-not-allowed"
                : "text-[#5C2E90] hover:bg-gray-100"
            }`}
            onClick={handleToggleCannedMessages}
            disabled={disabled}
          >
            <Menu size={20} />
          </button>
          <textarea
            ref={textareaRef}
            rows={1}
            placeholder={disabled ? disabledMessage : "Message"}
            value={inputMessage}
            onChange={onInputChange}
            onClick={handleToggleCannedMessages}
            onKeyDown={handleKeyDown}
            className={`flex-1 rounded-xl px-4 py-2 leading-tight focus:outline-none resize-none overflow-y-auto ${
              disabled
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-[#F2F0F0] text-gray-800"
            }`}
            style={{ maxHeight: "100px" }}
            disabled={disabled}
            readOnly={disabled}
          />
          <button
            className={`p-2 rounded-full ${
              disabled
                ? "text-gray-400 cursor-not-allowed"
                : "text-[#5C2E90] hover:bg-gray-100"
            }`}
            onClick={onSendMessage}
            disabled={disabled}
          >
            <Send size={20} className="transform rotate-45" />
          </button>
        </div>

        {!disabled && (
          <div className="px-4 pt-3">
            <div className="grid grid-cols-1 gap-2 pb-3 max-h-[200px] overflow-y-auto">
              {cannedMessages.map((msg, index) => (
                <button
                  key={index}
                  onClick={() => onSelectCannedMessage(msg)}
                  className="text-sm text-left px-4 py-3 bg-[#F5F5F5] rounded-xl hover:bg-[#EFEAFE] transition text-gray-800"
                >
                  {msg}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mt-4 flex flex-col border-t border-gray-200 pt-4 px-4">
      {/* Permission denied banner */}
      {disabled && !chatEnded && disabledMessage !== "Message" && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700 text-center">
            <span className="font-semibold">Access Denied:</span> {disabledMessage}
          </p>
        </div>
      )}

      {showPreviewBanner && !chatEnded && (
        <div className="mb-4 px-4 py-3 bg-orange-50 border border-orange-200 rounded-lg">
          <p className="text-sm text-orange-700 text-center">
            <span className="font-semibold">Preview Mode:</span> Accept this
            chat to start communicating with the client
          </p>
        </div>
      )}

      <div className="flex items-center gap-2">
        <button
          className={`p-2 mb-4 rounded-full ${
            chatEnded || disabled || !canUseCannedMessages
              ? "text-gray-400 cursor-not-allowed"
              : "text-[#5C2E90] hover:bg-gray-100"
          }`}
          onClick={handleToggleCannedMessages}
          disabled={chatEnded || disabled || !canUseCannedMessages}
          title={!canUseCannedMessages ? "You don't have permission to use canned messages" : ""}
        >
          <Menu size={20} />
        </button>
        <textarea
          ref={textareaRef}
          rows={1}
          placeholder={disabled && !chatEnded ? disabledMessage : "Message"}
          value={inputMessage}
          onChange={onInputChange}
          onKeyDown={handleKeyDown}
          className={`flex-1 rounded-xl px-4 py-2 mb-4 leading-tight focus:outline-none resize-none overflow-y-auto ${
            chatEnded || disabled
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-[#F2F0F0] text-gray-800"
          }`}
          style={{ maxHeight: "100px" }}
          disabled={chatEnded || disabled}
          readOnly={chatEnded || disabled}
        />
        <button
          className={`p-2 mb-4 rounded-full ${
            chatEnded || disabled
              ? "text-gray-400 cursor-not-allowed"
              : "text-[#5C2E90] hover:bg-gray-100"
          }`}
          onClick={onSendMessage}
          disabled={chatEnded || disabled}
        >
          <Send size={20} className="transform rotate-45" />
        </button>
      </div>
    </div>
  );
}
