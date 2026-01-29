import { Menu } from "react-feather";
import { useState } from "react";
import { useUser } from "../../src/context/UserContext";
import { useTheme } from "../../src/context/ThemeContext";
import { useUnsavedChanges } from "../../src/context/UnsavedChangesContext";
import UserProfilePanel from "./UserProfilePanel";
import DepartmentUsersPanel from "./DepartmentUsersPanel";

export default function TopNavbar({ toggleSidebar }) {
  const { userData, loading } = useUser();
  const { isDark } = useTheme();
  const { blockNavigation } = useUnsavedChanges();
  const [showProfilePanel, setShowProfilePanel] = useState(false);
  const [showDepartmentPanel, setShowDepartmentPanel] = useState(false);

  // Build full name
  const fullName = userData
    ? [userData.profile?.prof_firstname, userData.profile?.prof_middlename, userData.profile?.prof_lastname]
        .filter(Boolean)
        .join(" ")
    : "";

  // Get avatar or fallback
  const avatarUrl = userData?.image?.img_location;

  const handleProfileClick = () => {
    if (blockNavigation()) {
      return; // Blocked by unsaved changes
    }
    setShowProfilePanel(true);
  };

  const handleCloseProfilePanel = () => {
    setShowProfilePanel(false);
  };

  const handleDepartmentClick = () => {
    if (blockNavigation()) {
      return; // Blocked by unsaved changes
    }
    setShowDepartmentPanel(true);
  };

  const handleCloseDepartmentPanel = () => {
    setShowDepartmentPanel(false);
  };

  return (
    <>
      <header 
        className="h-14 sm:h-16 shadow flex items-center z-50 pl-12 sm:pl-14 md:pl-16 relative justify-between pr-3 sm:pr-4 md:pr-6 transition-colors duration-300"
        style={{ backgroundColor: 'var(--card-bg)', borderBottom: `1px solid var(--border-color)` }}
      >
        <button
          className="md:hidden absolute left-2 sm:left-3 hover:opacity-80 focus:outline-none transition-opacity"
          onClick={toggleSidebar}
          style={{ color: 'var(--text-primary)' }}
        >
          <Menu size={20} className="sm:w-6 sm:h-6" strokeWidth={1} />
        </button>

        <div className="flex items-center gap-2 sm:gap-3">
          <img 
            src="images/icon.png" 
            alt="Servana Logo" 
            className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10"
          />
          <span
            className="text-base sm:text-lg md:text-xl font-semibold relative transition-colors duration-300"
            style={{ 
              top: "-1px",
              color: isDark ? '#ffffff' : '#6b21a8'
            }}
          >
            servana
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Department Users Icon */}
          <button
            onClick={handleDepartmentClick}
            className="p-2 rounded-lg transition-all group relative"
            style={{ 
              color: isDark ? 'var(--text-secondary)' : '#6b7280',
              backgroundColor: isDark ? 'transparent' : 'transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = isDark ? 'rgba(139, 92, 246, 0.1)' : '#f5f3ff';
              e.currentTarget.style.color = '#6237A0';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = isDark ? 'var(--text-secondary)' : '#6b7280';
            }}
            title="View Department Team"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {/* Badge for online count */}
            <span 
              className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2"
              style={{ borderColor: 'var(--card-bg)' }}
            >
              3
            </span>
          </button>

          {/* Profile Button */}
          <button 
            onClick={handleProfileClick}
            className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity group"
          >
            <div className="relative">
              <img
                src={avatarUrl || "profile_picture/DefaultProfile.jpg"}
                alt={fullName || "Profile"}
                className="h-7 w-7 sm:h-8 sm:w-8 rounded-full object-cover ring-2 ring-transparent group-hover:ring-[#6237A0] transition-all"
              />
              <div 
                className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 rounded-full"
                style={{ borderColor: 'var(--card-bg)' }}
              ></div>
            </div>
            <span 
              className="text-xs sm:text-sm font-medium hidden xs:block max-w-[100px] sm:max-w-[150px] md:max-w-none truncate"
              style={{ color: 'var(--text-primary)' }}
            >
              {loading ? "" : fullName || ""}
            </span>
          </button>
        </div>
      </header>

      {/* Profile Panel */}
      <UserProfilePanel
        userData={userData}
        isOpen={showProfilePanel}
        onClose={handleCloseProfilePanel}
      />

      {/* Department Users Panel */}
      <DepartmentUsersPanel
        isOpen={showDepartmentPanel}
        onClose={handleCloseDepartmentPanel}
      />
    </>
  );
}
