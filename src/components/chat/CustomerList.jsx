/**
 * CustomerList - Displays list of customers/chats
 * Reusable for both Queues and Chats screens
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
        <span className="text-[9px] font-semibold text-orange-600 bg-orange-100 px-2 py-[2px] rounded-full whitespace-nowrap ml-1">
          QUEUED
        </span>
      );
    }
    if (customer.status === "transferred") {
      return (
        <span className="text-[9px] font-semibold text-blue-600 bg-blue-100 px-2 py-[2px] rounded-full whitespace-nowrap ml-1">
          TRANSFERRED
        </span>
      );
    }
    return null;
  };

  return (
    <div className="chat-list overflow-auto">
      {customers.map((customer) => {
        const isEnded = endedChats.some((chat) => chat.id === customer.id);
        const isSelected = selectedCustomer?.id === customer.id;

        return (
          <div
            key={customer.id}
            onClick={() => onCustomerClick(customer)}
            className={`flex items-center justify-between px-4 py-3 border-2 ${
              isSelected
                ? "bg-[#E6DCF7]"
                : isEnded
                ? "bg-gray-100 opacity-70"
                : "bg-[#f5f5f5]"
            } border-[#E6DCF7] rounded-xl hover:bg-[#E6DCF7] cursor-pointer transition m-2 min-h-[100px]`}
          >
            <div className="flex items-center gap-2 flex-1">
              <img
                src={
                  customer.profile || "profile_picture/DefaultProfile.jpg"
                }
                alt="profile"
                className="w-15 h-15 rounded-full object-cover"
              />

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center">
                    <span className="text-[10px] font-semibold text-purple-600 bg-purple-100 px-2 py-[2px] rounded-full whitespace-nowrap">
                      {customer.department}
                    </span>
                    {getStatusBadge(customer)}
                  </div>
                </div>
                <p
                  className={`text-sm font-medium truncate ${
                    isSelected
                      ? "text-[#6237A0]"
                      : isEnded
                      ? "text-gray-500"
                      : "text-gray-800"
                  }`}
                >
                  {customer.name}
                </p>
                <div className="flex justify-between items-center">
                  <p
                    className={`text-xs truncate ${
                      isSelected
                        ? "text-[#6237A0]"
                        : isEnded
                        ? "text-gray-400"
                        : "text-gray-500"
                    }`}
                  >
                    {customer.number}
                  </p>
                  <span className="text-[10px] text-gray-400 ml-2 whitespace-nowrap mt-5">
                    {customer.time}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
