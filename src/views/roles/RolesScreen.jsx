import { useState, useEffect, useCallback } from "react";
import { Plus, Settings, Users, Shield, MessageSquare } from "react-feather";
import Layout from "../../components/Layout";
import ScreenContainer from "../../components/ScreenContainer";
import Modal from "../../components/Modal";
import UnsavedChangesBar from "../../components/UnsavedChangesBar";
import SearchBar from "../../components/SearchBar";
import ToggleSwitch from "../../components/ToggleSwitch";
import RoleItem from "./components/RoleItem";
import PermissionCategory from "./components/PermissionCategory";
import { 
  PanelHeader, 
  EmptyState, 
  LoadingState, 
  SplitPanel, 
  DetailHeader 
} from "../../components/ui";
import { useUser } from "../../../src/context/UserContext";
import { useTheme } from "../../context/ThemeContext";
import { useUnsavedChanges } from "../../context/UnsavedChangesContext";
import { useRoles } from "../../hooks/useRoles";
import RoleService from "../../services/role.service";
import toast from "../../utils/toast";
import "../../App.css";
import "../../styles/GridLayout.css";

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

  const triggerShake = useCallback(() => {
    setShakeBar(prev => prev + 1);
  }, []);

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
    setOnNavigationBlocked(triggerShake);
  }, [setOnNavigationBlocked, triggerShake]);

  // Sync local unsaved changes with global context
  useEffect(() => {
    setGlobalUnsavedChanges(hasUnsavedChanges);
  }, [hasUnsavedChanges, setGlobalUnsavedChanges]);

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
      toast.error("Failed to load role members");
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

      toast.success("Member permission updated successfully");
    } catch (error) {
      console.error("Error updating member permission:", error);
      toast.error("Failed to update member permission");
      throw error;
    }
  };

  return (
    <Layout>
      <ScreenContainer>
        <div className="p-3 sm:p-4 flex flex-col h-full overflow-hidden">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="relative">
              <h1 className="text-lg sm:text-xl font-bold relative inline-block" style={{ color: 'var(--text-primary)' }}>
                Roles & Permissions
                <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-[#6237A0] via-[#8B5CF6] to-transparent rounded-full"></div>
              </h1>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-hidden">
            <div className="rounded-lg shadow-sm h-full" style={{ backgroundColor: 'var(--card-bg)' }}>
              <SplitPanel
                showLeft={!selectedRole}
                leftPanel={
                  <>
                    <PanelHeader
                      title="Roles"
                      actionButton={
                        canManageRoles && (
                          <button
                            onClick={handleCreateRole}
                            className="p-1.5 text-[#6237A0] hover:bg-purple-50 rounded-lg transition-colors"
                            title="Create Role"
                          >
                            <Plus size={16} />
                          </button>
                        )
                      }
                    >
                    <SearchBar
                      value={searchQuery}
                      onChange={setSearchQuery}
                      placeholder="Search roles..."
                      isDark={isDark}
                    />
                  </PanelHeader>
                  
                  <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {loading ? (
                      <LoadingState message="Loading roles..." />
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
                </>
              }
              rightPanel={
                selectedRole ? (
                  <>
                    <DetailHeader
                      title={selectedRole.name}
                      subtitle={`${pendingPermissions.length} permissions enabled`}
                      onBack={() => {
                        if (hasUnsavedChanges) {
                          triggerShake();
                          setPendingAction(() => () => setSelectedRole(null));
                          return;
                        }
                        setSelectedRole(null);
                      }}
                      actions={
                        <>
                          <span className="text-[10px] sm:text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Active</span>
                          <ToggleSwitch
                            checked={selectedRole.active}
                            onChange={() => handleToggleActive(selectedRole)}
                            disabled={!canManageRoles}
                          />
                        </>
                      }
                      isDark={isDark}
                    />
                    
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
                  <EmptyState
                    icon={Users}
                    title="Select a role"
                    description="Choose a role from the list to view and edit its permissions"
                    isDark={isDark}
                  />
                )
              }
            />
            </div>

            {isModalOpen && (
              <Modal
                isOpen={true}
                onClose={() => setIsModalOpen(false)}
                title="Create New Role"
                isDark={isDark}
                actions={[
                  {
                    label: 'Cancel',
                    onClick: () => setIsModalOpen(false),
                    variant: 'secondary'
                  },
                  {
                    label: 'Create Role',
                    onClick: handleSaveRole,
                    variant: 'primary',
                    disabled: !editForm.name.trim()
                  }
                ]}
              >
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Role Name
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#6237A0]/30 focus:border-[#6237A0]"
                  style={{
                    backgroundColor: 'var(--input-bg)',
                    color: 'var(--text-primary)',
                    border: `1px solid var(--border-color)`
                  }}
                  placeholder="Enter role name..."
                  autoFocus
                />
              </Modal>
            )}

            {/* Render unsaved changes bar at bottom when there are changes */}
            <UnsavedChangesBar
              show={hasUnsavedChanges}
              onSave={handleSaveChanges}
              onReset={handleResetChanges}
              isSaving={isSaving}
              shake={shakeBar}
            />
          </div>
        </div>
      </ScreenContainer>
    </Layout>
  );
}
