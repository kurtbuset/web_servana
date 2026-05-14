// src/components/StoreInitializer.jsx
import { useEffect } from "react";
import { useUserStore, useThemeStore, usePresenceStore } from "../stores";

/**
 * Component to initialize Zustand stores on app mount
 * This replaces the Provider pattern from Context API
 */
export default function StoreInitializer({ children }) {
  const initializeUser = useUserStore((state) => state.initialize);
  const connectSocket = useUserStore((state) => state.connectSocket);
  const userData = useUserStore((state) => state.userData);
  const initializeTheme = useThemeStore((state) => state.initialize);
  const initializePresence = usePresenceStore((state) => state.initialize);
  const cleanupPresence = usePresenceStore((state) => state.cleanup);

  // Initialize user store on mount
  useEffect(() => {
    const cleanup = initializeUser();
    return cleanup;
  }, [initializeUser]);

  // Initialize theme on mount
  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);

  // Connect socket when user is authenticated
  useEffect(() => {
    const cleanup = connectSocket();
    return cleanup;
  }, [userData?.sys_user_id, connectSocket]);

  // Initialize presence when user is authenticated
  useEffect(() => {
    if (userData?.sys_user_id) {
      const cleanup = initializePresence(userData.sys_user_id);
      return cleanup;
    } else {
      cleanupPresence();
    }
  }, [userData?.sys_user_id, initializePresence, cleanupPresence]);

  return children;
}
