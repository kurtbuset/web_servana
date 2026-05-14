// src/stores/presenceStore.js
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import socket from "../socket";
import {
  emitPresenceUpdate,
  emitPresenceHeartbeat,
  requestAllPresences,
  requestAvailableByDepartment,
  registerPresenceEvents,
} from "../socket/presence";

const HEARTBEAT_INTERVAL = 2 * 60 * 1000; // 2 minutes
const HEARTBEAT_TIMEOUT = 30 * 1000; // 30 seconds

let heartbeatInterval = null;
let heartbeatTimeout = null;
let missedHeartbeats = 0;
let cleanupPresenceEvents = null;

const usePresenceStore = create(
  devtools(
    (set, get) => ({
      // State
      myPresence: "accepting_chats",
      allPresences: {},

      // Actions
      setMyPresence: (status) => {
        emitPresenceUpdate(socket, status);
        set({ myPresence: status }, false, "setMyPresence");
      },

      setAllPresences: (presences) => {
        set({ allPresences: presences }, false, "setAllPresences");
      },

      updatePresence: (userId, presenceData) => {
        set(
          (state) => ({
            allPresences: {
              ...state.allPresences,
              [userId]: {
                ...state.allPresences[userId],
                ...presenceData,
              },
            },
          }),
          false,
          "updatePresence",
        );
      },

      fetchAvailableByDepartment: (callback) => {
        if (!socket.connected) return;

        const handler = (data) => {
          socket.off("presence:availableByDepartment", handler);
          if (callback) callback(data);
        };
        socket.on("presence:availableByDepartment", handler);
        requestAvailableByDepartment(socket);
      },

      // Initialize presence system (called when user is authenticated)
      initialize: (userId) => {
        if (!userId || !socket.connected) return;

        // Request all presences on connect
        requestAllPresences(socket);

        // Register presence event listeners
        cleanupPresenceEvents = registerPresenceEvents(socket, {
          onPresenceChange: (data) => {
            console.log("PresenceStore: Received presence:change event", data);

            set(
              (state) => ({
                allPresences: {
                  ...state.allPresences,
                  [data.userId]: {
                    ...state.allPresences[data.userId],
                    userPresence: data.status,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    deptIds:
                      data.deptIds ||
                      state.allPresences[data.userId]?.deptIds ||
                      [],
                    lastSeen: data.timestamp,
                  },
                },
              }),
              false,
              "presenceChange",
            );

            // Update own presence if it's about current user
            if (String(data.userId) === String(userId)) {
              set({ myPresence: data.status }, false, "myPresenceChange");
            }
          },
          onPresenceAll: (data) => {
            set({ allPresences: data || {} }, false, "presenceAll");

            // Set own presence from server data
            const myData = data?.[userId];
            if (myData?.userPresence) {
              set(
                { myPresence: myData.userPresence },
                false,
                "myPresenceFromServer",
              );
            }
          },
        });

        // Start heartbeat
        heartbeatInterval = setInterval(() => {
          if (!socket.connected) return;

          emitPresenceHeartbeat(socket);

          // Set timeout to detect if server doesn't respond
          heartbeatTimeout = setTimeout(() => {
            missedHeartbeats += 1;

            // If 3 consecutive heartbeats fail, assume we're offline
            if (missedHeartbeats >= 3) {
              console.warn("Heartbeat timeout - assuming offline");
              set({ myPresence: "offline" }, false, "heartbeatTimeout");
            }
          }, HEARTBEAT_TIMEOUT);
        }, HEARTBEAT_INTERVAL);

        // Listen for heartbeat acknowledgment
        const handleHeartbeatAck = () => {
          missedHeartbeats = 0;
          if (heartbeatTimeout) {
            clearTimeout(heartbeatTimeout);
            heartbeatTimeout = null;
          }
        };
        socket.on("presence:heartbeat:ack", handleHeartbeatAck);

        // Re-request presences on reconnect
        const handleReconnect = () => {
          missedHeartbeats = 0;
          requestAllPresences(socket);
        };
        socket.on("connect", handleReconnect);

        // Return cleanup function
        return () => {
          if (cleanupPresenceEvents) {
            cleanupPresenceEvents();
            cleanupPresenceEvents = null;
          }
          socket.off("connect", handleReconnect);
          socket.off("presence:heartbeat:ack", handleHeartbeatAck);
          if (heartbeatInterval) {
            clearInterval(heartbeatInterval);
            heartbeatInterval = null;
          }
          if (heartbeatTimeout) {
            clearTimeout(heartbeatTimeout);
            heartbeatTimeout = null;
          }
        };
      },

      // Cleanup
      cleanup: () => {
        if (cleanupPresenceEvents) {
          cleanupPresenceEvents();
          cleanupPresenceEvents = null;
        }
        if (heartbeatInterval) {
          clearInterval(heartbeatInterval);
          heartbeatInterval = null;
        }
        if (heartbeatTimeout) {
          clearTimeout(heartbeatTimeout);
          heartbeatTimeout = null;
        }
        missedHeartbeats = 0;
      },
    }),
    { name: "PresenceStore" },
  ),
);

export default usePresenceStore;
