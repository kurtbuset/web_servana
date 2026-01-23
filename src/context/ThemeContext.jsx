import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  // DARK MODE DISABLED - Always use light mode
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isInitialized, setIsInitialized] = useState(true);

  // Force light mode application
  const forceThemeApplication = useCallback((darkMode = false) => {
    if (typeof window === 'undefined') return;
    
    const htmlElement = document.documentElement;
    const bodyElement = document.body;
    
    // Remove any existing theme classes
    htmlElement.classList.remove('dark', 'light');
    bodyElement.classList.remove('dark', 'light');
    
    // Force light mode only
    htmlElement.classList.add('light');
    bodyElement.classList.add('light');
    htmlElement.setAttribute('data-theme', 'light');
    bodyElement.setAttribute('data-theme', 'light');
    
    // Override browser color scheme
    htmlElement.style.colorScheme = 'light';
    bodyElement.style.colorScheme = 'light';
    
    // Force CSS custom properties for light mode
    htmlElement.style.setProperty('--servana-bg-primary', '#ffffff');
    htmlElement.style.setProperty('--servana-bg-secondary', '#f9fafb');
    htmlElement.style.setProperty('--servana-bg-tertiary', '#f3f4f6');
    htmlElement.style.setProperty('--servana-text-primary', '#1f2937');
    htmlElement.style.setProperty('--servana-text-secondary', '#374151');
    htmlElement.style.setProperty('--servana-text-muted', '#6b7280');
    htmlElement.style.setProperty('--servana-border', '#e5e7eb');
    htmlElement.style.setProperty('--servana-border-light', '#d1d5db');
    htmlElement.style.setProperty('--servana-shadow', 'rgba(0, 0, 0, 0.1)');
    
    // Force background and text colors directly
    htmlElement.style.backgroundColor = '#ffffff';
    htmlElement.style.color = '#1f2937';
    bodyElement.style.backgroundColor = '#ffffff';
    bodyElement.style.color = '#1f2937';

    // Force immediate repaint
    htmlElement.offsetHeight;
    
    // Additional DOM manipulation for consistency
    setTimeout(() => {
      const rootElement = document.getElementById('root');
      if (rootElement) {
        rootElement.style.backgroundColor = '#ffffff';
        rootElement.style.color = '#1f2937';
      }
      
      // Force all main elements to light mode
      const mainElements = document.querySelectorAll('main');
      mainElements.forEach(main => {
        main.style.backgroundColor = '#ffffff';
        main.style.color = '#1f2937';
      });
    }, 50);
  }, []);

  // Initialize light mode only
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Always force light mode
    forceThemeApplication(false);
    
    // Clear any dark mode settings from localStorage
    try {
      localStorage.removeItem('servana-theme-mode');
    } catch (e) {
      console.error('Error clearing theme from localStorage:', e);
    }
  }, [forceThemeApplication]);

  // Disabled toggle function - does nothing
  const toggleDarkMode = useCallback(() => {
    // Dark mode is disabled - do nothing
    console.log('Dark mode is currently disabled');
  }, []);

  // Force light mode on window focus
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleFocus = () => {
      forceThemeApplication(false);
    };
    
    // Monitor to ensure light mode stays active
    const themeMonitor = setInterval(() => {
      forceThemeApplication(false);
    }, 5000);
    
    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
      clearInterval(themeMonitor);
    };
  }, [forceThemeApplication]);

  const value = {
    isDarkMode: false, // Always false
    toggleDarkMode,
    theme: 'light', // Always light
    isInitialized: true
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};