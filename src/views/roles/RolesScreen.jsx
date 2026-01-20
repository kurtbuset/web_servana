import React, { useState } from "react";
import { Plus, Search, X, Settings, Users, Shield, MessageSquare, Edit3 } from "react-feather";
import TopNavbar from "../../../src/components/TopNavbar";
import Sidebar from "../../components/Sidebar";
import { useUser } from "../../../src/context/UserContext";
import { useRoles } from "../../hooks/useRoles";
import "../../App.css";

const PERMISSION_CATEGORIES = {
  "Chat Permissions": {
    icon: MessageSquare,
    permissions: [
      { key: "Can view Chats", description: "Allows members to view chat messages and conversations" },
      { key: "Can Reply", description: "Allows members to send messages and reply to conversations" },
      { key: "Can End Chat", description: "Allows members to end or close chat conversations" },
      { key: "Can Transfer Department", description: "Allows members to transfer chats between departments" },
      { key: "Can send Macros", description: "Allows members to use predefined message templates" },
    ]
  },
  "Management Permissions": {
    icon: Settings,
    permissions: [
      { key: "Can Edit Department", description: "Allows members to create, edit, and manage departments" },
      { key: "Can Assign Department", description: "Allows members to assign users to departments" },
      { key: "Can Edit Roles", description: "Allows members to create and modify user roles" },
      { key: "Can Assign Roles", description: "Allows members to assign roles to other users" },
      { key: "Can Add Admin Accounts", description: "Allows members to create new administrator accounts" },
      { key: "Can Edit Auto-Replies", description: "Allows members to manage automated response messages" },
    ]
  },
  "General Permissions": {
    icon: Shield,
    permissions: [
      { key: "Can Manage Profile", description: "Allows members to edit their own profile information" },
    ]
  }
};

