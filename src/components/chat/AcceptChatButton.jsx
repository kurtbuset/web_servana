import { CheckCircle } from "react-feather";
import { useTheme } from "../../context/ThemeContext";

/**
 * AcceptChatButton - Compact, user-friendly button to accept queued chats
 * Replaces the message input when viewing a queued chat
 */
export default function AcceptChatButton({ onAccept, customer }) {
  const { isDark } = useTheme();

  return (
    <div 
      className="flex flex-col border-t-2 px-3 sm:px-4 py-3 sm:py-4" 
      style={{ 
        borderColor: 'var(--border-color)', 
        backgroundColor: 'var(--card-bg)' 
      }}
    >
      {/* Info Banner */}
      <div 
        className="mb-3 px-3 py-2 rounded-lg" 
        style={{
          backgroundColor: isDark ? 'rgba(234, 179, 8, 0.1)' : '#fefce8',
          border: `1px solid ${isDark ? 'rgba(234, 179, 8, 0.3)' : '#fde047'}`
        }}
      >
        <div className="flex items-center gap-2">
          <svg 
            className="w-4 h-4 flex-shrink-0" 
            fill="currentColor" 
            viewBox="0 0 20 20"
            style={{ color: isDark ? '#fde047' : '#ca8a04' }}
          >
            <path 
              fillRule="evenodd" 
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" 
              clipRule="evenodd" 
            />
          </svg>
          <p 
            className="text-xs sm:text-sm" 
            style={{ color: isDark ? '#fef08a' : '#a16207' }}
          >
            Preview mode - Accept to start responding
          </p>
        </div>
      </div>

      {/* Accept Button */}
      <button
        onClick={onAccept}
        className="w-full py-3 rounded-lg font-semibold text-sm sm:text-base transition-all duration-200 hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 group"
        style={{
          background: isDark 
            ? 'linear-gradient(135deg, #6237A0 0%, #7A4ED9 100%)' 
            : 'linear-gradient(135deg, #6237A0 0%, #8B5CF6 100%)',
          color: '#ffffff',
          boxShadow: isDark 
            ? '0 4px 12px -2px rgba(98, 55, 160, 0.4)' 
            : '0 4px 12px -2px rgba(98, 55, 160, 0.5)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = isDark 
            ? 'linear-gradient(135deg, #7A4ED9 0%, #8B5CF6 100%)' 
            : 'linear-gradient(135deg, #7A4ED9 0%, #9333EA 100%)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = isDark 
            ? 'linear-gradient(135deg, #6237A0 0%, #7A4ED9 100%)' 
            : 'linear-gradient(135deg, #6237A0 0%, #8B5CF6 100%)';
        }}
      >
        <CheckCircle 
          size={18} 
          className="group-hover:scale-110 transition-transform" 
        />
        <span>Accept Chat</span>
      </button>
    </div>
  );
}
