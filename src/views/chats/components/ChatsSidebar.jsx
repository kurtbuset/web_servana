import DepartmentFilter from "../../../components/chat/DepartmentFilter";
import CustomerList from "../../../components/chat/CustomerList";
import { LoadingChatsState, NoActiveChatsState } from "./ChatsEmptyStates";

/**
 * ChatsSidebar - Left sidebar with chat list for ChatsScreen
 * 
 * Props grouped into 2 objects:
 * - state: All state values
 * - actions: All handlers and setters
 */
export default function ChatsSidebar({ state, actions }) {
  const {
    view, loading, filteredCustomers, selectedCustomer,
    endedChats, departments, selectedDepartment, showDeptDropdown
  } = state;

  const { setSelectedDepartment, setShowDeptDropdown, handleChatClick } = actions;

  return (
    <div
      className={`${
        view === "chatList" ? "block" : "hidden md:block"
      } w-full md:w-[320px] lg:w-[360px] md:rounded-xl shadow-sm border-0 md:border overflow-hidden flex flex-col`}
      style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
    >
      <div className="bg-gradient-to-r from-[#6237A0] to-[#7A4ED9] p-3 md:p-4">
        <h2 className="text-base md:text-lg font-bold text-white mb-0.5 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Active Chats
        </h2>
        <p className="text-purple-100 text-[10px] md:text-xs">
          {filteredCustomers.length} conversation{filteredCustomers.length !== 1 ? 's' : ''}
        </p>
      </div>

      <DepartmentFilter
        departments={departments}
        selectedDepartment={selectedDepartment}
        onDepartmentChange={setSelectedDepartment}
        isOpen={showDeptDropdown}
        onToggle={() => setShowDeptDropdown((prev) => !prev)}
      />

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {loading ? (
          <LoadingChatsState />
        ) : filteredCustomers.length > 0 ? (
          <CustomerList
            customers={filteredCustomers}
            selectedCustomer={selectedCustomer}
            onCustomerClick={handleChatClick}
            endedChats={endedChats}
          />
        ) : (
          <NoActiveChatsState />
        )}
      </div>
    </div>
  );
}
