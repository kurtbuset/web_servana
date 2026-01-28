import { createContext, useContext, useState, useCallback } from 'react';

const UnsavedChangesContext = createContext();

export const UnsavedChangesProvider = ({ children }) => {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [onNavigationBlocked, setOnNavigationBlocked] = useState(null);

  const blockNavigation = useCallback((callback) => {
    if (hasUnsavedChanges && onNavigationBlocked) {
      onNavigationBlocked();
      return true; // Navigation blocked
    }
    return false; // Navigation allowed
  }, [hasUnsavedChanges, onNavigationBlocked]);

  const value = {
    hasUnsavedChanges,
    setHasUnsavedChanges,
    onNavigationBlocked,
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
