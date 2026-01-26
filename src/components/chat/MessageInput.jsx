import { Send, Menu } from "react-feather";

/**
 * MessageInput - Input area for sending messages with canned messages support
 * Enhanced with responsive design and modern styling
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
      <div className="border-t-2 border-gray-100 bg-white canned-dropdown">
        <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 pt-3 sm:pt-4 pb-2">
          <button
            className={`p-2 sm:p-2.5 rounded-xl transition-all ${
              disabled
                ? "text-gray-400 cursor-not-allowed bg-gray-100"
                : "text-[#6237A0] hover:bg-purple-50 hover:scale-110 active:scale-95"
            }`}
            onClick={handleToggleCannedMessages}
            disabled={disabled}
          >
            <Menu size={18} className="sm:w-5 sm:h-5" />
          </button>
          <textarea
            ref={textareaRef}
            rows={1}
            placeholder={disabled ? disabledMessage : "Type a message..."}
            value={inputMessage}
            onChange={onInputChange}
            onClick={handleToggleCannedMessages}
            onKeyDown={handleKeyDown}
            className={`flex-1 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base leading-tight focus:outline-none focus:ring-2 focus:ring-[#6237A0]/30 resize-none overflow-y-auto transition-all ${
              disabled
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gray-50 text-gray-800 hover:bg-gray-100"
            }`}
            style={{ maxHeight: "100px" }}
            disabled={disabled}
            readOnly={disabled}
          />
          <button
            className={`p-2 sm:p-2.5 rounded-xl transition-all ${
              disabled
                ? "text-gray-400 cursor-not-allowed bg-gray-100"
                : "text-white bg-gradient-to-r from-[#6237A0] to-[#7A4ED9] hover:shadow-lg hover:scale-110 active:scale-95"
            }`}
            onClick={onSendMessage}
            disabled={disabled}
          >
            <Send size={18} className="transform rotate-45 sm:w-5 sm:h-5" />
          </button>
        </div>

        {!disabled && (
          <div className="px-3 sm:px-4 pt-2 pb-3 sm:pb-4">
            <div className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <svg className="w-4 h-4 text-[#6237A0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Quick Replies
            </div>
            <div className="grid grid-cols-1 gap-2 max-h-[200px] overflow-y-auto custom-scrollbar">
              {cannedMessages.map((msg, index) => (
                <button
                  key={index}
                  onClick={() => onSelectCannedMessage(msg)}
                  className="text-xs sm:text-sm text-left px-3 sm:px-4 py-2.5 sm:py-3 bg-gradient-to-r from-purple-50 to-transparent rounded-xl hover:from-purple-100 hover:to-purple-50 hover:shadow-md transition-all text-gray-800 border border-purple-100 hover:border-[#6237A0] group"
                >
                  <span className="line-clamp-2 group-hover:text-[#6237A0]">{msg}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col border-t-2 border-gray-100 bg-white px-3 sm:px-4 pt-3 sm:pt-4 pb-3 sm:pb-4">
      {/* Permission denied banner */}
      {disabled && !chatEnded && disabledMessage !== "Message" && (
        <div className="mb-3 sm:mb-4 px-3 sm:px-4 py-2.5 sm:py-3 bg-red-50 border-2 border-red-200 rounded-xl animate-slide-in">
          <p className="text-xs sm:text-sm text-red-700 text-center flex items-center justify-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span><span className="font-semibold">Access Denied:</span> {disabledMessage}</span>
          </p>
        </div>
      )}

      {showPreviewBanner && !chatEnded && (
        <div className="mb-3 sm:mb-4 px-3 sm:px-4 py-2.5 sm:py-3 bg-orange-50 border-2 border-orange-200 rounded-xl animate-slide-in">
          <p className="text-xs sm:text-sm text-orange-700 text-center flex items-center justify-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span><span className="font-semibold">Preview Mode:</span> Accept this chat to start communicating</span>
          </p>
        </div>
      )}

      <div className="flex items-center gap-2 sm:gap-3">
        <button
          className={`p-2 sm:p-2.5 rounded-xl transition-all ${
            chatEnded || disabled || !canUseCannedMessages
              ? "text-gray-400 cursor-not-allowed bg-gray-100"
              : "text-[#6237A0] hover:bg-purple-50 hover:scale-110 active:scale-95"
          }`}
          onClick={handleToggleCannedMessages}
          disabled={chatEnded || disabled || !canUseCannedMessages}
          title={!canUseCannedMessages ? "You don't have permission to use canned messages" : "Quick replies"}
        >
          <Menu size={18} className="sm:w-5 sm:h-5" />
        </button>
        <textarea
          ref={textareaRef}
          rows={1}
          placeholder={disabled && !chatEnded ? disabledMessage : "Type a message..."}
          value={inputMessage}
          onChange={onInputChange}
          onKeyDown={handleKeyDown}
          className={`flex-1 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base leading-tight focus:outline-none focus:ring-2 focus:ring-[#6237A0]/30 resize-none overflow-y-auto transition-all ${
            chatEnded || disabled
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-gray-50 text-gray-800 hover:bg-gray-100"
          }`}
          style={{ maxHeight: "100px" }}
          disabled={chatEnded || disabled}
          readOnly={chatEnded || disabled}
        />
        <button
          className={`p-2 sm:p-2.5 rounded-xl transition-all ${
            chatEnded || disabled
              ? "text-gray-400 cursor-not-allowed bg-gray-100"
              : "text-white bg-gradient-to-r from-[#6237A0] to-[#7A4ED9] hover:shadow-lg hover:scale-110 active:scale-95"
          }`}
          onClick={onSendMessage}
          disabled={chatEnded || disabled}
        >
          <Send size={18} className="transform rotate-45 sm:w-5 sm:h-5" />
        </button>
      </div>
    </div>
  );
}
