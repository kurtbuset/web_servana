import React, { useState } from "react";
import Layout from "../../components/Layout";
import LoadingSpinner from "../../components/LoadingSpinner";
import { Search, X } from "react-feather";
import { useUserRoles } from "../../hooks/useRoles";
import { useUser } from "../../context/UserContext";
import { useTheme } from "../../context/ThemeContext";
import { toast } from "react-toastify";
import "../../App.css";

export default function ChangeRolesScreen() {
  const [searchQuery, setSearchQuery] = useState("");

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
      <Layout>
        <div className="flex flex-col h-full overflow-hidden" style={{ backgroundColor: 'var(--bg-secondary)' }}>
          <div className="flex flex-col h-full gap-0 p-0 md:p-3 flex-1">
            <div className="h-full flex flex-col md:rounded-xl shadow-sm border-0 md:border overflow-hidden" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
              <div className="p-3 sm:p-4">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <h1 className="text-lg sm:text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Change Roles</h1>
              
              {/* Search Bar */}
              <div className="flex items-center px-2.5 py-1.5 rounded-lg w-full sm:w-56 md:w-64" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                <Search size={16} className="mr-2 flex-shrink-0" style={{ color: 'var(--text-secondary)' }} />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent focus:outline-none text-xs w-full pr-6"
                  style={{ color: 'var(--text-primary)' }}
                />
                {searchQuery && (
                  <X
                    size={14}
                    className="cursor-pointer transition-colors"
                    style={{ color: 'var(--text-secondary)' }}
                    onClick={() => setSearchQuery("")}
                  />
                )}
              </div>
            </div>

            {/* Table Container */}
            <div className="flex-1 overflow-hidden">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-3 border-t-[#6237A0]" style={{ borderColor: 'var(--border-color)', borderTopColor: '#6237A0' }}></div>
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Loading users...</span>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto overflow-y-auto h-full custom-scrollbar">
                  <table className="w-full text-xs">
                    <thead className="sticky top-0 z-10" style={{ color: 'var(--text-secondary)', backgroundColor: isDark ? '#2a2a2a' : '#f9fafb', borderBottom: `1px solid var(--border-color)` }}>
                      <tr>
                        <th className="py-2 px-2.5 sm:px-3 text-left font-semibold text-xs">Email</th>
                        <th className="py-2 px-2.5 sm:px-3 text-center font-semibold w-28 sm:w-32 text-xs">Status</th>
                        <th className="py-2 px-2.5 sm:px-3 text-center font-semibold w-36 sm:w-40 text-xs">Role</th>
                      </tr>
                    </thead>
                    <tbody style={{ borderColor: 'var(--border-color)' }}>
                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="text-center py-12">
                            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                              {searchQuery ? "No users found matching your search" : "No users available"}
                            </p>
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map((user) => (
                        <tr
                          key={user.sys_user_id}
                          className="transition-colors"
                          style={{ borderTop: `1px solid ${isDark ? 'rgba(74, 74, 74, 0.3)' : 'var(--border-color)'}` }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = isDark ? 'rgba(139, 92, 246, 0.05)' : 'rgba(249, 250, 251, 1)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          <td className="py-2 px-2.5 sm:px-3">
                            <div className="flex items-center gap-2">
                              <img
                                src={user.profile_picture || "profile_picture/DefaultProfile.jpg"}
                                alt={user.sys_user_email}
                                className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm flex-shrink-0"
                              />
                              <span className="text-xs break-words" style={{ color: 'var(--text-primary)' }}>
                                {user.sys_user_email}
                              </span>
                            </div>
                          </td>

                          <td className="py-2 px-2.5 sm:px-3 text-center">
                            <label className={`inline-flex relative items-center ${
                              canAssignRoles ? "cursor-pointer" : "cursor-not-allowed"
                            }`}>
                              <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={user.sys_user_is_active || false}
                                onChange={() => handleToggleActive(user)}
                                disabled={!canAssignRoles}
                                title={!canAssignRoles ? "You don't have permission to modify user status" : ""}
                              />
                              <div className={`w-11 h-6 rounded-full peer transition-colors relative after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-transform peer-checked:after:translate-x-5 ${
                                canAssignRoles
                                  ? "bg-gray-300 peer-checked:bg-[#6237A0]"
                                  : "bg-gray-200 peer-checked:bg-gray-400"
                              }`} />
                            </label>
                          </td>

                          <td className="py-2 px-2.5 sm:px-3 text-center">
                            <select
                              value={user.role_id ?? ""}
                              onChange={(e) =>
                                handleChangeRole(
                                  user,
                                  e.target.value ? parseInt(e.target.value) : null
                                )
                              }
                              disabled={!canAssignRoles}
                              className={`rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-[#6237A0]/30 ${
                                canAssignRoles
                                  ? "cursor-pointer hover:border-[#6237A0]"
                                  : "cursor-not-allowed"
                              }`}
                              style={{
                                backgroundColor: canAssignRoles ? 'var(--input-bg)' : (isDark ? '#2a2a2a' : '#f3f4f6'),
                                color: canAssignRoles ? 'var(--text-primary)' : 'var(--text-secondary)',
                                border: `1px solid var(--border-color)`
                              }}
                              title={!canAssignRoles ? "You don't have permission to change user roles" : ""}
                            >
                              {availableRoles.map((role) => (
                                <option
                                  key={role.role_id}
                                  value={role.role_id}
                                  disabled={
                                    !role.role_is_active &&
                                    role.role_id !== user.role_id
                                  }
                                  className={
                                    !role.role_is_active ? "text-red-400" : ""
                                  }
                                >
                                  {role.role_name}
                                  {!role.role_is_active && " (Inactive)"}
                                </option>
                              ))}
                            </select>
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
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
