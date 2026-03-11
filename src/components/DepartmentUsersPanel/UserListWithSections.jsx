import React from "react";
import { useUser } from "../../context/UserContext";
import { UserCard } from "./UserCard";

/**
 * UserListWithSections - Discord-style user list with ONLINE/OFFLINE sections
 */
export function UserListWithSections({ members, isDark, onUserClick }) {
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
      
      const socketStatus = status.status;
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
