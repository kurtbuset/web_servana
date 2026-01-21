import React, { useState, useEffect } from "react";
import TopNavbar from "../components/TopNavbar";
import Sidebar from "../components/Sidebar";
import { Search, X } from "react-feather";
import api from "../src/api";
import "../src/App.css";

export default function ChangeRoles() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const toggleSidebar = () => setMobileSidebarOpen((prev) => !prev);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsersAndRoles();
  }, []);

  const fetchUsersAndRoles = async () => {
    setLoading(true);
    setError("");
    try {
      // Fetch users and roles in parallel
      const [usersResponse, rolesResponse] = await Promise.all([
        api.get("change-role"),
        api.get("change-role/roles"),
      ]);

      setUsers(usersResponse.data);
      setRoles(rolesResponse.data);
    } catch (err) {
      console.error("Failed to fetch Accounts", err);
      setError("Failed to fetch Accounts.");
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (userId, updatedFields) => {
    try {
      await api.put(`change-role/${userId}`, updatedFields);
      // Update local state to avoid full refresh
      setUsers(
        users.map((user) =>
          user.sys_user_id === userId ? { ...user, ...updatedFields } : user
        )
      );
    } catch (err) {
      console.error("Failed to update user", err);
    }
  };

  const handleToggleActive = (user) => {
    updateUser(user.sys_user_id, {
      sys_user_is_active: !user.sys_user_is_active,
    });
  };

  const handleChangeRole = (user, newRoleId) => {
    updateUser(user.sys_user_id, {
      role_id: parseInt(newRoleId),
    });
  };

  const filteredUsers = users.filter((user) =>
    user.sys_user_email.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

        <main className="flex-1 bg-gray-100 p-15 overflow-hidden transition-colors duration-300 flex flex-col">
          <div className="bg-white p-4 rounded-lg flex flex-col flex-1 min-h-0">
            {/* Search */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center bg-gray-100 px-3 py-2 rounded-md w-1/3 relative">
                <Search
                  size={18}
                  className="text-gray-500 mr-2 flex-shrink-0"
                />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent focus:outline-none text-sm w-full pr-6"
                />
                {searchQuery && (
                  <X
                    size={16}
                    className="text-gray-500 cursor-pointer absolute right-3 hover:text-gray-700"
                    onClick={() => setSearchQuery("")}
                  />
                )}
              </div>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-y-auto min-h-0 custom-scrollbar">
              <table className="w-full text-sm text-left">
                <thead className="text-gray-500 bg-white sticky top-0 z-10 shadow-[inset_0_-1px_0_0_#000000]">
                  <tr>
                    <th className="py-2 px-3 pl-3">Username</th>
                    <th className="py-2 px-3 text-center">Active Status</th>
                    <th className="py-2 px-3 text-center">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.sys_user_id}
                      className="transition-colors duration-200 hover:bg-gray-50"
                    >
                      <td className="py-2 px-3">{user.sys_user_email}</td>
                      <td className="py-2 px-3 text-center">
                        <label className="inline-flex relative items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={user.sys_user_is_active || false}
                            onChange={() => handleToggleActive(user)}
                          />
                          <div className="w-7 h-4 bg-gray-200 rounded-full peer peer-checked:bg-[#6237A0] transition-colors duration-300 relative after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-transform after:duration-300 peer-checked:after:translate-x-3" />
                        </label>
                      </td>
                      <td className="py-2 px-3 text-center">
<select
  value={user.role_id ?? ""}
  onChange={(e) =>
    handleChangeRole(user, e.target.value ? parseInt(e.target.value) : null)
  }
  className="rounded-md px-2 py-1 text-sm text-gray-800 border-none text-center"
>
  {roles.map((role) => (
    <option
      key={role.role_id}
      value={role.role_id}
      disabled={
        !role.role_is_active && role.role_id !== user.role_id
      }
      className={!role.role_is_active ? "text-red-400" : ""}
    >
      {role.role_name}
      {!role.role_is_active && " (Inactive)"}
    </option>
  ))}
</select>

                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {loading && (
                <p className="pt-15 text-center text-gray-600 py-4">
                  Loading...
                </p>
              )}
              {error && (
                <p className="pt-15 text-center text-red-600 mb-2 font-semibold">
                  {error}
                </p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
