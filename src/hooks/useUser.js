// src/hooks/useUser.js
import { useUserStore } from "../stores";
import { useEffect, useState } from "react";

/**
 * Backward-compatible hook for UserContext
 * Provides the same API as the old useUser() hook
 */
export const useUser = () => {
  const userData = useUserStore((state) => state.userData);
  const loading = useUserStore((state) => state.loading);
  const setUserData = useUserStore((state) => state.setUserData);
  const fetchUser = useUserStore((state) => state.fetchUser);
  const refreshUserData = useUserStore((state) => state.refreshUserData);
  const updateProfile = useUserStore((state) => state.updateProfile);
  const uploadProfileImage = useUserStore((state) => state.uploadProfileImage);
  const logout = useUserStore((state) => state.logout);
  const getPermissions = useUserStore((state) => state.getPermissions);
  const getRoleName = useUserStore((state) => state.getRoleName);
  const getUserId = useUserStore((state) => state.getUserId);
  const getUserEmail = useUserStore((state) => state.getUserEmail);
  const getUserName = useUserStore((state) => state.getUserName);
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);

  // Recompute permissions when userData or preview permissions change
  const [permissions, setPermissions] = useState(getPermissions());

  useEffect(() => {
    setPermissions(getPermissions());
  }, [userData, getPermissions]);

  // Listen for role preview changes
  useEffect(() => {
    const handlePreviewChange = () => {
      setPermissions(getPermissions());
    };

    window.addEventListener("rolePreviewChanged", handlePreviewChange);
    return () => {
      window.removeEventListener("rolePreviewChanged", handlePreviewChange);
    };
  }, [getPermissions]);

  return {
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
  };
};
