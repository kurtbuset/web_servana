import { useState, useRef, useEffect } from "react";
import { Edit3, Search, X, Eye, EyeOff, Filter } from "react-feather";
import TopNavbar from "../../../src/components/TopNavbar";
import Sidebar from "../../../src/components/Sidebar";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useAgents } from "../../hooks/useAgents";
import { useUser } from "../../context/UserContext";
import { toast } from "react-toastify";
import "../../../src/App.css";

/**
 * ManageAgentsScreen - Refactored agent management interface
 * 
 * Uses the new useAgents hook for business logic while maintaining
 * the exact same UI/UX as the original ManageAgents screen.
 * 
 * Features:
 * - View all agents
 * - Search agents by email
 * - Filter by departments
 * - Add new agent
 * - Edit agent email/password
 * - Toggle agent active status
 * - Assign/unassign departments
 * - Duplicate email detection
 * - Email validation
 * - Responsive table with sticky columns
 */
export default function ManageAgentsScreen() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [currentEditIndex, setCurrentEditIndex] = useState(null);
  const [editForm, setEditForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [modalError, setModalError] = useState(null);
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [selectedDepartmentsFilter, setSelectedDepartmentsFilter] = useState([]);
  const filterRef = useRef(null);

  // Get user permissions
  const { hasPermission } = useUser();
  const canAssignDepartment = hasPermission("priv_can_assign_dept");
  const canCreateAccount = hasPermission("priv_can_create_account");

  // Get agent state and actions from hook
  const {
    agents,
    allDepartments,
    loading,
    createAgent,
    updateAgent,
    toggleActive,
    toggleDepartment,
  } = useAgents();

  useEffect(() => {
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setFilterDropdownOpen(false);
      }
    }
    if (filterDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [filterDropdownOpen]);

  const filteredAgents = agents.filter((agent) => {
    const email = agent.email?.toLowerCase() || "";
    const matchesSearch = email.includes(searchQuery.toLowerCase());

    if (selectedDepartmentsFilter.length === 0) {
      return matchesSearch;
    }

    const hasAllDepartments = selectedDepartmentsFilter.every((dept) =>
      (agent.departments || []).includes(dept)
    );

    return matchesSearch && hasAllDepartments;
  });

  const toggleSidebar = () => setMobileSidebarOpen((prev) => !prev);

  const handleOpenEditModal = (index = null) => {
    if (!canCreateAccount) {
      console.warn("User does not have permission to create accounts");
      toast.error("You don't have permission to create or edit accounts");
      return;
    }
    
    setCurrentEditIndex(index);
    setEditForm(
      index !== null
        ? { email: agents[index].email, password: "" }
        : { email: "", password: "" }
    );
    setShowPassword(false);
    setIsModalOpen(true);
    setModalError("");
  };

  const handleSaveAgent = async () => {
    setIsModalOpen(false);
    setIsConfirmModalOpen(true);
  };

  const confirmSaveAgent = async () => {
    try {
      const isEdit = currentEditIndex !== null;

      if (isEdit) {
        await updateAgent(
          agents[currentEditIndex].id,
          editForm.email,
          editForm.password,
          currentEditIndex
        );
      } else {
        await createAgent(editForm.email, editForm.password);
      }

      setIsModalOpen(false);
      setIsConfirmModalOpen(false);
      setEditForm({ email: "", password: "" });
      setModalError(null);
    } catch (error) {
      // Error already handled by hook with toast
      setModalError(error.message);
      setIsModalOpen(true);
      setIsConfirmModalOpen(false);
    }
  };

  const handleToggleActive = async (index) => {
    if (!canCreateAccount) {
      console.warn("User does not have permission to create accounts");
      toast.error("You don't have permission to modify account status");
      return;
    }

    try {
      await toggleActive(index);
    } catch (error) {
      // Error already handled by hook with toast
      console.error("Error updating active status:", error);
    }
  };

  const handleToggleDepartment = async (agentIndex, dept) => {
    if (!canAssignDepartment) {
      console.warn("User does not have permission to assign departments");
      toast.error("You don't have permission to assign departments");
      return;
    }

    try {
      await toggleDepartment(agentIndex, dept);
    } catch (error) {
      // Error already handled by hook with toast
      console.error("Error updating departments:", error);
    }
  };

  return (
    <>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #6237A0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #552C8C;
        }
      `}</style>
      <div className="flex flex-col h-screen overflow-hidden">
        <TopNavbar toggleSidebar={toggleSidebar} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          isMobile={true}
          isOpen={mobileSidebarOpen}
          toggleDropdown={setOpenDropdown}
          openDropdown={openDropdown}
        />
        <Sidebar
          isMobile={false}
          toggleDropdown={setOpenDropdown}
          openDropdown={openDropdown}
        />
        <main className="flex-1 bg-gradient-to-br from-[#F7F5FB] via-[#F0EBFF] to-[#F7F5FB] p-2 sm:p-3 md:p-4 overflow-hidden">
          <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm h-full flex flex-col">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <h1 className="text-lg sm:text-xl font-bold text-gray-800">Manage Agents</h1>
              
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                {/* Search Bar with Filter */}
                <div className="relative flex-1 sm:flex-initial sm:w-56 md:w-64" ref={filterRef}>
                  <SearchInput
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Search agents..."
                    onFilterClick={() => setFilterDropdownOpen((prev) => !prev)}
                    filterDropdownOpen={filterDropdownOpen}
                    selectedFilters={selectedDepartmentsFilter}
                  />
                  {filterDropdownOpen && (
                    <div
                      className="absolute mt-1 bg-white border-2 border-gray-200 rounded-lg shadow-xl w-full sm:w-64 max-h-60 overflow-auto z-50"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="p-3">
                        <p className="text-xs font-semibold text-gray-600 mb-2">Filter by Department</p>
                        {allDepartments.map((dept) => (
                          <label
                            key={dept}
                            className="flex items-center gap-2 mb-2 cursor-pointer hover:bg-gray-50 p-1.5 rounded"
                          >
                            <input
                              type="checkbox"
                              checked={selectedDepartmentsFilter.includes(dept)}
                              onChange={() => {
                                setSelectedDepartmentsFilter((prev) =>
                                  prev.includes(dept)
                                    ? prev.filter((d) => d !== dept)
                                    : [...prev, dept]
                                );
                              }}
                              className="w-4 h-4 text-[#6237A0] rounded focus:ring-[#6237A0]"
                            />
                            <span className="text-sm">{dept}</span>
                          </label>
                        ))}
                        {selectedDepartmentsFilter.length > 0 && (
                          <button
                            onClick={() => setSelectedDepartmentsFilter([])}
                            className="mt-2 text-sm text-[#6237A0] hover:underline font-medium"
                          >
                            Clear Filters
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Add Button */}
                <button
                  onClick={() => handleOpenEditModal()}
                  disabled={!canCreateAccount}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                    canCreateAccount
                      ? "bg-[#6237A0] text-white hover:bg-[#552C8C]"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                  title={!canCreateAccount ? "You don't have permission to create accounts" : ""}
                >
                  + Add Agent
                </button>
              </div>
            </div>

            {/* Table Container */}
            <div className="flex-1 overflow-hidden">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-3 border-gray-200 border-t-[#6237A0]"></div>
                    <span className="text-gray-600 text-sm">Loading agents...</span>
                  </div>
                </div>
              ) : (
                <div className="h-full overflow-x-auto overflow-y-auto custom-scrollbar">
                  <table className="min-w-full text-sm border-separate border-spacing-0">
                    <thead className="text-gray-600 sticky top-0 bg-gray-50 z-20">
                      <tr>
                        <th className="sticky top-0 left-0 z-30 bg-gray-50 py-3 px-3 sm:px-4 text-left font-semibold border-b border-gray-200 min-w-[200px] sm:min-w-[250px]">
                          Email
                        </th>
                        <th className="sticky left-[200px] sm:left-[250px] z-30 bg-gray-50 py-3 px-3 sm:px-4 text-center font-semibold border-b border-gray-200 w-32 sm:w-40">
                          Status
                        </th>

                        {allDepartments.map((dept, i) => (
                          <th
                            key={i}
                            className="py-3 px-3 sm:px-4 text-center min-w-[100px] sm:min-w-[120px] border-b border-gray-200 bg-gray-50 sticky top-0 z-20 font-semibold"
                          >
                            {dept}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredAgents.length === 0 ? (
                        <tr>
                          <td colSpan={allDepartments.length + 2} className="text-center py-12">
                            <p className="text-gray-500 text-sm">
                              {searchQuery || selectedDepartmentsFilter.length > 0
                                ? "No agents found matching your criteria"
                                : "No agents available"}
                            </p>
                          </td>
                        </tr>
                      ) : (
                        filteredAgents.map((agent, idx) => (
                        <tr key={idx} className="hover:bg-gray-50 transition-colors">
                          <td className="sticky left-0 bg-white hover:bg-gray-50 py-2 px-2.5 sm:px-3 z-10 min-w-[180px] sm:min-w-[220px]">
                            <div className="flex items-start gap-1.5">
                              <span className="text-xs break-words flex-1">
                                {agent.email}
                              </span>
                              <button
                                onClick={() => handleOpenEditModal(idx)}
                                disabled={!canCreateAccount}
                                className={`flex-shrink-0 p-1 rounded transition-colors ${
                                  canCreateAccount
                                    ? "text-gray-500 hover:text-[#6237A0] hover:bg-purple-50"
                                    : "text-gray-300 cursor-not-allowed"
                                }`}
                                title={!canCreateAccount ? "You don't have permission to edit accounts" : "Edit"}
                              >
                                <Edit3 size={14} />
                              </button>
                            </div>
                          </td>

                          <td className="sticky left-[180px] sm:left-[220px] bg-white hover:bg-gray-50 py-2 px-2.5 sm:px-3 z-20 text-center">
                            <ToggleSwitch
                              checked={agent.active}
                              onChange={() => handleToggleActive(idx)}
                              disabled={!canCreateAccount}
                            />
                          </td>

                          {allDepartments.map((dept, i) => (
                            <td key={i} className="py-2 px-2.5 sm:px-3 text-center">
                              <input
                                type="checkbox"
                                checked={agent.departments.includes(dept)}
                                onChange={() => handleToggleDepartment(idx, dept)}
                                disabled={!canAssignDepartment}
                                className={`w-4 h-4 rounded ${
                                  canAssignDepartment
                                    ? "cursor-pointer text-[#6237A0] focus:ring-[#6237A0]"
                                    : "cursor-not-allowed text-gray-300"
                                }`}
                                title={!canAssignDepartment ? "You don't have permission to assign departments" : ""}
                              />
                            </td>
                          ))}
                        </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg p-5 sm:p-6 w-full max-w-md">
              <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">
                {currentEditIndex !== null ? "Edit Agent" : "Add Agent"}
              </h2>
              {modalError && (
                <div className="bg-red-50 text-red-700 px-3 sm:px-4 py-2.5 rounded-lg mb-4 text-sm font-medium border border-red-200">
                  {modalError}
                </div>
              )}
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={editForm.email}
                onChange={(e) => {
                  setEditForm({ ...editForm, email: e.target.value });
                  if (modalError) setModalError(null);
                }}
                placeholder="agent@example.com"
                className="w-full mb-4 px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6237A0] focus:border-transparent"
                autoFocus
              />

              <label className="block mb-2 text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative mb-5">
                <input
                  type={showPassword ? "text" : "password"}
                  value={editForm.password}
                  onChange={(e) => {
                    setEditForm({ ...editForm, password: e.target.value });
                    if (modalError) setModalError(null);
                  }}
                  placeholder="Enter password"
                  className="w-full px-3 py-2.5 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6237A0] focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3">
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setModalError(null);
                  }}
                  className="w-full sm:w-auto px-4 py-2 rounded-lg bg-gray-200 text-gray-800 font-medium hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveAgent}
                  disabled={!editForm.email.trim() || !editForm.password.trim()}
                  className={`w-full sm:w-auto px-4 py-2 rounded-lg font-medium transition-colors ${
                    editForm.email.trim() && editForm.password.trim()
                      ? "bg-[#6237A0] text-white hover:bg-[#552C8C]"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Confirm Save Modal */}
        {isConfirmModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-60 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg p-5 sm:p-6 w-full max-w-sm">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Confirm Save</h3>
              <p className="mb-5 text-sm text-gray-600">
                Are you sure you want to save these changes?
              </p>
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3">
                <button
                  onClick={() => {
                    setIsConfirmModalOpen(false);
                    setIsModalOpen(true);
                  }}
                  className="w-full sm:w-auto px-4 py-2 rounded-lg bg-gray-200 text-gray-800 font-medium hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmSaveAgent}
                  className="w-full sm:w-auto px-4 py-2 rounded-lg bg-[#6237A0] text-white font-medium hover:bg-[#552C8C] transition-colors"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
}

// ToggleSwitch component
function ToggleSwitch({ checked, onChange, disabled = false }) {
  return (
    <label className={`inline-flex relative items-center ${
      disabled ? "cursor-not-allowed" : "cursor-pointer"
    }`}>
      <input
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
      />
      <div className={`w-11 h-6 rounded-full peer transition-colors relative after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-transform peer-checked:after:translate-x-5 ${
        disabled
          ? "bg-gray-200 peer-checked:bg-gray-400"
          : "bg-gray-300 peer-checked:bg-[#6237A0]"
      }`} />
    </label>
  );
}

// SearchInput component
function SearchInput({
  value,
  onChange,
  placeholder,
  onFilterClick,
  filterDropdownOpen,
  selectedFilters,
}) {
  return (
    <div className="flex items-center bg-gray-100 px-2.5 py-1.5 rounded-lg w-full relative">
      <Search size={16} className="text-gray-500 mr-2 flex-shrink-0" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent focus:outline-none text-xs w-full pr-16"
      />
      {value && (
        <X
          size={14}
          className="text-gray-500 cursor-pointer hover:text-gray-700 transition-colors absolute right-9"
          onClick={() => onChange("")}
        />
      )}
      <button
        onClick={onFilterClick}
        className={`absolute right-3 p-1 rounded transition-colors ${
          filterDropdownOpen || selectedFilters.length > 0
            ? "text-[#6237A0] bg-purple-50"
            : "text-gray-500 hover:bg-gray-200"
        }`}
      >
        <Filter size={16} />
      </button>
      {selectedFilters.length > 0 && (
        <div className="absolute right-2 -top-1 text-xs bg-[#6237A0] text-white rounded-full w-5 h-5 flex items-center justify-center font-semibold">
          {selectedFilters.length}
        </div>
      )}
    </div>
  );
}
