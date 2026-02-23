import { useState } from "react";
import Layout from "../../components/Layout";
import ScreenContainer from "../../components/ScreenContainer";
import SearchBar from "../../components/SearchBar";
import { 
  Tooltip,
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../components/ui";
import { usePagination } from "../../hooks/usePagination";
import { useDepartments } from "../../hooks/useDepartments";
import { useUser } from "../../context/UserContext";
import { useTheme } from "../../context/ThemeContext";
import DepartmentsTable from "./components/DepartmentsTable";
import DepartmentModal from "./components/DepartmentModal";
import { HelpCircle } from "react-feather";
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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState('default');

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

  // Sort filtered departments
  const sortedDepartments = [...filteredDepartments].sort((a, b) => {
    switch (sortBy) {
      case 'alphabetical':
        return a.dept_name.toLowerCase().localeCompare(b.dept_name.toLowerCase());
      case 'reverse':
        return b.dept_name.toLowerCase().localeCompare(a.dept_name.toLowerCase());
      case 'default':
      default:
        return b.dept_id - a.dept_id; // Newest first
    }
  });

  // Pagination
  const {
    totalPages,
    paginationRange,
    hasNextPage,
    hasPreviousPage,
    startIndex,
    endIndex
  } = usePagination({
    totalItems: sortedDepartments.length,
    itemsPerPage,
    currentPage,
    siblingCount: 1
  });

  // Get current page departments
  const paginatedDepartments = sortedDepartments.slice(startIndex, endIndex);

  // Reset to page 1 when search query, sort, or items per page changes
  const handleSearchChange = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    setCurrentPage(1);
  };

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
            <div className="relative flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold relative inline-block" style={{ color: 'var(--text-primary)' }}>
                Departments
                <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-[#6237A0] via-[#8B5CF6] to-transparent rounded-full"></div>
              </h1>
              <Tooltip 
                content="Create, edit, activate or deactivate departments to structure your organization. Organize your teams and control access across different areas."
                position="bottom"
                isDark={isDark}
              >
                <div className="flex items-center justify-center w-5 h-5 rounded-full transition-all duration-200 hover:bg-purple-100 dark:hover:bg-purple-900/20 cursor-help">
                  <HelpCircle 
                    size={16} 
                    className="transition-colors" 
                    style={{ color: '#8B5CF6' }}
                  />
                </div>
              </Tooltip>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
              {/* Search Bar */}
              <SearchBar
                value={searchQuery}
                onChange={handleSearchChange}
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
          <div className="flex-1 overflow-hidden flex flex-col">
            <DepartmentsTable
              departments={paginatedDepartments}
              loading={loading}
              error={error}
              searchQuery={searchQuery}
              sortBy={sortBy}
              onSortChange={handleSortChange}
              canEditDepartment={canEditDepartment}
              isDark={isDark}
              onEdit={handleEdit}
              onToggleStatus={handleToggle}
            />

            {/* Pagination Controls */}
            {!loading && !error && sortedDepartments.length > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 border-t" style={{ borderColor: 'var(--border-color)' }}>
                {/* Items per page selector */}
                <div className="flex items-center gap-2">
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    Show
                  </span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => handleItemsPerPageChange(e.target.value)}
                    className="px-2 py-1 text-xs rounded border focus:outline-none focus:ring-2 focus:ring-[#6237A0]/30"
                    style={{
                      backgroundColor: 'var(--input-bg)',
                      color: 'var(--text-primary)',
                      borderColor: 'var(--border-color)'
                    }}
                  >
                    <option value="10">10</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    per page
                  </span>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => setCurrentPage(currentPage - 1)}
                          disabled={!hasPreviousPage}
                          isDark={isDark}
                        />
                      </PaginationItem>

                      {paginationRange?.map((pageNumber, index) => {
                        if (pageNumber === 'DOTS') {
                          return (
                            <PaginationItem key={`dots-${index}`}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          );
                        }

                        return (
                          <PaginationItem key={pageNumber}>
                            <PaginationLink
                              onClick={() => setCurrentPage(pageNumber)}
                              isActive={currentPage === pageNumber}
                              isDark={isDark}
                            >
                              {pageNumber}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      })}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() => setCurrentPage(currentPage + 1)}
                          disabled={!hasNextPage}
                          isDark={isDark}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}

                {/* Page info */}
                <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  Showing {startIndex + 1} to {endIndex} of {sortedDepartments.length}
                </div>
              </div>
            )}
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
