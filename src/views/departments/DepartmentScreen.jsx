import { useState } from "react";
import Layout from "../../components/Layout";
import LoadingSpinner from "../../components/LoadingSpinner";
import { Edit3, Search, X } from "react-feather";
import { useDepartments } from "../../hooks/useDepartments";
import { useUser } from "../../context/UserContext";
import { useTheme } from "../../context/ThemeContext";
import "../../../src/App.css";

/**
 * DepartmentScreen - Refactored department management interface
 * 
 * Uses the new useDepartments hook for business logic while maintaining
 * the exact same UI/UX as the original Department screen.
 * 
 * Features:
 * - View all departments
 * - Search departments
 * - Add new department
 * - Edit department name
 * - Toggle department active status
 * - Duplicate detection
 * - Responsive design
 */
export default function DepartmentScreen() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Get user permissions
  const { hasPermission } = useUser();
  const { isDark } = useTheme();
  const canEditDepartment = hasPermission("priv_can_manage_dept");

  // Get department state and actions from hook
  const {
    departments,
    loading,
    error,
    createDepartment,
    updateDepartment,
    toggleDepartment,
  } = useDepartments();

  const filteredDepartments = departments.filter((dept) =>
    dept.dept_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSave = async () => {
    if (!canEditDepartment) {
      console.warn("User does not have permission to edit departments");
      return;
    }

    try {
      if (currentEditId) {
        await updateDepartment(currentEditId, editText);
      } else {
        await createDepartment(editText);
      }

      setIsModalOpen(false);
      setEditText("");
      setCurrentEditId(null);
    } catch (error) {
      // Error already handled by hook with toast
      console.error("Failed to save department:", error);
    }
  };

  const handleToggle = async (deptId, currentStatus) => {
    if (!canEditDepartment) {
      console.warn("User does not have permission to edit departments");
      return;
    }

    try {
      await toggleDepartment(deptId, currentStatus);
    } catch (error) {
      // Error already handled by hook with toast
      console.error("Failed to toggle status:", error);
    }
  };

  return (
    <Layout>
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
      <div className="flex flex-col h-full overflow-hidden" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 p-2 sm:p-3 md:p-4 overflow-hidden">
            <div className="p-3 sm:p-4 rounded-lg shadow-sm h-full flex flex-col" style={{ backgroundColor: 'var(--card-bg)' }}>
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <h1 className="text-lg sm:text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Departments</h1>
              
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                {/* Search Bar */}
                <div className="flex items-center px-2.5 py-1.5 rounded-lg flex-1 sm:flex-initial sm:w-56 md:w-64" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                  <Search
                    size={16}
                    className="mr-2 flex-shrink-0"
                    style={{ color: 'var(--text-secondary)' }}
                  />
                  <input
                    type="text"
                    placeholder="Search departments..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent focus:outline-none text-xs w-full pr-6"
                    style={{ color: 'var(--text-primary)' }}
                  />
                  {searchQuery && (
                    <X
                      size={14}
                      className="cursor-pointer hover:text-gray-700 transition-colors"
                      style={{ color: 'var(--text-secondary)' }}
                      onClick={() => setSearchQuery("")}
                    />
                  )}
                </div>

                {/* Add Button */}
                <button
                  onClick={() => {
                    if (!canEditDepartment) {
                      console.warn("User does not have permission to edit departments");
                      return;
                    }
                    setEditText("");
                    setCurrentEditId(null);
                    setIsModalOpen(true);
                  }}
                  disabled={!canEditDepartment}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                    canEditDepartment
                      ? "bg-[#6237A0] text-white hover:bg-[#552C8C]"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                  title={!canEditDepartment ? "You don't have permission to edit departments" : ""}
                >
                  + Add Department
                </button>
              </div>
            </div>

            {/* Table Container */}
            <div className="flex-1 overflow-hidden">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-3 border-t-[#6237A0]" style={{ borderColor: 'var(--border-color)', borderTopColor: '#6237A0' }}></div>
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Loading departments...</span>
                  </div>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-red-600 text-sm font-semibold">{error}</p>
                </div>
              ) : (
                <div className="overflow-x-auto overflow-y-auto h-full custom-scrollbar">
                  <table className="w-full text-xs">
                    <thead className="sticky top-0 z-10 border-b" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)', borderColor: 'var(--border-color)' }}>
                      <tr>
                        <th className="py-2 px-2.5 sm:px-3 text-left font-semibold text-xs">Department Name</th>
                        <th className="py-2 px-2.5 sm:px-3 text-center font-semibold w-28 sm:w-32 text-xs">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y" style={{ borderColor: isDark ? 'rgba(74, 74, 74, 0.3)' : 'var(--border-color)' }}>
                      {filteredDepartments.length === 0 ? (
                        <tr>
                          <td colSpan={2} className="text-center py-12">
                            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                              {searchQuery ? "No departments found matching your search" : "No departments available"}
                            </p>
                          </td>
                        </tr>
                      ) : (
                        filteredDepartments.map((dept) => (
                          <tr
                            key={dept.dept_id}
                            className="transition-colors"
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = isDark ? 'rgba(139, 92, 246, 0.05)' : 'rgba(249, 250, 251, 1)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                          >
                            <td className="py-2 px-2.5 sm:px-3">
                              <div className="flex items-center gap-1.5 sm:gap-2">
                                <p className="text-xs break-words flex-1" style={{ color: 'var(--text-primary)' }}>
                                  {dept.dept_name}
                                </p>
                                <button
                                  onClick={() => {
                                    if (!canEditDepartment) {
                                      console.warn("User does not have permission to edit departments");
                                      return;
                                    }
                                    setCurrentEditId(dept.dept_id);
                                    setEditText(dept.dept_name);
                                    setIsModalOpen(true);
                                  }}
                                  disabled={!canEditDepartment}
                                  className={`flex-shrink-0 p-1 rounded transition-colors ${
                                    canEditDepartment
                                      ? "hover:text-[#6237A0] hover:bg-purple-50"
                                      : "cursor-not-allowed"
                                  }`}
                                  style={canEditDepartment ? { color: 'var(--text-secondary)' } : { color: isDark ? '#4a4a4a' : '#d1d5db' }}
                                  title={!canEditDepartment ? "You don't have permission to edit departments" : "Edit"}
                                >
                                  <Edit3 size={14} />
                                </button>
                              </div>
                            </td>

                            <td className="py-2 px-2.5 sm:px-3 text-center">
                              <label className={`inline-flex relative items-center ${
                                canEditDepartment ? "cursor-pointer" : "cursor-not-allowed"
                              }`}>
                                <input
                                  type="checkbox"
                                  className="sr-only peer"
                                  checked={dept.dept_is_active}
                                  onChange={() =>
                                    handleToggle(dept.dept_id, dept.dept_is_active)
                                  }
                                  disabled={!canEditDepartment}
                                  title={!canEditDepartment ? "You don't have permission to edit departments" : ""}
                                />
                                <div className={`w-11 h-6 rounded-full peer transition-colors relative after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-transform peer-checked:after:translate-x-5 ${
                                  canEditDepartment
                                    ? "bg-gray-300 peer-checked:bg-[#6237A0]"
                                    : "bg-gray-200 peer-checked:bg-gray-400"
                                }`} />
                              </label>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Modal for Add/Edit */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
              <div className="rounded-lg shadow-xl p-5 sm:p-6 w-full max-w-md" style={{ backgroundColor: 'var(--card-bg)' }}>
                <h2 className="text-lg sm:text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                  {currentEditId ? "Edit Department" : "Add Department"}
                </h2>
                <label className="text-sm mb-2 block font-medium" style={{ color: 'var(--text-primary)' }}>
                  Department Name
                </label>
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  placeholder="Enter department name"
                  className="w-full border rounded-lg p-2.5 sm:p-3 text-sm mb-5 focus:ring-2 focus:ring-[#6237A0] focus:border-transparent outline-none"
                  style={{ 
                    backgroundColor: 'var(--input-bg)', 
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)'
                  }}
                  autoFocus
                />

                <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="w-full sm:w-auto px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    style={{ 
                      backgroundColor: 'var(--bg-tertiary)', 
                      color: 'var(--text-primary)'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={!canEditDepartment || !editText.trim()}
                    className={`w-full sm:w-auto px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      canEditDepartment && editText.trim()
                        ? "bg-[#6237A0] text-white hover:bg-[#552C8C]"
                        : "cursor-not-allowed"
                    }`}
                    style={!canEditDepartment || !editText.trim() ? {
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
          </div>
        </div>
      </div>
    </Layout>
  );
}
