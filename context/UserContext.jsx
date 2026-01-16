// src/context/UserContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { AuthService } from "../src/services/auth.service";
import { ProfileService } from "../src/services/profile.service";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const data = await ProfileService.getProfile();
      
      // Validate role data
      if (!data?.role_name) {
        console.warn("User role information is missing or invalid");
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

  // Helper function for role checking
  const hasRole = (roleName) => {
    if (!userData?.role_name) return false;
    return userData.role_name.toLowerCase() === roleName.toLowerCase();
  };

  // Helper functions for role-based access
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
    // If user is admin, grant all permissions
    if (isAdmin()) {
      return true;
    }
    
    if (!userData?.privilege) return false;
    return userData.privilege[permission] === true;
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
