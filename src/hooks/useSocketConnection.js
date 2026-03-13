/**
 * Socket Connection Status Hook
 * Tracks socket connection state and provides UI feedback
 */
import { useState, useEffect } from "react";
import socket from "../socket-simple";
import {
  showSuccess,
  showError,
  showWarning,
  showInfo,
  dismissToast,
} from "../utils/toast";

export const useSocketConnection = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [reconnectAttempt, setReconnectAttempt] = useState(0);
  const [connectionQuality, setConnectionQuality] = useState("good"); // good, poor, disconnected

  useEffect(() => {
    let reconnectToastId = null;
    let connectionLostTime = null;

    // Connection established
    const handleConnect = () => {
      console.log("✅ Socket connected");
      setIsConnected(true);
      setIsReconnecting(false);
      setReconnectAttempt(0);
      setConnectionQuality("good");

      // Show success message if this was a reconnection
      if (connectionLostTime) {
        const downtime = Math.round((Date.now() - connectionLostTime) / 1000);
        showSuccess(`Connection restored after ${downtime}s`, {
          autoClose: 3000,
        });
        connectionLostTime = null;
      }

      // Dismiss reconnecting toast
      if (reconnectToastId) {
        dismissToast(reconnectToastId);
        reconnectToastId = null;
      }
    };

    // Connection lost
    const handleDisconnect = (reason) => {
      console.warn("❌ Socket disconnected:", reason);
      setIsConnected(false);
      setConnectionQuality("disconnected");
      connectionLostTime = Date.now();

      // Handle different disconnect reasons
      if (reason === "io server disconnect") {
        // Server kicked us out - likely auth issue
        showError("Connection closed by server. Please refresh the page.", {
          autoClose: false,
        });
      } else if (reason === "io client disconnect") {
        // Intentional disconnect (logout) - no message needed
        console.log("Intentional disconnect");
      } else {
        // Network issue - will auto-reconnect
        showWarning("Connection lost. Attempting to reconnect...", {
          autoClose: false,
          toastId: "connection-lost",
        });
      }
    };

    // Reconnection attempt
    const handleReconnectAttempt = (attemptNumber) => {
      console.log(`🔄 Reconnection attempt #${attemptNumber}`);
      setIsReconnecting(true);
      setReconnectAttempt(attemptNumber);
      setConnectionQuality("poor");

      // Dismiss previous toast and show new one with attempt number
      if (reconnectToastId) {
        dismissToast(reconnectToastId);
      }

      reconnectToastId = showInfo(
        `Reconnecting... (attempt ${attemptNumber}/5)`,
        {
          autoClose: false,
          toastId: "reconnecting",
        },
      );
    };

    // Reconnection failed
    const handleReconnectFailed = () => {
      console.error("❌ Reconnection failed after all attempts");
      setIsReconnecting(false);
      setConnectionQuality("disconnected");

      // Dismiss reconnecting toast
      if (reconnectToastId) {
        dismissToast(reconnectToastId);
        reconnectToastId = null;
      }

      showError(
        "Unable to reconnect. Please check your internet connection and refresh the page.",
        {
          autoClose: false,
        },
      );
    };

    // Connection error
    const handleConnectError = (error) => {
      console.error("❌ Connection error:", error.message);

      if (error.message.includes("Authentication failed")) {
        showError("Authentication failed. Please log in again.", {
          autoClose: false,
        });
      }
    };

    // Register event listeners
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("reconnect_attempt", handleReconnectAttempt);
    socket.on("reconnect_failed", handleReconnectFailed);
    socket.on("connect_error", handleConnectError);

    // Set initial state
    setIsConnected(socket.connected);

    // Cleanup
    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("reconnect_attempt", handleReconnectAttempt);
      socket.off("reconnect_failed", handleReconnectFailed);
      socket.off("connect_error", handleConnectError);

      if (reconnectToastId) {
        dismissToast(reconnectToastId);
      }
    };
  }, []);

  return {
    isConnected,
    isReconnecting,
    reconnectAttempt,
    connectionQuality,
  };
};
