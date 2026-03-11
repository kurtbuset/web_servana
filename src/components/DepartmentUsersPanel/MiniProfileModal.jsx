import React from "react";
import { useUser } from "../../context/UserContext";
import { formatLastSeen } from "../../utils/timeUtils";
import { getProfilePictureUrl } from "../../utils/imageUtils";

/**
 * MiniProfileModal - Discord-style mini profile popup
 */
export function MiniProfileModal({ user, isDark, onClose, skipAnimation = false }) {
  const { getUserStatus } = useUser();
  const [position, setPosition] = React.useState({ top: 0, left: 0 });
  const modalRef = React.useRef(null);
  const [isMobile, setIsMobile] = React.useState(false);
  
  const userStatus = getUserStatus(user.sys_user_id);
  
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
  
  const displayLastSeen = socketLastSeen || (user.last_seen ? new Date(user.last_seen) : null);
  
  const fullName = [
    user.profile?.prof_firstname,
    user.profile?.prof_middlename,
    user.profile?.prof_lastname
  ].filter(Boolean).join(" ").trim();
  
  const displayName = fullName || user.sys_user_email;
  const avatarUrl = getProfilePictureUrl(user.image?.img_location);
  const email = user.profile?.prof_email || user.sys_user_email;
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
  
  // Calculate position
  React.useEffect(() => {
    if (isMobile) {
      setPosition({
        top: '50%',
        left: '50%',
        right: 'auto',
        transform: 'translate(-50%, -50%)'
      });
    } else {
      setPosition({
        top: '50%',
        right: '280px',
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
        
        {/* Profile Content */}
        <div className="px-3 pb-3 -mt-6">
          {/* Avatar */}
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
          
          {/* User Info */}
          <div className="mt-2 p-2.5 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <h3 className="text-base font-bold truncate" style={{ color: 'var(--text-primary)' }}>
              {displayName}
            </h3>
            <p className="text-xs mt-0.5" style={{ color: isOnline ? '#10b981' : 'var(--text-secondary)' }}>
              {isOnline ? 'online' : (displayLastSeen ? formatLastSeen(displayLastSeen) : 'Offline')}
            </p>
          </div>
          
          {/* Departments Section */}
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
          
          {/* Email */}
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
