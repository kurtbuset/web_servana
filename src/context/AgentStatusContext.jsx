// src/context/AgentStatusContext.jsx
import { createContext, useContext, useEffect } from "react";
import { useUser } from "./UserContext";
import { showWarning, dismissToast } from "../utils/toast";
import { useActivityTracking } from "../hooks/useActivityTracking";
import { useAgentStatusSocket } from "../hooks/useAgentStatusSocket";
import { updateAgentStatus as updateAgentStatusEmitter } from "../socket/emitters";
import socket from "../socket/index";

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
  const isAgent = userData?.role_name === 'Agent' || userData?.role_name === 'Admin';
  const { agentStatuses, setAgentStatuses, sendImmediateHeartbeatIfIdle } = useAgentStatusSocket(userId, isAgent, activityTracking);

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
    const activityEvents = ['mousedown', 'keydown', 'touchstart', 'scroll', 'click'];
    
    activityEvents.forEach(event => {
      window.addEventListener(event, handleActivityUpdate, { passive: true });
    });

    return () => {
      activityEvents.forEach(event => {
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
        console.log('⚠️ Agent idle for 10 minutes, showing session warning');
        
        activityTracking.setSessionWarning(
          showWarning,
          dismissToast,
          () => {
            console.log('👆 User clicked to stay logged in');
            activityTracking.updateActivity();
          },
          () => {
            console.log('⏰ Session expired after 15 minutes of inactivity');
            window.location.href = '/login?reason=session_expired';
          }
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
   * @param {number} userId - User ID to check
   * @returns {Object} Status object with agentStatus and lastSeen
   */
  const getAgentStatus = (userId) => {
    const status = agentStatuses.get(userId);
    
    // Return default object if no status found
    if (!status) {
      return { agentStatus: 'offline', lastSeen: null };
    }
    
    return status;
  };

  /**
   * Update agent status (accepting_chats/not_accepting_chats)
   * @param {string} agentStatus - New agent status
   */
  const updateAgentStatus = (agentStatus) => {
    if (!userData?.sys_user_id) return;
    
    const validStatuses = ['accepting_chats', 'not_accepting_chats'];
    if (!validStatuses.includes(agentStatus)) {
      console.error('Invalid agent status:', agentStatus);
      return;
    }
    
    // Optimistic update
    setAgentStatuses(prev => {
      const newMap = new Map(prev);
      newMap.set(userData.sys_user_id, {
        agentStatus,
        lastSeen: new Date()
      });
      return newMap;
    });
    
    // Emit to server
    if (socket.connected) {
      updateAgentStatusEmitter(socket, agentStatus);
    }
  };

  return (
    <AgentStatusContext.Provider value={{ 
      agentStatuses,
      getAgentStatus,
      updateAgentStatus,
    }}>
      {children}
    </AgentStatusContext.Provider>
  );
};

export const useAgentStatus = () => {
  const context = useContext(AgentStatusContext);
  if (!context) {
    throw new Error('useAgentStatus must be used within a AgentStatusProvider');
  }
  return context;
};
