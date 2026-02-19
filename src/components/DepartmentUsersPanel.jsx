  import React, { useState, useEffect, useMemo } from "react";
import { useUser } from "../context/UserContext";
import { useTheme } from "../context/ThemeContext";
import { formatLastSeen } from "../utils/timeUtils";
import { getProfilePictureUrl } from "../utils/imageUtils";
import api from "../api";

// Cache for department data to prevent refetching on every navigation
let departmentDataCache = [];
let lastFetchTime = 0;
const CACHE_DURATION = 60000; // 1 minute cache

/**
 * DepartmentUsersPanel - Discord-style right sidebar showing department team members
 * Collapsible, responsive, with theme-matching colors
 * 
 * Usage:
 * ```jsx
 * const [isDepartmentPanelOpen, setIsDepartmentPanelOpen] = useState(false);
 * 
 * // Toggle button
 * <button onClick={() => setIsDepartmentPanelOpen(!isDepartmentPanelOpen)}>
 *   Toggle Department Panel
 * </button>
 * 
 * // Panel component
 * <DepartmentUsersPanel 
 *   isOpen={isDepartmentPanelOpen} 
 *   onClose={() => setIsDepartmentPanelOpen(false)} 
 * />
 * ```
 */
const DepartmentUsersPanel = React.memo(({ isOpen = false, onClose, isDropdown = false }) => {
  const { userData, getUserStatus, userStatuses } = useUser();
  const { isDark } = useTheme();
  const [departmentsData, setDepartmentsData] = useState(departmentDataCache);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentDeptIndex, setCurrentDeptIndex] = useState(0);
  const [, forceUpdate] = React.useReducer(x => x + 1, 0);
  const [selectedUser, setSelectedUser] = useState(null); // For mini profile modal
  const [previousUserId, setPreviousUserId] = useState(null); // Track previous user to avoid re-animation
  
  // Convert Map to array for dependency tracking
  const userStatusesArray = React.useMemo(() => {
    return Array.from(userStatuses.entries());
  }, [userStatuses]);

  const departments = userData?.departments || [];
  const currentDepartment = departmentsData[currentDeptIndex];
  
  // Calculate online members count based on real-time status
  const getOnlineMembersCount = (members) => {
    if (!members) return 0;
    
    const onlineCount = members.filter(member => {
      const status = getUserStatus(member.sys_user_id);
      
      // Trust the socket status if available, otherwise calculate from lastSeen
      const socketStatus = status.status;
      const lastSeenDate = status.lastSeen;
      
      let isOnline;
      if (socketStatus) {
        isOnline = socketStatus === 'online';
      } else if (lastSeenDate) {
        const diffMs = Date.now() - new Date(lastSeenDate).getTime();
        isOnline = diffMs < 45000;
      } else {
        isOnline = false;
      }
      
      return isOnline;
    }).length;
    
    return onlineCount;
  };
  
  // Update online count for current department
  const currentDeptWithOnlineCount = currentDepartment ? {
    ...currentDepartment,
    onlineMembers: getOnlineMembersCount(currentDepartment.members)
  } : null;

  // Force re-render when userStatuses changes
  React.useEffect(() => {
    if (currentDepartment && userStatuses.size > 0) {
      forceUpdate();
    }
  }, [userStatuses, currentDepartment]);

  // Only fetch data when panel is open
  useEffect(() => {
    if (!isOpen) return; // Don't fetch if panel is closed
    
    const now = Date.now();
    const shouldFetch = departments.length > 0 && 
                       (departmentsData.length === 0 || now - lastFetchTime > CACHE_DURATION);
    
    if (shouldFetch) {
      fetchAllDepartmentsUsers();
    }
  }, [isOpen, userData, departments.length]);

  const fetchAllDepartmentsUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch users for all departments
      const promises = departments.map(dept => 
        api.get(`/departments/${dept.dept_id}/members`, { withCredentials: true })
          .then(res => {
            const members = res.data.members || [];
            
            return {
              ...dept,
              members: members,
              totalMembers: members.length,
              onlineMembers: 0 // Will be calculated in real-time
            };
          })
          .catch(err => {
            console.error(`Error fetching members for ${dept.dept_name}:`, err);
            return {
              ...dept,
              members: [],
              totalMembers: 0,
              onlineMembers: 0,
              error: true
            };
          })
      );

      const results = await Promise.all(promises);
      setDepartmentsData(results);
      
      // Update cache
      departmentDataCache = results;
      lastFetchTime = Date.now();
    } catch (err) {
      console.error('Error fetching department users:', err);
      setError('Failed to load department users');
    } finally {
      setLoading(false);
    }
  };

  const handleNextDepartment = () => {
    setCurrentDeptIndex((prev) => (prev + 1) % departmentsData.length);
  };

  const handlePrevDepartment = () => {
    setCurrentDeptIndex((prev) => (prev - 1 + departmentsData.length) % departmentsData.length);
  };

  return (
    <>
      {/* Mobile/Tablet Overlay (< 1024px) - Only show on mobile when open */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-[65] transition-opacity duration-300"
          onClick={() => {
            if (onClose) onClose();
          }}
        />
      )}
      
      {/* Panel - Discord-style: Overlay on mobile, compress content on desktop */}
      <div
        className={`
          lg:relative lg:flex-shrink-0
          fixed lg:static top-14 sm:top-16 lg:top-0 right-0 
          h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] lg:h-full
          shadow-lg border-l overflow-hidden flex flex-col
          transition-all duration-300 ease-in-out
          ${isOpen ? 'lg:w-60' : 'lg:w-0'}
          ${isOpen ? 'translate-x-0 w-60 sm:w-72 z-[70]' : 'translate-x-full lg:translate-x-0 w-0 z-[70]'}
        `}
        style={{ 
          backgroundColor: 'var(--card-bg)',
          borderColor: 'var(--border-color)'
        }}
      >
      {/* Header */}
      <div className="p-4" style={{ 
        background: isDark 
          ? 'linear-gradient(135deg, #6237A0 0%, #7A4ED9 50%, #8B5CF6 100%)'
          : 'linear-gradient(135deg, #6237A0 0%, #7A4ED9 50%, #8B5CF6 100%)',
        color: '#ffffff'
      }}>
          {/* Close button for mobile/tablet */}
          <button
            onClick={() => {
              if (onClose) onClose();
            }}
            className="lg:hidden absolute top-4 right-4 p-1 hover:bg-white/20 rounded-md transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="mb-3">
            <h2 className="text-sm font-bold flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Team
            </h2>
            <p className="text-purple-100 text-xs mt-1 truncate">
              {loading ? "Loading..." : currentDepartment?.dept_name || "No Department"}
            </p>
          </div>

          {/* Stats */}
          {!loading && currentDeptWithOnlineCount && (
            <div className="flex gap-2">
              <div className="flex-1 bg-white/20 backdrop-blur-sm rounded-md p-2 border border-white/30">
                <p className="text-[10px] text-purple-100">Members</p>
                <p className="text-lg font-bold">{currentDeptWithOnlineCount.totalMembers}</p>
              </div>
              <div className="flex-1 bg-white/20 backdrop-blur-sm rounded-md p-2 border border-white/30">
                <p className="text-[10px] text-purple-100">Online</p>
                <p className="text-lg font-bold">{currentDeptWithOnlineCount.onlineMembers}</p>
              </div>
            </div>
          )}

          {/* Department Navigation Dots */}
          {departmentsData.length > 1 && (
            <div className="mt-3 flex justify-center items-center gap-2">
              <button
                onClick={handlePrevDepartment}
                className="p-0.5 hover:bg-white/20 rounded-full transition-all"
                disabled={loading}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="flex gap-1.5">
                {departmentsData.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentDeptIndex(index)}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      index === currentDeptIndex ? 'bg-white w-4' : 'bg-white/40'
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={handleNextDepartment}
                className="p-0.5 hover:bg-white/20 rounded-full transition-all"
                disabled={loading}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Users List - Discord Style with Sections */}
        <div className="flex-1 p-3 space-y-3 overflow-y-auto department-panel-scrollbar" style={{ 
          backgroundColor: 'var(--bg-secondary)'
        }}>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex flex-col items-center space-y-2">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-t-[#6237A0]" style={{ borderColor: 'var(--border-color)', borderTopColor: '#6237A0' }}></div>
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Loading...</span>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <svg className="w-8 h-8 mx-auto mb-2" style={{ color: isDark ? '#6b7280' : '#9ca3af' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{error}</p>
            </div>
          ) : !currentDepartment ? (
            <div className="text-center py-8">
              <svg className="w-8 h-8 mx-auto mb-2" style={{ color: isDark ? '#6b7280' : '#9ca3af' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <p className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>No departments</p>
            </div>
          ) : currentDepartment.members.length === 0 ? (
            <div className="text-center py-8">
              <svg className="w-8 h-8 mx-auto mb-2" style={{ color: isDark ? '#6b7280' : '#9ca3af' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>No members</p>
            </div>
          ) : (
            <UserListWithSections 
              members={currentDepartment.members} 
              isDark={isDark} 
              onUserClick={(user) => {
                setPreviousUserId(selectedUser?.sys_user_id || null);
                setSelectedUser(user);
              }} 
            />
          )}
        </div>
        
        {/* Scrollbar styling - inline for theme reactivity */}
        <style key={`scrollbar-${isDark ? 'dark' : 'light'}`} dangerouslySetInnerHTML={{
          __html: `
            .department-panel-scrollbar::-webkit-scrollbar {
              width: 6px !important;
            }
            .department-panel-scrollbar::-webkit-scrollbar-track {
              background: transparent !important;
            }
            .department-panel-scrollbar::-webkit-scrollbar-thumb {
              background: ${isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'} !important;
              border-radius: 3px !important;
            }
            .department-panel-scrollbar::-webkit-scrollbar-thumb:hover {
              background: ${isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)'} !important;
            }
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes scaleIn {
              from { transform: translate(-50%, -50%) scale(0.9); opacity: 0; }
              to { transform: translate(-50%, -50%) scale(1); opacity: 1; }
            }
            @keyframes slideInRight {
              from { 
                opacity: 0;
                transform: translateY(-50%) translateX(20px);
              }
              to { 
                opacity: 1;
                transform: translateY(-50%) translateX(0);
              }
            }
            .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
            .animate-scaleIn { animation: scaleIn 0.2s ease-out; }
            .animate-slideInRight { animation: slideInRight 0.2s ease-out; }
          `
        }} />
      </div>
      
      {/* Mini Profile Modal */}
      {selectedUser && (
        <MiniProfileModal 
          user={selectedUser} 
          isDark={isDark} 
          onClose={() => {
            setSelectedUser(null);
            setPreviousUserId(null);
          }}
          skipAnimation={previousUserId === selectedUser.sys_user_id}
        />
      )}
    </>
  );
});

DepartmentUsersPanel.displayName = 'DepartmentUsersPanel';

export default DepartmentUsersPanel;

/**
 * UserListWithSections - Discord-style user list with ONLINE/OFFLINE sections
 */
function UserListWithSections({ members, isDark, onUserClick }) {
  const { getUserStatus, userStatuses } = useUser();
  
  // Convert Map to array for dependency tracking
  const userStatusesArray = React.useMemo(() => {
    return Array.from(userStatuses.entries());
  }, [userStatuses]);
  
  // Separate users into online and offline
  const { onlineUsers, offlineUsers } = React.useMemo(() => {
    const online = [];
    const offline = [];
    
    members.forEach(member => {
      const status = getUserStatus(member.sys_user_id);
      
      // Trust the socket status if available, otherwise calculate from lastSeen
      const socketStatus = status.status; // 'online' or 'offline' from socket
      const lastSeenDate = status.lastSeen;
      
      let isOnline;
      if (socketStatus) {
        isOnline = socketStatus === 'online';
      } else if (lastSeenDate) {
        const now = Date.now();
        const lastSeenTime = new Date(lastSeenDate).getTime();
        const diffMs = now - lastSeenTime;
        isOnline = diffMs < 45000;
      } else {
        isOnline = false;
      }
      
      if (isOnline) {
        online.push(member);
      } else {
        offline.push(member);
      }
    });
    
    // Sort alphabetically within each section
    online.sort((a, b) => {
      const nameA = [a.profile?.prof_firstname, a.profile?.prof_lastname].filter(Boolean).join(" ");
      const nameB = [b.profile?.prof_firstname, b.profile?.prof_lastname].filter(Boolean).join(" ");
      return nameA.localeCompare(nameB);
    });
    
    offline.sort((a, b) => {
      const nameA = [a.profile?.prof_firstname, a.profile?.prof_lastname].filter(Boolean).join(" ");
      const nameB = [b.profile?.prof_firstname, b.profile?.prof_lastname].filter(Boolean).join(" ");
      return nameA.localeCompare(nameB);
    });
    
    return { onlineUsers: online, offlineUsers: offline };
  }, [members, getUserStatus, userStatusesArray]);
  
  return (
    <div className="space-y-3">
      {/* ONLINE Section */}
      {onlineUsers.length > 0 && (
        <div>
          <div className="flex items-center gap-2 px-2 py-1 mb-1">
            <h3 className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
              Online — {onlineUsers.length}
            </h3>
          </div>
          <div className="space-y-0.5">
            {onlineUsers.map(member => (
              <UserCard key={member.sys_user_id} user={member} isDark={isDark} onClick={() => onUserClick(member)} />
            ))}
          </div>
        </div>
      )}
      
      {/* OFFLINE Section */}
      {offlineUsers.length > 0 && (
        <div>
          <div className="flex items-center gap-2 px-2 py-1 mb-1">
            <h3 className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
              Offline — {offlineUsers.length}
            </h3>
          </div>
          <div className="space-y-0.5">
            {offlineUsers.map(member => (
              <UserCard key={member.sys_user_id} user={member} isDark={isDark} onClick={() => onUserClick(member)} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * UserCard - Individual user card component (compact version)
 */
function UserCard({ user, isDark, onClick }) {
  const { getUserStatus, userStatuses } = useUser();
  const [currentTime, setCurrentTime] = React.useState(Date.now());
  
  // Update current time every 10 seconds to refresh "X mins ago" text
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Get fresh status on every render and when userStatuses changes
  const userStatus = React.useMemo(() => {
    return getUserStatus(user.sys_user_id);
  }, [getUserStatus, user.sys_user_id, userStatuses]);
  
  // Trust the socket status if available, otherwise calculate from lastSeen
  const socketStatus = userStatus.status; // 'online' or 'offline' from socket
  const socketLastSeen = userStatus.lastSeen;
  
  // If socket provides explicit status, use it. Otherwise calculate from timestamp.
  let isOnline;
  if (socketStatus) {
    isOnline = socketStatus === 'online';
  } else if (socketLastSeen) {
    const now = Date.now();
    const socketTime = new Date(socketLastSeen).getTime();
    const diffMs = now - socketTime;
    isOnline = diffMs < 45000;
  } else {
    isOnline = false;
  }
  
  // For display text: Use socket data if available, otherwise fall back to database
  const displayLastSeen = socketLastSeen || (user.last_seen ? new Date(user.last_seen) : null);
  
  // Construct full name from profile data
  const fullName = [
    user.profile?.prof_firstname,
    user.profile?.prof_middlename,
    user.profile?.prof_lastname
  ].filter(Boolean).join(" ").trim();
  
  // Fallback to email if no name available
  const displayName = fullName || user.sys_user_email;
  
  // Get avatar URL
  const avatarUrl = getProfilePictureUrl(user.image?.img_location);
  
  return (
    <div 
      className="flex items-center gap-2 p-2 rounded-md transition-all cursor-pointer group hover:bg-opacity-80"
      style={{
        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)';
      }}
      onClick={onClick}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <img
          src={avatarUrl}
          alt={displayName}
          className="w-8 h-8 rounded-full object-cover"
        />
        <div 
          className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 ${isOnline ? 'bg-green-500' : 'bg-gray-400'} border-2 rounded-full`} 
          style={{ borderColor: isDark ? '#2b2d31' : '#f2f3f5' }}
        ></div>
      </div>

      {/* User Info */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
          {displayName}
        </h4>
        <p className="text-xs truncate" style={{ color: isOnline ? '#10b981' : 'var(--text-secondary)' }}>
          {isOnline ? 'online' : (displayLastSeen ? formatLastSeen(displayLastSeen) : 'Offline')}
        </p>
      </div>
    </div>
  );
}


/**
 * MiniProfileModal - Discord-style mini profile popup
 */
function MiniProfileModal({ user, isDark, onClose, skipAnimation = false }) {
  const { getUserStatus } = useUser();
  const [position, setPosition] = React.useState({ top: 0, left: 0 });
  const modalRef = React.useRef(null);
  const [isMobile, setIsMobile] = React.useState(false);
  
  const userStatus = getUserStatus(user.sys_user_id);
  
  // Trust the socket status if available, otherwise calculate from lastSeen
  const socketStatus = userStatus.status;
  const socketLastSeen = userStatus.lastSeen;
  
  let isOnline;
  if (socketStatus) {
    isOnline = socketStatus === 'online';
  } else if (socketLastSeen) {
    const diffMs = Date.now() - new Date(socketLastSeen).getTime();
    isOnline = diffMs < 45000;
  } else {
    isOnline = false;
  }
  
  // For display text: Use socket data if available, otherwise fall back to database
  const displayLastSeen = socketLastSeen || (user.last_seen ? new Date(user.last_seen) : null);
  
  const fullName = [
    user.profile?.prof_firstname,
    user.profile?.prof_middlename,
    user.profile?.prof_lastname
  ].filter(Boolean).join(" ").trim();
  
  const displayName = fullName || user.sys_user_email;
  const avatarUrl = getProfilePictureUrl(user.image?.img_location);
  const email = user.profile?.prof_email || user.sys_user_email;
  
  // Get user's departments
  const userDepartments = user.departments || [];
  
  // Check if mobile on mount and window resize
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Close on click outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);
  
  // Calculate position - to the left of department panel on desktop, centered on mobile
  React.useEffect(() => {
    if (isMobile) {
      // Mobile: centered
      setPosition({
        top: '50%',
        left: '50%',
        right: 'auto',
        transform: 'translate(-50%, -50%)'
      });
    } else {
      // Desktop: to the left of department panel
      setPosition({
        top: '50%',
        right: '280px', // 240px panel + 40px gap
        left: 'auto',
        transform: 'translateY(-50%)'
      });
    }
  }, [isMobile]);
  
  return (
    <>
      {/* Backdrop for mobile */}
      {isMobile && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[71] animate-fadeIn"
          onClick={onClose}
        />
      )}
      
      <div
        ref={modalRef}
        className={`fixed w-[280px] rounded-xl shadow-2xl z-[72] overflow-hidden ${skipAnimation ? '' : (isMobile ? 'animate-scaleIn' : 'animate-slideInRight')}`}
        style={{ 
          backgroundColor: 'var(--card-bg)',
          top: position.top,
          left: position.left,
          right: position.right,
          transform: position.transform
        }}
      >
      {/* Compact Banner with gradient */}
      <div className="h-12 bg-gradient-to-br from-[#6237A0] via-[#7A4ED9] to-[#8B5CF6] relative">
        <div className="absolute top-1.5 right-1.5">
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-white/20 transition-all"
          >
            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Profile Content - Compact */}
      <div className="px-3 pb-3 -mt-6">
        {/* Avatar - Smaller */}
        <div className="relative inline-block">
          <div className="w-16 h-16 rounded-full border-4 overflow-hidden" style={{ borderColor: 'var(--card-bg)' }}>
            <img
              src={avatarUrl}
              alt={displayName}
              className="w-full h-full object-cover"
            />
          </div>
          <div 
            className={`absolute bottom-0.5 right-0.5 w-4 h-4 ${isOnline ? 'bg-green-500' : 'bg-gray-400'} border-[3px] rounded-full`}
            style={{ borderColor: 'var(--card-bg)' }}
          />
        </div>
        
        {/* User Info - Compact */}
        <div className="mt-2 p-2.5 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
          <h3 className="text-base font-bold truncate" style={{ color: 'var(--text-primary)' }}>
            {displayName}
          </h3>
          <p className="text-xs mt-0.5" style={{ color: isOnline ? '#10b981' : 'var(--text-secondary)' }}>
            {isOnline ? 'online' : (displayLastSeen ? formatLastSeen(displayLastSeen) : 'Offline')}
          </p>
        </div>
        
        {/* Departments Section - Compact with "ROLES" label like Discord */}
        {userDepartments.length > 0 && (
          <div className="mt-2.5 p-2.5 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <div className="flex items-center gap-1.5 mb-1.5">
              <svg className="w-3.5 h-3.5" style={{ color: '#6237A0' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                Departments
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {userDepartments.map((dept, index) => (
                <span
                  key={index}
                  className="px-2 py-1 rounded-md text-[11px] font-semibold border"
                  style={{
                    backgroundColor: isDark ? 'rgba(139, 92, 246, 0.15)' : '#f5f3ff',
                    borderColor: isDark ? 'rgba(139, 92, 246, 0.4)' : '#e9d5ff',
                    color: isDark ? '#c4b5fd' : '#6237A0'
                  }}
                >
                  {dept.dept_name || dept}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* Email - Compact */}
        {email && (
          <div className="mt-2.5 p-2.5 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <div className="flex items-center gap-1.5 mb-1">
              <svg className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#6237A0' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                Email
              </span>
            </div>
            <p className="text-xs break-words" style={{ color: 'var(--text-primary)' }}>{email}</p>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
