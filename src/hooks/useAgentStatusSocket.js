import { useEffect, useState, useRef } from "react";
import socket, {
  sendAgentHeartbeat,
  setAgentOffline,
  sendUserHeartbeat,
  setUserOffline,
  setAgentOnline,
  getAgentStatuses,
  registerAgentEvents,
} from "../socket";

/**
 * useAgentStatusSocket hook
 * Manages socket events and heartbeats for agent status
 */
export const useAgentStatusSocket = (userId, isAgent, activityTracking) => {
  const [agentStatuses, setAgentStatuses] = useState(new Map());

  const heartbeatIntervalRef = useRef(null);
  const agentHeartbeatIntervalRef = useRef(null);
  const activityCheckIntervalRef = useRef(null);

  /**
   * Handle agent statuses list
   */
  const handleAgentStatusesList = (agents) => {
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

    setAgentStatuses(statusMap);
  };

  /**
   * Handle agent status changes
   */
  const handleAgentStatusChanged = (data) => {
    const { userId, agentStatus, lastSeen } = data || {};

    // Validate data
    if (!userId || !agentStatus) {
      console.warn("⚠️ Invalid agent status change data:", data);
      return;
    }

    setAgentStatuses((prev) => {
      const newMap = new Map(prev);
      newMap.set(userId, {
        agentStatus,
        lastSeen: lastSeen ? new Date(lastSeen) : new Date(),
      });
      return newMap;
    });
  };

  /**
   * Handle socket connection
   */
  const handleConnect = () => {
    // Emit agentOnline to join department rooms and set status
    if (isAgent) {
      setAgentOnline(socket, userId);
    }

    // Always request agent statuses (includes database fetch for offline agents)
    getAgentStatuses(socket);
  };

  /**
   * Setup heartbeats
   */
  useEffect(() => {
    if (!userId) return;

    /**
     * Heartbeat: Send ping every 30 seconds (only if active)
     */
    heartbeatIntervalRef.current = setInterval(() => {
      const idleTime = activityTracking.getIdleTime();
      const idleThreshold = 20 * 60 * 1000; // 20 minutes

      if (idleTime < idleThreshold) {
        // User is active, send heartbeat
        if (socket.connected) {
          sendUserHeartbeat(socket, userId);
        }
      } else {
        // User is idle for 20+ minutes, mark as offline
        console.log("😴 User idle for 20+ minutes, marking offline");
        if (socket.connected) {
          setUserOffline(socket, userId);
        }
      }
    }, 30000); // Check every 30 seconds

    /**
     * Agent Heartbeat: Send ping every 30 seconds (only if active and is agent)
     * Aligned with token lifecycle: 12 minutes idle threshold
     */
    if (isAgent) {
      agentHeartbeatIntervalRef.current = setInterval(() => {
        const idleTime = activityTracking.getIdleTime();
        const idleThreshold = 12 * 60 * 1000; // 12 minutes (matches token auto-refresh)

        if (idleTime < idleThreshold) {
          // Agent is active, send heartbeat
          if (socket.connected) {
            sendAgentHeartbeat(socket, userId);
          }
        } else {
          // Agent is idle for 12+ minutes, mark as offline
          console.log("😴 Agent idle for 12+ minutes, marking offline");
          if (socket.connected) {
            setAgentOffline(socket, userId);
          }
        }
      }, 30000); // Check every 30 seconds
    }

    /**
     * Check for idle status every minute
     * Show session warning at 10 minutes for agents (5 minutes before 15-minute token expiry)
     */
    activityCheckIntervalRef.current = setInterval(() => {
      const idleMinutes = activityTracking.getIdleMinutes();

      // For agents: show warning at 10 minutes (5 minutes before token expiry)
      if (isAgent && idleMinutes === 10) {
        console.log("⚠️ Agent idle for 10 minutes, showing session warning");
        // Note: Session warning would be handled by parent component
      }

      // Log idle status
      const idleThreshold = isAgent ? 10 : 20;
      if (idleMinutes >= idleThreshold) {
        console.log(`😴 User has been idle for ${idleMinutes} minutes`);
      }
    }, 60000); // Check every minute

    return () => {
      clearInterval(heartbeatIntervalRef.current);
      clearInterval(agentHeartbeatIntervalRef.current);
      clearInterval(activityCheckIntervalRef.current);
    };
  }, [userId, isAgent, activityTracking]);

  /**
   * Setup socket event listeners
   */
  useEffect(() => {
    if (!userId) return;

    // If already connected, emit immediately
    if (socket.connected) {
      handleConnect();
    }

    // Listen for socket events using centralized event registration
    socket.on("connect", handleConnect);

    // Register agent status events with callbacks
    const cleanupAgentEvents = registerAgentEvents(socket, {
      onAgentStatusesList: handleAgentStatusesList,
      onAgentStatusChanged: handleAgentStatusChanged,
    });

    return () => {
      socket.off("connect", handleConnect);
      cleanupAgentEvents(); // Cleanup agent events

      // Emit that user is going offline
      if (socket.connected) {
        // Also emit agent offline if user is an agent
        if (isAgent) {
          setAgentOffline(socket, userId);
        }
      }
    };
  }, [userId, isAgent]);

  /**
   * Send immediate heartbeat if user was idle
   * @param {number} timeSinceLastActivity - Time since last activity in ms
   */
  const sendImmediateHeartbeatIfIdle = (timeSinceLastActivity) => {
    if (!userId || !socket.connected) return;

    // If user was inactive for more than 30 seconds, send immediate heartbeat
    if (timeSinceLastActivity > 30000) {
      if (isAgent) {
        sendAgentHeartbeat(socket, userId);
      }
    }
  };

  return {
    agentStatuses,
    setAgentStatuses,
    handleConnect,
    sendImmediateHeartbeatIfIdle,
  };
};
