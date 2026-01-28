import { useState } from "react";
import { Plus, Search, X, Settings, Users, Shield, MessageSquare, ChevronDown, ChevronRight } from "react-feather";
import TopNavbar from "../../../src/components/TopNavbar";
import Sidebar from "../../components/Sidebar";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useUser } from "../../../src/context/UserContext";
import { useRoles } from "../../hooks/useRoles";
import RoleService from "../../services/role.service";
import { toast } from "react-toastify";
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

  // Member management states
  const [expandedRoles, setExpandedRoles] = useState(new Set());
  const [roleMembers, setRoleMembers] = useState({});
  const [membersLoading, setMembersLoading] = useState({});
  const [membersError, setMembersError] = useState({});

  const { userData, hasPermission } = useUser();
  const { roles, loading, createRole, toggleRoleActive, togglePermission } = useRoles();

  const canManageRoles = hasPermission("priv_can_manage_role");

  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSidebar = () => setMobileSidebarOpen((prev) => !prev);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  const handleCreateRole = () => {
    if (!canManageRoles) {
      console.warn("User does not have permission to manage roles");
      toast.error("You don't have permission to create roles");
      return;
    }
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
    if (!canManageRoles) {
      console.warn("User does not have permission to manage roles");
      toast.error("You don't have permission to modify roles");
      return;
    }

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
    if (!canManageRoles) {
      console.warn("User does not have permission to manage roles");
      toast.error("You don't have permission to modify role permissions");
      return;
    }
    
    if (!selectedRole) return;

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

  // Member management functions
  const toggleRoleExpansion = async (roleId) => {
    const newExpandedRoles = new Set(expandedRoles);
    
    if (expandedRoles.has(roleId)) {
      newExpandedRoles.delete(roleId);
    } else {
      newExpandedRoles.add(roleId);
      // Fetch members when expanding
      await fetchRoleMembers(roleId);
    }
    
    setExpandedRoles(newExpandedRoles);
  };

  const fetchRoleMembers = async (roleId) => {
    if (roleMembers[roleId]) {
      return; // Already have data
    }

    setMembersLoading(prev => ({ ...prev, [roleId]: true }));
    setMembersError(prev => ({ ...prev, [roleId]: null }));

    try {
      console.log(`Fetching members for role ${roleId}...`);
      const response = await RoleService.getRoleMembers(roleId);
      console.log(`Role ${roleId} members response:`, response);
      setRoleMembers(prev => ({ ...prev, [roleId]: response.members }));
    } catch (error) {
      console.error("Error fetching role members:", error);
      const errorMessage = error.response?.data?.error || error.message || "Failed to load members. Please try again.";
      setMembersError(prev => ({ 
        ...prev, 
        [roleId]: errorMessage
      }));
      toast.error("Failed to load role members", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setMembersLoading(prev => ({ ...prev, [roleId]: false }));
    }
  };

  const updateMemberPermission = async (roleId, userId, permission, value) => {
    try {
      await RoleService.updateMemberPermission(roleId, userId, permission, value);
      
      // Update local state
      setRoleMembers(prev => ({
        ...prev,
        [roleId]: prev[roleId]?.map(member => 
          member.sys_user_id === userId 
            ? { ...member, [permission]: value }
            : member
        ) || []
      }));

      toast.success("Member permission updated successfully", {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (error) {
      console.error("Error updating member permission:", error);
      toast.error("Failed to update member permission", {
        position: "top-right",
        autoClose: 3000,
      });
      throw error;
    }
  };

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
            <div className="bg-white rounded-lg shadow-sm h-full flex flex-col md:flex-row overflow-hidden">
              {/* Left Panel - Roles List */}
              <div className={`${selectedRole ? 'hidden md:flex' : 'flex'} w-full md:w-80 lg:w-96 bg-white border-b md:border-b-0 md:border-r border-gray-200 flex-col`}>
                <div className="p-2.5 sm:p-3 border-b border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-base sm:text-lg font-bold text-gray-800 flex items-center gap-2">
                      <Users size={18} />
                      Roles
                    </h2>
                    {canManageRoles && (
                      <button
                        onClick={handleCreateRole}
                        className="p-1.5 text-[#6237A0] hover:bg-purple-50 rounded-lg transition-colors"
                        title="Create Role"
                      >
                        <Plus size={16} />
                      </button>
                    )}
                  </div>
                  <SearchInput
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Search roles..."
                  />
                </div>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                  {loading ? (
                    <div className="flex items-center justify-center h-full py-8">
                      <div className="flex items-center space-x-3">
                        <div className="animate-spin rounded-full h-8 w-8 border-3 border-gray-200 border-t-[#6237A0]"></div>
                        <span className="text-gray-600 text-sm">Loading roles...</span>
                      </div>
                    </div>
                  ) : filteredRoles.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 text-sm">
                      {searchQuery ? "No roles found matching your search" : "No roles available"}
                    </div>
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
                          isExpanded={expandedRoles.has(role.role_id)}
                          members={roleMembers[role.role_id]}
                          membersLoading={membersLoading[role.role_id]}
                          membersError={membersError[role.role_id]}
                          onToggleExpansion={toggleRoleExpansion}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Panel - Role Permissions */}
              <div className={`${selectedRole ? 'flex' : 'hidden md:flex'} flex-1 flex-col overflow-hidden`}>
                {selectedRole ? (
                  <>
                    <div className="p-2.5 sm:p-3 md:p-4 border-b border-gray-200 bg-white">
                      <div className="flex items-center justify-between gap-2 mb-2 md:mb-0">
                        <button
                          onClick={() => setSelectedRole(null)}
                          className="md:hidden p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Back to roles"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base sm:text-lg font-bold text-gray-800 truncate">{selectedRole.name}</h3>
                          <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">
                            {selectedRole.permissions.length} permissions enabled
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                          <span className="text-[10px] sm:text-xs text-gray-600 font-medium">Active</span>
                          <ToggleSwitch
                            checked={selectedRole.active}
                            onChange={() => handleToggleActive(selectedRole)}
                            disabled={!canManageRoles}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 custom-scrollbar">
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
                    <div className="text-center p-4">
                      <Users size={48} className="text-gray-300 mx-auto mb-4" />
                      <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">Select a role</h3>
                      <p className="text-xs sm:text-sm text-gray-500 px-4">Choose a role from the list to view and edit its permissions</p>
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
    </>
  );
}

function SearchInput({ value, onChange, placeholder }) {
  return (
    <div className="flex items-center bg-gray-100 px-3 py-2 rounded-lg w-full relative">
      <Search
        size={16}
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
          className="text-gray-500 cursor-pointer absolute right-3 hover:text-gray-700 transition-colors"
          onClick={() => onChange("")}
        />
      )}
    </div>
  );
}

function RoleItem({ 
  role, 
  isSelected, 
  onClick, 
  onToggleActive, 
  canManage,
  isExpanded,
  members,
  membersLoading,
  membersError,
  onToggleExpansion
}) {
  const handleExpansionClick = (e) => {
    e.stopPropagation();
    onToggleExpansion(role.role_id);
  };

  return (
    <div className="mb-1">
      <div
        className={`p-2.5 sm:p-3 rounded-lg cursor-pointer transition-all duration-200 ${
          isSelected
            ? "bg-[#6237A0] text-white"
            : "hover:bg-gray-50 text-gray-700"
        }`}
        onClick={onClick}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={handleExpansionClick}
                className={`p-1 rounded transition-colors flex-shrink-0 ${
                  isSelected
                    ? "hover:bg-purple-600 text-purple-100"
                    : "hover:bg-gray-200 text-gray-500"
                }`}
                title={isExpanded ? "Collapse members" : "Expand members"}
              >
                {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm truncate">{role.name}</h4>
                <p className={`text-xs mt-0.5 sm:mt-1 truncate ${isSelected ? "text-purple-100" : "text-gray-500"}`}>
                  {role.permissions.length} permissions
                  {members && ` • ${members.length} members`}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
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

      {/* Member List */}
      {isExpanded && (
        <div className="ml-3 sm:ml-4 mt-2 bg-gray-50 rounded-lg p-2.5 sm:p-3">
          <div className="flex items-center gap-2 mb-2 sm:mb-3">
            <Users size={14} className="text-gray-600 flex-shrink-0" />
            <h5 className="font-medium text-xs sm:text-sm text-gray-800">Role Members</h5>
          </div>
          
          {membersLoading ? (
            <div className="py-4 flex items-center justify-center">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-200 border-t-[#6237A0]"></div>
                <span className="text-xs text-gray-600">Loading...</span>
              </div>
            </div>
          ) : membersError ? (
            <div className="text-center py-4">
              <p className="text-xs sm:text-sm text-red-600 mb-2">{membersError}</p>
              <button
                onClick={handleExpansionClick}
                className="text-xs text-[#6237A0] hover:underline"
              >
                Retry
              </button>
            </div>
          ) : !members || members.length === 0 ? (
            <p className="text-xs sm:text-sm text-gray-500 text-center py-4">No members in this role</p>
          ) : (
            <div className="space-y-1.5 sm:space-y-2">
              {members.map((member) => (
                <MemberListItem
                  key={member.sys_user_id}
                  member={member}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function MemberListItem({ member }) {
  // Generate initials from name or email for profile picture placeholder
  const getInitials = (member) => {
    if (member.profile?.prof_firstname && member.profile?.prof_lastname) {
      return `${member.profile.prof_firstname.charAt(0)}${member.profile.prof_lastname.charAt(0)}`.toUpperCase();
    }
    // Fallback to email initials
    const name = member.sys_user_email.split('@')[0];
    return name.substring(0, 2).toUpperCase();
  };

  // Get display name
  const getDisplayName = (member) => {
    if (member.profile?.full_name && member.profile.full_name.trim()) {
      return member.profile.full_name;
    }
    // Fallback to email
    return member.sys_user_email;
  };

  // Check if profile image exists
  const hasProfileImage = member.profile?.profile_image;

  return (
    <div className="flex items-center p-2 sm:p-3 bg-white rounded border hover:bg-gray-50 transition-colors">
      {/* Profile Picture */}
      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full mr-2 sm:mr-3 flex-shrink-0 overflow-hidden">
        {hasProfileImage ? (
          <img
            src={member.profile.profile_image}
            alt={getDisplayName(member)}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback to initials if image fails to load
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div 
          className={`w-full h-full bg-[#6237A0] rounded-full flex items-center justify-center text-white font-medium text-xs sm:text-sm ${hasProfileImage ? 'hidden' : 'flex'}`}
        >
          {getInitials(member)}
        </div>
      </div>
      
      {/* User Info */}
      <div className="flex-1 min-w-0">
        <p className="text-xs sm:text-sm font-medium text-gray-800 truncate">
          {getDisplayName(member)}
        </p>
        <p className="text-xs text-gray-500 truncate">
          {member.profile?.full_name ? member.sys_user_email : (member.sys_user_is_active ? "Active" : "Inactive")}
        </p>
      </div>
    </div>
  );
}

function PermissionCategory({ name, icon: Icon, permissions, rolePermissions, onTogglePermission, canManage }) {
  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex items-center gap-2 mb-3 sm:mb-4">
        <Icon size={16} className="text-gray-600 flex-shrink-0" />
        <h4 className="font-semibold text-gray-800 uppercase text-xs tracking-wide">{name}</h4>
      </div>
      <div className="space-y-2 sm:space-y-3">
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
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between p-3 sm:p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors gap-3">
      <div className="flex-1 min-w-0">
        <h5 className="font-medium text-gray-800 text-sm">{permission.key}</h5>
        <p className="text-xs text-gray-500 mt-1">{permission.description}</p>
      </div>
      <div className="flex items-center justify-end sm:justify-start gap-2">
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

function ToggleSwitch({ checked, onChange, disabled = false, size = "md" }) {
  const sizeClasses = {
    sm: {
      container: "w-8 h-4",
      toggle: "after:h-3 after:w-3 after:top-0.5 after:left-0.5 peer-checked:after:translate-x-4"
    },
    md: {
      container: "w-11 h-6",
      toggle: "after:h-5 after:w-5 after:top-0.5 after:left-0.5 peer-checked:after:translate-x-5"
    }
  };

  const currentSize = sizeClasses[size] || sizeClasses.md;

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
        className={`${currentSize.container} rounded-full transition-colors duration-300 relative after:content-[''] after:absolute after:bg-white after:rounded-full after:transition-transform ${currentSize.toggle} ${
          disabled
            ? "bg-gray-300 cursor-not-allowed"
            : checked
            ? "bg-[#6237A0]"
            : "bg-gray-300"
        }`}
      />
    </label>
  );
}

function CreateRoleModal({ formData, onFormChange, onClose, onSave }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-5 sm:p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Create New Role</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Role Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => onFormChange({ ...formData, name: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#6237A0]/30 focus:border-[#6237A0]"
            placeholder="Enter role name..."
            autoFocus
          />
        </div>

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={!formData.name.trim()}
            className="px-4 py-2 bg-[#6237A0] text-white text-sm rounded-lg hover:bg-[#552C8C] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Create Role
          </button>
        </div>
      </div>
    </div>
  );
}