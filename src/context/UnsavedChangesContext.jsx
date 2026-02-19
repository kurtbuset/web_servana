import { createContext, useContext, useState, useCallback, useRef } from 'react';

const UnsavedChangesContext = createContext();

export const UnsavedChangesProvider = ({ children }) => {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const onNavigationBlockedRef = useRef(null);

  const setOnNavigationBlocked = useCallback((callback) => {
    onNavigationBlockedRef.current = callback;
  }, []);

  const blockNavigation = useCallback(() => {
    if (hasUnsavedChanges && onNavigationBlockedRef.current) {
      onNavigationBlockedRef.current();
      return true; // Navigation blocked
    }
    return false; // Navigation allowed
  }, [hasUnsavedChanges]);

  const value = {
    hasUnsavedChanges,
    setHasUnsavedChanges,
    setOnNavigationBlocked,
    blockNavigation
  };

  return (
    <UnsavedChangesContext.Provider value={value}>
      {children}
    </UnsavedChangesContext.Provider>
  );
};

export const useUnsavedChanges = () => {
  const context = useContext(UnsavedChangesContext);
  if (!context) {
    throw new Error('useUnsavedChanges must be used within UnsavedChangesProvider');
  }
  return context;
};
