// src/context/UserContext.jsx
import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { AuthService } from "../services/auth.service";
import { ProfileService } from "../services/profile.service";
import tokenService from "../services/token.service";
import socket from "../socket";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    setLoading(true);
    try {

      const data = await ProfileService.getProfile();
      setUserData(data);
    } catch (err) {
      console.error("❌ Failed to fetch user data:", err);
      console.error("❌ Error details:", err.response?.data || err.message);
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  // Force refresh user data (useful after login/logout or permission changes)
  const refreshUserData = async () => {
    console.log("🔄 Force refreshing user data...");
    await fetchUser(true);
  };

  useEffect(() => {
    fetchUser();

    // Start auto token refresh when user context loads
    tokenService.startAutoRefresh();

    return () => {
      // Stop auto refresh on unmount
      tokenService.stopAutoRefresh();
    };
  }, []);

  // Connect socket when user is authenticated
  useEffect(() => {
    if (userData?.sys_user_id) {

      // Update socket auth before connecting
      socket.auth = (cb) => {
        cb({
          userId: userData.sys_user_id,
          timestamp: Date.now(),
        });
      };

      // Handle disconnect events specific to user context
      const handleDisconnect = (reason) => {
        if (reason === "io server disconnect") {
          // Check if we still have valid session
          setTimeout(async () => {
            try {
              await fetchUser();
              if (!userData) {
                console.error("🚨 Session invalid - user needs to re-login");
                // Could trigger logout or show re-login modal here
              }
            } catch (error) {
              console.error("🚨 Failed to verify session:", error);
            }
          }, 1000);
        }
      };

      socket.on("disconnect", handleDisconnect);
      socket.connect();

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
  }, [userData?.sys_user_id]);

  // Update user profile
  const updateProfile = async (data) => {
    try {
      const updatedData = await ProfileService.updateProfile(data);
      setUserData(updatedData);
      return { success: true, data: updatedData };
    } catch (err) {
      console.error("Failed to update profile:", err);
      return { success: false, error: err };
    }
  };

  // Upload profile image
  const uploadProfileImage = async (formData) => {
    try {
      const result = await ProfileService.uploadImage(formData);
      // Refresh user data after image upload
      await fetchUser();
      return { success: true, data: result };
    } catch (err) {
      console.error("Failed to upload profile image:", err);
      return { success: false, error: err };
    }
  };

  // Logout user
  const logout = async () => {
    try {
      const logoutData = await AuthService.logout();
      console.log(JSON.stringify(logoutData, null, 2))

      // Clear all user data and force fresh fetch on next login
      setUserData(null);

      return { success: true };
    } catch (err) {
      console.error("Failed to logout:", err);
      return { success: false, error: err };
    }
  };


  // Memoized permissions object - compute once, reuse everywhere
  const permissions = useMemo(() => {
    const source = window.__rolePreviewPermissions || userData?.privilege || {};
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
      canManageDept: source.priv_can_manage_dept === true,
      canAssignDept: source.priv_can_assign_dept === true,
      
      // Roles
      canManageRole: source.priv_can_manage_role === true,
      canAssignRole: source.priv_can_assign_role === true,
      canViewChangeRoles: source.priv_can_view_change_roles === true,
      canEditChangeRoles: source.priv_can_edit_change_roles === true,
      
      // Accounts
      canCreateAccount: source.priv_can_create_account === true,
      
      // Auto Replies
      canViewAutoReply: source.priv_can_view_auto_reply === true,
      canAddAutoReply: source.priv_can_add_auto_reply === true,
      canEditAutoReply: source.priv_can_edit_auto_reply === true,
      canDeleteAutoReply: source.priv_can_delete_auto_reply === true,
      canManageAutoReply: source.priv_can_manage_auto_reply === true,
      
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
      canEditDeptManageAgents: source.priv_can_edit_dept_manage_agents === true,
      canViewAnalyticsManageAgents: source.priv_can_view_analytics_manage_agents === true,
    };
  }, [userData?.privilege, window.__rolePreviewPermissions]);

  const getRoleName = () => {
    if (!userData) return "Unknown";
    return userData.role_name || "Unknown";
  };

  // Get user ID
  const getUserId = () => {
    return userData?.sys_user_id || null;
  };

  // Get user email
  const getUserEmail = () => {
    return userData?.sys_user_email || null;
  };

  // Get user full name
  const getUserName = () => {
    const firstName = userData?.profile.prof_firstname || "";
    const lastName = userData?.profile.prof_lastname || "";
    return `${firstName} ${lastName}`.trim() || "Unknown User";
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return userData !== null;
  };

  return (
    <UserContext.Provider
      value={{
        userData,
        setUserData,
        loading,
        fetchUser,
        refreshUserData,
        updateProfile,
        uploadProfileImage,
        logout,
        permissions,
        getRoleName,
        getUserId,
        getUserEmail,
        getUserName,
        isAuthenticated,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
