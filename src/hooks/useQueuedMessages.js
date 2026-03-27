/**
 * Queued Messages Hook
 * Queues messages when disconnected and sends when reconnected
 */
import { useState, useEffect, useCallback } from "react";
import socket from "../socket";
import { useSocketConnection } from "./useSocketConnection";

export const useQueuedMessages = () => {
  const [messageQueue, setMessageQueue] = useState([]);
  const { isConnected } = useSocketConnection();

  // Send queued messages when reconnected
  useEffect(() => {
    if (isConnected && messageQueue.length > 0) {
      console.log(`📤 Sending ${messageQueue.length} queued messages`);

      messageQueue.forEach(({ event, data, timestamp }) => {
        const age = Date.now() - timestamp;

        // Only send messages less than 5 minutes old
        if (age < 5 * 60 * 1000) {
          socket.emit(event, data);
        } else {
          console.warn(
            `Discarding old queued message (${Math.round(age / 1000)}s old)`,
          );
        }
      });

      setMessageQueue([]);
    }
  }, [isConnected, messageQueue]);

  // Queue a message
  const queueMessage = useCallback(
    (event, data) => {
      if (!isConnected) {
        console.log(`📥 Queueing message: ${event}`);
        setMessageQueue((prev) => [
          ...prev,
          {
            event,
            data,
            timestamp: Date.now(),
          },
        ]);
        return true; // Message queued
      }
      return false; // Not queued, send immediately
    },
    [isConnected],
  );

  // Clear queue (e.g., on logout)
  const clearQueue = useCallback(() => {
    setMessageQueue([]);
  }, []);

  return {
    queueMessage,
    clearQueue,
    queuedCount: messageQueue.length,
  };
};
