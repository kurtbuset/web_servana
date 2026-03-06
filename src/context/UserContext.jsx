// src/context/UserContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { AuthService } from "../services/auth.service";
import { ProfileService } from "../services/profile.service";
import tokenService from "../services/token.service";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async (forceRefresh = false) => {
    setLoading(true);
    try {
      // Add timestamp to prevent caching issues
      const timestamp = Date.now();
      console.log(`🔄 UserContext - Fetching user data (${forceRefresh ? 'forced refresh' : 'normal'}) at ${timestamp}`);
      
      const data = await ProfileService.getProfile();
      
      // Debug logging to see what data we're receiving
      // console.log("🔍 UserContext - Full profile response:", data);
      // console.log("🔍 UserContext - User role:", data?.role_name);
      // console.log("🔍 UserContext - User privileges:", data?.privilege);
      // console.log("🔍 UserContext - Role ID:", data?.role_id);
      
      // Validate role data
      if (!data?.role_name) {
        console.warn("⚠️ User role information is missing or invalid");
      }
      
      // Validate privilege data
      if (!data?.privilege) {
        console.error("🚨 User privilege data is missing!");
        console.error("🚨 This will cause permission checks to fail");
        console.error("🚨 Backend response structure:", Object.keys(data || {}));
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
        _sessionId: Math.random().toString(36).substr(2, 9)
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

  // Force refresh user data (useful after login/logout)
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
      
      // Clear any potential cached data in localStorage/sessionStorage
      localStorage.removeItem('userData');
      sessionStorage.removeItem('userData');
      
      // Trigger storage event to notify other components (like socket)
      localStorage.setItem('logout', Date.now().toString());
      localStorage.removeItem('logout');
      
      return { success: true };
    } catch (err) {
      console.error("Failed to logout:", err);
      return { success: false, error: err };
    }
  };

  const hasPermission = (permission) => {
    // Remove admin override - everyone goes through privilege table
    if (!userData?.privilege) {
      console.warn(`🚨 hasPermission(${permission}): No privilege data available`);
      console.warn(`🚨 UserData state:`, {
        hasUserData: !!userData,
        userDataKeys: userData ? Object.keys(userData) : [],
        sessionId: userData?._sessionId,
        fetchedAt: userData?._fetchedAt
      });
      return false;
    }
    
    const privilegeValue = userData.privilege[permission];
    const result = privilegeValue === true;
    
    // console.log(`🔍 hasPermission(${permission}): ${result} (raw value: ${privilegeValue}, type: ${typeof privilegeValue})`);
    
    if (!result && privilegeValue !== false) {
      console.warn(`⚠️ Unexpected privilege value for ${permission}:`, privilegeValue);
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
    <UserContext.Provider value={{ 
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
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);