// src/hooks/useTheme.js
import { useThemeStore } from "../stores";

/**
 * Backward-compatible hook for ThemeContext
 * Provides the same API as the old useTheme() hook
 */
export const useTheme = () => {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const isDark = theme === "dark";

  return {
    theme,
    toggleTheme,
    isDark,
  };
};
