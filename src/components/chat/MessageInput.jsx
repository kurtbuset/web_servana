import { Send, Menu } from "react-feather";
import { useTheme } from "../../hooks/useTheme";

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
  const { isDark } = useTheme();

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

  return (
    <div
      className="border-t-2 canned-dropdown"
      style={{
        borderColor: "var(--border-color)",
        backgroundColor: "var(--card-bg)",
      }}
    >
      <div className="flex flex-col px-3 sm:px-4 pt-3 sm:pt-4 pb-3 sm:pb-4">
        {/* Preview banner for chats in queued */}
        {/* only appear when agent's user presence is set to not_accepting_chats */}
        {showPreviewBanner && !chatEnded && (
          <div
            className="mb-3 sm:mb-4 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl animate-slide-in"
            style={{
              backgroundColor: isDark ? "rgba(249, 115, 22, 0.1)" : "#fff7ed",
              border: `2px solid ${isDark ? "rgba(249, 115, 22, 0.3)" : "#fed7aa"}`,
            }}
          >
            <p
              className="text-xs sm:text-sm text-center flex items-center justify-center gap-2"
              style={{
                color: isDark ? "#fdba74" : "#c2410c",
              }}
            >
              <svg
                className="w-4 h-4 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <span>
                <span className="font-semibold">Preview Mode:</span> Accept this
                chat to start communicating
              </span>
            </p>
          </div>
        )}

        {/* input area */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            className={`p-2 sm:p-2.5 rounded-xl transition-all ${
              chatEnded || disabled || !canUseCannedMessages
                ? "cursor-not-allowed"
                : "text-[#6237A0] hover:scale-110 active:scale-95"
            }`}
            style={
              chatEnded || disabled || !canUseCannedMessages
                ? {
                    backgroundColor: isDark ? "#2a2a2a" : "#f3f4f6",
                    color: isDark ? "#6b7280" : "#9ca3af",
                  }
                : {
                    backgroundColor: isDark
                      ? "rgba(98, 55, 160, 0.1)"
                      : "rgba(243, 232, 255, 1)",
                  }
            }
            onClick={handleToggleCannedMessages}
            disabled={chatEnded || disabled || !canUseCannedMessages}
            title={
              !canUseCannedMessages
                ? "You don't have permission to use canned messages"
                : "Quick replies"
            }
          >
            <Menu size={18} className="sm:w-5 sm:h-5" />
          </button>
          <textarea
            ref={textareaRef}
            rows={1}
            placeholder={
              disabled && !chatEnded ? disabledMessage : "Type a message..."
            }
            value={inputMessage}
            onChange={onInputChange}
            onKeyDown={handleKeyDown}
            className={`flex-1 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base leading-tight focus:outline-none focus:ring-2 focus:ring-[#6237A0]/30 resize-none overflow-y-auto transition-all ${
              chatEnded || disabled ? "cursor-not-allowed" : ""
            }`}
            style={{
              maxHeight: "100px",
              backgroundColor:
                chatEnded || disabled
                  ? isDark
                    ? "#2a2a2a"
                    : "#f3f4f6"
                  : isDark
                    ? "rgba(58, 58, 58, 0.5)"
                    : "rgba(249, 250, 251, 1)",
              color:
                chatEnded || disabled
                  ? "var(--text-secondary)"
                  : "var(--text-primary)",
              border: `2px solid var(--border-color)`,
            }}
            disabled={chatEnded || disabled}
            readOnly={chatEnded || disabled}
          />
          <button
            className={`p-2 sm:p-2.5 rounded-xl transition-all ${
              chatEnded || disabled
                ? "cursor-not-allowed"
                : "text-white bg-gradient-to-r from-[#6237A0] to-[#7A4ED9] hover:shadow-lg hover:scale-110 active:scale-95"
            }`}
            style={
              chatEnded || disabled
                ? {
                    backgroundColor: isDark ? "#3a3a3a" : "#e5e7eb",
                    color: isDark ? "#6b7280" : "#9ca3af",
                  }
                : {}
            }
            onClick={onSendMessage}
            disabled={chatEnded || disabled}
          >
            <Send size={18} className="transform rotate-45 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* canned messages dropdown - conditionally shown if the user has permission to send canned/macro message*/}
      {showCannedMessages &&
        canUseCannedMessages &&
        !disabled &&
        !chatEnded && (
          <div className="px-3 sm:px-4 pb-3 sm:pb-4 pt-0">
            <div
              className="text-xs sm:text-sm font-semibold mb-2 flex items-center gap-2"
              style={{ color: "var(--text-primary)" }}
            >
              <svg
                className="w-4 h-4 text-[#6237A0]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              Quick Replies
            </div>
            {cannedMessages.length === 0 ? (
              <div
                className="text-xs sm:text-sm text-center py-4"
                style={{ color: "var(--text-secondary)" }}
              >
                No quick replies available
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2 max-h-[200px] overflow-y-auto custom-scrollbar">
                {cannedMessages.map((msg, index) => (
                  <button
                    key={index}
                    onClick={() => onSelectCannedMessage(msg)}
                    className="text-xs sm:text-sm text-left px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl hover:shadow-md transition-all group"
                    style={{
                      background: isDark
                        ? "linear-gradient(to right, rgba(139, 92, 246, 0.15), transparent)"
                        : "linear-gradient(to right, #faf5ff, transparent)",
                      border: `1px solid ${isDark ? "rgba(139, 92, 246, 0.3)" : "#e9d5ff"}`,
                      color: "var(--text-primary)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = isDark
                        ? "linear-gradient(to right, rgba(139, 92, 246, 0.25), rgba(139, 92, 246, 0.1))"
                        : "linear-gradient(to right, #f3e8ff, #faf5ff)";
                      e.currentTarget.style.borderColor = "#8B5CF6";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = isDark
                        ? "linear-gradient(to right, rgba(139, 92, 246, 0.15), transparent)"
                        : "linear-gradient(to right, #faf5ff, transparent)";
                      e.currentTarget.style.borderColor = isDark
                        ? "rgba(139, 92, 246, 0.3)"
                        : "#e9d5ff";
                    }}
                  >
                    <span className="line-clamp-2 group-hover:text-[#6237A0]">
                      {msg}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
    </div>
  );
}

