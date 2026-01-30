import React, { useState, useEffect } from 'react';
import { formatLastSeen, getStatusColor, isUserOnline } from '../utils/timeUtils';

/**
 * UserStatus Component - Shows online/offline status like Facebook/Instagram
 * @param {Object} props
 * @param {Date|string} props.lastSeen - Last seen timestamp
 * @param {boolean} props.showDot - Show colored dot indicator
 * @param {boolean} props.showText - Show status text
 * @param {string} props.size - Size: 'sm', 'md', 'lg'
 * @param {string} props.className - Additional CSS classes
 */
const UserStatus = ({ 
  lastSeen, 
  showDot = true, 
  showText = true, 
  size = 'md',
  className = '' 
}) => {
  const [statusText, setStatusText] = useState('');
  const [statusColor, setStatusColor] = useState('#6b7280');
  const [online, setOnline] = useState(false);

  useEffect(() => {
    const updateStatus = () => {
      setStatusText(formatLastSeen(lastSeen));
      setStatusColor(getStatusColor(lastSeen));
      setOnline(isUserOnline(lastSeen));
    };

    updateStatus();

    // Update every 30 seconds to keep "X mins ago" current
    const interval = setInterval(updateStatus, 30000);

    return () => clearInterval(interval);
  }, [lastSeen]);

  const dotSizes = {
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3'
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showDot && (
        <span 
          className={`${dotSizes[size]} rounded-full ${online ? 'animate-pulse' : ''}`}
          style={{ backgroundColor: statusColor }}
          title={statusText}
        />
      )}
      {showText && (
        <span 
          className={`${textSizes[size]} text-gray-600 dark:text-gray-400`}
          style={{ color: online ? statusColor : undefined }}
        >
          {statusText}
        </span>
      )}
    </div>
  );
};

export default UserStatus;
