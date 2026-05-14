// src/stores/rolePreviewStore.js
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import RoleService from "../services/role.service";

const useRolePreviewStore = create(
  devtools(
    (set, get) => ({
      // State
      previewMode: false,
      previewRole: null,
      previewPermissions: null,
      loading: false,

      // Actions
      startPreview: async (roleId, roleName) => {
        set({ loading: true }, false, "startPreview/start");
        try {
          console.log(
            `🎭 Starting preview mode for role: ${roleName} (ID: ${roleId})`,
          );

          // Fetch role permissions
          const roles = await RoleService.getAllRoles();
          const role = roles.find((r) => r.role_id === roleId);

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
            "Can Edit Department Manage Agents":
              "priv_can_edit_dept_manage_agents",
            "Can View Analytics Manage Agents":
              "priv_can_view_analytics_manage_agents",
          };

          // Build privilege object
          const privileges = {};
          Object.values(permissionMap).forEach((key) => {
            privileges[key] = false;
          });

          role.permissions.forEach((label) => {
            const key = permissionMap[label];
            if (key) {
              privileges[key] = true;
            }
          });

          // Sync to window for UserStore access
          window.__rolePreviewPermissions = privileges;
          window.dispatchEvent(new CustomEvent("rolePreviewChanged"));

          set(
            {
              previewRole: { id: roleId, name: roleName },
              previewPermissions: privileges,
              previewMode: true,
              loading: false,
            },
            false,
            "startPreview/success",
          );

          console.log(`✅ Preview mode activated for ${roleName}`);
          console.log(`🔍 Preview permissions:`, privileges);

          return true;
        } catch (error) {
          console.error("❌ Failed to start preview mode:", error);
          set({ loading: false }, false, "startPreview/error");
          throw error;
        }
      },

      exitPreview: () => {
        console.log("🚪 Exiting preview mode");

        // Clear window reference
        window.__rolePreviewPermissions = null;
        window.dispatchEvent(new CustomEvent("rolePreviewChanged"));

        set(
          {
            previewMode: false,
            previewRole: null,
            previewPermissions: null,
          },
          false,
          "exitPreview",
        );
      },

      hasPreviewPermission: (permission) => {
        const { previewMode, previewPermissions } = get();
        if (!previewMode || !previewPermissions) {
          return null; // Not in preview mode
        }
        return previewPermissions[permission] === true;
      },
    }),
    { name: "RolePreviewStore" },
  ),
);

export default useRolePreviewStore;
