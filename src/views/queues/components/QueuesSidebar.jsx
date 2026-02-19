import DepartmentFilter from "../../../components/chat/DepartmentFilter";
import CustomerList from "../../../components/chat/CustomerList";
import { LoadingQueueState, QueueEmptyState } from "./QueuesEmptyStates";

/**
 * QueuesSidebar - Left sidebar with queue list for QueuesScreen
 * 
 * Props grouped into 2 objects:
 * - state: All state values
 * - actions: All handlers and setters
 */
export default function QueuesSidebar({ state, actions }) {
  const {
    view, loading, filteredCustomers, selectedCustomer,
    departments, selectedDepartment, showDeptDropdown
  } = state;

  const { setSelectedDepartment, setShowDeptDropdown, handleChatClick } = actions;

  return (
    <div
      className={`${
        view === "chatList" ? "block" : "hidden md:block"
      } w-full md:w-[320px] lg:w-[360px] md:rounded-xl shadow-sm border overflow-hidden flex flex-col`}
      style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
    >
      <div className="bg-gradient-to-r from-[#6237A0] to-[#7A4ED9] p-3 md:p-4">
        <h2 className="text-base md:text-lg font-bold text-white mb-0.5 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Queue
        </h2>
        <p className="text-purple-100 text-[10px] md:text-xs">
          {filteredCustomers.length} customer{filteredCustomers.length !== 1 ? 's' : ''} waiting
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
          <LoadingQueueState />
        ) : filteredCustomers.length > 0 ? (
          <CustomerList
            customers={filteredCustomers}
            selectedCustomer={selectedCustomer}
            onCustomerClick={handleChatClick}
          />
        ) : (
          <QueueEmptyState />
        )}
      </div>
    </div>
  );
}
