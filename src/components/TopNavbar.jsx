import { Menu } from "react-feather";
import { useState } from "react";
import { useUser } from "../../src/context/UserContext";
import { useTheme } from "../../src/context/ThemeContext";
import { useUnsavedChanges } from "../../src/context/UnsavedChangesContext";
import { usePresence } from "../../src/context/PresenceContext";
import UserProfilePanel from "./UserProfilePanel";
import { getAvatarUrl } from "../utils/imageUtils";

export default function TopNavbar({ toggleSidebar }) {
  const { userData, loading } = useUser();
  const { isDark } = useTheme();
  const { blockNavigation, hasUnsavedChanges } = useUnsavedChanges();
  const { myPresence } = usePresence();
  const [showProfilePanel, setShowProfilePanel] = useState(false);

  // Build full name
  const fullName = userData
    ? [userData.profile?.prof_firstname, userData.profile?.prof_middlename, userData.profile?.prof_lastname]
        .filter(Boolean)
        .join(" ")
    : "";

  // Get avatar or fallback
  const avatarUrl = getAvatarUrl(userData);
  
  // Determine indicator color based on agent presence from Redis
  const getStatusColor = () => {
    switch (myPresence) {
      case 'accepting_chats': return 'bg-green-500';
      case 'not_accepting_chats': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const handleProfileClick = () => {
    if (blockNavigation()) {
      return; // Blocked by unsaved changes
    }
    setShowProfilePanel(true);
  };

  const handleCloseProfilePanel = () => {
    setShowProfilePanel(false);
  };

  return (
    <>
      <header 
        className="h-14 sm:h-16 shadow flex items-center z-50 pl-12 sm:pl-14 md:pl-16 relative justify-between pr-3 sm:pr-4 md:pr-6 transition-colors duration-300"
        style={{ 
          backgroundColor: 'var(--card-bg)', 
          borderBottom: `1px solid var(--border-color)`,
          opacity: hasUnsavedChanges ? 0.5 : 1,
          pointerEvents: hasUnsavedChanges ? 'none' : 'auto'
        }}
      >
        <button
          className="md:hidden absolute left-2 sm:left-3 hover:opacity-80 focus:outline-none transition-opacity"
          onClick={toggleSidebar}
          style={{ 
            color: 'var(--text-primary)',
            pointerEvents: 'auto'
          }}
          data-sidebar-toggle
          disabled={hasUnsavedChanges}
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
          {/* Profile Button */}
          <button 
            onClick={handleProfileClick}
            className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity group"
            style={{ pointerEvents: 'auto' }}
            title={hasUnsavedChanges ? "Save or reset changes first" : "View Profile"}
            disabled={hasUnsavedChanges}
          >
            <div className="relative">
              <img
                src={avatarUrl}
                alt={fullName || "Profile"}
                className="h-7 w-7 sm:h-8 sm:w-8 rounded-full object-cover ring-2 ring-transparent group-hover:ring-[#6237A0] transition-all"
              />
              <div 
                className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 border-2 rounded-full ${getStatusColor()}`}
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
    </>
  );
}
