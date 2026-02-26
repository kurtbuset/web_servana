/**
 * ChatMessages - Displays chat messages with date dividers
 * Enhanced with responsive design and modern styling
 */
import TypingIndicator from './TypingIndicator';
import { useTheme } from '../../context/ThemeContext';

export default function ChatMessages({
  groupedMessages,
  selectedCustomer,
  chatEnded,
  scrollContainerRef,
  bottomRef,
  isMobile,
  isTyping = false,
  typingUser = null,
  typingUserImage = null,
  hasMoreMessages = true,
  isLoadingMore = false,
}) {
  const { isDark } = useTheme();
  const getSenderLabel = (message) => {
    if (message.sender_type === 'client') {
      return 'Client';
    } else if (message.sender_type === 'previous_agent') {
      return message.sender_name || 'Previous Agent';
    } else if (message.sender_type === 'current_agent') {
      return 'You';
    }
    return 'System';
  };

  const getMessageStyle = (message) => {
    if (message.sender === "user") {
      // Current agent messages (right side)
      return "bg-gradient-to-r from-[#6237A0] to-[#7A4ED9] text-white shadow-md";
    } else {
      // Client and previous agent messages (left side)
      if (message.sender_type === 'client') {
        return isDark 
          ? "text-gray-200 shadow-sm" 
          : "bg-white text-gray-800 border border-gray-200 shadow-sm";
      } else if (message.sender_type === 'previous_agent') {
        return isDark 
          ? "text-gray-200 shadow-sm" 
          : "bg-blue-50 text-gray-800 border border-blue-200 shadow-sm";
      } else {
        return isDark 
          ? "text-gray-200 shadow-sm" 
          : "bg-gray-50 text-gray-800 border border-gray-200 shadow-sm";
      }
    }
  };

  const getMessageBgStyle = (message) => {
    if (message.sender === "user") {
      return {};
    } else {
      if (message.sender_type === 'client') {
        return { 
          backgroundColor: isDark ? '#3a3a3a' : '#ffffff',
          border: `1px solid ${isDark ? '#4a4a4a' : '#e5e7eb'}`
        };
      } else if (message.sender_type === 'previous_agent') {
        return { 
          backgroundColor: isDark ? '#2d3748' : '#eff6ff',
          border: `1px solid ${isDark ? '#4a5568' : '#bfdbfe'}`
        };
      } else {
        return { 
          backgroundColor: isDark ? '#3a3a3a' : '#f9fafb',
          border: `1px solid ${isDark ? '#4a4a4a' : '#e5e7eb'}`
        };
      }
    }
  };

  return (
    <div
      ref={scrollContainerRef}
      className="flex-1 overflow-y-scroll overflow-x-hidden px-2.5 sm:px-3 md:px-4 pb-2 custom-scrollbar"
      style={{
        maxHeight: isMobile ? "calc(100vh - 200px)" : "calc(100vh - 300px)",
        height: "100%",
        background: isDark 
          ? 'linear-gradient(to bottom, rgba(42, 42, 42, 0.5), transparent)' 
          : 'linear-gradient(to bottom, rgba(249, 250, 251, 0.5), transparent)'
      }}
    >
      <div className="flex flex-col justify-end min-h-full gap-2 sm:gap-2.5 pt-3">
        {/* Loading indicator for pagination */}
        {isLoadingMore && (
          <div className="flex justify-center py-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-full" style={{
              backgroundColor: 'var(--card-bg)',
              border: `1px solid var(--border-color)`
            }}>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#6237A0] border-t-transparent"></div>
              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Loading messages...</span>
            </div>
          </div>
        )}

        {/* Load more indicator */}
        {hasMoreMessages && !isLoadingMore && groupedMessages.length > 0 && (
          <div className="flex justify-center py-2">
            <div className="text-xs px-3 py-1 rounded-full cursor-pointer hover:bg-opacity-80 transition-colors" style={{
              backgroundColor: isDark ? 'rgba(98, 55, 160, 0.1)' : 'rgba(98, 55, 160, 0.05)',
              border: `1px solid ${isDark ? 'rgba(98, 55, 160, 0.3)' : 'rgba(98, 55, 160, 0.2)'}`,
              color: '#6237A0'
            }}>
              Scroll up to load more messages
            </div>
          </div>
        )}

        {/* No more messages indicator */}
        {!hasMoreMessages && groupedMessages.length > 0 && (
          <div className="flex justify-center py-2">
            <div className="text-xs px-3 py-1 rounded-full" style={{
              backgroundColor: isDark ? 'rgba(107, 114, 128, 0.1)' : 'rgba(107, 114, 128, 0.05)',
              border: `1px solid ${isDark ? 'rgba(107, 114, 128, 0.3)' : 'rgba(107, 114, 128, 0.2)'}`,
              color: isDark ? '#9CA3AF' : '#6B7280'
            }}>
              No more messages
            </div>
          </div>
        )}

        {groupedMessages.map((item, index) => {
          if (item.type === "date") {
            return (
              <div
                key={`date-${index}`}
                className="text-[9px] sm:text-[10px] text-center flex items-center gap-2 my-1.5 sm:my-2"
                style={{ color: 'var(--text-secondary)' }}
              >
                <div className="flex-grow h-px" style={{ 
                  background: isDark 
                    ? 'linear-gradient(to right, transparent, rgba(74, 74, 74, 0.5), transparent)' 
                    : 'linear-gradient(to right, transparent, #d1d5db, transparent)' 
                }} />
                <span className="px-2 py-0.5 rounded-full shadow-sm font-medium text-[8px] sm:text-[9px]" style={{
                  backgroundColor: 'var(--card-bg)',
                  border: `1px solid var(--border-color)`
                }}>
                  {item.content}
                </span>
                <div className="flex-grow h-px" style={{ 
                  background: isDark 
                    ? 'linear-gradient(to right, transparent, rgba(74, 74, 74, 0.5), transparent)' 
                    : 'linear-gradient(to right, transparent, #d1d5db, transparent)' 
                }} />
              </div>
            );
          } else {
            return (
              <div
                key={`msg-${index}`}
                className={`flex items-end gap-1.5 sm:gap-2 ${
                  item.sender === "user" ? "justify-end" : "justify-start"
                } animate-slide-in`}
              >
                {item.sender !== "user" && (
                  <img
                    src={
                      item.sender_image ||
                      selectedCustomer.profile ||
                      "profile_picture/DefaultProfile.jpg"
                    }
                    alt={getSenderLabel(item)}
                    className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-white shadow-sm flex-shrink-0"
                  />
                )}
                <div className="flex flex-col max-w-[75%] sm:max-w-[70%] md:max-w-[60%]">
                  {item.sender !== "user" && item.sender_type === 'previous_agent' && (
                    <div className="text-[9px] sm:text-[10px] mb-0.5 ml-1.5 font-medium" style={{ color: 'var(--text-secondary)' }}>
                      {getSenderLabel(item)}
                    </div>
                  )}
                  <div
                    className={`${getMessageStyle(item)} px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl ${
                      item.sender === "user" ? "rounded-br-md" : "rounded-bl-md"
                    } text-[11px] sm:text-xs break-words whitespace-pre-wrap`}
                    style={getMessageBgStyle(item)}
                  >
                    {item.content}
                    <div
                      className={`text-[8px] sm:text-[9px] text-right mt-0.5 ${
                        item.sender === "user"
                          ? "text-purple-200"
                          : isDark ? "text-gray-400" : "text-gray-400"
                      }`}
                    >
                      {item.displayTime}
                    </div>
                  </div>
                </div>
              </div>
            );
          }
        })}

        {isTyping && typingUser && (
          <TypingIndicator 
            userName={typingUser} 
            userImage={typingUserImage}
          />
        )}

        {chatEnded && (
          <div className="text-[10px] sm:text-xs text-center flex items-center gap-2 my-2 sm:my-2.5" style={{ color: 'var(--text-secondary)' }}>
            <div className="flex-grow h-px" style={{ 
              background: isDark 
                ? 'linear-gradient(to right, transparent, rgba(239, 68, 68, 0.5), transparent)' 
                : 'linear-gradient(to right, transparent, #fca5a5, transparent)' 
            }} />
            <span className="px-2.5 sm:px-3 py-1 rounded-full shadow-sm font-medium flex items-center gap-1.5 text-[9px] sm:text-[10px]" style={{
              backgroundColor: isDark ? 'rgba(220, 38, 38, 0.1)' : '#fef2f2',
              border: `1px solid ${isDark ? 'rgba(220, 38, 38, 0.3)' : '#fecaca'}`,
              color: isDark ? '#fca5a5' : '#dc2626'
            }}>
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              Chat has ended
            </span>
            <div className="flex-grow h-px" style={{ 
              background: isDark 
                ? 'linear-gradient(to right, transparent, rgba(239, 68, 68, 0.5), transparent)' 
                : 'linear-gradient(to right, transparent, #fca5a5, transparent)' 
            }} />
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
