/**
 * TypingIndicator - Animated typing indicator component
 * Shows when someone is typing in the chat
 */
export default function TypingIndicator({ userName = "Someone" }) {
  return (
    <div className="flex items-end gap-2 sm:gap-2.5 justify-start animate-slide-in mb-3">
      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
        <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
        </svg>
      </div>
      <div className="flex flex-col max-w-[75%] sm:max-w-[70%] md:max-w-[60%]">
        <div className="text-[10px] sm:text-xs text-gray-500 mb-1 ml-2 font-medium">
          {userName}
        </div>
        <div className="bg-white text-gray-800 border border-gray-200 shadow-sm px-4 py-3 rounded-2xl rounded-bl-md">
          <div className="flex items-center gap-1">
            <div className="typing-dot"></div>
            <div className="typing-dot" style={{ animationDelay: '0.2s' }}></div>
            <div className="typing-dot" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
