import { useState, useRef, useEffect } from "react";
import { Edit3, Search, X, Eye, EyeOff, Filter } from "react-feather";
import TopNavbar from "../../../src/components/TopNavbar";
import Sidebar from "../../../src/components/Sidebar";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useAgents } from "../../hooks/useAgents";
import { useUser } from "../../context/UserContext";
import { useTheme } from "../../context/ThemeContext";
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
  const [viewProfileModal, setViewProfileModal] = useState(null);
  const filterRef = useRef(null);

  // Get user permissions
  const { hasPermission } = useUser();
  const { isDark } = useTheme();
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
          background: ${isDark ? '#2a2a2a' : '#f1f1f1'};
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
          <main className="flex-1 p-2 sm:p-3 md:p-4 overflow-hidden" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <div className="p-3 sm:p-4 rounded-lg shadow-sm h-full flex flex-col" style={{ backgroundColor: 'var(--card-bg)' }}>
              {/* Header Section */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <h1 className="text-lg sm:text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Manage Agents</h1>
                
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
                      isDark={isDark}
                    />
                    {filterDropdownOpen && (
                      <div
                        className="absolute mt-1 border-2 rounded-lg shadow-xl w-full sm:w-64 max-h-60 overflow-auto z-50"
                        style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="p-3">
                          <p className="text-xs font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>Filter by Department</p>
                          {allDepartments.map((dept) => (
                            <label
                              key={dept}
                              className="flex items-center gap-2 mb-2 cursor-pointer p-1.5 rounded"
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = isDark ? 'rgba(139, 92, 246, 0.05)' : 'rgba(249, 250, 251, 1)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                              }}
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
                              <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{dept}</span>
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
                      : "cursor-not-allowed"
                  }`}
                  style={!canCreateAccount ? {
                    backgroundColor: isDark ? '#4a4a4a' : '#d1d5db',
                    color: isDark ? '#9ca3af' : '#6b7280'
                  } : {}}
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
                    <div className="animate-spin rounded-full h-8 w-8 border-3 border-t-[#6237A0]" style={{ borderColor: 'var(--border-color)', borderTopColor: '#6237A0' }}></div>
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Loading agents...</span>
                  </div>
                </div>
              ) : (
                <div className="h-full overflow-x-auto overflow-y-auto custom-scrollbar">
                  <table className="min-w-full text-sm border-separate border-spacing-0">
                    <thead className="sticky top-0 z-20" style={{ color: 'var(--text-secondary)', backgroundColor: isDark ? '#2a2a2a' : '#f9fafb' }}>
                      <tr>
                        <th className="sticky top-0 left-0 z-30 py-3 px-3 sm:px-4 text-left font-semibold min-w-[240px] sm:min-w-[280px]" style={{ backgroundColor: isDark ? '#2a2a2a' : '#f9fafb', borderBottom: `1px solid var(--border-color)` }}>
                          Email
                        </th>
                        <th className="sticky left-[240px] sm:left-[280px] z-30 py-3 px-3 sm:px-4 text-center font-semibold w-32 sm:w-40" style={{ backgroundColor: isDark ? '#2a2a2a' : '#f9fafb', borderBottom: `1px solid var(--border-color)` }}>
                          Status
                        </th>

                        {allDepartments.map((dept, i) => (
                          <th
                            key={i}
                            className="py-3 px-3 sm:px-4 text-center min-w-[100px] sm:min-w-[120px] sticky top-0 z-20 font-semibold"
                            style={{ backgroundColor: isDark ? '#2a2a2a' : '#f9fafb', borderBottom: `1px solid var(--border-color)` }}
                          >
                            {dept}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody style={{ borderColor: 'var(--border-color)' }}>
                      {filteredAgents.length === 0 ? (
                        <tr>
                          <td colSpan={allDepartments.length + 2} className="text-center py-12">
                            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                              {searchQuery || selectedDepartmentsFilter.length > 0
                                ? "No agents found matching your criteria"
                                : "No agents available"}
                            </p>
                          </td>
                        </tr>
                      ) : (
                        filteredAgents.map((agent, idx) => (
                        <tr 
                          key={idx} 
                          className="transition-colors"
                          style={{ borderTop: `1px solid ${isDark ? 'rgba(74, 74, 74, 0.3)' : 'var(--border-color)'}` }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = isDark ? 'rgba(139, 92, 246, 0.05)' : 'rgba(249, 250, 251, 1)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          <td className="sticky left-0 z-10 py-2 px-2.5 sm:px-3 min-w-[240px] sm:min-w-[280px]" style={{ backgroundColor: 'var(--card-bg)' }}>
                            <div className="flex items-center gap-2">
                              <img
                                src={agent.profile_picture || "profile_picture/DefaultProfile.jpg"}
                                alt={agent.email}
                                className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm flex-shrink-0"
                              />
                              <div className="flex items-start gap-1.5 flex-1 min-w-0">
                                <span className="text-xs break-words flex-1" style={{ color: 'var(--text-primary)' }}>
                                  {agent.email}
                                </span>
                                <div className="flex items-center gap-1 flex-shrink-0">
                                  <button
                                    onClick={() => setViewProfileModal(agent)}
                                    className="p-1 rounded transition-colors hover:text-[#6237A0]"
                                    style={{ color: 'var(--text-secondary)' }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.backgroundColor = isDark ? 'rgba(139, 92, 246, 0.1)' : 'rgba(243, 232, 255, 1)';
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.backgroundColor = 'transparent';
                                    }}
                                    title="View Profile"
                                  >
                                    <Eye size={14} />
                                  </button>
                                  <button
                                    onClick={() => handleOpenEditModal(idx)}
                                    disabled={!canCreateAccount}
                                    className={`p-1 rounded transition-colors ${
                                      canCreateAccount
                                        ? "hover:text-[#6237A0]"
                                        : "cursor-not-allowed"
                                    }`}
                                    style={{ color: canCreateAccount ? 'var(--text-secondary)' : '#d1d5db' }}
                                    onMouseEnter={(e) => {
                                      if (canCreateAccount) {
                                        e.currentTarget.style.backgroundColor = isDark ? 'rgba(139, 92, 246, 0.1)' : 'rgba(243, 232, 255, 1)';
                                      }
                                    }}
                                    onMouseLeave={(e) => {
                                      if (canCreateAccount) {
                                        e.currentTarget.style.backgroundColor = 'transparent';
                                      }
                                    }}
                                    title={!canCreateAccount ? "You don't have permission to edit accounts" : "Edit"}
                                  >
                                    <Edit3 size={14} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="sticky left-[240px] sm:left-[280px] z-20 py-2 px-2.5 sm:px-3 text-center" style={{ backgroundColor: 'var(--card-bg)' }}>
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
            <div className="rounded-lg p-5 sm:p-6 w-full max-w-md" style={{ backgroundColor: 'var(--card-bg)' }}>
              <h2 className="text-lg sm:text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                {currentEditIndex !== null ? "Edit Agent" : "Add Agent"}
              </h2>
              {modalError && (
                <div className="bg-red-50 text-red-700 px-3 sm:px-4 py-2.5 rounded-lg mb-4 text-sm font-medium border border-red-200">
                  {modalError}
                </div>
              )}
              <label className="block mb-2 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
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
                className="w-full mb-4 px-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6237A0] focus:border-transparent"
                style={{ 
                  backgroundColor: 'var(--input-bg)', 
                  color: 'var(--text-primary)',
                  border: `1px solid var(--border-color)`
                }}
                autoFocus
              />

              <label className="block mb-2 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
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
                  className="w-full px-3 py-2.5 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6237A0] focus:border-transparent"
                  style={{ 
                    backgroundColor: 'var(--input-bg)', 
                    color: 'var(--text-primary)',
                    border: `1px solid var(--border-color)`
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 -translate-y-1/2 right-3 hover:text-gray-700 transition-colors"
                  style={{ color: 'var(--text-secondary)' }}
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
                  className="w-full sm:w-auto px-4 py-2 rounded-lg font-medium transition-colors"
                  style={{ 
                    backgroundColor: isDark ? '#4a4a4a' : '#e5e7eb',
                    color: 'var(--text-primary)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = isDark ? '#5a5a5a' : '#d1d5db';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = isDark ? '#4a4a4a' : '#e5e7eb';
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveAgent}
                  disabled={!editForm.email.trim() || !editForm.password.trim()}
                  className={`w-full sm:w-auto px-4 py-2 rounded-lg font-medium transition-colors ${
                    editForm.email.trim() && editForm.password.trim()
                      ? "bg-[#6237A0] text-white hover:bg-[#552C8C]"
                      : "cursor-not-allowed"
                  }`}
                  style={!(editForm.email.trim() && editForm.password.trim()) ? {
                    backgroundColor: isDark ? '#4a4a4a' : '#d1d5db',
                    color: isDark ? '#9ca3af' : '#6b7280'
                  } : {}}
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
            <div className="rounded-lg p-5 sm:p-6 w-full max-w-sm" style={{ backgroundColor: 'var(--card-bg)' }}>
              <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Confirm Save</h3>
              <p className="mb-5 text-sm" style={{ color: 'var(--text-secondary)' }}>
                Are you sure you want to save these changes?
              </p>
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3">
                <button
                  onClick={() => {
                    setIsConfirmModalOpen(false);
                    setIsModalOpen(true);
                  }}
                  className="w-full sm:w-auto px-4 py-2 rounded-lg font-medium transition-colors"
                  style={{ 
                    backgroundColor: isDark ? '#4a4a4a' : '#e5e7eb',
                    color: 'var(--text-primary)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = isDark ? '#5a5a5a' : '#d1d5db';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = isDark ? '#4a4a4a' : '#e5e7eb';
                  }}
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

        {/* View Profile Modal */}
        {viewProfileModal && (
          <ViewProfileModal
            user={viewProfileModal}
            onClose={() => setViewProfileModal(null)}
            isDark={isDark}
          />
        )}
      </div>
    </div>
    </>
  );
}

function ViewProfileModal({ user, onClose, isDark }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4 animate-fadeIn" onClick={onClose}>
      <div 
        className="rounded-lg shadow-xl w-full max-w-sm overflow-hidden animate-slideUp" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Purple Gradient Header */}
        <div className="relative bg-gradient-to-br from-[#8B5CF6] via-[#7C3AED] to-[#6D28D9] p-5 text-white">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>

          {/* Profile Icon and Title */}
          <div className="flex items-center gap-2 mb-5">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            <h3 className="text-xl font-bold">Agents Profile</h3>
          </div>

          {/* Profile Picture */}
          <div className="flex justify-center mb-4">
            <div className="relative">
              <img
                src={user.profile_picture || "profile_picture/DefaultProfile.jpg"}
                alt="Profile"
                className="w-28 h-28 rounded-full object-cover ring-4 ring-white/30"
              />
              {/* Online Status Indicator */}
              <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white"></div>
            </div>
          </div>

          {/* Email/Username */}
          <h4 className="text-xl font-bold text-center mb-4">
            {user.email.split('@')[0]}
          </h4>

          {/* Three Dots Menu */}
          <div className="flex justify-center gap-1.5">
            <div className="w-2 h-2 bg-white/40 rounded-full"></div>
            <div className="w-2 h-2 bg-white/40 rounded-full"></div>
            <div className="w-2 h-2 bg-white/40 rounded-full"></div>
          </div>
        </div>

        {/* Dark Content Section */}
        <div className="p-5 bg-[#2b2d31]">
          <div className="space-y-4">
            <div>
              <p className="text-[10px] font-semibold mb-1.5 uppercase tracking-wider text-gray-400">Email Address</p>
              <p className="text-sm font-medium text-white">{user.email}</p>
            </div>
            
            <div>
              <p className="text-[10px] font-semibold mb-1.5 uppercase tracking-wider text-gray-400">Role</p>
              <p className="text-sm font-medium text-white">
                {user.departments ? 'Agent' : 'Administrator'}
              </p>
            </div>

            {user.departments && user.departments.length > 0 && (
              <div>
                <p className="text-[10px] font-semibold mb-1.5 uppercase tracking-wider text-gray-400">Departments</p>
                <div className="flex flex-wrap gap-1.5">
                  {user.departments.map((dept, idx) => (
                    <span 
                      key={idx}
                      className="px-2 py-1 rounded-full text-xs font-medium bg-[#8B5CF6] text-white"
                    >
                      {dept}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <p className="text-[10px] font-semibold mb-1.5 uppercase tracking-wider text-gray-400">Status</p>
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${user.active ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                <p className="text-sm font-medium text-white">
                  {user.active ? 'Active' : 'Inactive'}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full mt-5 px-4 py-2.5 bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-white text-sm font-semibold rounded-lg hover:from-[#7C3AED] hover:to-[#6D28D9] transition-all shadow-lg"
          >
            Close
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
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
  isDark,
}) {
  return (
    <div className="flex items-center px-2.5 py-1.5 rounded-lg w-full relative" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
      <Search size={16} className="mr-2 flex-shrink-0" style={{ color: 'var(--text-secondary)' }} />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent focus:outline-none text-xs w-full pr-16"
        style={{ color: 'var(--text-primary)' }}
      />
      {value && (
        <X
          size={14}
          className="cursor-pointer hover:text-gray-700 transition-colors absolute right-9"
          style={{ color: 'var(--text-secondary)' }}
          onClick={() => onChange("")}
        />
      )}
      <button
        onClick={onFilterClick}
        className={`absolute right-3 p-1 rounded transition-colors ${
          filterDropdownOpen || selectedFilters.length > 0
            ? "text-[#6237A0] bg-purple-50"
            : "hover:bg-gray-200"
        }`}
        style={!(filterDropdownOpen || selectedFilters.length > 0) ? { color: 'var(--text-secondary)' } : {}}
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
