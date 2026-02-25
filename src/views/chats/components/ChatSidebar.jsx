import DepartmentFilter from "../../../components/chat/DepartmentFilter";
import CustomerList from "../../../components/chat/CustomerList";
import ChatSidebarHeader from "./ChatSidebarHeader";
import ChatSidebarEmpty from "./ChatSidebarEmpty";

/**
 * ChatSidebar - Left sidebar showing customer list
 */
export default function ChatSidebar({
  view,
  isMobile,
  departments,
  selectedDepartment,
  setSelectedDepartment,
  filteredCustomers,
  selectedCustomer,
  loading,
  endedChats,
  showDeptDropdown,
  setShowDeptDropdown,
  onCustomerClick,
}) {
  return (
    <div
      className={`${
        view === "chatList" ? "block" : "hidden md:block"
      } w-full md:w-[320px] lg:w-[360px] md:rounded-xl shadow-sm border-0 md:border overflow-hidden flex flex-col`}
      style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
    >
      <ChatSidebarHeader customerCount={filteredCustomers.length} />

      <DepartmentFilter
        departments={departments}
        selectedDepartment={selectedDepartment}
        onDepartmentChange={setSelectedDepartment}
        isOpen={showDeptDropdown}
        onToggle={() => setShowDeptDropdown((prev) => !prev)}
      />

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {loading ? (
          <ChatSidebarEmpty
            icon="loading"
            title="Loading Chats"
            message="Fetching active conversations..."
          />
        ) : filteredCustomers.length > 0 ? (
          <CustomerList
            customers={filteredCustomers}
            selectedCustomer={selectedCustomer}
            onCustomerClick={onCustomerClick}
            endedChats={endedChats}
          />
        ) : (
          <ChatSidebarEmpty
            icon="chat"
            title="No Active Chats"
            message="No active conversations at the moment. New chats will appear here automatically."
          />
        )}
      </div>
    </div>
  );
}
