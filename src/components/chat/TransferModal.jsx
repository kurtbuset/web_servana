import { useState } from "react";
import { Search, X } from "lucide-react";

/**
 * TransferModal - Modal for selecting department or agent to transfer to
 */
export default function TransferModal({
  isOpen,
  departments,
  selectedDepartment,
  currentDepartment,
  onDepartmentChange,
  onConfirm,
  onCancel,
  departmentAvailability = {},
  availableAgents = [],
}) {
  const [activeTab, setActiveTab] = useState("department");
  const [searchQuery, setSearchQuery] = useState("");

  if (!isOpen) return null;

  // Filter departments based on search
  const filteredDepartments = departments.filter((dept) =>
    dept.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter available agents based on search (only accepting_chats agents)
  const filteredAgents = availableAgents.filter((agent) => {
    const name = `${agent.firstName || ''} ${agent.lastName || ''}`.trim();
    const searchLower = searchQuery.toLowerCase();
    return (
      name.toLowerCase().includes(searchLower) ||
      (agent.email || '').toLowerCase().includes(searchLower)
    );
  });

  const handleConfirm = (e) => {
    if (!selectedDepartment || selectedDepartment === currentDepartment) {
      e.preventDefault();
      return;
    }
    onConfirm();
  };

  const handleClose = () => {
    onCancel();
    onDepartmentChange(null, null);
    setSearchQuery("");
    setActiveTab("department");
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Transfer chat to ...
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 px-6">
          <button
            onClick={() => {
              setActiveTab("department");
              setSearchQuery("");
            }}
            className={`py-4 px-4 font-medium transition-colors ${
              activeTab === "department"
                ? "text-[#6237A0] border-b-2 border-[#6237A0]"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Department ({departments.length})
          </button>
          <button
            onClick={() => {
              setActiveTab("agent");
              setSearchQuery("");
            }}
            className={`py-4 px-4 font-medium transition-colors ${
              activeTab === "agent"
                ? "text-[#6237A0] border-b-2 border-[#6237A0]"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Agent ({availableAgents.length})
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="relative">
            <Search
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6237A0] focus:border-transparent"
            />
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 min-h-64 max-h-96 overflow-y-auto">
          {activeTab === "department" ? (
            <div className="space-y-2">
              {filteredDepartments.length > 0 ? (
                filteredDepartments.map((dept) => {
                  const count = departmentAvailability[dept] ?? 0;
                  return (
                    <button
                      key={dept}
                      onClick={() => onDepartmentChange(dept, 'department')}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center justify-between ${
                        selectedDepartment === dept
                          ? "bg-[#6237A0] text-white"
                          : "bg-gray-50 text-gray-900 hover:bg-gray-100"
                      }`}
                    >
                      <span>{dept}</span>
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          selectedDepartment === dept
                            ? "bg-white/20 text-white"
                            : count > 0
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        {count} available
                      </span>
                    </button>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                  <p className="text-center">No departments found</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredAgents.length > 0 ? (
                filteredAgents.map((agent) => {
                  const agentName = `${agent.firstName || ''} ${agent.lastName || ''}`.trim();
                  return (
                    <button
                      key={agent.userId}
                      onClick={() => {
                        const agentName = `${agent.firstName || ''} ${agent.lastName || ''}`.trim();
                        onDepartmentChange(agent.userId, 'agent', agentName || agent.email);
                      }}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                        selectedDepartment === agent.userId
                          ? "bg-[#6237A0] text-white"
                          : "bg-gray-50 text-gray-900 hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-green-500 flex-shrink-0"></span>
                        <div>
                          <div className="font-medium">{agentName || agent.email}</div>
                          {agentName && (
                            <div className="text-sm opacity-75">{agent.email}</div>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                  <p className="text-center">No available agents</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={handleClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedDepartment || selectedDepartment === currentDepartment}
            className={`px-6 py-2 text-white rounded-lg transition-colors font-medium ${
              selectedDepartment && selectedDepartment !== currentDepartment
                ? "bg-[#6237A0] hover:bg-[#4c2b7d]"
                : "bg-[#6237A0]/50 cursor-not-allowed"
            }`}
          >
            Transfer
          </button>
        </div>
      </div>
    </div>
  );
}