export default function RolesScreen() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({ name: "" });

  const { userData, hasPermission } = useUser();
  const { roles, loading, createRole, updateRole, toggleRoleActive, togglePermission } = useRoles();

  const canManageRoles = hasPermission("priv_can_manage_role");

  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSidebar = () => setMobileSidebarOpen((prev) => !prev);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  const handleCreateRole = () => {
    setEditForm({ name: "" });
    setIsModalOpen(true);
  };

  const handleSaveRole = async () => {
    if (!canManageRoles || !editForm.name.trim()) {
      return;
    }

    const userId = userData?.sys_user_id;
    if (!userId) return;

    const success = await createRole({
      name: editForm.name,
      permissions: [],
      created_by: userId,
      updated_by: userId,
    });

    if (success) {
      setIsModalOpen(false);
      setEditForm({ name: "" });
    }
  };

  const handleToggleActive = async (role) => {
    if (!canManageRoles) return;

    const userId = userData?.sys_user_id;
    if (!userId) return;

    await toggleRoleActive(
      role.role_id,
      role.active,
      role.name,
      role.permissions,
      userId
    );

    // Update selected role if it's the one being toggled
    if (selectedRole && selectedRole.role_id === role.role_id) {
      setSelectedRole({ ...role, active: !role.active });
    }
  };

  const handleTogglePermission = async (permission) => {
    if (!canManageRoles || !selectedRole) return;

    const userId = userData?.sys_user_id;
    if (!userId) return;

    await togglePermission(
      selectedRole.role_id,
      permission,
      selectedRole.permissions,
      selectedRole.name,
      selectedRole.active,
      userId
    );

    // Update selected role permissions
    const hasPermission = selectedRole.permissions.includes(permission);
    const updatedPermissions = hasPermission
      ? selectedRole.permissions.filter(p => p !== permission)
      : [...selectedRole.permissions, permission];

    setSelectedRole({ ...selectedRole, permissions: updatedPermissions });
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
        <main className="flex-1 bg-gray-50 overflow-hidden">
          <div className="flex h-full">
            {/* Left Panel - Roles List */}
            <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Users size={20} />
                    Roles
                  </h2>
                  {canManageRoles && (
                    <button
                      onClick={handleCreateRole}
                      className="p-2 text-[#6237A0] hover:bg-purple-50 rounded-lg transition-colors"
                      title="Create Role"
                    >
                      <Plus size={18} />
                    </button>
                  )}
                </div>
                <SearchInput
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Search roles..."
                />
              </div>
              
              <div className="flex-1 overflow-y-auto">
                {loading ? (
                  <div className="p-4 text-center text-gray-500">Loading roles...</div>
                ) : filteredRoles.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">No roles found</div>
                ) : (
                  <div className="p-2">
                    {filteredRoles.map((role) => (
                      <RoleItem
                        key={role.role_id}
                        role={role}
                        isSelected={selectedRole?.role_id === role.role_id}
                        onClick={() => handleRoleSelect(role)}
                        onToggleActive={() => handleToggleActive(role)}
                        canManage={canManageRoles}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Panel - Role Permissions */}
            <div className="flex-1 flex flex-col">
              {selectedRole ? (
                <>
                  <div className="p-6 border-b border-gray-200 bg-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{selectedRole.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {selectedRole.permissions.length} permissions enabled
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-600">Active</span>
                        <ToggleSwitch
                          checked={selectedRole.active}
                          onChange={() => handleToggleActive(selectedRole)}
                          disabled={!canManageRoles}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-6">
                    {Object.entries(PERMISSION_CATEGORIES).map(([categoryName, category]) => (
                      <PermissionCategory
                        key={categoryName}
                        name={categoryName}
                        icon={category.icon}
                        permissions={category.permissions}
                        rolePermissions={selectedRole.permissions}
                        onTogglePermission={handleTogglePermission}
                        canManage={canManageRoles}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <Users size={48} className="text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Select a role</h3>
                    <p className="text-gray-500">Choose a role from the left to view and edit its permissions</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {isModalOpen && (
            <CreateRoleModal
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
    <div className="flex items-center bg-gray-100 px-3 py-2 rounded-lg w-full relative">
      <Search
        size={16}
        strokeWidth={1}
        className="text-gray-400 mr-2 flex-shrink-0"
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
          className="text-gray-400 cursor-pointer absolute right-3 hover:text-gray-600"
          onClick={() => onChange("")}
        />
      )}
    </div>
  );
}

function RoleItem({ role, isSelected, onClick, onToggleActive, canManage }) {
  return (
    <div
      className={`p-3 rounded-lg cursor-pointer transition-all duration-200 mb-1 ${
        isSelected
          ? "bg-[#6237A0] text-white"
          : "hover:bg-gray-50 text-gray-700"
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm truncate">{role.name}</h4>
          <p className={`text-xs mt-1 ${isSelected ? "text-purple-100" : "text-gray-500"}`}>
            {role.permissions.length} permissions
          </p>
        </div>
        <div className="flex items-center gap-2 ml-3">
          <div
            className={`w-2 h-2 rounded-full ${
              role.active ? "bg-green-400" : "bg-gray-400"
            }`}
            title={role.active ? "Active" : "Inactive"}
          />
          {canManage && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleActive();
              }}
              className={`p-1 rounded transition-colors ${
                isSelected
                  ? "hover:bg-purple-600 text-purple-100"
                  : "hover:bg-gray-200 text-gray-500"
              }`}
              title="Toggle Active Status"
            >
              <Settings size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function PermissionCategory({ name, icon: Icon, permissions, rolePermissions, onTogglePermission, canManage }) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Icon size={18} className="text-gray-600" />
        <h4 className="font-semibold text-gray-900 uppercase text-xs tracking-wide">{name}</h4>
      </div>
      <div className="space-y-3">
        {permissions.map((permission) => (
          <PermissionItem
            key={permission.key}
            permission={permission}
            isEnabled={rolePermissions.includes(permission.key)}
            onToggle={() => onTogglePermission(permission.key)}
            canManage={canManage}
          />
        ))}
      </div>
    </div>
  );
}

function PermissionItem({ permission, isEnabled, onToggle, canManage }) {
  return (
    <div className="flex items-start justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
      <div className="flex-1 min-w-0 mr-4">
        <h5 className="font-medium text-gray-900 text-sm">{permission.key}</h5>
        <p className="text-xs text-gray-500 mt-1">{permission.description}</p>
      </div>
      <div className="flex items-center gap-2">
        <PermissionToggle
          state={isEnabled ? "enabled" : "disabled"}
          onChange={onToggle}
          disabled={!canManage}
        />
      </div>
    </div>
  );
}

function PermissionToggle({ state, onChange, disabled }) {
  const isEnabled = state === "enabled";
  
  return (
    <button
      onClick={() => !disabled && onChange()}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#6237A0] focus:ring-offset-2 ${
        disabled
          ? "cursor-not-allowed opacity-50 bg-gray-300"
          : isEnabled
          ? "bg-[#6237A0]"
          : "bg-gray-400"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
          isEnabled ? "translate-x-6" : "translate-x-1"
        }`}
      >
        <span className="flex items-center justify-center h-full w-full">
          {isEnabled ? (
            <svg className="h-3 w-3 text-[#6237A0]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="h-3 w-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          )}
        </span>
      </span>
    </button>
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
        className={`w-11 h-6 rounded-full transition-colors duration-300 relative after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-transform ${
          disabled
            ? "bg-gray-300 cursor-not-allowed"
            : checked
            ? "bg-[#6237A0] peer-checked:after:translate-x-5"
            : "bg-gray-300 peer-checked:after:translate-x-5"
        }`}
      />
    </label>
  );
}

function CreateRoleModal({ formData, onFormChange, onClose, onSave }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-96">
        <h2 className="text-lg font-semibold mb-4 text-gray-900">Create New Role</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Role Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => onFormChange({ ...formData, name: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#6237A0] focus:border-transparent outline-none"
            placeholder="Enter role name..."
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={!formData.name.trim()}
            className="px-4 py-2 bg-[#6237A0] text-white text-sm rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Create Role
          </button>
        </div>
      </div>
    </div>
  );
}