# Dark Mode Implementation Guide

## Overview
The Servana web application now supports dark mode with automatic system preference detection and manual toggle functionality.

## Features
- **Automatic Detection**: Respects user's system dark mode preference
- **Manual Toggle**: Users can manually switch between light and dark modes
- **Persistent Settings**: User preference is saved in localStorage
- **Smooth Transitions**: All theme changes include smooth CSS transitions
- **Comprehensive Coverage**: All components support dark mode styling

## How to Use

### For Users
1. **Automatic**: The app will automatically detect your system's dark mode preference
2. **Manual Toggle**: Click the sun/moon icon in the top navigation bar to switch themes
3. **Persistent**: Your preference will be remembered across browser sessions

### For Developers

#### Theme Context
The dark mode functionality is managed by `ThemeContext`:

```jsx
import { useTheme } from '../context/ThemeContext';

function MyComponent() {
  const { isDarkMode, toggleDarkMode, theme } = useTheme();
  
  return (
    <div className={`bg-white dark:bg-gray-800 ${theme === 'dark' ? 'dark-specific-class' : ''}`}>
      <button onClick={toggleDarkMode}>
        Toggle to {isDarkMode ? 'Light' : 'Dark'} Mode
      </button>
    </div>
  );
}
```

#### Dark Mode Toggle Component
Use the pre-built toggle component:

```jsx
import DarkModeToggle from '../components/DarkModeToggle';

function Navigation() {
  return (
    <nav>
      <DarkModeToggle size={20} className="ml-4" />
    </nav>
  );
}
```

#### Styling Guidelines
Use Tailwind's dark mode classes:

```jsx
// Basic dark mode styling
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">

// Interactive elements
<button className="bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700">

// Borders and dividers
<div className="border-gray-200 dark:border-gray-700">

// Form inputs
<input className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100" />
```

## Implementation Details

### Theme Provider Setup
The app is wrapped with `ThemeProvider` in `App.jsx`:

```jsx
import { ThemeProvider } from "./context/ThemeContext";

function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <AppNavigation />
      </UserProvider>
    </ThemeProvider>
  );
}
```

### CSS Classes Applied
The theme context automatically applies the `dark` class to `document.documentElement` when dark mode is active.

### Storage
User preferences are stored in `localStorage` under the key `darkMode`.

### System Preference Detection
The app uses `window.matchMedia('(prefers-color-scheme: dark)')` to detect system preferences.

## Components with Dark Mode Support

### Core Components
- ✅ TopNavbar
- ✅ Sidebar
- ✅ DarkModeToggle

### Auto-Reply Components
- ✅ AutoRepliesScreen
- ✅ AutoReplyCard
- ✅ AutoReplyFilters
- ✅ AutoReplyModal

### Responsive Components
- ✅ ResponsiveContainer (context-aware)
- ✅ Custom scrollbars
- ✅ All responsive utilities

## Color Palette

### Light Mode
- Primary: `#6237A0` (purple)
- Background: `#ffffff` (white)
- Secondary Background: `#f9fafb` (gray-50)
- Text: `#1f2937` (gray-800)
- Borders: `#e5e7eb` (gray-200)

### Dark Mode
- Primary: `#7C3AED` (purple-600)
- Background: `#111827` (gray-900)
- Secondary Background: `#1f2937` (gray-800)
- Text: `#f9fafb` (gray-50)
- Borders: `#374151` (gray-700)

## Best Practices

### 1. Always Use Dark Mode Classes
```jsx
// ✅ Good
<div className="bg-white dark:bg-gray-800">

// ❌ Avoid
<div className={isDarkMode ? "bg-gray-800" : "bg-white"}>
```

### 2. Consistent Color Usage
- Use the established color palette
- Maintain sufficient contrast ratios
- Test both themes thoroughly

### 3. Smooth Transitions
Add transition classes for smooth theme switching:
```jsx
<div className="bg-white dark:bg-gray-800 transition-colors duration-200">
```

### 4. Icon Considerations
Use appropriate icons for each theme:
```jsx
{isDarkMode ? <Sun /> : <Moon />}
```

## Testing
1. Test all components in both light and dark modes
2. Verify system preference detection works
3. Check localStorage persistence
4. Ensure smooth transitions
5. Validate accessibility and contrast ratios

## Future Enhancements
- [ ] Add more color theme options
- [ ] Implement auto-switching based on time of day
- [ ] Add theme customization options
- [ ] Extend to mobile app