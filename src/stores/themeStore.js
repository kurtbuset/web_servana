// src/stores/themeStore.js
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

const useThemeStore = create(
  devtools(
    persist(
      (set, get) => ({
        // State
        theme: "light",

        // Computed
        isDark: () => get().theme === "dark",

        // Actions
        setTheme: (theme) => {
          const root = document.documentElement;

          if (theme === "dark") {
            root.setAttribute("data-theme", "dark");
          } else {
            root.setAttribute("data-theme", "light");
          }

          set({ theme }, false, "setTheme");
        },

        toggleTheme: () => {
          const { theme, setTheme } = get();
          const newTheme = theme === "light" ? "dark" : "light";
          setTheme(newTheme);
        },

        // Initialize theme on mount
        initialize: () => {
          const { theme } = get();
          const root = document.documentElement;

          if (theme === "dark") {
            root.setAttribute("data-theme", "dark");
          } else {
            root.setAttribute("data-theme", "light");
          }
        },
      }),
      {
        name: "theme-storage",
        partialize: (state) => ({ theme: state.theme }),
      },
    ),
    { name: "ThemeStore" },
  ),
);

export default useThemeStore;
