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
      console.log('response: ', res.data)
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

  return (
    <UserContext.Provider value={{ userData, setUserData, loading, fetchUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
