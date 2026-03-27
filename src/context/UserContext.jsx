// src/context/UserContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { AuthService } from "../services/auth.service";
import { ProfileService } from "../services/profile.service";
import tokenService from "../services/token.service";
import socket from "../socket-simple";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const timestamp = Date.now();

      const data = await ProfileService.getProfile();

      // Validate role data
      if (!data?.role_name) {
        console.warn("⚠️ User role information is missing or invalid");
      }

      // Validate privilege data
      if (!data?.privilege) {
        console.error("🚨 User privilege data is missing!");
        console.error("🚨 This will cause permission checks to fail");
        console.error(
          "🚨 Backend response structure:",
          Object.keys(data || {}),
        );
      } else {
        // console.log("✅ Privilege data found:", Object.keys(data.privilege));
        // Log each permission status with detailed info
        Object.entries(data.privilege).forEach(([key, value]) => {
          const status = value === true ? "✅ GRANTED" : "❌ DENIED";
          // console.log(`  ${key}: ${value} ${status}`);
        });
      }

      // Store with timestamp to track freshness
      const userDataWithMeta = {
        ...data,
        _fetchedAt: timestamp,
        _sessionId: Math.random().toString(36).substr(2, 9),
      };

      setUserData(userDataWithMeta);
      // console.log(`✅ UserContext - User data updated successfully (session: ${userDataWithMeta._sessionId})`);
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
      console.log(
        "🔌 Connecting socket for authenticated user:",
        userData.sys_user_id,
      );

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
          // Server kicked us out - likely auth failure
          console.error(
            "🚨 Server disconnected socket - checking authentication...",
          );

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
      await AuthService.logout();

      // Clear all user data and force fresh fetch on next login
      setUserData(null);

      return { success: true };
    } catch (err) {
      console.error("Failed to logout:", err);
      return { success: false, error: err };
    }
  };

  const hasPermission = (permission, usePreview = true) => {
    // Check if we should use preview permissions (from RolePreviewContext)
    if (usePreview && window.__rolePreviewPermissions) {
      const previewValue = window.__rolePreviewPermissions[permission];
      console.log(
        `🎭 [PREVIEW] Checking permission ${permission}: ${previewValue}`,
      );

      // Special debug for change roles permissions
      if (permission === "priv_can_view_change_roles") {
        console.log(`🎭 [PREVIEW DEBUG] Change Roles View Permission:`, {
          permission,
          previewValue,
          allPreviewPermissions: window.__rolePreviewPermissions,
        });
      }

      return previewValue === true;
    }

    // Remove admin override - everyone goes through privilege table
    if (!userData?.privilege) {
      console.warn(
        `🚨 hasPermission(${permission}): No privilege data available`,
      );
      console.warn(`🚨 UserData state:`, {
        hasUserData: !!userData,
        userDataKeys: userData ? Object.keys(userData) : [],
        sessionId: userData?._sessionId,
        fetchedAt: userData?._fetchedAt,
      });
      return false;
    }

    const privilegeValue = userData.privilege[permission];

    // Handle undefined values (new permissions that don't exist in DB yet)
    if (privilegeValue === undefined) {
      console.warn(
        `⚠️ Permission ${permission} is undefined - likely missing from database. Defaulting to false.`,
      );
      return false;
    }

    const result = privilegeValue === true;

    // console.log(`🔍 hasPermission(${permission}): ${result} (raw value: ${privilegeValue}, type: ${typeof privilegeValue})`);

    if (!result && privilegeValue !== false) {
      console.warn(
        `⚠️ Unexpected privilege value for ${permission}:`,
        privilegeValue,
      );
    }

    return result;
  };

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
        hasPermission,
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
