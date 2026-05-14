// src/stores/unsavedChangesStore.js
import { create } from "zustand";
import { devtools } from "zustand/middleware";

let onNavigationBlockedCallback = null;

const useUnsavedChangesStore = create(
  devtools(
    (set, get) => ({
      // State
      hasUnsavedChanges: false,

      // Actions
      setHasUnsavedChanges: (value) => {
        set({ hasUnsavedChanges: value }, false, "setHasUnsavedChanges");
      },

      setOnNavigationBlocked: (callback) => {
        onNavigationBlockedCallback = callback;
      },

      blockNavigation: () => {
        const { hasUnsavedChanges } = get();
        if (hasUnsavedChanges && onNavigationBlockedCallback) {
          onNavigationBlockedCallback();
          return true; // Navigation blocked
        }
        return false; // Navigation allowed
      },
    }),
    { name: "UnsavedChangesStore" },
  ),
);

export default useUnsavedChangesStore;
