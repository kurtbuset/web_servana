import { useState } from "react";
import Layout from "../../components/Layout";
import ScreenContainer from "../../components/ScreenContainer";
import SearchBar from "../../components/SearchBar";
import { useUserRoles } from "../../hooks/useRoles";
import { useUser } from "../../context/UserContext";
import { useTheme } from "../../context/ThemeContext";
import { PERMISSIONS } from "../../constants/permissions";
import toast from "../../utils/toast";
import UserRolesTable from "./components/UserRolesTable";
import "../../App.css";

export default function ChangeRolesScreen() {
  const [searchQuery, setSearchQuery] = useState("");

  // Get user permissions
  const { hasPermission } = useUser();
  const { isDark } = useTheme();
  const canAssignRoles = hasPermission(PERMISSIONS.ASSIGN_ROLE);

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

  return (
    <Layout>
      <ScreenContainer>
        <div className="p-3 sm:p-4 flex flex-col h-full">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <h1 className="text-lg sm:text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Change Roles</h1>
            
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
          <div className="flex-1 overflow-hidden">
            <UserRolesTable
              users={filteredUsers}
              availableRoles={availableRoles}
              loading={loading}
              searchQuery={searchQuery}
              canAssignRoles={canAssignRoles}
              isDark={isDark}
              onToggleActive={handleToggleActive}
              onChangeRole={handleChangeRole}
            />
          </div>
        </div>
      </ScreenContainer>
    </Layout>
  );
}
