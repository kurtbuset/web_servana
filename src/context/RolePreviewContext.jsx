// src/context/RolePreviewContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import RoleService from "../services/role.service";

const RolePreviewContext = createContext();

export const RolePreviewProvider = ({ children }) => {
  const [previewMode, setPreviewMode] = useState(false);
  const [previewRole, setPreviewRole] = useState(null);
  const [previewPermissions, setPreviewPermissions] = useState(null);
  const [loading, setLoading] = useState(false);

  // Sync preview permissions to window for UserContext access
  useEffect(() => {
    if (previewMode && previewPermissions) {
      console.log('🎭 Setting preview permissions:', previewPermissions);
      console.log('🎭 Change Roles permissions in preview:', {
        'priv_can_view_change_roles': previewPermissions['priv_can_view_change_roles'],
        'priv_can_edit_change_roles': previewPermissions['priv_can_edit_change_roles']
      });
      window.__rolePreviewPermissions = previewPermissions;
      
      // Force a re-render by dispatching a custom event
      window.dispatchEvent(new CustomEvent('rolePreviewChanged'));
    } else {
      window.__rolePreviewPermissions = null;
      
      // Force a re-render by dispatching a custom event
      window.dispatchEvent(new CustomEvent('rolePreviewChanged'));
    }
  }, [previewMode, previewPermissions]);

  // Start preview mode for a specific role
  const startPreview = async (roleId, roleName) => {
    setLoading(true);
    try {
      console.log(`🎭 Starting preview mode for role: ${roleName} (ID: ${roleId})`);
      
      // Fetch role permissions
      const roles = await RoleService.getAllRoles();
      const role = roles.find(r => r.role_id === roleId);
      
      if (!role) {
        throw new Error("Role not found");
      }

      // Convert permissions array to privilege object format
      const permissionMap = {
        "Can view Chats": "priv_can_view_message",
        "Can Reply": "priv_can_message",
        "Can Manage Profile": "priv_can_manage_profile",
        "Can send Macros": "priv_can_use_canned_mess",
        "Can End Chat": "priv_can_end_chat",
        "Can Transfer Department": "priv_can_transfer",
        "Can View Departments": "priv_can_view_dept",
        "Can Add Departments": "priv_can_add_dept",
        "Can Edit Departments": "priv_can_edit_dept",
        "Can Assign Department": "priv_can_assign_dept",
        "Can Edit Roles": "priv_can_manage_role",
        "Can View Change Roles": "priv_can_view_change_roles",
        "Can Edit Change Roles": "priv_can_edit_change_roles",
        "Can Add Admin Accounts": "priv_can_create_account",
        "Can View Auto-Replies": "priv_can_view_auto_reply",
        "Can Add Auto-Replies": "priv_can_add_auto_reply",
        "Can Edit Auto-Replies": "priv_can_edit_auto_reply",
        "Can Delete Auto-Replies": "priv_can_delete_auto_reply",
        "Can View Macros": "priv_can_view_macros",
        "Can Add Macros": "priv_can_add_macros",
        "Can Edit Macros": "priv_can_edit_macros",
        "Can Delete Macros": "priv_can_delete_macros",
        "Can View Manage Agents": "priv_can_view_manage_agents",
        "Can View Agents Information": "priv_can_view_agents_info",
        "Can Create Agent Account": "priv_can_create_agent_account",
        "Can Edit Manage Agents": "priv_can_edit_manage_agents",
        "Can Edit Department Manage Agents": "priv_can_edit_dept_manage_agents",
        "Can View Analytics Manage Agents": "priv_can_view_analytics_manage_agents",
      };

      // Build privilege object
      const privileges = {};
      Object.values(permissionMap).forEach(key => {
        privileges[key] = false;
      });
      
      role.permissions.forEach(label => {
        const key = permissionMap[label];
        if (key) {
          privileges[key] = true;
        }
      });

      setPreviewRole({ id: roleId, name: roleName });
      setPreviewPermissions(privileges);
      setPreviewMode(true);
      
      console.log(`✅ Preview mode activated for ${roleName}`);
      console.log(`🔍 Preview permissions:`, privileges);
      
      return true; // Return success
      
    } catch (error) {
      console.error("❌ Failed to start preview mode:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Exit preview mode
  const exitPreview = () => {
    console.log("🚪 Exiting preview mode");
    setPreviewMode(false);
    setPreviewRole(null);
    setPreviewPermissions(null);
  };

  // Check if a permission is available in preview mode
  const hasPreviewPermission = (permission) => {
    if (!previewMode || !previewPermissions) {
      return null; // Not in preview mode
    }
    return previewPermissions[permission] === true;
  };

  return (
    <RolePreviewContext.Provider
      value={{
        previewMode,
        previewRole,
        previewPermissions,
        loading,
        startPreview,
        exitPreview,
        hasPreviewPermission,
      }}
    >
      {children}
    </RolePreviewContext.Provider>
  );
};

export const useRolePreview = () => {
  const context = useContext(RolePreviewContext);
  if (!context) {
    throw new Error("useRolePreview must be used within RolePreviewProvider");
  }
  return context;
};
