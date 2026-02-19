import React, { createContext, useContext, useState } from 'react';

const DepartmentPanelContext = createContext();

export function useDepartmentPanel() {
  const context = useContext(DepartmentPanelContext);
  if (!context) {
    throw new Error('useDepartmentPanel must be used within DepartmentPanelProvider');
  }
  return context;
}

export function DepartmentPanelProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(prev => !prev);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return (
    <DepartmentPanelContext.Provider value={{ isOpen, toggle, open, close }}>
      {children}
    </DepartmentPanelContext.Provider>
  );
}
