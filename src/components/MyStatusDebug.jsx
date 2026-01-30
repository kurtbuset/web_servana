import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { useTheme } from '../context/ThemeContext';
import socket from '../socket';

/**
 * MyStatusDebug - Shows YOUR current status in real-time
 * Updates automatically via Socket.IO - NO REFRESH NEEDED!
 */
export default function MyStatusDebug() {
  const { userData, getUserStatus, userStatuses } = useUser();
  const { isDark } = useTheme();
  const [socketConnected, setSocketConnected] = useState(socket.connected);
  const [lastHeartbeat, setLastHeartbeat] = useState(null);
  const [activityCount, setActivityCount] = useState(0);
  const [onlineUsersCount, setOnlineUsersCount] = useState(0);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Update online users count in real-time
  useEffect(() => {
    setOnlineUsersCount(userStatuses.size);
  }, [userStatuses]);

  useEffect(() => {
    // Track socket connection
    const handleConnect = () => {
      setSocketConnected(true);
      setLastUpdate(new Date());
    };
    
    const handleDisconnect = () => {
      setSocketConnected(false);
      setLastUpdate(new Date());
    };

    // Listen for status changes (real-time updates!)
    const handleStatusChanged = (data) => {
      console.log('🔄 Real-time status update:', data);
      setLastUpdate(new Date());
    };

    // Listen for online users list
    const handleOnlineUsersList = (users) => {
      console.log('📋 Real-time online users:', users.length);
      setOnlineUsersCount(users.length);
      setLastUpdate(new Date());
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('userStatusChanged', handleStatusChanged);
    socket.on('onlineUsersList', handleOnlineUsersList);

    // Track activity
    const handleActivity = () => {
      setActivityCount(prev => prev + 1);
    };

    window.addEventListener('mousedown', handleActivity);
    window.addEventListener('keydown', handleActivity);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('userStatusChanged', handleStatusChanged);
      socket.off('onlineUsersList', handleOnlineUsersList);
      window.removeEventListener('mousedown', handleActivity);
      window.removeEventListener('keydown', handleActivity);
    };
  }, []);

  // Update heartbeat time every 30 seconds
  useEffect(() => {
    const updateHeartbeat = () => {
      setLastHeartbeat(new Date().toLocaleTimeString());
    };
    
    updateHeartbeat(); // Initial update
    const interval = setInterval(updateHeartbeat, 30000);

    return () => clearInterval(interval);
  }, []);

  if (!userData) return null;

  const myStatus = getUserStatus(userData.sys_user_id);

  return (
    <div 
      className="fixed bottom-4 right-4 p-4 rounded-lg shadow-lg border-2 z-50 max-w-sm"
      style={{
        backgroundColor: isDark ? '#2a2a2a' : '#ffffff',
        borderColor: socketConnected ? '#10b981' : '#ef4444'
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
          🔍 Real-Time Status
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-green-500 font-semibold animate-pulse">LIVE</span>
          <div 
            className={`w-3 h-3 rounded-full ${socketConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}
            title={socketConnected ? 'Connected' : 'Disconnected'}
          />
        </div>
      </div>

      <div className="space-y-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
        {/* User Info */}
        <div className="flex justify-between">
          <span className="font-medium">User ID:</span>
          <span className="font-mono">{userData.sys_user_id}</span>
        </div>

        {/* Socket Status */}
        <div className="flex justify-between">
          <span className="font-medium">Socket:</span>
          <span className={socketConnected ? 'text-green-500' : 'text-red-500'}>
            {socketConnected ? '✅ Connected' : '❌ Disconnected'}
          </span>
        </div>

        {/* My Status */}
        <div className="flex justify-between">
          <span className="font-medium">My Status:</span>
          <span className="font-semibold">
            {myStatus.lastSeen ? (
              <>
                {myStatus.status === 'online' ? '🟢' : '⚪'} {myStatus.status || 'unknown'}
              </>
            ) : (
              '⚪ No data'
            )}
          </span>
        </div>

        {/* Last Seen */}
        {myStatus.lastSeen && (
          <div className="flex justify-between">
            <span className="font-medium">Last Seen:</span>
            <span className="font-mono text-xs">
              {new Date(myStatus.lastSeen).toLocaleTimeString()}
            </span>
          </div>
        )}

        {/* Online Users Count */}
        <div className="flex justify-between">
          <span className="font-medium">Online Users:</span>
          <span className="font-mono text-green-500">{onlineUsersCount}</span>
        </div>

        {/* Activity Count */}
        <div className="flex justify-between">
          <span className="font-medium">Activity:</span>
          <span className="font-mono">{activityCount} events</span>
        </div>

        {/* Last Heartbeat */}
        {lastHeartbeat && (
          <div className="flex justify-between">
            <span className="font-medium">Last Heartbeat:</span>
            <span className="font-mono text-xs">{lastHeartbeat}</span>
          </div>
        )}

        {/* Last Update */}
        <div className="flex justify-between">
          <span className="font-medium">Last Update:</span>
          <span className="font-mono text-xs text-blue-500">
            {lastUpdate.toLocaleTimeString()}
          </span>
        </div>

        {/* Real-time indicator */}
        <div className="mt-3 pt-3 border-t" style={{ borderColor: 'var(--border-color)' }}>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <p className="text-xs font-semibold text-green-500">
              Updates automatically - No refresh needed!
            </p>
          </div>
        </div>

        {/* Test Buttons */}
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => {
              socket.emit('userOnline', {
                userId: userData.sys_user_id,
                userType: userData.role_name,
                userName: 'Test User'
              });
              setLastUpdate(new Date());
              alert('✅ Sent userOnline event!');
            }}
            className="flex-1 px-2 py-1 text-xs rounded bg-green-500 text-white hover:bg-green-600"
          >
            Test Online
          </button>
          <button
            onClick={() => {
              socket.emit('getOnlineUsers');
              setLastUpdate(new Date());
              alert('✅ Requested online users!');
            }}
            className="flex-1 px-2 py-1 text-xs rounded bg-blue-500 text-white hover:bg-blue-600"
          >
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
}
