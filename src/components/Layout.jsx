import React, { useState } from 'react';
import TopNavbar from './TopNavbar';
import Sidebar from './Sidebar';
import DepartmentUsersPanel from './DepartmentUsersPanel';
import { useDepartmentPanel } from '../context/DepartmentPanelContext';

/**
 * Layout - Main layout wrapper for all authenticated pages
 * Includes TopNavbar, Sidebar, and DepartmentUsersPanel
 * The department panel state persists across all pages
 */
export default function Layout({ children }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const { isOpen: isDepartmentPanelOpen, close: closeDepartmentPanel } = useDepartmentPanel();

  const toggleSidebar = () => {
    setMobileSidebarOpen(prev => !prev);
  };

  const toggleDropdown = (name) => {
    setOpenDropdown(prev => (prev === name ? null : name));
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      <TopNavbar toggleSidebar={toggleSidebar} />

      <div className="flex flex-1 overflow-hidden">
        {/* Mobile Sidebar */}
        <Sidebar
          isMobile={true}
          isOpen={mobileSidebarOpen}
          toggleDropdown={toggleDropdown}
          openDropdown={openDropdown}
          onClose={() => setMobileSidebarOpen(false)}
        />

        {/* Desktop Sidebar */}
        <Sidebar
          isMobile={false}
          toggleDropdown={toggleDropdown}
          openDropdown={openDropdown}
        />

        {/* Main Content Area - Flex container for content + department panel */}
        <main className="flex flex-1 overflow-hidden" style={{ backgroundColor: 'transparent' }}>
          {/* Page Content */}
          <div className="flex-1 overflow-hidden">
            {children}
          </div>

          {/* Department Users Panel - Discord-style */}
          <DepartmentUsersPanel 
            isOpen={isDepartmentPanelOpen} 
            onClose={closeDepartmentPanel} 
          />
        </main>
      </div>
    </div>
  );
}
