// src/context/UserStatusContext.jsx
import { createContext, useContext, useEffect, useState, useRef } from "react";
import socket from "../socket-simple";
import { useUser } from "./UserContext";
import { showWarning, dismissToast } from "../utils/toast";

const UserStatusContext = createContext();

/**
 * UserStatusProvider
 * Manages online/offline status tracking for all users
 * AND agent status tracking (accepting_chats, not_accepting_chats, offline)
 * Separated from UserContext for single responsibility
 */
export const UserStatusProvider = ({ children }) => {
  const { userData, getUserName } = useUser();
  const [userStatuses, setUserStatuses] = useState(new Map());
  const [agentStatuses, setAgentStatuses] = useState(new Map());

  const lastActivityTimeRef = useRef(Date.now());
  const heartbeatIntervalRef = useRef(null);
  const agentHeartbeatIntervalRef = useRef(null);
  const activityCheckIntervalRef = useRef(null);
  const sessionWarningToastIdRef = useRef(null);
  const sessionTimeoutRef = useRef(null);

  /**
   * Track user activity and update status
   */
  const updateActivity = () => {
    const now = Date.now();
    const timeSinceLastActivity = now - lastActivityTimeRef.current;

    lastActivityTimeRef.current = now;

    // Dismiss session warning if user becomes active
    if (sessionWarningToastIdRef.current) {
      dismissToast(sessionWarningToastIdRef.current);
      sessionWarningToastIdRef.current = null;
    }

    // Clear session timeout if user becomes active
    if (sessionTimeoutRef.current) {
      clearTimeout(sessionTimeoutRef.current);
      sessionTimeoutRef.current = null;
    }

    if (!userData?.sys_user_id) return;

    // Optimistic update - immediately show user as online
    setUserStatuses((prev) => {
      const newMap = new Map(prev);
      newMap.set(userData.sys_user_id, {
        status: "online",
        lastSeen: new Date(),
      });
      return newMap;
    });

    // If user was inactive for more than 30 seconds, send immediate heartbeat
    if (timeSinceLastActivity > 30000 && socket.connected) {
      console.log(
        "🔥 User active after idle period, sending immediate heartbeat",
      );
      socket.emit("userHeartbeat", { userId: userData.sys_user_id });

      // Also send agent heartbeat if user is an agent
      if (userData.role_name === "agent" || userData.role_name === "admin") {
        socket.emit("agentHeartbeat", { userId: userData.sys_user_id });
      }
    }
  };

  /**
   * Setup activity tracking
   */
  useEffect(() => {
    const activityEvents = [
      "mousedown",
      "keydown",
      "touchstart",
      "scroll",
      "click",
    ];

    activityEvents.forEach((event) => {
      window.addEventListener(event, updateActivity, { passive: true });
    });

    return () => {
      activityEvents.forEach((event) => {
        window.removeEventListener(event, updateActivity);
      });
    };
  }, [userData?.sys_user_id]);

  /**
   * Setup socket connection and status tracking
   */
  useEffect(() => {
    if (!userData?.sys_user_id) return;

    const userId = userData.sys_user_id;
    const userName = getUserName();
    const isAgent =
      userData.role_name === "agent" || userData.role_name === "admin";

    /**
     * Handle socket connection
     */
    const handleConnect = () => {
      console.log("✅ Socket connected, emitting userOnline for user:", userId);

      // Emit that current user is online
      socket.emit("userOnline", {
        userId,
        userType: userData.role_name || "agent",
        userName,
      });

      // Request list of online users
      socket.emit("getOnlineUsers");

      // Always request agent statuses (includes database fetch for offline agents)
      console.log("📡 Requesting agent statuses from server...");
      socket.emit("getAgentStatuses");
    };

    /**
     * Handle online users list
     */
    const handleOnlineUsersList = (users) => {
      console.log("📋 Received online users list:", users);

      const statusMap = new Map();

      if (!users) {
        console.warn("⚠️ No users data received");
        return;
      }

      // If users is an object (Map-like), convert to array
      if (typeof users === "object" && !Array.isArray(users)) {
        Object.entries(users).forEach(([userId, userData]) => {
          statusMap.set(parseInt(userId, 10), {
            status: userData.status,
            lastSeen: new Date(userData.lastSeen),
          });
        });
      }
      // If users is an array
      else if (Array.isArray(users)) {
        users.forEach((user) => {
          statusMap.set(user.userId, {
            status: user.status,
            lastSeen: new Date(user.lastSeen),
          });
        });
      }

      setUserStatuses(statusMap);
    };

    /**
     * Handle user status changes
     */
    const handleUserStatusChanged = ({ userId, status, lastSeen }) => {
      console.log("🔄 User status changed:", { userId, status, lastSeen });
      setUserStatuses((prev) => {
        const newMap = new Map(prev);
        newMap.set(userId, { status, lastSeen: new Date(lastSeen) });
        return newMap;
      });
    };

    /**
     * Handle agent statuses list
     */
    const handleAgentStatusesList = (agents) => {
      console.log("📋 Received agent statuses list:", agents);
      console.log("📋 Number of agents:", Object.keys(agents || {}).length);

      const statusMap = new Map();

      if (!agents) {
        console.warn("⚠️ No agents data received");
        return;
      }

      // If agents is an object (Map-like), convert to array
      if (typeof agents === "object" && !Array.isArray(agents)) {
        Object.entries(agents).forEach(([userId, agentData]) => {
          statusMap.set(parseInt(userId, 10), {
            agentStatus: agentData.agentStatus,
            lastSeen: new Date(agentData.lastSeen),
          });
        });
      }
      // If agents is an array
      else if (Array.isArray(agents)) {
        agents.forEach((agent) => {
          statusMap.set(agent.userId, {
            agentStatus: agent.agentStatus,
            lastSeen: new Date(agent.lastSeen),
          });
        });
      }

      console.log("✅ Loaded agent statuses for", statusMap.size, "agents");
      setAgentStatuses(statusMap);
    };

    /**
     * Handle agent status changes
     */
    const handleAgentStatusChanged = ({ userId, agentStatus, lastSeen }) => {
      console.log("🔄 Agent status changed:", {
        userId,
        agentStatus,
        lastSeen,
      });
      setAgentStatuses((prev) => {
        const newMap = new Map(prev);
        newMap.set(userId, { agentStatus, lastSeen: new Date(lastSeen) });
        return newMap;
      });
    };

    // If already connected, emit immediately
    if (socket.connected) {
      handleConnect();
    }

    /**
     * Handle socket reconnection - refetch all statuses
     */
    const handleReconnect = () => {
      console.log("🔄 Socket reconnected, refetching statuses...");
      handleConnect();
    };

    /**
     * Heartbeat: Send ping every 30 seconds (only if active)
     */
    heartbeatIntervalRef.current = setInterval(() => {
      const idleTime = Date.now() - lastActivityTimeRef.current;
      const idleThreshold = 20 * 60 * 1000; // 20 minutes

      if (idleTime < idleThreshold) {
        // User is active, send heartbeat
        if (socket.connected) {
          socket.emit("userHeartbeat", { userId });
          console.log("💓 Heartbeat sent (user active)");
        }
      } else {
        // User is idle for 20+ minutes, mark as offline
        console.log("😴 User idle for 20+ minutes, marking offline");
        if (socket.connected) {
          socket.emit("userOffline", { userId });
        }
      }
    }, 30000); // Check every 30 seconds

    /**
     * Agent Heartbeat: Send ping every 30 seconds (only if active and is agent)
     * Aligned with token lifecycle: 12 minutes idle threshold
     */
    if (isAgent) {
      agentHeartbeatIntervalRef.current = setInterval(() => {
        const idleTime = Date.now() - lastActivityTimeRef.current;
        const idleThreshold = 12 * 60 * 1000; // 12 minutes (matches token auto-refresh)

        if (idleTime < idleThreshold) {
          // Agent is active, send heartbeat
          if (socket.connected) {
            socket.emit("agentHeartbeat", { userId });
            console.log("💓 Agent heartbeat sent (agent active)");
          }
        } else {
          // Agent is idle for 12+ minutes, mark as offline
          console.log("😴 Agent idle for 12+ minutes, marking offline");
          if (socket.connected) {
            socket.emit("agentOffline", { userId });
          }
        }
      }, 30000); // Check every 30 seconds
    }

    /**
     * Check for idle status every minute
     * Show session warning at 10 minutes for agents (5 minutes before 15-minute token expiry)
     */
    activityCheckIntervalRef.current = setInterval(() => {
      const idleTime = Date.now() - lastActivityTimeRef.current;
      const idleMinutes = Math.floor(idleTime / 60000);

      // For agents: show warning at 10 minutes (5 minutes before token expiry)
      if (isAgent && idleMinutes === 10 && !sessionWarningToastIdRef.current) {
        console.log("⚠️ Agent idle for 10 minutes, showing session warning");

        sessionWarningToastIdRef.current = showWarning(
          "Your session will expire in 5 minutes due to inactivity. Click here to stay logged in.",
          {
            autoClose: false,
            closeOnClick: true,
            onClick: () => {
              console.log("👆 User clicked to stay logged in");
              updateActivity();
            },
          },
        );

        // Set timeout to force logout at 15 minutes
        sessionTimeoutRef.current = setTimeout(
          () => {
            console.log("⏰ Session expired after 15 minutes of inactivity");

            // Dismiss warning toast
            if (sessionWarningToastIdRef.current) {
              dismissToast(sessionWarningToastIdRef.current);
              sessionWarningToastIdRef.current = null;
            }

            // Force logout by redirecting to login
            window.location.href = "/login?reason=session_expired";
          },
          5 * 60 * 1000,
        ); // 5 minutes from now (total 15 minutes)
      }

      // Log idle status
      const idleThreshold = isAgent ? 10 * 60 * 1000 : 20 * 60 * 1000;
      if (idleTime >= idleThreshold) {
        console.log(`😴 User has been idle for ${idleMinutes} minutes`);
      }
    }, 60000); // Check every minute

    // Listen for socket events
    socket.on("connect", handleConnect);
    socket.on("userStatusChanged", handleUserStatusChanged);
    socket.on("agentStatusesList", handleAgentStatusesList);
    socket.on("agentStatusChanged", handleAgentStatusChanged);

    // Cleanup
    return () => {
      clearInterval(heartbeatIntervalRef.current);
      clearInterval(agentHeartbeatIntervalRef.current);
      clearInterval(activityCheckIntervalRef.current);

      // Clear session warning and timeout
      if (sessionWarningToastIdRef.current) {
        dismissToast(sessionWarningToastIdRef.current);
        sessionWarningToastIdRef.current = null;
      }
      if (sessionTimeoutRef.current) {
        clearTimeout(sessionTimeoutRef.current);
        sessionTimeoutRef.current = null;
      }

      socket.off("connect", handleConnect);
      socket.off("userStatusChanged", handleUserStatusChanged);
      socket.off("agentStatusesList", handleAgentStatusesList);
      socket.off("agentStatusChanged", handleAgentStatusChanged);

      // Emit that user is going offline
      if (socket.connected) {
        console.log("❌ User going offline:", userId);
        socket.emit("userOffline", { userId });

        // Also emit agent offline if user is an agent
        if (isAgent) {
          socket.emit("agentOffline", { userId });
        }
      }
    };
  }, [userData?.sys_user_id, userData?.role_name, getUserName]);

  /**
   * Get user status (online/offline/last seen)
   * @param {number} userId - User ID to check
   * @returns {Object} Status object with status and lastSeen
   */
  const getUserStatus = (userId) => {
    const status = userStatuses.get(userId);

    // Return default object if no status found
    if (!status) {
      return { status: "offline", lastSeen: null };
    }

    return status;
  };

  /**
   * Get agent status (accepting_chats/not_accepting_chats/offline)
   * @param {number} userId - User ID to check
   * @returns {Object} Status object with agentStatus and lastSeen
   */
  const getAgentStatus = (userId) => {
    const status = agentStatuses.get(userId);

    // Return default object if no status found
    if (!status) {
      return { agentStatus: "offline", lastSeen: null };
    }

    return status;
  };

  /**
   * Update agent status (accepting_chats/not_accepting_chats)
   * @param {string} agentStatus - New agent status
   */
  const updateAgentStatus = (agentStatus) => {
    if (!userData?.sys_user_id) return;

    const validStatuses = ["accepting_chats", "not_accepting_chats"];
    if (!validStatuses.includes(agentStatus)) {
      console.error("Invalid agent status:", agentStatus);
      return;
    }

    // Optimistic update
    setAgentStatuses((prev) => {
      const newMap = new Map(prev);
      newMap.set(userData.sys_user_id, {
        agentStatus,
        lastSeen: new Date(),
      });
      return newMap;
    });

    // Emit to server
    if (socket.connected) {
      socket.emit("updateAgentStatus", { agentStatus });
      console.log("📡 Emitted updateAgentStatus:", agentStatus);
    }
  };

  /**
   * Check if user is online
   * @param {number} userId - User ID to check
   * @returns {boolean} True if user is online
   */
  const isUserOnline = (userId) => {
    const status = getUserStatus(userId);
    return status.status === "online";
  };

  /**
   * Get all online users
   * @returns {Array} Array of online user IDs
   */
  const getOnlineUsers = () => {
    const onlineUsers = [];
    userStatuses.forEach((status, userId) => {
      if (status.status === "online") {
        onlineUsers.push(userId);
      }
    });
    return onlineUsers;
  };

  /**
   * Get online users count
   * @returns {number} Number of online users
   */
  const getOnlineUsersCount = () => {
    return getOnlineUsers().length;
  };

  return (
    <UserStatusContext.Provider
      value={{
        userStatuses,
        agentStatuses,
        getUserStatus,
        getAgentStatus,
        updateAgentStatus,
        isUserOnline,
        getOnlineUsers,
        getOnlineUsersCount,
      }}
    >
      {children}
    </UserStatusContext.Provider>
  );
};

export const useUserStatus = () => {
  const context = useContext(UserStatusContext);
  if (!context) {
    throw new Error("useUserStatus must be used within a UserStatusProvider");
  }
  return context;
};
