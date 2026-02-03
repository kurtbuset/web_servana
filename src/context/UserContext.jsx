// src/context/UserContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { AuthService } from "../services/auth.service";
import { ProfileService } from "../services/profile.service";
import socket from "../socket";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userStatuses, setUserStatuses] = useState(new Map());

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
      console.log(`✅ UserContext - User data updated successfully (session: ${userDataWithMeta._sessionId})`);
      
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
  }, []);

  // User status tracking with Socket.IO
  useEffect(() => {
    if (!userData?.sys_user_id) return;

    const userId = userData.sys_user_id;
    const userName = getUserName();
    let lastActivityTime = Date.now();
    let heartbeatInterval;
    let activityCheckInterval;

    // Connect socket if not connected
    if (!socket.connected) {
      socket.connect();
    }

    // Track user activity (mouse, keyboard, touch, scroll)
    const updateActivity = () => {
      const now = Date.now();
      const timeSinceLastActivity = now - lastActivityTime;
      
      lastActivityTime = now;
      
      // Immediately update own status in the Map (optimistic update)
      setUserStatuses(prev => {
        const newMap = new Map(prev);
        newMap.set(userId, {
          status: 'online',
          lastSeen: new Date()
        });
        return newMap;
      });
      
      // If user was inactive for more than 30 seconds, send immediate heartbeat
      // This ensures status updates immediately when user returns
      if (timeSinceLastActivity > 30000 && socket.connected) {
        console.log('🔥 User active after idle period, sending immediate heartbeat');
        socket.emit('userHeartbeat', { userId });
      }
    };

    // Activity event listeners
    const activityEvents = ['mousedown', 'keydown', 'touchstart', 'scroll', 'click'];
    activityEvents.forEach(event => {
      window.addEventListener(event, updateActivity, { passive: true });
    });

    // Wait for socket to connect, then emit userOnline
    const handleConnect = () => {
      console.log('✅ Socket connected, emitting userOnline for user:', userId);
      
      // Emit that current user is online
      socket.emit('userOnline', {
        userId,
        userType: userData.role_name || 'agent',
        userName
      });

      // Request list of online users
      socket.emit('getOnlineUsers');
    };

    // Listen for online users list
    const handleOnlineUsersList = (users) => {
      console.log('📋 Received online users list:', users);
      const statusMap = new Map();
      users.forEach(user => {
        statusMap.set(user.userId, {
          status: user.status,
          lastSeen: new Date(user.lastSeen)
        });
      });
      setUserStatuses(statusMap);
    };

    // Listen for user status changes
    const handleUserStatusChanged = ({ userId, status, lastSeen }) => {
      console.log('🔄 User status changed:', { userId, status, lastSeen });
      setUserStatuses(prev => {
        const newMap = new Map(prev);
        newMap.set(userId, { status, lastSeen: new Date(lastSeen) });
        return newMap;
      });
    };

    // If already connected, emit immediately
    if (socket.connected) {
      handleConnect();
    }

    // Heartbeat: Send ping every 30 seconds (only if active)
    heartbeatInterval = setInterval(() => {
      const idleTime = Date.now() - lastActivityTime;
      const idleThreshold = 20 * 60 * 1000; // 20 minutes in milliseconds

      if (idleTime < idleThreshold) {
        // User is active, send heartbeat
        if (socket.connected) {
          socket.emit('userHeartbeat', { userId });
          console.log('💓 Heartbeat sent (user active)');
        }
      } else {
        // User is idle for 20+ minutes, mark as offline
        console.log('😴 User idle for 20+ minutes, marking offline');
        if (socket.connected) {
          socket.emit('userOffline', { userId });
        }
      }
    }, 30000); // Check every 30 seconds

    // Check for idle status every minute
    activityCheckInterval = setInterval(() => {
      const idleTime = Date.now() - lastActivityTime;
      const idleThreshold = 20 * 60 * 1000; // 20 minutes

      if (idleTime >= idleThreshold) {
        console.log(`😴 User has been idle for ${Math.floor(idleTime / 60000)} minutes`);
      }
    }, 60000); // Check every minute

    // Listen for connection
    socket.on('connect', handleConnect);
    socket.on('onlineUsersList', handleOnlineUsersList);
    socket.on('userStatusChanged', handleUserStatusChanged);

    // Cleanup
    return () => {
      clearInterval(heartbeatInterval);
      clearInterval(activityCheckInterval);
      
      // Remove activity listeners
      activityEvents.forEach(event => {
        window.removeEventListener(event, updateActivity);
      });
      
      socket.off('connect', handleConnect);
      socket.off('onlineUsersList', handleOnlineUsersList);
      socket.off('userStatusChanged', handleUserStatusChanged);
      
      // Emit that user is going offline
      if (socket.connected) {
        console.log('❌ User going offline:', userId);
        socket.emit('userOffline', { userId });
      }
    };
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
      // Emit userOffline BEFORE logout to ensure it's sent
      if (userData?.sys_user_id && socket.connected) {
        console.log('📤 Emitting userOffline for user:', userData.sys_user_id);
        console.log('🔌 Socket connected:', socket.connected);
        console.log('🆔 Socket ID:', socket.id);
        socket.emit('userOffline', { userId: userData.sys_user_id });
        
        // Wait a bit to ensure the event is sent
        await new Promise(resolve => setTimeout(resolve, 100));
        console.log('✅ userOffline event sent, waiting 100ms for delivery');
      } else {
        console.warn('⚠️ Cannot emit userOffline:', {
          hasUserId: !!userData?.sys_user_id,
          socketConnected: socket.connected,
          socketId: socket.id
        });
      }
      
      await AuthService.logout();
      
      // Clear all user data and force fresh fetch on next login
      setUserData(null);
      
      // Clear any potential cached data in localStorage/sessionStorage
      localStorage.removeItem('userData');
      sessionStorage.removeItem('userData');
      
      // Trigger storage event to notify other components (like socket)
      localStorage.setItem('logout', Date.now().toString());
      localStorage.removeItem('logout');
      
      console.log("🔄 Logout complete - cleared all user data and cache");
      
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

  // Get user status (online/offline/last seen)
  const getUserStatus = (userId) => {
    const status = userStatuses.get(userId);
    
    // Return default object if no status found
    if (!status) {
      return { status: 'offline', lastSeen: null };
    }
    
    return status;
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
      userStatuses,
      getUserStatus,
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);