/**
 * ChatMessages - Displays chat messages with date dividers
 * Enhanced with responsive design and modern styling
 */
export default function ChatMessages({
  groupedMessages,
  selectedCustomer,
  chatEnded,
  scrollContainerRef,
  bottomRef,
  isMobile,
}) {
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
        return "bg-white text-gray-800 border border-gray-200 shadow-sm";
      } else if (message.sender_type === 'previous_agent') {
        return "bg-blue-50 text-gray-800 border border-blue-200 shadow-sm";
      } else {
        return "bg-gray-50 text-gray-800 border border-gray-200 shadow-sm";
      }
    }
  };

  return (
    <div
      ref={scrollContainerRef}
      className="flex-1 overflow-y-auto overflow-x-hidden px-3 sm:px-4 md:px-5 pb-2 custom-scrollbar bg-gradient-to-b from-gray-50/50 to-transparent"
      style={{
        maxHeight: isMobile ? "calc(100vh - 200px)" : "none",
        height: isMobile ? "auto" : "100%",
      }}
    >
      <div className="flex flex-col justify-end min-h-full gap-3 sm:gap-4 pt-4">
        {groupedMessages.map((item, index) => {
          if (item.type === "date") {
            return (
              <div
                key={`date-${index}`}
                className="text-[10px] sm:text-xs text-gray-500 text-center flex items-center gap-2 sm:gap-3 my-2 sm:my-3"
              >
                <div className="flex-grow h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                <span className="px-2 sm:px-3 py-1 bg-white rounded-full shadow-sm border border-gray-200 font-medium">
                  {item.content}
                </span>
                <div className="flex-grow h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
              </div>
            );
          } else {
            return (
              <div
                key={`msg-${index}`}
                className={`flex items-end gap-2 sm:gap-2.5 ${
                  item.sender === "user" ? "justify-end" : "justify-start"
                } animate-slide-in`}
              >
                {item.sender !== "user" && (
                  <img
                    src={
                      selectedCustomer.profile ||
                      "profile_picture/DefaultProfile.jpg"
                    }
                    alt={getSenderLabel(item)}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-white shadow-sm flex-shrink-0"
                  />
                )}
                <div className="flex flex-col max-w-[75%] sm:max-w-[70%] md:max-w-[60%]">
                  {item.sender !== "user" && item.sender_type === 'previous_agent' && (
                    <div className="text-[10px] sm:text-xs text-gray-500 mb-1 ml-2 font-medium">
                      {getSenderLabel(item)}
                    </div>
                  )}
                  <div
                    className={`${getMessageStyle(item)} px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl ${
                      item.sender === "user" ? "rounded-br-md" : "rounded-bl-md"
                    } text-xs sm:text-sm break-words whitespace-pre-wrap`}
                  >
                    {item.content}
                    <div
                      className={`text-[9px] sm:text-[10px] text-right mt-1 ${
                        item.sender === "user"
                          ? "text-purple-200"
                          : "text-gray-400"
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

        {chatEnded && (
          <div className="text-xs sm:text-sm text-gray-500 text-center flex items-center gap-2 sm:gap-3 my-3 sm:my-4">
            <div className="flex-grow h-px bg-gradient-to-r from-transparent via-red-300 to-transparent" />
            <span className="px-3 sm:px-4 py-1.5 bg-red-50 rounded-full shadow-sm border border-red-200 font-medium text-red-600 flex items-center gap-2">
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              Chat has ended
            </span>
            <div className="flex-grow h-px bg-gradient-to-r from-transparent via-red-300 to-transparent" />
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
