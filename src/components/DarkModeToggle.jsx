import { Sun, Moon } from 'react-feather';
import { useTheme } from '../context/ThemeContext';
import { memo } from 'react';

const DarkModeToggle = memo(({ className = '', size = 20 }) => {
  // DARK MODE DISABLED - Don't render the toggle
  return null;
});

DarkModeToggle.displayName = 'DarkModeToggle';

export default DarkModeToggle;