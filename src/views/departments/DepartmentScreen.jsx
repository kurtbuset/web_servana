import { useState } from "react";
import Layout from "../../components/Layout";
import ScreenContainer from "../../components/ScreenContainer";
import SearchBar from "../../components/SearchBar";
import { useDepartments } from "../../hooks/useDepartments";
import { useUser } from "../../context/UserContext";
import { useTheme } from "../../context/ThemeContext";
import DepartmentsTable from "./components/DepartmentsTable";
import DepartmentModal from "./components/DepartmentModal";
import { PERMISSIONS } from "../../constants/permissions";
import "../../App.css";

/**
 * DepartmentScreen - Department management interface
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Get user permissions
  const { hasPermission } = useUser();
  const { isDark } = useTheme();
  const canEditDepartment = hasPermission(PERMISSIONS.MANAGE_DEPT);

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

  const handleEdit = (dept) => {
    if (!canEditDepartment) {
      console.warn("User does not have permission to edit departments");
      return;
    }
    setCurrentEditId(dept.dept_id);
    setEditText(dept.dept_name);
    setIsModalOpen(true);
  };

  const handleOpenAddModal = () => {
    if (!canEditDepartment) {
      console.warn("User does not have permission to edit departments");
      return;
    }
    setEditText("");
    setCurrentEditId(null);
    setIsModalOpen(true);
  };

  return (
    <Layout>
      <ScreenContainer>
        <div className="p-3 sm:p-4 flex flex-col h-full">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <h1 className="text-lg sm:text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Departments</h1>
            
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
              {/* Search Bar */}
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search departments..."
                isDark={isDark}
                className="flex-1 sm:flex-initial sm:w-56 md:w-64"
              />
              {/* Add Button */}
              <button
                onClick={handleOpenAddModal}
                disabled={!canEditDepartment}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                  canEditDepartment
                    ? "bg-[#6237A0] text-white hover:bg-[#552C8C]"
                    : "cursor-not-allowed"
                }`}
                style={!canEditDepartment ? {
                  backgroundColor: isDark ? '#4a4a4a' : '#d1d5db',
                  color: isDark ? '#9ca3af' : '#6b7280'
                } : {}}
                title={!canEditDepartment ? "You don't have permission to edit departments" : ""}
              >
                + Add Department
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="flex-1 overflow-hidden">
            <DepartmentsTable
              departments={filteredDepartments}
              loading={loading}
              error={error}
              searchQuery={searchQuery}
              canEditDepartment={canEditDepartment}
              isDark={isDark}
              onEdit={handleEdit}
              onToggleStatus={handleToggle}
            />
          </div>

          {/* Modal for Add/Edit */}
          <DepartmentModal
            isOpen={isModalOpen}
            isEdit={currentEditId !== null}
            departmentName={editText}
            canEditDepartment={canEditDepartment}
            isDark={isDark}
            onNameChange={setEditText}
            onSave={handleSave}
            onClose={() => {
              setIsModalOpen(false);
              setEditText("");
              setCurrentEditId(null);
            }}
          />
        </div>
      </ScreenContainer>
    </Layout>
  );
}
