import { useState, useEffect } from "react";
import { Plus, Search, X, Settings, Users, Shield, MessageSquare, ChevronDown, ChevronRight } from "react-feather";
import TopNavbar from "../../../src/components/TopNavbar";
import Sidebar from "../../components/Sidebar";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useUser } from "../../../src/context/UserContext";
import { useTheme } from "../../context/ThemeContext";
import { useUnsavedChanges } from "../../context/UnsavedChangesContext";
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

  // Unsaved changes tracking
  const [originalPermissions, setOriginalPermissions] = useState([]);
  const [pendingPermissions, setPendingPermissions] = useState([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [shakeBar, setShakeBar] = useState(0);

  const { userData, hasPermission } = useUser();
  const { isDark } = useTheme();
  const { roles, loading, createRole, toggleRoleActive, updateRole } = useRoles();
  const { setHasUnsavedChanges: setGlobalUnsavedChanges, setOnNavigationBlocked } = useUnsavedChanges();

  const canManageRoles = hasPermission("priv_can_manage_role");

  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSidebar = () => setMobileSidebarOpen((prev) => !prev);

  const triggerShake = () => {
    setShakeBar(prev => prev + 1);
  };

  const handleRoleSelect = (role) => {
    // Block navigation if there are unsaved changes
    if (hasUnsavedChanges) {
      triggerShake();
      setPendingAction(() => () => {
        setSelectedRole(role);
        setOriginalPermissions(role.permissions);
        setPendingPermissions(role.permissions);
        setHasUnsavedChanges(false);
      });
      return;
    }
    
    setSelectedRole(role);
    setOriginalPermissions(role.permissions);
    setPendingPermissions(role.permissions);
    setHasUnsavedChanges(false);
  };

  const handleDiscardChanges = () => {
    setPendingPermissions(originalPermissions);
    setHasUnsavedChanges(false);
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  };

  const handleCreateRole = () => {
    // Block if there are unsaved changes
    if (hasUnsavedChanges) {
      triggerShake();
      setPendingAction(() => () => {
        setEditForm({ name: "" });
        setIsModalOpen(true);
      });
      return;
    }

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
    // Block if there are unsaved changes
    if (hasUnsavedChanges) {
      triggerShake();
      setPendingAction(() => async () => {
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
          const updatedRole = { ...role, active: !role.active };
          setSelectedRole(updatedRole);
          setOriginalPermissions(updatedRole.permissions);
          setPendingPermissions(updatedRole.permissions);
        }
      });
      return;
    }

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
      const updatedRole = { ...role, active: !role.active };
      setSelectedRole(updatedRole);
      setOriginalPermissions(updatedRole.permissions);
      setPendingPermissions(updatedRole.permissions);
    }
  };

  const handleTogglePermission = (permission) => {
    if (!canManageRoles) {
      console.warn("User does not have permission to manage roles");
      toast.error("You don't have permission to modify role permissions");
      return;
    }
    
    if (!selectedRole) return;

    // Toggle permission in pending state (don't save yet)
    const hasPermission = pendingPermissions.includes(permission);
    const updatedPermissions = hasPermission
      ? pendingPermissions.filter(p => p !== permission)
      : [...pendingPermissions, permission];

    setPendingPermissions(updatedPermissions);
    
    // Check if there are changes
    const hasChanges = JSON.stringify([...updatedPermissions].sort()) !== 
                       JSON.stringify([...originalPermissions].sort());
    setHasUnsavedChanges(hasChanges);
    setGlobalUnsavedChanges(hasChanges);
    
    // Show modal immediately when changes are detected
    if (hasChanges && !showUnsavedModal) {
      console.log("Changes detected, showing modal");
    }
  };

  const handleSaveChanges = async () => {
    if (!selectedRole || !canManageRoles) return;

    const userId = userData?.sys_user_id;
    if (!userId) return;

    setIsSaving(true);
    try {
      const success = await updateRole(selectedRole.role_id, {
        name: selectedRole.name,
        active: selectedRole.active,
        permissions: pendingPermissions,
        updated_by: userId,
      });

      if (success) {
        // Update local state
        setSelectedRole({ ...selectedRole, permissions: pendingPermissions });
        setOriginalPermissions(pendingPermissions);
        setHasUnsavedChanges(false);
        setGlobalUnsavedChanges(false);
        
        // Execute pending action if exists
        if (pendingAction) {
          pendingAction();
          setPendingAction(null);
        }
      }
    } catch (error) {
      console.error("Failed to save changes:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetChanges = () => {
    setPendingPermissions(originalPermissions);
    setHasUnsavedChanges(false);
    setGlobalUnsavedChanges(false);
    
    // Execute pending action if exists
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  };

  // Set up the navigation blocked callback
  useEffect(() => {
    setOnNavigationBlocked(() => triggerShake);
  }, [setOnNavigationBlocked]);

  // Member management functions
  const toggleRoleExpansion = async (roleId) => {
    // Block if there are unsaved changes
    if (hasUnsavedChanges) {
      triggerShake();
      setPendingAction(() => async () => {
        const newExpandedRoles = new Set(expandedRoles);
        
        if (expandedRoles.has(roleId)) {
          newExpandedRoles.delete(roleId);
        } else {
          newExpandedRoles.add(roleId);
          // Fetch members when expanding
          await fetchRoleMembers(roleId);
        }
        
        setExpandedRoles(newExpandedRoles);
      });
      return;
    }

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
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
          20%, 40%, 60%, 80% { transform: translateX(10px); }
        }
        
        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        .shake-animation {
          animation: shake 0.5s ease-in-out;
        }
        
        .slide-up-animation {
          animation: slideUp 0.3s ease-out;
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
          <main className="flex-1 p-2 sm:p-3 md:p-4 overflow-hidden" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <div className="rounded-lg shadow-sm h-full flex flex-col md:flex-row overflow-hidden" style={{ backgroundColor: 'var(--card-bg)' }}>
              {/* Left Panel - Roles List */}
              <div className={`${selectedRole ? 'hidden md:flex' : 'flex'} w-full md:w-80 lg:w-96 flex-col`} style={{ backgroundColor: 'var(--card-bg)', borderRight: `1px solid var(--border-color)` }}>
                <div className="p-2.5 sm:p-3" style={{ borderBottom: `1px solid var(--border-color)` }}>
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-base sm:text-lg font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
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
                    isDark={isDark}
                  />
                </div>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                  {loading ? (
                    <div className="flex items-center justify-center h-full py-8">
                      <div className="flex items-center space-x-3">
                        <div className="animate-spin rounded-full h-8 w-8 border-3 border-t-[#6237A0]" style={{ borderColor: 'var(--border-color)', borderTopColor: '#6237A0' }}></div>
                        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Loading roles...</span>
                      </div>
                    </div>
                  ) : filteredRoles.length === 0 ? (
                    <div className="p-4 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
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
                          isDark={isDark}
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
                    <div className="p-2.5 sm:p-3 md:p-4" style={{ borderBottom: `1px solid var(--border-color)`, backgroundColor: 'var(--card-bg)' }}>
                      <div className="flex items-center justify-between gap-2 mb-2 md:mb-0">
                        <button
                          onClick={() => {
                            if (hasUnsavedChanges) {
                              triggerShake();
                              setPendingAction(() => () => setSelectedRole(null));
                              return;
                            }
                            setSelectedRole(null);
                          }}
                          className="md:hidden p-1.5 rounded-lg transition-colors"
                          style={{ color: 'var(--text-secondary)' }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = isDark ? 'rgba(139, 92, 246, 0.05)' : 'rgba(249, 250, 251, 1)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                          title="Back to roles"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base sm:text-lg font-bold truncate" style={{ color: 'var(--text-primary)' }}>{selectedRole.name}</h3>
                          <p className="text-[10px] sm:text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                            {pendingPermissions.length} permissions enabled
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                          <span className="text-[10px] sm:text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Active</span>
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
                          rolePermissions={pendingPermissions}
                          onTogglePermission={handleTogglePermission}
                          canManage={canManageRoles}
                          isDark={isDark}
                        />
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center" style={{ backgroundColor: isDark ? '#2a2a2a' : '#f9fafb' }}>
                    <div className="text-center p-4">
                      <Users size={48} className="mx-auto mb-4" style={{ color: isDark ? '#4a4a4a' : '#d1d5db' }} />
                      <h3 className="text-base sm:text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Select a role</h3>
                      <p className="text-xs sm:text-sm px-4" style={{ color: 'var(--text-secondary)' }}>Choose a role from the list to view and edit its permissions</p>
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
                isDark={isDark}
              />
            )}
          </main>

          {/* Render unsaved changes bar at bottom when there are changes */}
          {hasUnsavedChanges && (
            <UnsavedChangesModal
              onSave={handleSaveChanges}
              onDiscard={handleResetChanges}
              isSaving={isSaving}
              isDark={isDark}
              shake={shakeBar}
            />
          )}
        </div>
      </div>
    </>
  );
}

function SearchInput({ value, onChange, placeholder, isDark }) {
  return (
    <div className="flex items-center px-3 py-2 rounded-lg w-full relative" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
      <Search
        size={16}
        className="mr-2 flex-shrink-0"
        style={{ color: 'var(--text-secondary)' }}
      />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent focus:outline-none text-sm w-full pr-6"
        style={{ color: 'var(--text-primary)' }}
      />
      {value && (
        <X
          size={16}
          className="cursor-pointer absolute right-3 transition-colors"
          style={{ color: 'var(--text-secondary)' }}
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
  onToggleExpansion,
  isDark
}) {
  const handleExpansionClick = (e) => {
    e.stopPropagation();
    onToggleExpansion(role.role_id);
  };

  return (
    <div className="mb-1">
      <div
        className="p-2.5 sm:p-3 rounded-lg cursor-pointer transition-all duration-200"
        style={
          isSelected 
            ? { backgroundColor: '#6237A0', color: 'white' }
            : { color: 'var(--text-primary)' }
        }
        onClick={onClick}
        onMouseEnter={(e) => {
          if (!isSelected) {
            e.currentTarget.style.backgroundColor = isDark ? 'rgba(139, 92, 246, 0.05)' : 'rgba(249, 250, 251, 1)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isSelected) {
            e.currentTarget.style.backgroundColor = 'transparent';
          }
        }}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={handleExpansionClick}
                className={`p-1 rounded transition-colors flex-shrink-0 ${
                  isSelected
                    ? "hover:bg-purple-600 text-purple-100"
                    : ""
                }`}
                style={!isSelected ? { color: 'var(--text-secondary)' } : {}}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = isDark ? 'rgba(139, 92, 246, 0.1)' : 'rgba(229, 231, 235, 1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
                title={isExpanded ? "Collapse members" : "Expand members"}
              >
                {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm truncate">{role.name}</h4>
                <p className={`text-xs mt-0.5 sm:mt-1 truncate ${isSelected ? "text-purple-100" : ""}`} style={!isSelected ? { color: 'var(--text-secondary)' } : {}}>
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
                    : ""
                }`}
                style={!isSelected ? { color: 'var(--text-secondary)' } : {}}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = isDark ? 'rgba(139, 92, 246, 0.1)' : 'rgba(229, 231, 235, 1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
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
        <div className="ml-3 sm:ml-4 mt-2 rounded-lg p-2.5 sm:p-3" style={{ backgroundColor: isDark ? '#2a2a2a' : '#f9fafb' }}>
          <div className="flex items-center gap-2 mb-2 sm:mb-3">
            <Users size={14} className="flex-shrink-0" style={{ color: 'var(--text-secondary)' }} />
            <h5 className="font-medium text-xs sm:text-sm" style={{ color: 'var(--text-primary)' }}>Role Members</h5>
          </div>
          
          {membersLoading ? (
            <div className="py-4 flex items-center justify-center">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-t-[#6237A0]" style={{ borderColor: 'var(--border-color)', borderTopColor: '#6237A0' }}></div>
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Loading...</span>
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
            <p className="text-xs sm:text-sm text-center py-4" style={{ color: 'var(--text-secondary)' }}>No members in this role</p>
          ) : (
            <div className="space-y-1.5 sm:space-y-2">
              {members.map((member) => (
                <MemberListItem
                  key={member.sys_user_id}
                  member={member}
                  isDark={isDark}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function MemberListItem({ member, isDark }) {
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
    <div className="flex items-center p-2 sm:p-3 rounded transition-colors" style={{ backgroundColor: 'var(--card-bg)', border: `1px solid var(--border-color)` }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = isDark ? 'rgba(139, 92, 246, 0.05)' : 'rgba(249, 250, 251, 1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--card-bg)';
      }}
    >
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
        <p className="text-xs sm:text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
          {getDisplayName(member)}
        </p>
        <p className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>
          {member.profile?.full_name ? member.sys_user_email : (member.sys_user_is_active ? "Active" : "Inactive")}
        </p>
      </div>
    </div>
  );
}

function PermissionCategory({ name, icon: Icon, permissions, rolePermissions, onTogglePermission, canManage, isDark }) {
  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex items-center gap-2 mb-3 sm:mb-4">
        <Icon size={16} className="flex-shrink-0" style={{ color: 'var(--text-secondary)' }} />
        <h4 className="font-semibold uppercase text-xs tracking-wide" style={{ color: 'var(--text-primary)' }}>{name}</h4>
      </div>
      <div className="space-y-2 sm:space-y-3">
        {permissions.map((permission) => (
          <PermissionItem
            key={permission.key}
            permission={permission}
            isEnabled={rolePermissions.includes(permission.key)}
            onToggle={() => onTogglePermission(permission.key)}
            canManage={canManage}
            isDark={isDark}
          />
        ))}
      </div>
    </div>
  );
}

function PermissionItem({ permission, isEnabled, onToggle, canManage, isDark }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between p-3 sm:p-4 rounded-lg transition-colors gap-3" style={{ backgroundColor: isDark ? '#1e1e1e' : 'var(--card-bg)', border: `1px solid var(--border-color)` }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = isDark ? '#5a5a5a' : '#d1d5db';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-color)';
      }}
    >
      <div className="flex-1 min-w-0">
        <h5 className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{permission.key}</h5>
        <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{permission.description}</p>
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

function CreateRoleModal({ formData, onFormChange, onClose, onSave, isDark }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
      <div className="rounded-lg shadow-xl p-5 sm:p-6 w-full max-w-md" style={{ backgroundColor: 'var(--card-bg)' }}>
        <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Create New Role</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Role Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => onFormChange({ ...formData, name: e.target.value })}
            className="w-full rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#6237A0]/30 focus:border-[#6237A0]"
            style={{
              backgroundColor: 'var(--input-bg)',
              color: 'var(--text-primary)',
              border: `1px solid var(--border-color)`
            }}
            placeholder="Enter role name..."
            autoFocus
          />
        </div>

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg transition-colors"
            style={{ 
              backgroundColor: isDark ? '#4a4a4a' : '#e5e7eb',
              color: 'var(--text-primary)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = isDark ? '#5a5a5a' : '#d1d5db';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = isDark ? '#4a4a4a' : '#e5e7eb';
            }}
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

function UnsavedChangesModal({ onSave, onDiscard, isSaving, isDark, shake }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] flex justify-center px-2 sm:px-4 pb-2 sm:pb-4 pointer-events-none slide-up-animation">
      <div 
        key={shake}
        className="rounded-lg shadow-2xl px-3 sm:px-4 py-2.5 sm:py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 pointer-events-auto max-w-2xl w-full shake-animation"
        style={{ 
          backgroundColor: isDark ? '#111214' : '#2b2d31',
          border: `1px solid ${isDark ? '#1e1f22' : '#3f4147'}`,
          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.24)'
        }}
      >
        <span 
          className="text-xs sm:text-sm font-medium"
          style={{ color: '#f2f3f5' }}
        >
          Careful — you have unsaved changes!
        </span>

        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <button
            onClick={onDiscard}
            disabled={isSaving}
            className="text-xs sm:text-sm font-medium transition-colors flex-1 sm:flex-none py-2 sm:py-0"
            style={{ 
              color: '#f2f3f5'
            }}
            onMouseEnter={(e) => {
              if (!isSaving) {
                e.currentTarget.style.textDecoration = 'underline';
              }
            }}
            onMouseLeave={(e) => {
              if (!isSaving) {
                e.currentTarget.style.textDecoration = 'none';
              }
            }}
          >
            Reset
          </button>
          <button
            onClick={onSave}
            disabled={isSaving}
            className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded transition-colors text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 flex-1 sm:flex-none"
            style={{ backgroundColor: '#248046', minWidth: '100px', maxWidth: '100%' }}
            onMouseEnter={(e) => {
              if (!isSaving) {
                e.currentTarget.style.backgroundColor = '#1a5c34';
              }
            }}
            onMouseLeave={(e) => {
              if (!isSaving) {
                e.currentTarget.style.backgroundColor = '#248046';
              }
            }}
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-2 border-white border-t-transparent"></div>
                <span className="hidden sm:inline">Saving...</span>
                <span className="sm:hidden">Save...</span>
              </>
            ) : (
              <>
                <span className="hidden sm:inline">Save Changes</span>
                <span className="sm:hidden">Save</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}