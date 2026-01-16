import React, { useState } from "react";
import { Edit3, Search, X } from "react-feather";
import TopNavbar from "../../../components/TopNavbar";
import Sidebar from "../../../components/Sidebar";
import { useUser } from "../../../context/UserContext";
import { useRoles } from "../../hooks/useRoles";
import "../../App.css";

const PERMISSIONS = [
  "Can view Chats",
  "Can Reply",
  "Can Manage Profile",
  "Can send Macros",
  "Can End Chat",
  "Can Transfer Department",
  "Can Edit Department",
  "Can Assign Department",
  "Can Edit Roles",
  "Can Assign Roles",
  "Can Add Admin Accounts",
  "Can Edit Auto-Replies",
];

export default function RolesScreen() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEditIndex, setCurrentEditIndex] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", permissions: [] });

  const { userData, hasPermission } = useUser();
  const { roles, loading, createRole, updateRole, toggleRoleActive, togglePermission } = useRoles();

  const canManageRoles = hasPermission("priv_can_manage_role");

  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSidebar = () => setMobileSidebarOpen((prev) => !prev);

  const handleOpenEditModal = (index = null) => {
    setCurrentEditIndex(index);
    setEditForm({
      name: index !== null ? roles[index].name : "",
      permissions: index !== null ? roles[index].permissions : [],
    });
    setIsModalOpen(true);
  };

  const handleSaveRole = async () => {
    if (!canManageRoles) {
      return;
    }

    if (!editForm.name.trim()) {
      return;
    }

    const userId = userData?.sys_user_id;
    if (!userId) {
      return;
    }

    const roleData = {
      name: editForm.name,
      permissions: editForm.permissions || [],
      created_by: userId,
      updated_by: userId,
    };

    let success;
    if (currentEditIndex !== null) {
      const roleId = roles[currentEditIndex].role_id;
      success = await updateRole(roleId, {
        ...roleData,
        active: roles[currentEditIndex].active,
      });
    } else {
      success = await createRole(roleData);
    }

    if (success) {
      setIsModalOpen(false);
    }
  };

  const handleToggleActive = async (index) => {
    if (!canManageRoles) {
      return;
    }

    const role = roles[index];
    const userId = userData?.sys_user_id;

    if (!userId) {
      return;
    }

    await toggleRoleActive(
      role.role_id,
      role.active,
      role.name,
      role.permissions,
      userId
    );
  };

  const handleTogglePermission = async (roleIndex, permission) => {
    if (!canManageRoles) {
      return;
    }

    const role = roles[roleIndex];
    const userId = userData?.sys_user_id;

    if (!userId) {
      return;
    }

    await togglePermission(
      role.role_id,
      permission,
      role.permissions,
      role.name,
      role.active,
      userId
    );
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
        <main className="flex-1 bg-gray-100 p-15 overflow-y-auto transition-colors duration-300">
          <div className="bg-white p-4 rounded-lg min-h-[80vh] transition-all duration-300">
            <div className="flex justify-between items-center mb-4">
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search roles..."
              />
              <button
                onClick={() => handleOpenEditModal()}
                disabled={!canManageRoles}
                className={`px-4 py-2 rounded-lg text-sm transition-colors duration-300 ${
                  canManageRoles
                    ? "bg-[#6237A0] text-white hover:bg-purple-800"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Add Role
              </button>
            </div>
            <div className="overflow-x-auto max-h-[70vh] overflow-y-auto relative custom-scrollbar">
              <table className="min-w-full text-sm text-left border-separate border-spacing-0">
                <thead className="text-gray-500 sticky top-0 bg-white z-20 shadow-sm">
                  <tr>
                    <th className="sticky left-0 z-30 bg-white py-2 px-3 w-48 border-b border-gray-500">
                      Role Name
                    </th>
                    <th className="sticky left-48 z-30 bg-white py-2 px-3 text-center w-24 border-b border-gray-500">
                      Active Status
                    </th>
                    {PERMISSIONS.map((perm, i) => (
                      <th
                        key={i}
                        className="py-2 px-3 text-center min-w-[120px] border-b border-gray-500"
                      >
                        {perm}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td
                        colSpan={PERMISSIONS.length + 2}
                        className="text-center py-8 text-gray-600"
                      >
                        Loading roles...
                      </td>
                    </tr>
                  ) : filteredRoles.length === 0 ? (
                    <tr>
                      <td
                        colSpan={PERMISSIONS.length + 2}
                        className="text-center py-8 text-gray-600"
                      >
                        No roles found
                      </td>
                    </tr>
                  ) : (
                    filteredRoles.map((role, idx) => (
                      <tr key={idx}>
                        <td className="sticky left-0 bg-white py-3 px-3 z-10 w-[192px] min-w-[192px] max-w-[192px]">
                          <div className="relative w-full">
                            <span className="break-words whitespace-normal text-sm block">
                              {role.name}
                            </span>
                            {canManageRoles && (
                              <Edit3
                                size={18}
                                strokeWidth={1}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-700 cursor-pointer"
                                onClick={() => handleOpenEditModal(idx)}
                              />
                            )}
                          </div>
                        </td>
                        <td className="sticky left-[192px] bg-white py-3 px-3 z-10 text-center w-[96px] min-w-[96px] max-w-[96px]">
                          <ToggleSwitch
                            checked={role.active}
                            onChange={() => handleToggleActive(idx)}
                            disabled={!canManageRoles}
                          />
                        </td>
                        {PERMISSIONS.map((perm, i) => (
                          <td key={i} className="py-3 px-3 text-center">
                            <input
                              type="checkbox"
                              checked={role.permissions.includes(perm)}
                              onChange={() => handleTogglePermission(idx, perm)}
                              disabled={!canManageRoles}
                              className={`w-4 h-4 text-purple-600 rounded focus:ring-purple-500 ${
                                canManageRoles
                                  ? "cursor-pointer"
                                  : "cursor-not-allowed opacity-50"
                              }`}
                            />
                          </td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {isModalOpen && (
            <RoleModal
              isEdit={currentEditIndex !== null}
              formData={editForm}
              onFormChange={setEditForm}
              onClose={() => setIsModalOpen(false)}
              onSave={handleSaveRole}
            />
          )}
        </main>
      </div>
    </div>
  );
}

function SearchInput({ value, onChange, placeholder }) {
  return (
    <div className="flex items-center bg-gray-100 px-3 py-2 rounded-md w-1/3 relative">
      <Search
        size={18}
        strokeWidth={1}
        className="text-gray-500 mr-2 flex-shrink-0"
      />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent focus:outline-none text-sm w-full pr-6"
      />
      {value && (
        <X
          size={16}
          strokeWidth={1}
          className="text-gray-500 cursor-pointer absolute right-3"
          onClick={() => onChange("")}
        />
      )}
    </div>
  );
}

function ToggleSwitch({ checked, onChange, disabled = false }) {
  return (
    <label
      className={`inline-flex relative items-center ${
        disabled ? "cursor-not-allowed" : "cursor-pointer"
      }`}
    >
      <input
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
      />
      <div
        className={`w-7 h-4 rounded-full transition-colors duration-300 relative after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-transform ${
          disabled
            ? "bg-gray-300 cursor-not-allowed"
            : checked
            ? "bg-[#6237A0] peer-checked:after:translate-x-3"
            : "bg-gray-200 peer-checked:after:translate-x-3"
        }`}
      />
    </label>
  );
}

function RoleModal({ isEdit, formData, onFormChange, onClose, onSave }) {
  return (
    <div className="fixed inset-0 bg-gray-400/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-96">
        <h2 className="text-md font-semibold mb-4">
          {isEdit ? "Edit Role" : "Add Role"}
        </h2>

        <FormField
          label="Role Name"
          value={formData.name}
          onChange={(value) => onFormChange({ ...formData, name: value })}
        />

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-800 px-4 py-1 rounded-lg text-sm hover:bg-gray-400 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="bg-purple-700 text-white px-4 py-1 rounded-lg text-sm hover:bg-purple-800 transition-colors duration-300"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

function FormField({ label, type = "text", value, onChange }) {
  return (
    <div>
      <label className="text-sm text-gray-700 mb-1 block">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded-md p-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all duration-300"
      />
    </div>
  );
}
