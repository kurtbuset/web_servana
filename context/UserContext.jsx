// src/context/UserContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../src/api";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const res = await api.get("/profile", { withCredentials: true });
      setUserData(res.data);
    } catch (err) {
      console.error("Failed to fetch user data:", err.response?.data || err);
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Helper functions for role-based access
  const isAdmin = () => userData?.role_id === 1;
  const isAgent = () => userData?.role_id === 3;
  const isClient = () => userData?.role_id === 2;
  
  const hasPermission = (permission) => {
    // If user is admin (role_id = 1), grant all permissions
    if (userData?.role_id === 1) {
      return true;
    }
    
    if (!userData?.role?.privilege) return false;
    return userData.role.privilege[permission] === true;
  };

  const getRoleName = () => {
    if (!userData?.role) return "Unknown";
    return userData.role.role_name || "Unknown";
  };

  return (
    <UserContext.Provider value={{ 
      userData, 
      setUserData, 
      loading, 
      fetchUser,
      isAdmin,
      isAgent,
      isClient,
      hasPermission,
      getRoleName
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
