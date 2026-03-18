// src/context/AgentStatusContext.jsx
import { createContext, useContext, useEffect } from "react";
import { useUser } from "./UserContext";
import { showWarning, dismissToast } from "../utils/toast";
import { useActivityTracking } from "../hooks/useActivityTracking";
import { useAgentStatusSocket } from "../hooks/useAgentStatusSocket";
import agentStatusService from "../services/agentStatusService";
import socket, {
  updateAgentStatus as updateAgentStatusEmitter,
} from "../socket-simple";

const AgentStatusContext = createContext();

/**
 * UserStatusProvider
 * Manages online/offline status tracking for all users
 * AND agent status tracking (accepting_chats, not_accepting_chats, offline)
 * Separated from UserContext for single responsibility
 */
export const AgentStatusProvider = ({ children }) => {
  const { userData, getUserName } = useUser();

  // Activity tracking
  const activityTracking = useActivityTracking();

  // Socket and status management
  const userId = userData?.sys_user_id;
  const isAgent =
    userData?.role_name === "Agent" || userData?.role_name === "Admin";
  const { agentStatuses, setAgentStatuses, sendImmediateHeartbeatIfIdle } =
    useAgentStatusSocket(userId, isAgent, activityTracking);

  /**
   * Fetch agent status from REST API
   * @param {number} userId - User ID to fetch status for
   */
  const fetchAgentStatus = async (userId) => {
    if (!userId) return;

    try {
      const agentStatus = await agentStatusService.getAgentStatus();
      
      // Update socket state with REST API data
      setAgentStatuses(prev => {
        const newMap = new Map(prev);
        newMap.set(userId, {
          agentStatus,
          lastSeen: new Date(),
        });
        return newMap;
      });

      console.log(`✅ Fetched agent status from REST API: ${agentStatus}`);
    } catch (error) {
      console.error("❌ Failed to fetch agent status from REST API:", error);
      
      // Set error state
      setAgentStatuses(prev => {
        const newMap = new Map(prev);
        newMap.set(userId, {
          agentStatus: "offline",
          lastSeen: new Date(),
        });
        return newMap;
      });
    }
  };

  // Fetch initial agent status from REST API when user loads or changes
  useEffect(() => {
    if (userId && isAgent) {
      console.log(`🔄 Fetching agent status for user ${userId} (isAgent: ${isAgent})`);
      fetchAgentStatus(userId);
    }
  }, [userId, isAgent, userData?._fetchedAt]); // Include _fetchedAt to refetch after login

  /**
   * Handle immediate heartbeat on activity
   */
  const handleActivityUpdate = () => {
    const timeSinceLastActivity = activityTracking.updateActivity();

    if (!userId) return;

    // If user was inactive for more than 30 seconds, send immediate heartbeat
    if (timeSinceLastActivity > 30000 && socket.connected) {
      sendImmediateHeartbeatIfIdle(timeSinceLastActivity);
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
      window.addEventListener(event, handleActivityUpdate, { passive: true });
    });

    return () => {
      activityEvents.forEach((event) => {
        window.removeEventListener(event, handleActivityUpdate);
      });
    };
  }, [userId, handleActivityUpdate]);

  /**
   * Setup session warning for agents
   */
  useEffect(() => {
    if (!isAgent || !userId) return;

    const checkIdleStatus = () => {
      const idleMinutes = activityTracking.getIdleMinutes();

      if (idleMinutes === 10) {
        console.log("⚠️ Agent idle for 10 minutes, showing session warning");

        activityTracking.setSessionWarning(
          showWarning,
          dismissToast,
          () => {
            console.log("👆 User clicked to stay logged in");
            activityTracking.updateActivity();
          },
          () => {
            console.log("⏰ Session expired after 15 minutes of inactivity");
            window.location.href = "/login?reason=session_expired";
          },
        );
      }
    };

    // Check every minute
    const interval = setInterval(checkIdleStatus, 60000);

    return () => {
      clearInterval(interval);
      activityTracking.clearSessionWarning(dismissToast);
    };
  }, [isAgent, userId, activityTracking]);

  /**
   * Get agent status (accepting_chats/not_accepting_chats/offline)
   * First tries to get from socket state, falls back to REST API
   * @param {number} userId - User ID to check
   * @returns {Object} Status object with agentStatus and lastSeen
   */
  const getAgentStatus = (userId) => {
    const status = agentStatuses.get(userId);

    // Return socket state if available
    if (status) {
      return status;
    }

    // Return loading state - REST API will be called separately
    return { agentStatus: "loading", lastSeen: null };
  };

  /**
   * Update agent status (accepting_chats/not_accepting_chats)
   * Uses REST API first, then socket for real-time updates
   * @param {string} agentStatus - New agent status
   */
  const updateAgentStatus = async (agentStatus) => {
    if (!userData?.sys_user_id) return;

    const validStatuses = ["accepting_chats", "not_accepting_chats"];
    if (!validStatuses.includes(agentStatus)) {
      console.error("Invalid agent status:", agentStatus);
      return;
    }

    try {
      // 1. Update via REST API first (authoritative)
      console.log(`🔄 Updating agent status via REST API: ${agentStatus}`);
      await agentStatusService.updateAgentStatus(agentStatus);

      // 2. Update local state immediately for responsive UI
      setAgentStatuses(prev => {
        const newMap = new Map(prev);
        newMap.set(userData.sys_user_id, {
          agentStatus,
          lastSeen: new Date(),
        });
        return newMap;
      });

      // 3. Emit socket event for real-time updates to other clients
      // (REST API already broadcasts, but this ensures immediate local updates)
      if (socket.connected) {
        updateAgentStatusEmitter(socket, agentStatus);
      }

      console.log(`✅ Agent status updated successfully: ${agentStatus}`);
    } catch (error) {
      console.error("❌ Failed to update agent status:", error);
      throw error;
    }
  };

  return (
    <AgentStatusContext.Provider
      value={{
        agentStatuses,
        getAgentStatus,
        updateAgentStatus,
        fetchAgentStatus,
      }}
    >
      {children}
    </AgentStatusContext.Provider>
  );
};

export const useAgentStatus = () => {
  const context = useContext(AgentStatusContext);
  if (!context) {
    throw new Error("useAgentStatus must be used within a AgentStatusProvider");
  }
  return context;
};
