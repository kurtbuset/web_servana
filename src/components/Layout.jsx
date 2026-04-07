import React, { useState } from 'react';
import TopNavbar from './TopNavbar';
import Sidebar from './Sidebar';
import { useRolePreview } from '../context/RolePreviewContext';

/**
 * Layout - Main layout wrapper for all authenticated pages
 * Includes TopNavbar, Sidebar, and DepartmentUsersPanel
 * The department panel state persists across all pages
 */
export default function Layout({ children }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const { previewMode } = useRolePreview();

  const toggleSidebar = () => {
    console.log('Toggle sidebar clicked, current state:', mobileSidebarOpen);
    setMobileSidebarOpen(prev => {
      console.log('Setting sidebar to:', !prev);
      return !prev;
    });
  };

  const closeSidebar = () => {
    console.log('Closing sidebar');
    setMobileSidebarOpen(false);
  };

  return (
    <div 
      className="flex flex-col h-screen overflow-hidden" 
      style={{ 
        backgroundColor: 'var(--bg-secondary)',
        paddingTop: previewMode ? '44px' : '0' // Add padding when banner is visible
      }}
    >
      <TopNavbar toggleSidebar={toggleSidebar} />

      <div className="flex flex-1 overflow-hidden">
        {/* Mobile Sidebar */}
        <Sidebar
          isMobile={true}
          isOpen={mobileSidebarOpen}
          onClose={closeSidebar}
        />

        {/* Desktop Sidebar */}
        <Sidebar
          isMobile={false}
          isOpen={false}
        />

        {/* Main Content Area - Flex container for content + department panel */}
        <main className="flex flex-1 overflow-hidden" style={{ backgroundColor: 'transparent' }}>
          {/* Page Content */}
          <div className="flex-1 overflow-hidden">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
