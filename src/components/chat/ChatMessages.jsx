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
                className="text-[10px] text-gray-400 dark:text-gray-500 text-center flex items-center gap-2 my-2 transition-colors duration-200"
              >
                <div className="flex-grow h-px bg-gray-200 dark:bg-gray-600 transition-colors duration-200" />
                {item.content}
                <div className="flex-grow h-px bg-gray-200 dark:bg-gray-600 transition-colors duration-200" />
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
                      item.sender === "system"
                        ? selectedCustomer.profile ||
                          "profile_picture/DefaultProfile.jpg"
                        : "profile_picture/DefaultProfile.jpg"
                    }
                    alt={item.sender === "system" ? "agent" : "customer"}
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <div
                  className={`px-4 py-2 rounded-xl max-w-[320px] text-sm break-words whitespace-pre-wrap transition-colors duration-200 ${
                    item.sender === "user"
                      ? "chat-message-user bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                      : item.sender === "system"
                      ? "chat-message-system bg-[#6237A0] text-white"
                      : "chat-message-customer bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  }`}
                >
                  {item.content}
                  <div
                    className={`text-[10px] text-right mt-1 transition-colors duration-200 ${
                      item.sender === "system"
                        ? "text-gray-300"
                        : "text-gray-400 dark:text-gray-500"
                    }`}
                  >
                    {item.displayTime}
                  </div>
                </div>
              </div>
            );
          }
        })}

        {chatEnded && (
          <div className="text-[10px] text-gray-400 dark:text-gray-500 text-center flex items-center gap-2 my-2 transition-colors duration-200">
            <div className="flex-grow h-px bg-gray-200 dark:bg-gray-600 transition-colors duration-200" />
            Chat has ended
            <div className="flex-grow h-px bg-gray-200 dark:bg-gray-600 transition-colors duration-200" />
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
