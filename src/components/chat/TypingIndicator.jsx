import { useTheme } from "../../context/ThemeContext";

/**
 * TypingIndicator - Animated typing indicator component with profile picture
 * Shows when someone is typing in the chat
 */
export default function TypingIndicator({ userName = "Someone", userImage = null }) {
  const { isDark } = useTheme();

  return (
    <div className="flex items-end gap-2 sm:gap-2.5 justify-start animate-slide-in mb-3">
      {/* Profile Picture */}
      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex-shrink-0 overflow-hidden border-2" style={{
        borderColor: isDark ? 'rgba(139, 92, 246, 0.3)' : '#E9D5FF',
        backgroundColor: isDark ? '#2a2a2a' : '#F3F4F6'
      }}>
        {userImage ? (
          <img 
            src={userImage} 
            alt={userName}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div className={`w-full h-full ${userImage ? 'hidden' : 'flex'} items-center justify-center`}>
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" style={{
            color: isDark ? '#6b7280' : '#9CA3AF'
          }}>
            <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
          </svg>
        </div>
      </div>

      {/* Typing Bubble */}
      <div className="flex flex-col max-w-[75%] sm:max-w-[70%] md:max-w-[60%]">
        <div 
          className="px-5 py-4 rounded-2xl rounded-bl-md shadow-sm"
          style={{
            backgroundColor: isDark ? 'rgba(58, 58, 58, 0.8)' : '#F3F4F6',
            border: `1px solid ${isDark ? 'rgba(75, 85, 99, 0.3)' : '#E5E7EB'}`
          }}
        >
          <div className="flex items-center gap-1.5">
            <div className="typing-dot" style={{
              backgroundColor: isDark ? '#9CA3AF' : '#6B7280'
            }}></div>
            <div className="typing-dot" style={{ 
              animationDelay: '0.2s',
              backgroundColor: isDark ? '#9CA3AF' : '#6B7280'
            }}></div>
            <div className="typing-dot" style={{ 
              animationDelay: '0.4s',
              backgroundColor: isDark ? '#9CA3AF' : '#6B7280'
            }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
