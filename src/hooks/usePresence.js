// src/hooks/usePresence.js
import { usePresenceStore } from "../stores";

/**
 * Backward-compatible hook for PresenceContext
 * Provides the same API as the old usePresence() hook
 */
export const usePresence = () => {
  const myPresence = usePresenceStore((state) => state.myPresence);
  const allPresences = usePresenceStore((state) => state.allPresences);
  const setMyPresence = usePresenceStore((state) => state.setMyPresence);
  const fetchAvailableByDepartment = usePresenceStore(
    (state) => state.fetchAvailableByDepartment,
  );

  return {
    myPresence,
    setMyPresence,
    allPresences,
    fetchAvailableByDepartment,
  };
};
