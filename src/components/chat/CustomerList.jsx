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
  const getStatusBadge = (customer) => {
    if (customer.status === "queued") {
      return (
        <span className="text-[9px] sm:text-[10px] font-semibold text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full whitespace-nowrap ml-1 border border-orange-200">
          QUEUED
        </span>
      );
    }
    if (customer.status === "transferred") {
      return (
        <span className="text-[9px] sm:text-[10px] font-semibold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full whitespace-nowrap ml-1 border border-blue-200">
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
        <p className="text-sm font-medium text-gray-600 mb-1">No customers in queue</p>
        <p className="text-xs text-gray-400">Waiting for new chats...</p>
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
            className={`flex items-center gap-3 px-3 sm:px-4 py-3 sm:py-3.5 border rounded-xl cursor-pointer transition-all duration-200 mb-2 sm:mb-3 hover:shadow-md group ${
              isSelected
                ? "bg-gradient-to-r from-[#E6DCF7] to-[#F0EBFF] border-[#6237A0] shadow-md"
                : isEnded
                ? "bg-gray-50 opacity-70 border-gray-200"
                : "bg-white border-gray-200 hover:border-[#6237A0] hover:bg-purple-50/30"
            }`}
          >
            {/* Avatar with status indicator */}
            <div className="relative flex-shrink-0">
              <img
                src={customer.profile || "profile_picture/DefaultProfile.jpg"}
                alt="profile"
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border border-white shadow-sm"
              />
              {!isEnded && (
                <div className="absolute bottom-0 right-0 w-3 h-3 sm:w-3.5 sm:h-3.5 bg-green-500 border border-white rounded-full"></div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              {/* Department and Status Badges */}
              <div className="flex items-center gap-1 mb-1.5 flex-wrap">
                <span className="text-[9px] sm:text-[10px] font-semibold text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full whitespace-nowrap border border-purple-200">
                  {customer.department}
                </span>
                {getStatusBadge(customer)}
              </div>

              {/* Customer Name */}
              <p
                className={`text-sm sm:text-base font-semibold truncate mb-1 transition-colors ${
                  isSelected
                    ? "text-[#6237A0]"
                    : isEnded
                    ? "text-gray-500"
                    : "text-gray-800 group-hover:text-[#6237A0]"
                }`}
              >
                {customer.name}
              </p>

              {/* Phone Number and Time */}
              <div className="flex justify-between items-center gap-2">
                <p
                  className={`text-xs sm:text-sm truncate ${
                    isSelected
                      ? "text-[#6237A0]/80"
                      : isEnded
                      ? "text-gray-400"
                      : "text-gray-500"
                  }`}
                >
                  {customer.number}
                </p>
                <span className="text-[10px] sm:text-xs text-gray-400 whitespace-nowrap flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
