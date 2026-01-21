import { useRef } from "react";
import { MoreVertical } from "react-feather";

/**
 * ChatHeader - Header for chat conversation with customer info and actions
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
    <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-4">
      <div className="flex items-center">
        {isMobile && (
          <button
            onClick={onBack}
            className="mr-2 text-gray-600 hover:text-gray-800"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
        <div className="flex items-center gap-4">
          <img
            src={customer?.profile || "profile_picture/DefaultProfile.jpg"}
            alt="profile"
            className="w-10 h-10 rounded-full object-cover"
          />

          <div>
            <h3 className="text-lg font-medium text-gray-800">
              {customer.name}
            </h3>
            {!customer.isAccepted && !customer.sys_user_id && (
              <span className="text-xs text-orange-500 font-medium">
                Waiting in Queue
              </span>
            )}
          </div>
        </div>
        <div className="relative ml-auto flex items-center gap-2">
          {/* Accept Chat Button */}
          {showAcceptButton && !chatEnded && (
            <button
              onClick={onAccept}
              className="px-4 py-2 bg-[#6237A0] text-white rounded-lg hover:bg-[#4c2b7d] transition-colors text-sm font-medium"
            >
              Accept Chat
            </button>
          )}

          {/* Three-dot menu */}
          {showMenu && !chatEnded && (canEndChat || canTransfer) && (
            <button
              className="p-2 text-black hover:text-[#6237A0] transition rounded-full"
              onClick={onMenuToggle}
            >
              <MoreVertical size={22} />
            </button>
          )}
          {menuOpen && (
            <div
              ref={dropdownRef}
              className="absolute right-0 mt-2 w-44 bg-white border border-gray-300 rounded-md shadow-sm z-20"
            >
              {canEndChat && (
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                  onClick={onEndChat}
                >
                  End Chat
                </button>
              )}
              {canEndChat && canTransfer && (
                <div className="border-t border-gray-200" />
              )}
              {canTransfer && (
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                  onClick={onTransfer}
                >
                  Transfer Department
                </button>
              )}
              {!canEndChat && !canTransfer && (
                <div className="px-4 py-2 text-sm text-gray-400">
                  No actions available
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
