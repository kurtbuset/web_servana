import DepartmentFilter from "../../../components/chat/DepartmentFilter";
import CustomerList from "../../../components/chat/CustomerList";
import QueueSidebarHeader from "./QueueSidebarHeader";
import QueueSidebarEmpty from "./QueueSidebarEmpty";

/**
 * QueueSidebar - Left sidebar showing customer queue
 */
export default function QueueSidebar({
  view,
  departments,
  selectedDepartment,
  setSelectedDepartment,
  filteredCustomers,
  selectedCustomer,
  loading,
  showDeptDropdown,
  setShowDeptDropdown,
  onCustomerClick,
}) {
  return (
    <div
      className={`${
        view === "chatList" ? "block" : "hidden md:block"
      } w-full md:w-[320px] lg:w-[360px] h-full md:rounded-xl shadow-sm border overflow-hidden flex flex-col`}
      style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
    >
      <QueueSidebarHeader customerCount={filteredCustomers.length} />

      <DepartmentFilter
        departments={departments}
        selectedDepartment={selectedDepartment}
        onDepartmentChange={setSelectedDepartment}
        isOpen={showDeptDropdown}
        onToggle={() => setShowDeptDropdown((prev) => !prev)}
      />

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {loading ? (
          <QueueSidebarEmpty
            icon="loading"
            title="Loading Queue"
            message="Fetching customers waiting in queue..."
          />
        ) : filteredCustomers.length > 0 ? (
          <CustomerList
            customers={filteredCustomers}
            selectedCustomer={selectedCustomer}
            onCustomerClick={onCustomerClick}
          />
        ) : (
          <QueueSidebarEmpty
            icon="queue"
            title="Queue is Empty"
            message="No customers are waiting in the queue right now."
          />
        )}
      </div>
    </div>
  );
}
