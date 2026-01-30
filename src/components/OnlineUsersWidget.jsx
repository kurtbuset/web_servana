import React from 'react';
import { useUser } from '../context/UserContext';
import UserStatus from './UserStatus';
import { useTheme } from '../context/ThemeContext';

/**
 * OnlineUsersWidget - Shows currently online users
 * Add this to your dashboard to test the status system
 */
export default function OnlineUsersWidget() {
  const { userStatuses, userData } = useUser();
  const { isDark } = useTheme();

  // Convert Map to Array
  const onlineUsers = Array.from(userStatuses.entries())
    .map(([userId, status]) => ({
      userId,
      ...status
    }))
    .filter(user => user.status === 'online' && user.userId !== userData?.sys_user_id);

  return (
    <div 
      className="rounded-xl p-4 shadow-sm border"
      style={{ 
        backgroundColor: 'var(--card-bg)', 
        borderColor: 'var(--border-color)'
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          Online Users
        </h3>
        <span 
          className="text-xs px-2 py-1 rounded-full"
          style={{ 
            backgroundColor: isDark ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.1)',
            color: '#10b981'
          }}
        >
          {onlineUsers.length}
        </span>
      </div>

      {onlineUsers.length === 0 ? (
        <div className="text-center py-6">
          <div className="w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center" style={{
            backgroundColor: isDark ? 'rgba(107, 114, 128, 0.2)' : 'rgba(107, 114, 128, 0.1)'
          }}>
            <svg className="w-6 h-6" style={{ color: 'var(--text-secondary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            No other users online
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
            Open another browser to test
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {onlineUsers.map(user => (
            <div 
              key={user.userId}
              className="flex items-center justify-between p-2 rounded-lg"
              style={{
                backgroundColor: isDark ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.05)'
              }}
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-semibold">
                  {user.userId}
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    User {user.userId}
                  </p>
                  <UserStatus lastSeen={user.lastSeen} showDot={false} showText={true} size="sm" />
                </div>
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          ))}
        </div>
      )}

      {/* Debug Info */}
      <div className="mt-3 pt-3 border-t" style={{ borderColor: 'var(--border-color)' }}>
        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          Total tracked: {userStatuses.size} | Your ID: {userData?.sys_user_id || 'N/A'}
        </p>
      </div>
    </div>
  );
}
