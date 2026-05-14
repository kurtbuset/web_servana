// src/stores/userStore.js
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { AuthService } from "../services/auth.service";
import { ProfileService } from "../services/profile.service";
import tokenService from "../services/token.service";
import socket from "../socket";
import {
  setupPushNotifications,
  unsubscribePush,
} from "../services/push.service";

const useUserStore = create(
  devtools(
    (set, get) => ({
      // State
      userData: null,
      loading: true,

      // Computed permissions (memoized via selector in components)
      getPermissions: () => {
        const { userData } = get();
        const source =
          window.__rolePreviewPermissions || userData?.privilege || {};

        return {
          // Communication
          canViewMessage: source.priv_can_view_message === true,
          canMessage: source.priv_can_message === true,
          canEndChat: source.priv_can_end_chat === true,
          canTransfer: source.priv_can_transfer === true,
          canUseCannedMess: source.priv_can_use_canned_mess === true,

          // Profile
          canManageProfile: source.priv_can_manage_profile === true,

          // Departments
          canViewDept: source.priv_can_view_dept === true,
          canAddDept: source.priv_can_add_dept === true,
          canEditDept: source.priv_can_edit_dept === true,
          canAssignDept: source.priv_can_assign_dept === true,

          // Roles
          canManageRole: source.priv_can_manage_role === true,
          canViewChangeRoles: source.priv_can_view_change_roles === true,
          canEditChangeRoles: source.priv_can_edit_change_roles === true,

          // Accounts
          canCreateAccount: source.priv_can_create_account === true,

          // Auto Replies
          canViewAutoReply: source.priv_can_view_auto_reply === true,
          canAddAutoReply: source.priv_can_add_auto_reply === true,
          canEditAutoReply: source.priv_can_edit_auto_reply === true,
          canDeleteAutoReply: source.priv_can_delete_auto_reply === true,

          // Macros
          canViewMacros: source.priv_can_view_macros === true,
          canAddMacros: source.priv_can_add_macros === true,
          canEditMacros: source.priv_can_edit_macros === true,
          canDeleteMacros: source.priv_can_delete_macros === true,

          // Manage Agents
          canViewManageAgents: source.priv_can_view_manage_agents === true,
          canViewAgentsInfo: source.priv_can_view_agents_info === true,
          canCreateAgentAccount: source.priv_can_create_agent_account === true,
          canEditManageAgents: source.priv_can_edit_manage_agents === true,
          canEditDeptManageAgents:
            source.priv_can_edit_dept_manage_agents === true,
          canViewAnalyticsManageAgents:
            source.priv_can_view_analytics_manage_agents === true,
        };
      },

      // Helper methods
      getRoleName: () => {
        const { userData } = get();
        if (!userData) return "Unknown";
        return userData.role_name || "Unknown";
      },

      getUserId: () => {
        const { userData } = get();
        return userData?.sys_user_id || null;
      },

      getUserEmail: () => {
        const { userData } = get();
        return userData?.sys_user_email || null;
      },

      getUserName: () => {
        const { userData } = get();
        const firstName = userData?.profile.prof_firstname || "";
        const lastName = userData?.profile.prof_lastname || "";
        return `${firstName} ${lastName}`.trim() || "Unknown User";
      },

      isAuthenticated: () => {
        const { userData } = get();
        return userData !== null;
      },

      // Actions
      setUserData: (data) => set({ userData: data }, false, "setUserData"),

      fetchUser: async () => {
        set({ loading: true }, false, "fetchUser/start");
        try {
          const data = await ProfileService.getProfile();
          set({ userData: data, loading: false }, false, "fetchUser/success");
        } catch (err) {
          console.error("❌ Failed to fetch user data:", err);
          console.error("❌ Error details:", err.response?.data || err.message);
          set({ userData: null, loading: false }, false, "fetchUser/error");
        }
      },

      refreshUserData: async () => {
        console.log("🔄 Force refreshing user data...");
        await get().fetchUser();
      },

      updateProfile: async (data) => {
        try {
          const updatedData = await ProfileService.updateProfile(data);
          set({ userData: updatedData }, false, "updateProfile");
          return { success: true, data: updatedData };
        } catch (err) {
          console.error("Failed to update profile:", err);
          return { success: false, error: err };
        }
      },

      uploadProfileImage: async (formData) => {
        try {
          const result = await ProfileService.uploadImage(formData);
          await get().fetchUser();
          return { success: true, data: result };
        } catch (err) {
          console.error("Failed to upload profile image:", err);
          return { success: false, error: err };
        }
      },

      logout: async () => {
        try {
          await unsubscribePush().catch(() => {});
          await AuthService.logout();

          set({ userData: null }, false, "logout");

          // Notify other tabs to log out
          new BroadcastChannel("auth_logout").postMessage({ type: "LOGOUT" });

          return { success: true };
        } catch (err) {
          console.error("Failed to logout:", err);
          return { success: false, error: err };
        }
      },

      // Initialize (called once on app mount)
      initialize: () => {
        const { fetchUser } = get();

        // Fetch user data
        fetchUser();

        // Start auto token refresh
        tokenService.startAutoRefresh();

        // Return cleanup function
        return () => {
          tokenService.stopAutoRefresh();
        };
      },

      // Socket connection management (called when userData changes)
      connectSocket: () => {
        const { userData } = get();

        if (userData?.sys_user_id) {
          // Update socket auth before connecting
          socket.auth = (cb) => {
            cb({
              userId: userData.sys_user_id,
              timestamp: Date.now(),
            });
          };

          // Handle disconnect events
          const handleDisconnect = (reason) => {
            if (reason === "io server disconnect") {
              setTimeout(async () => {
                try {
                  await get().fetchUser();
                  if (!get().userData) {
                    console.error(
                      "🚨 Session invalid - user needs to re-login",
                    );
                  }
                } catch (error) {
                  console.error("🚨 Failed to verify session:", error);
                }
              }, 1000);
            }
          };

          socket.on("disconnect", handleDisconnect);
          socket.connect();

          // Register push notifications
          setupPushNotifications().catch((err) =>
            console.error("❌ Push setup failed:", err),
          );

          return () => {
            socket.off("disconnect", handleDisconnect);
            if (socket.connected) {
              socket.disconnect();
            }
          };
        } else {
          if (socket.connected) {
            socket.disconnect();
          }
        }
      },
    }),
    { name: "UserStore" },
  ),
);

export default useUserStore;
