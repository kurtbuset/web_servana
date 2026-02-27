import React from "react";
import { useUser } from "../../context/UserContext";
import { formatLastSeen } from "../../utils/timeUtils";
import { getProfilePictureUrl } from "../../utils/imageUtils";

/**
 * UserCard - Individual user card component (compact version)
 */
export function UserCard({ user, isDark, onClick }) {
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
  const socketStatus = userStatus.status;
  const socketLastSeen = userStatus.lastSeen;
  
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
  
  const displayLastSeen = socketLastSeen || (user.last_seen ? new Date(user.last_seen) : null);
  
  const fullName = [
    user.profile?.prof_firstname,
    user.profile?.prof_middlename,
    user.profile?.prof_lastname
  ].filter(Boolean).join(" ").trim();
  
  const displayName = fullName || user.sys_user_email;
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
