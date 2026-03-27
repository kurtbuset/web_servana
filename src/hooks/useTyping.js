import { useState, useEffect, useRef, useCallback } from "react";
import socket, {
  registerTypingEvents,
  emitTyping as emitTypingEmitter,
  emitStopTyping as emitStopTypingEmitter,
} from "../socket";

/**
 * useTyping hook manages typing indicators
 *
 * Features:
 * - Listen for typing events from clients
 * - Emit typing events when agent types
 * - Auto-clear typing indicator after timeout
 *
 * @param {Object} selectedCustomer - Currently selected customer
 * @param {Function} getUserId - Function to get current user ID
 * @param {boolean} enabled - Whether typing is enabled (default: true)
 * @returns {Object} Typing state and actions
 */
export const useTyping = (selectedCustomer, getUserId, enabled = true) => {
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState(null);
  const [typingUserImage, setTypingUserImage] = useState(null);
  const typingTimeoutRef = useRef(null);

  /**
   * Listen for typing indicators from clients
   */
  useEffect(() => {
    if (!enabled || !selectedCustomer) return;

    const handleTyping = (data) => {
      if (
        data.chatGroupId === selectedCustomer.chat_group_id &&
        data.userType === "client"
      ) {
        console.log("👤 Client is typing:", data.userName);
        setIsTyping(true);
        setTypingUser(data.userName || "Client");
        setTypingUserImage(data.userImage || null);

        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
          setIsTyping(false);
          setTypingUser(null);
          setTypingUserImage(null);
        }, 3000);
      }
    };

    const handleStopTyping = (data) => {
      if (
        data.chatGroupId === selectedCustomer.chat_group_id &&
        data.userType === "client"
      ) {
        console.log("👤 Client stopped typing");

        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }

        setIsTyping(false);
        setTypingUser(null);
        setTypingUserImage(null);
      }
    };

    const cleanup = registerTypingEvents(socket, {
      onTyping: handleTyping,
      onStopTyping: handleStopTyping,
    });

    return () => {
      cleanup();
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [selectedCustomer, enabled]);

  /**
   * Emit typing event to server
   */
  const emitTyping = useCallback(() => {
    if (!enabled || !selectedCustomer) return;

    const userId = getUserId();
    if (!userId) return;

    emitTypingEmitter(socket, {
      chatGroupId: selectedCustomer.chat_group_id,
      userName: "Agent",
      userId: userId,
    });
  }, [selectedCustomer, getUserId, enabled]);

  /**
   * Emit stop typing event to server
   */
  const emitStopTyping = useCallback(() => {
    if (!enabled || !selectedCustomer) return;

    const userId = getUserId();
    if (!userId) return;

    emitStopTypingEmitter(socket, {
      chatGroupId: selectedCustomer.chat_group_id,
      userId: userId,
    });
  }, [selectedCustomer, getUserId]);

  /**
   * Handle typing with auto-stop after inactivity
   */
  const handleTypingWithTimeout = useCallback(
    (isTypingNow) => {
      if (isTypingNow) {
        emitTyping();

        // Clear previous timeout
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }

        // Set timeout to emit stop typing after 2 seconds of inactivity
        typingTimeoutRef.current = setTimeout(() => {
          emitStopTyping();
        }, 2000);
      } else {
        // If not typing, immediately stop
        emitStopTyping();
      }
    },
    [emitTyping, emitStopTyping],
  );

  return {
    isTyping,
    typingUser,
    typingUserImage,
    emitTyping,
    emitStopTyping,
    handleTypingWithTimeout,
  };
};
