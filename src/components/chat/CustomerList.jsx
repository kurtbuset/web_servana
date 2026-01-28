import { useTheme } from "../../context/ThemeContext";

/**
 * CustomerList - Displays list of customers/chats
 * Reusable for both Queues and Chats screens
 * Enhanced with responsive design and modern styling
 */
export default function CustomerList({
  customers,
  selectedCustomer,
  onCustomerClick,
  endedChats = [],
}) {
  const { isDark } = useTheme();
  
  const getStatusBadge = (customer) => {
    if (customer.status === "queued") {
      return (
        <span className="text-[7px] sm:text-[8px] font-semibold text-orange-600 bg-orange-100 px-1.5 py-0.5 rounded-full whitespace-nowrap ml-1 border border-orange-200">
          QUEUED
        </span>
      );
    }
    if (customer.status === "transferred") {
      return (
        <span className="text-[7px] sm:text-[8px] font-semibold text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded-full whitespace-nowrap ml-1 border border-blue-200">
          TRANSFERRED
        </span>
      );
    }
    return null;
  };

  if (customers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-3">
          <svg className="w-8 h-8 text-[#6237A0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>No customers in queue</p>
        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Waiting for new chats...</p>
      </div>
    );
  }

  return (
    <div className="chat-list overflow-auto p-2 sm:p-3">
      {customers.map((customer) => {
        const isEnded = endedChats.some((chat) => chat.id === customer.id);
        const isSelected = selectedCustomer?.id === customer.id;

        return (
          <div
            key={customer.id}
            onClick={() => onCustomerClick(customer)}
            className={`flex items-center gap-2 px-2 sm:px-2.5 py-1.5 sm:py-2 border rounded-lg cursor-pointer transition-all duration-200 mb-1 sm:mb-1.5 hover:shadow-md group ${
              isSelected
                ? "border-[#6237A0] shadow-md"
                : isEnded
                ? "opacity-70"
                : "hover:border-[#6237A0]"
            }`}
            style={
              isSelected 
                ? {
                    background: isDark 
                      ? 'linear-gradient(to right, rgba(139, 92, 246, 0.25), rgba(139, 92, 246, 0.15))' 
                      : 'linear-gradient(to right, #E6DCF7, #F0EBFF)',
                    borderColor: '#6237A0'
                  }
                : isEnded 
                ? {
                    backgroundColor: isDark ? 'rgba(58, 58, 58, 0.5)' : 'rgba(249, 250, 251, 1)',
                    borderColor: 'var(--border-color)'
                  }
                : {
                    backgroundColor: 'var(--card-bg)',
                    borderColor: 'var(--border-color)'
                  }
            }
            onMouseEnter={(e) => {
              if (!isSelected && !isEnded) {
                e.currentTarget.style.backgroundColor = isDark ? 'rgba(139, 92, 246, 0.1)' : 'rgba(245, 243, 255, 0.3)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isSelected && !isEnded) {
                e.currentTarget.style.backgroundColor = 'var(--card-bg)';
              }
            }}
          >
            {/* Avatar with status indicator */}
            <div className="relative flex-shrink-0">
              <img
                src={customer.profile || "profile_picture/DefaultProfile.jpg"}
                alt="profile"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border border-white shadow-sm"
              />
              {!isEnded && (
                <div className="absolute bottom-0 right-0 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-green-500 border border-white rounded-full"></div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              {/* Department and Status Badges */}
              <div className="flex items-center gap-1 mb-0.5 flex-wrap">
                <span className="text-[7px] sm:text-[8px] font-semibold text-purple-600 bg-purple-100 px-1.5 py-0.5 rounded-full whitespace-nowrap border border-purple-200">
                  {customer.department}
                </span>
                {getStatusBadge(customer)}
              </div>

              {/* Customer Name */}
              <p
                className={`text-[11px] sm:text-xs font-semibold truncate mb-0.5 transition-colors ${
                  isSelected && !isDark
                    ? "text-[#6237A0]"
                    : ""
                }`}
                style={
                  isSelected && isDark
                    ? { color: '#ffffff' }
                    : !isSelected
                    ? { color: isEnded ? 'var(--text-secondary)' : 'var(--text-primary)' }
                    : {}
                }
              >
                {customer.name}
              </p>

              {/* Phone Number and Time */}
              <div className="flex justify-between items-center gap-1.5">
                <p
                  className={`text-[9px] sm:text-[10px] truncate ${
                    isSelected && !isDark
                      ? "text-[#6237A0]/80"
                      : ""
                  }`}
                  style={
                    isSelected && isDark
                      ? { color: 'rgba(255, 255, 255, 0.9)' }
                      : !isSelected
                      ? { color: 'var(--text-secondary)' }
                      : {}
                  }
                >
                  {customer.number}
                </p>
                <span 
                  className="text-[8px] sm:text-[9px] whitespace-nowrap flex items-center gap-0.5" 
                  style={{ 
                    color: isSelected && isDark ? 'rgba(255, 255, 255, 0.8)' : 'var(--text-secondary)' 
                  }}
                >
                  <svg className="w-2 h-2 sm:w-2.5 sm:h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {customer.time}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
