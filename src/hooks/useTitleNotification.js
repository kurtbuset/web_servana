import { useEffect, useRef, useCallback } from "react";

/**
 * useTitleNotification hook manages browser tab title notifications
 * Similar to how Messenger shows "(1) New message" in the title
 *
 * Features:
 * - Show notification count in title
 * - Flash between original title and notification
 * - Clear notification when tab is focused
 * - Auto-clear after timeout
 *
 * @returns {Object} Title notification handlers
 */
export const useTitleNotification = () => {
  const originalTitle = useRef(document.title);
  const notificationInterval = useRef(null);
  const notificationTimeout = useRef(null);
  const notificationCount = useRef(0);

  /**
   * Clear all notification timers
   */
  const clearNotificationTimers = useCallback(() => {
    if (notificationInterval.current) {
      clearInterval(notificationInterval.current);
      notificationInterval.current = null;
    }
    if (notificationTimeout.current) {
      clearTimeout(notificationTimeout.current);
      notificationTimeout.current = null;
    }
  }, []);

  /**
   * Reset title to original
   */
  const resetTitle = useCallback(() => {
    clearNotificationTimers();
    document.title = originalTitle.current;
    notificationCount.current = 0;
  }, [clearNotificationTimers]);

  /**
   * Show notification in title with flashing effect
   */
  const showNotification = useCallback(
    (message = "New message") => {
      // Increment notification count
      notificationCount.current += 1;

      // Clear any existing timers
      clearNotificationTimers();

      const notificationText = `(${notificationCount.current}) ${message}`;
      let isOriginal = false;

      // Flash between notification and original title
      notificationInterval.current = setInterval(() => {
        document.title = isOriginal ? originalTitle.current : notificationText;
        isOriginal = !isOriginal;
      }, 1000); // Flash every 1 second

      // Auto-clear after 30 seconds
      notificationTimeout.current = setTimeout(() => {
        resetTitle();
      }, 30000);

      console.log(`🔔 Title notification: ${notificationText}`);
    },
    [clearNotificationTimers, resetTitle],
  );

  /**
   * Handle visibility change (tab focus/blur)
   */
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Tab is focused, clear notifications
        resetTitle();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearNotificationTimers();
    };
  }, [resetTitle, clearNotificationTimers]);

  return {
    showNotification,
    resetTitle,
  };
};
