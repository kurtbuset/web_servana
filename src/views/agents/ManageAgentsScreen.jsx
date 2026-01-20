import { useState, useRef, useEffect } from "react";
import { Edit3, Search, X, Eye, EyeOff, Filter } from "react-feather";
import TopNavbar from "../../../src/components/TopNavbar";
import Sidebar from "../../../src/components/Sidebar";
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
        <main className="flex-1 bg-gray-100 p-15 overflow-hidden relative">
          <div className="bg-white p-4 rounded-lg h-full flex flex-col">
            <div className="flex justify-between items-center mb-4 relative">
              <div className="relative w-1/3" ref={filterRef}>
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
                    className="absolute mt-1 bg-white border border-gray-300 rounded-md shadow-lg w-64 max-h-60 overflow-auto z-50"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="p-2">
                      {allDepartments.map((dept) => (
                        <label
                          key={dept}
                          className="flex items-center gap-2 mb-1 cursor-pointer"
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
                            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                          />
                          <span className="text-sm">{dept}</span>
                        </label>
                      ))}
                      {selectedDepartmentsFilter.length > 0 && (
                        <button
                          onClick={() => setSelectedDepartmentsFilter([])}
                          className="mt-2 text-sm text-purple-600 hover:underline"
                        >
                          Clear Filters
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => handleOpenEditModal()}
                disabled={!canCreateAccount}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  canCreateAccount
                    ? "bg-[#6237A0] text-white hover:bg-purple-800"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                title={!canCreateAccount ? "You don't have permission to create accounts" : ""}
              >
                Add Agent
              </button>
            </div>

            <div className="overflow-x-auto flex-1">
              <div className="h-full overflow-y-auto custom-scrollbar">
                <table className="min-w-full text-sm text-left border-separate border-spacing-0">
                  <thead className="text-gray-500 sticky top-0 bg-white z-20 shadow-sm">
                    <tr>
                      <th className="sticky top-0 left-0 z-30 bg-white py-2 px-3 w-48 border-b border-gray-500">
                        Email
                      </th>
                      <th className="sticky left-[250px] z-30 bg-white py-2 px-3 text-center w-32 border-b border-gray-500">
                        Active Status
                      </th>

                      {allDepartments.map((dept, i) => (
                        <th
                          key={i}
                          className="py-2 px-3 text-center min-w-[120px] border-b border-gray-500 bg-white sticky top-0 z-20"
                        >
                          {dept}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredAgents.map((agent, idx) => (
                      <tr key={idx}>
                        <td className="sticky left-0 bg-white py-3 px-3 z-10 w-[250px] min-w-[250px]">
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-sm break-words max-w-[200px]">
                              {agent.email}
                            </span>
                            <Edit3
                              size={18}
                              strokeWidth={1}
                              className={`flex-shrink-0 mt-1 transition-colors ${
                                canCreateAccount
                                  ? "text-gray-500 cursor-pointer hover:text-purple-700"
                                  : "text-gray-300 cursor-not-allowed"
                              }`}
                              onClick={() => handleOpenEditModal(idx)}
                              title={!canCreateAccount ? "You don't have permission to edit accounts" : ""}
                            />
                          </div>
                        </td>

                        <td className="sticky left-[250px] bg-white py-3 px-3 z-20 text-center w-32">
                          <ToggleSwitch
                            checked={agent.active}
                            onChange={() => handleToggleActive(idx)}
                            disabled={!canCreateAccount}
                          />
                        </td>

                        {allDepartments.map((dept, i) => (
                          <td key={i} className="py-3 px-3 text-center">
                            <input
                              type="checkbox"
                              checked={agent.departments.includes(dept)}
                              onChange={() => handleToggleDepartment(idx, dept)}
                              disabled={!canAssignDepartment}
                              className={`w-4 h-4 ${
                                canAssignDepartment ? "cursor-pointer" : "cursor-not-allowed"
                              }`}
                              title={!canAssignDepartment ? "You don't have permission to assign departments" : ""}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>

                {loading && (
                  <p className="text-center text-gray-600 py-4">Loading...</p>
                )}
              </div>
            </div>
          </div>
        </main>

        {/* Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-400/50 z-50 flex justify-center items-center">
            <div className="bg-white rounded-lg p-6 w-96 relative">
              <h2 className="text-xl font-semibold mb-4">
                {currentEditIndex !== null ? "Edit Agent" : "Add Agent"}
              </h2>
              {modalError && (
                <div className="bg-red-100 text-red-700 px-4 py-2 rounded-md mb-3 text-sm font-medium border border-red-300">
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
                className="w-full mb-4 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
              />

              <label className="block mb-2 text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={editForm.password}
                  onChange={(e) => {
                    setEditForm({ ...editForm, password: e.target.value });
                    if (modalError) setModalError(null);
                  }}
                  className="w-full mb-4 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
                {showPassword ? (
                  <EyeOff
                    size={18}
                    className="absolute top-3 right-3 cursor-pointer text-gray-500"
                    onClick={() => setShowPassword(false)}
                  />
                ) : (
                  <Eye
                    size={18}
                    className="absolute top-3 right-3 cursor-pointer text-gray-500"
                    onClick={() => setShowPassword(true)}
                  />
                )}
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setModalError(null);
                  }}
                  className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveAgent}
                  className="px-4 py-2 rounded-md bg-purple-700 text-white hover:bg-purple-800"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Confirm Save Modal */}
        {isConfirmModalOpen && (
          <div className="fixed inset-0 bg-gray-200/40 z-60 flex justify-center items-center">
            <div className="bg-white rounded-lg p-6 w-80">
              <h3 className="text-lg font-semibold mb-4">Confirm Save</h3>
              <p className="mb-6">
                Are you sure you want to save these changes?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setIsConfirmModalOpen(false);
                    setIsModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmSaveAgent}
                  className="px-4 py-2 rounded-md bg-purple-700 text-white hover:bg-purple-800"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
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
      <div className={`w-7 h-4 rounded-full peer transition-colors duration-300 relative after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-transform peer-checked:after:translate-x-3 ${
        disabled
          ? "bg-gray-100 peer-checked:bg-gray-300"
          : "bg-gray-200 peer-checked:bg-[#6237A0]"
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
    <div className="flex items-center bg-gray-100 px-3 py-2 rounded-md w-full relative">
      <Search size={18} strokeWidth={1} className="text-gray-500 mr-2" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent focus:outline-none text-sm w-full pr-12"
      />
      {value && (
        <X
          size={16}
          strokeWidth={1}
          className="text-gray-500 cursor-pointer absolute right-7"
          onClick={() => onChange("")}
        />
      )}
      <Filter
        size={16}
        strokeWidth={1}
        className={`text-gray-500 cursor-pointer absolute right-3 ${
          filterDropdownOpen ? "text-purple-700" : ""
        }`}
        onClick={onFilterClick}
      />
      {selectedFilters.length > 0 && (
        <div className="absolute right-8 top-1 text-xs bg-purple-600 text-white rounded-full px-1.5 select-none">
          {selectedFilters.length}
        </div>
      )}
    </div>
  );
}
