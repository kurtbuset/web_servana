import { useEffect, useRef } from 'react';

/**
 * useActivityTracking hook
 * Tracks user activity and provides activity state
 */
export const useActivityTracking = () => {
  const lastActivityTimeRef = useRef(Date.now());
  const sessionWarningToastIdRef = useRef(null);
  const sessionTimeoutRef = useRef(null);

  /**
   * Update activity timestamp
   */
  const updateActivity = () => {
    const now = Date.now();
    const timeSinceLastActivity = now - lastActivityTimeRef.current;
    
    lastActivityTimeRef.current = now;
    
    // Dismiss session warning if user becomes active
    if (sessionWarningToastIdRef.current) {
      // Note: dismissToast would need to be passed in or imported
      // For now, we'll just clear the ref
      sessionWarningToastIdRef.current = null;
    }
    
    // Clear session timeout if user becomes active
    if (sessionTimeoutRef.current) {
      clearTimeout(sessionTimeoutRef.current);
      sessionTimeoutRef.current = null;
    }
    
    return timeSinceLastActivity;
  };

  /**
   * Setup activity tracking listeners
   */
  useEffect(() => {
    const activityEvents = ['mousedown', 'keydown', 'touchstart', 'scroll', 'click'];
    
    activityEvents.forEach(event => {
      window.addEventListener(event, updateActivity, { passive: true });
    });

    return () => {
      activityEvents.forEach(event => {
        window.removeEventListener(event, updateActivity);
      });
    };
  }, []);

  /**
   * Get idle time in milliseconds
   */
  const getIdleTime = () => {
    return Date.now() - lastActivityTimeRef.current;
  };

  /**
   * Get idle time in minutes
   */
  const getIdleMinutes = () => {
    return Math.floor(getIdleTime() / 60000);
  };

  /**
   * Check if user is idle beyond threshold
   * @param {number} thresholdMinutes - Threshold in minutes
   */
  const isIdle = (thresholdMinutes) => {
    return getIdleMinutes() >= thresholdMinutes;
  };

  /**
   * Set session warning
   * @param {Function} showWarning - Function to show warning toast
   * @param {Function} dismissToast - Function to dismiss toast
   * @param {Function} onWarningClick - Callback when warning is clicked
   * @param {Function} onSessionExpired - Callback when session expires
   */
  const setSessionWarning = (showWarning, dismissToast, onWarningClick, onSessionExpired) => {
    if (sessionWarningToastIdRef.current) {
      return; // Warning already active
    }

    sessionWarningToastIdRef.current = showWarning(
      'Your session will expire in 5 minutes due to inactivity. Click here to stay logged in.',
      {
        autoClose: false,
        closeOnClick: true,
        onClick: () => {
          onWarningClick?.();
          updateActivity();
        }
      }
    );
    
    // Set timeout to force logout at 15 minutes
    sessionTimeoutRef.current = setTimeout(() => {
      if (sessionWarningToastIdRef.current) {
        dismissToast(sessionWarningToastIdRef.current);
        sessionWarningToastIdRef.current = null;
      }
      onSessionExpired?.();
    }, 5 * 60 * 1000); // 5 minutes from now (total 15 minutes)
  };

  /**
   * Clear session warning
   * @param {Function} dismissToast - Function to dismiss toast
   */
  const clearSessionWarning = (dismissToast) => {
    if (sessionWarningToastIdRef.current) {
      dismissToast?.(sessionWarningToastIdRef.current);
      sessionWarningToastIdRef.current = null;
    }
    if (sessionTimeoutRef.current) {
      clearTimeout(sessionTimeoutRef.current);
      sessionTimeoutRef.current = null;
    }
  };

  return {
    updateActivity,
    getIdleTime,
    getIdleMinutes,
    isIdle,
    setSessionWarning,
    clearSessionWarning,
    lastActivityTimeRef
  };
};