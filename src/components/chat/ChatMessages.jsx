/**
 * ChatMessages - Displays chat messages with date dividers
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
      return "bg-[#6237A0] text-white";
    } else {
      // Client and previous agent messages (left side)
      if (message.sender_type === 'client') {
        return "bg-[#f5f5f5] text-gray-800";
      } else if (message.sender_type === 'previous_agent') {
        return "bg-[#e3f2fd] text-gray-800"; // Light blue for previous agents
      } else {
        return "bg-[#f5f5f5] text-gray-800"; // Default for system
      }
    }
  };

  return (
    <div
      ref={scrollContainerRef}
      className="flex-1 overflow-y-auto overflow-x-hidden px-4 pb-2 auto-hide-scrollbar"
      style={{
        maxHeight: isMobile ? "calc(100vh - 200px)" : "none",
        height: isMobile ? "auto" : "100%",
      }}
    >
      <div className="flex flex-col justify-end min-h-full gap-4 pt-4">
        {groupedMessages.map((item, index) => {
          if (item.type === "date") {
            return (
              <div
                key={`date-${index}`}
                className="text-[10px] text-gray-400 text-center flex items-center gap-2 my-2"
              >
                <div className="flex-grow h-px bg-gray-200" />
                {item.content}
                <div className="flex-grow h-px bg-gray-200" />
              </div>
            );
          } else {
            return (
              <div
                key={`msg-${index}`}
                className={`flex items-end gap-2 ${
                  item.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {item.sender !== "user" && (
                  <img
                    src={
                      selectedCustomer.profile ||
                      "profile_picture/DefaultProfile.jpg"
                    }
                    alt={getSenderLabel(item)}
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <div className="flex flex-col">
                  {item.sender !== "user" && item.sender_type === 'previous_agent' && (
                    <div className="text-[10px] text-gray-500 mb-1 ml-2">
                      {getSenderLabel(item)}
                    </div>
                  )}
                  <div
                    className={`${getMessageStyle(item)} px-4 py-2 rounded-xl max-w-[320px] text-sm break-words whitespace-pre-wrap`}
                  >
                    {item.content}
                    <div
                      className={`text-[10px] text-right mt-1 ${
                        item.sender === "user" || item.sender_type === 'previous_agent'
                          ? "text-gray-300"
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
          <div className="text-[10px] text-gray-400 text-center flex items-center gap-2 my-2">
            <div className="flex-grow h-px bg-gray-200" />
            Chat has ended
            <div className="flex-grow h-px bg-gray-200" />
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
