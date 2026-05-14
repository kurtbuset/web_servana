// src/hooks/useUnsavedChanges.js
import { useUnsavedChangesStore } from "../stores";

/**
 * Backward-compatible hook for UnsavedChangesContext
 * Provides the same API as the old useUnsavedChanges() hook
 */
export const useUnsavedChanges = () => {
  const hasUnsavedChanges = useUnsavedChangesStore(
    (state) => state.hasUnsavedChanges,
  );
  const setHasUnsavedChanges = useUnsavedChangesStore(
    (state) => state.setHasUnsavedChanges,
  );
  const setOnNavigationBlocked = useUnsavedChangesStore(
    (state) => state.setOnNavigationBlocked,
  );
  const blockNavigation = useUnsavedChangesStore(
    (state) => state.blockNavigation,
  );

  return {
    hasUnsavedChanges,
    setHasUnsavedChanges,
    setOnNavigationBlocked,
    blockNavigation,
  };
};
