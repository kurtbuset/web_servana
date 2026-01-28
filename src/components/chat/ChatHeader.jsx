import { useRef } from "react";
import { MoreVertical, ArrowLeft, CheckCircle, Clock } from "react-feather";
import { useTheme } from "../../context/ThemeContext";

/**
 * ChatHeader - Header for chat conversation with customer info and actions
 * Enhanced with responsive design and modern styling
 */
export default function ChatHeader({
  customer,
  isMobile,
  onBack,
  showAcceptButton,
  onAccept,
  showMenu,
  chatEnded,
  menuOpen,
  onMenuToggle,
  onEndChat,
  onTransfer,
  dropdownRef,
  canEndChat = true,
  canTransfer = true,
  onProfileClick,
}) {
  const { isDark } = useTheme();

  return (
    <div className="sticky top-0 z-10 border-b-2 shadow-sm" style={{ 
      backgroundColor: 'var(--card-bg)', 
      borderColor: 'var(--border-color)' 
    }}>
      <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 md:p-5">
        {/* Back Button for Mobile */}
        {isMobile && (
          <button
            onClick={onBack}
            className="flex-shrink-0 p-2 -ml-2 rounded-lg transition-all"
            style={{ 
              color: 'var(--text-secondary)',
              backgroundColor: isDark ? 'rgba(98, 55, 160, 0.1)' : 'transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#6237A0';
              e.currentTarget.style.backgroundColor = isDark ? 'rgba(98, 55, 160, 0.2)' : 'rgba(243, 232, 255, 1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-secondary)';
              e.currentTarget.style.backgroundColor = isDark ? 'rgba(98, 55, 160, 0.1)' : 'transparent';
            }}
          >
            <ArrowLeft size={20} />
          </button>
        )}

        {/* Customer Info */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <button
            onClick={onProfileClick}
            className="relative flex-shrink-0 group cursor-pointer"
          >
            <img
              src={customer?.profile || "profile_picture/DefaultProfile.jpg"}
              alt="profile"
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-white shadow-md group-hover:border-[#6237A0] transition-all group-hover:scale-105"
            />
            {customer.isAccepted || customer.sys_user_id ? (
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
            ) : (
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-orange-500 border-2 border-white rounded-full animate-pulse"></div>
            )}
            {/* Hover indicator */}
            <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/10 transition-all flex items-center justify-center">
              <svg className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </button>

          <div className="flex-1 min-w-0">
            <h3 className="text-sm sm:text-base md:text-lg font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
              {customer.name}
            </h3>
            {(!customer.isAccepted && !customer.sys_user_id) && (
              <div className="flex items-center gap-1.5 mt-0.5">
                <Clock size={12} className="text-orange-500 flex-shrink-0" />
                <span className="text-[10px] sm:text-xs text-orange-600 font-medium truncate">
                  {customer.status === "transferred" ? "Transferred - Waiting" : "In Queue"}
                </span>
              </div>
            )}
            {(customer.isAccepted || customer.sys_user_id) && (
              <div className="flex items-center gap-1.5 mt-0.5">
                <CheckCircle size={12} className="text-green-500 flex-shrink-0" />
                <span className="text-[10px] sm:text-xs text-green-600 font-medium">
                  Active Chat
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="relative flex items-center gap-2 flex-shrink-0">
          {/* Accept Chat Button */}
          {showAcceptButton && !chatEnded && (
            <button
              onClick={onAccept}
              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-[#6237A0] to-[#7A4ED9] text-white rounded-lg hover:shadow-lg hover:scale-105 active:scale-95 transition-all text-xs sm:text-sm font-semibold flex items-center gap-1.5 sm:gap-2"
            >
              <CheckCircle size={14} className="sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Accept Chat</span>
              <span className="sm:hidden">Accept</span>
            </button>
          )}

          {/* Three-dot menu */}
          {showMenu && !chatEnded && (canEndChat || canTransfer) && (
            <button
              className="p-2 rounded-lg transition-all"
              style={{ 
                color: 'var(--text-secondary)',
                backgroundColor: isDark ? 'rgba(98, 55, 160, 0.1)' : 'transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#6237A0';
                e.currentTarget.style.backgroundColor = isDark ? 'rgba(98, 55, 160, 0.2)' : 'rgba(243, 232, 255, 1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text-secondary)';
                e.currentTarget.style.backgroundColor = isDark ? 'rgba(98, 55, 160, 0.1)' : 'transparent';
              }}
              onClick={onMenuToggle}
            >
              <MoreVertical size={20} className="sm:w-5 sm:h-5" />
            </button>
          )}

          {/* Dropdown Menu */}
          {menuOpen && (
            <>
              {/* Backdrop for mobile */}
              <div 
                className="fixed inset-0 z-30 md:hidden" 
                onClick={onMenuToggle}
              />
              
              <div
                ref={dropdownRef}
                className="absolute right-0 top-full mt-2 w-48 sm:w-52 border-2 rounded-xl shadow-xl z-40 overflow-hidden animate-slide-in"
                style={{ 
                  backgroundColor: 'var(--card-bg)', 
                  borderColor: 'var(--border-color)' 
                }}
              >
                {canEndChat && (
                  <button
                    className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm transition-colors group"
                    style={{ 
                      color: isDark ? '#fca5a5' : '#dc2626',
                      backgroundColor: 'transparent'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = isDark ? 'rgba(220, 38, 38, 0.1)' : '#fef2f2';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                    onClick={onEndChat}
                  >
                    <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="font-medium">End Chat</span>
                  </button>
                )}
                {canEndChat && canTransfer && (
                  <div style={{ borderTop: `1px solid var(--border-color)` }} />
                )}
                {canTransfer && (
                  <button
                    className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm transition-colors group"
                    style={{ 
                      color: 'var(--text-primary)',
                      backgroundColor: 'transparent'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = isDark ? 'rgba(98, 55, 160, 0.1)' : 'rgba(243, 232, 255, 1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                    onClick={onTransfer}
                  >
                    <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                    <span className="font-medium">Transfer Department</span>
                  </button>
                )}
                {!canEndChat && !canTransfer && (
                  <div className="px-4 py-3 text-sm text-center" style={{ color: 'var(--text-secondary)' }}>
                    No actions available
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
