import { useState, useEffect } from "react";
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
import { useUserRoles } from "../../hooks/useRoles";
import { useUser } from "../../context/UserContext";
import { useTheme } from "../../context/ThemeContext";
import { usePagination } from "../../hooks/usePagination";
import toast from "../../utils/toast";
import UserRolesTable from "./components/UserRolesTable";
import { HelpCircle } from "react-feather";
import "../../App.css";

export default function ChangeRolesScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState('default');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Get user permissions
  const { hasPermission } = useUser();
  const { isDark } = useTheme();
  const canAssignRoles = hasPermission("priv_can_assign_role");

  const { users, availableRoles, loading, changeUserRole, toggleUserActive } = useUserRoles();

  const handleToggleActive = (user) => {
    if (!canAssignRoles) {
      console.warn("User does not have permission to assign roles");
      toast.error("You don't have permission to modify user status");
      return;
    }
    toggleUserActive(user.sys_user_id, user.sys_user_is_active);
  };

  const handleChangeRole = (user, newRoleId) => {
    if (!canAssignRoles) {
      console.warn("User does not have permission to assign roles");
      toast.error("You don't have permission to change user roles");
      return;
    }
    changeUserRole(user.sys_user_id, parseInt(newRoleId));
  };

  const filteredUsers = users.filter((user) =>
    user.sys_user_email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort filtered users
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    switch (sortBy) {
      case 'alphabetical':
        return a.sys_user_email.toLowerCase().localeCompare(b.sys_user_email.toLowerCase());
      case 'reverse':
        return b.sys_user_email.toLowerCase().localeCompare(a.sys_user_email.toLowerCase());
      case 'default':
      default:
        return b.sys_user_id - a.sys_user_id; // Newest first
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
    totalItems: sortedUsers.length,
    itemsPerPage,
    currentPage,
    siblingCount: 1
  });

  // Get current page users
  const paginatedUsers = sortedUsers.slice(startIndex, endIndex);

  // Reset to page 1 when search query, sort, or items per page changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortBy, itemsPerPage]);

  return (
    <Layout>
      <ScreenContainer>
        <div className="p-3 sm:p-4 flex flex-col h-full">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="relative flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold relative inline-block" style={{ color: 'var(--text-primary)' }}>
                Change Roles
                <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-[#6237A0] via-[#8B5CF6] to-transparent rounded-full"></div>
              </h1>
              <Tooltip 
                content="Assign and manage user roles. Change user roles to control their permissions and access levels. Activate or deactivate user accounts as needed."
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
            
            {/* Search Bar */}
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search users..."
              isDark={isDark}
              className="w-full sm:w-56 md:w-64"
            />
          </div>

          {/* Table Container */}
          <div className="flex-1 overflow-hidden flex flex-col">
            <UserRolesTable
              users={paginatedUsers}
              availableRoles={availableRoles}
              loading={loading}
              searchQuery={searchQuery}
              sortBy={sortBy}
              onSortChange={setSortBy}
              canAssignRoles={canAssignRoles}
              isDark={isDark}
              onToggleActive={handleToggleActive}
              onChangeRole={handleChangeRole}
            />

            {/* Pagination Controls */}
            {!loading && sortedUsers.length > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 border-t" style={{ borderColor: 'var(--border-color)' }}>
                {/* Items per page selector */}
                <div className="flex items-center gap-2">
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    Show
                  </span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
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
                  Showing {startIndex + 1} to {endIndex} of {sortedUsers.length}
                </div>
              </div>
            )}
          </div>
        </div>
      </ScreenContainer>
    </Layout>
  );
}
