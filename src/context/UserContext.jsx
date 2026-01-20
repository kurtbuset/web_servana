// src/context/UserContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { AuthService } from "../services/auth.service";
import { ProfileService } from "../services/profile.service";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const data = await ProfileService.getProfile();
      
      // Debug logging to see what data we're receiving
      console.log("🔍 UserContext - Full profile response:", data);
      console.log("🔍 UserContext - User role:", data?.role_name);
      console.log("🔍 UserContext - User privileges:", data?.privilege);
      console.log("🔍 UserContext - Role ID:", data?.role_id);
      
      // Validate role data
      if (!data?.role_name) {
        console.warn("⚠️ User role information is missing or invalid");
      }
      
      // Validate privilege data
      if (!data?.privilege) {
        console.warn("🚨 User privilege data is missing!");
      } else {
        console.log("✅ Privilege data found:", Object.keys(data.privilege));
        // Log each permission status
        Object.entries(data.privilege).forEach(([key, value]) => {
          console.log(`  ${key}: ${value}`);
        });
      }
      
      setUserData(data);
    } catch (err) {
      console.error("Failed to fetch user data:", err);
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
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
      setUserData(null);
      return { success: true };
    } catch (err) {
      console.error("Failed to logout:", err);
      return { success: false, error: err };
    }
  };

  // Helper function for role checking (kept for backward compatibility)
  const hasRole = (roleName) => {
    if (!userData?.role_name) return false;
    return userData.role_name.toLowerCase() === roleName.toLowerCase();
  };

  // Note: These role-based functions are deprecated in favor of permission-based checks
  // They are kept for backward compatibility but should not be used for access control
  const isAdmin = () => {
    if (!userData?.role_name) return false;
    return userData.role_name.toLowerCase() === "admin";
  };

  const isAgent = () => {
    if (!userData?.role_name) return false;
    return userData.role_name.toLowerCase() === "agent";
  };

  const isClient = () => {
    if (!userData?.role_name) return false;
    return userData.role_name.toLowerCase() === "client";
  };
  
  const hasPermission = (permission) => {
    // Remove admin override - everyone goes through privilege table
    if (!userData?.privilege) {
      console.warn(`🚨 hasPermission(${permission}): No privilege data available`);
      return false;
    }
    
    const result = userData.privilege[permission] === true;
    console.log(`🔍 hasPermission(${permission}): ${result} (value: ${userData.privilege[permission]})`);
    return result;
  };

  const getRoleName = () => {
    if (!userData) return "Unknown";
    return userData.role_name || "Unknown";
  };

  // Get user ID
  const getUserId = () => {
    return userData?.user_id || null;
  };

  // Get user email
  const getUserEmail = () => {
    return userData?.user_email || null;
  };

  // Get user full name
  const getUserName = () => {
    const firstName = userData?.user_fname || "";
    const lastName = userData?.user_lname || "";
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
      updateProfile,
      uploadProfileImage,
      logout,
      hasRole,
      isAdmin,
      isAgent,
      isClient,
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
