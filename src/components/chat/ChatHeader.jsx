import { useRef } from "react";
import { MoreVertical, ArrowLeft, CheckCircle, Clock } from "react-feather";

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
}) {
  return (
    <div className="sticky top-0 z-10 bg-white border-b-2 border-gray-100 shadow-sm">
      <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 md:p-5">
        {/* Back Button for Mobile */}
        {isMobile && (
          <button
            onClick={onBack}
            className="flex-shrink-0 p-2 -ml-2 text-gray-600 hover:text-[#6237A0] hover:bg-purple-50 rounded-lg transition-all"
          >
            <ArrowLeft size={20} />
          </button>
        )}

        {/* Customer Info */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="relative flex-shrink-0">
            <img
              src={customer?.profile || "profile_picture/DefaultProfile.jpg"}
              alt="profile"
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-white shadow-md"
            />
            {customer.isAccepted || customer.sys_user_id ? (
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
            ) : (
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-orange-500 border-2 border-white rounded-full animate-pulse"></div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 truncate">
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
              className="p-2 text-gray-600 hover:text-[#6237A0] hover:bg-purple-50 transition-all rounded-lg"
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
                className="absolute right-0 top-full mt-2 w-48 sm:w-52 bg-white border-2 border-gray-200 rounded-xl shadow-xl z-40 overflow-hidden animate-slide-in"
              >
                {canEndChat && (
                  <button
                    className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors group"
                    onClick={onEndChat}
                  >
                    <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="font-medium">End Chat</span>
                  </button>
                )}
                {canEndChat && canTransfer && (
                  <div className="border-t border-gray-200" />
                )}
                {canTransfer && (
                  <button
                    className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-purple-50 transition-colors group"
                    onClick={onTransfer}
                  >
                    <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                    <span className="font-medium">Transfer Department</span>
                  </button>
                )}
                {!canEndChat && !canTransfer && (
                  <div className="px-4 py-3 text-sm text-gray-400 text-center">
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
