import React, { useState } from "react";
import TopNavbar from "../../../src/components/TopNavbar";
import Sidebar from "../../../src/components/Sidebar";
import LoadingSpinner from "../../components/LoadingSpinner";
import { Search, X } from "react-feather";
import { useUserRoles } from "../../hooks/useRoles";
import { useUser } from "../../context/UserContext";
import { toast } from "react-toastify";
import "../../App.css";

export default function ChangeRolesScreen() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Get user permissions
  const { hasPermission } = useUser();
  const canAssignRoles = hasPermission("priv_can_assign_role");

  const { users, availableRoles, loading, changeUserRole, toggleUserActive } = useUserRoles();

  const toggleSidebar = () => setMobileSidebarOpen((prev) => !prev);

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
              <h1 className="text-lg sm:text-xl font-bold text-gray-800">Change Roles</h1>
              
              {/* Search Bar */}
              <div className="flex items-center bg-gray-100 px-2.5 py-1.5 rounded-lg w-full sm:w-56 md:w-64">
                <Search size={16} className="text-gray-500 mr-2 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent focus:outline-none text-xs w-full pr-6"
                />
                {searchQuery && (
                  <X
                    size={14}
                    className="text-gray-500 cursor-pointer hover:text-gray-700 transition-colors"
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
                    <div className="animate-spin rounded-full h-8 w-8 border-3 border-gray-200 border-t-[#6237A0]"></div>
                    <span className="text-gray-600 text-sm">Loading users...</span>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto overflow-y-auto h-full custom-scrollbar">
                  <table className="w-full text-xs">
                    <thead className="text-gray-600 bg-gray-50 sticky top-0 z-10 border-b border-gray-200">
                      <tr>
                        <th className="py-2 px-2.5 sm:px-3 text-left font-semibold text-xs">Email</th>
                        <th className="py-2 px-2.5 sm:px-3 text-center font-semibold w-28 sm:w-32 text-xs">Status</th>
                        <th className="py-2 px-2.5 sm:px-3 text-center font-semibold w-36 sm:w-40 text-xs">Role</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="text-center py-12">
                            <p className="text-gray-500 text-sm">
                              {searchQuery ? "No users found matching your search" : "No users available"}
                            </p>
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map((user) => (
                        <tr
                          key={user.sys_user_id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="py-2 px-2.5 sm:px-3">
                            <span className="text-xs text-gray-800 break-words">
                              {user.sys_user_email}
                            </span>
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
                              className={`rounded-lg px-2 py-1 text-xs border border-gray-200 ${
                                canAssignRoles
                                  ? "text-gray-800 cursor-pointer hover:border-[#6237A0] focus:outline-none focus:ring-2 focus:ring-[#6237A0]/30"
                                  : "text-gray-400 cursor-not-allowed bg-gray-100"
                              }`}
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
        </main>
      </div>
    </div>
    </>
  );
}
