import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import socket from "../socket";
import {
  emitPresenceUpdate,
  emitPresenceHeartbeat,
  requestAllPresences,
  requestAvailableByDepartment,
  registerPresenceEvents,
} from "../socket/presence";
import { useUser } from "./UserContext";

const PresenceContext = createContext();

const HEARTBEAT_INTERVAL = 2 * 60 * 1000; // 2 minutes

export const PresenceProvider = ({ children }) => {
  const { userData } = useUser();
  const [myPresence, setMyPresenceState] = useState("accepting_chats");
  const [allPresences, setAllPresences] = useState({});
  const heartbeatRef = useRef(null);

  // Set own presence via socket
  const setMyPresence = useCallback((status) => {
    emitPresenceUpdate(socket, status);
    setMyPresenceState(status);
  }, []);

  // Request fresh available-by-department data (for Transfer Modal)
  const fetchAvailableByDepartment = useCallback((callback) => {
    if (!socket.connected) return;

    const handler = (data) => {
      socket.off("presence:availableByDepartment", handler);
      if (callback) callback(data);
    };
    socket.on("presence:availableByDepartment", handler);
    requestAvailableByDepartment(socket);
  }, []);

  useEffect(() => {
    if (!userData?.sys_user_id || !socket.connected) return;

    // Request all presences on connect
    requestAllPresences(socket);

    // Register presence event listeners
    const cleanup = registerPresenceEvents(socket, {
      onPresenceChange: (data) => {
        setAllPresences((prev) => ({
          ...prev,
          [data.userId]: {
            ...prev[data.userId],
            userPresence: data.status,
            firstName: data.firstName,
            lastName: data.lastName,
            deptIds: data.deptIds || prev[data.userId]?.deptIds || [],
            lastSeen: data.timestamp,
          },
        }));

        // Update own presence if it's about current user
        if (String(data.userId) === String(userData.sys_user_id)) {
          setMyPresenceState(data.status);
        }
      },
      onPresenceAll: (data) => {
        setAllPresences(data || {});

        // Set own presence from server data
        const myData = data?.[userData.sys_user_id];
        if (myData?.userPresence) {
          setMyPresenceState(myData.userPresence);
        }
      },
    });

    // Start heartbeat
    heartbeatRef.current = setInterval(() => {
      emitPresenceHeartbeat(socket);
    }, HEARTBEAT_INTERVAL);

    // Re-request presences on reconnect
    const handleReconnect = () => {
      requestAllPresences(socket);
    };
    socket.on("connect", handleReconnect);

    return () => {
      cleanup();
      socket.off("connect", handleReconnect);
      if (heartbeatRef.current) {
        clearInterval(heartbeatRef.current);
        heartbeatRef.current = null;
      }
    };
  }, [userData?.sys_user_id, socket.connected]);

  return (
    <PresenceContext.Provider
      value={{
        myPresence,
        setMyPresence,
        allPresences,
        fetchAvailableByDepartment,
      }}
    >
      {children}
    </PresenceContext.Provider>
  );
};

export const usePresence = () => {
  const context = useContext(PresenceContext);
  if (!context) {
    throw new Error("usePresence must be used within a PresenceProvider");
  }
  return context;
};
