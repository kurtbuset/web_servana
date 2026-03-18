/**
 * MessageStatus - Displays message delivery and read status as text
 * Maximum performance optimization with pre-computed styles
 */
import React from 'react';
import { useTheme } from '../../context/ThemeContext';

// Pre-computed style objects to avoid inline style creation
const LIGHT_STYLES = {
  sent: { color: 'rgba(0, 0, 0, 0.5)' },
  delivered: { color: '#6237A0' },
  read: { color: '#6237A0' }
};

const DARK_STYLES = {
  sent: { color: 'rgba(255, 255, 255, 0.6)' },
  delivered: { color: '#fdfdfdff' },
  read: { color: '#fdfdfdff' }
};

// Pre-computed text values
const STATUS_TEXT = {
  sent: 'Sent',
  delivered: 'Delivered',
  read: 'Read'
};

const MessageStatus = ({ status, className = "" }) => {
  const { isDark } = useTheme();
  
  // Direct object lookup - fastest possible
  const statusText = STATUS_TEXT[status] || STATUS_TEXT.sent;
  const styleObj = isDark ? DARK_STYLES[status] || DARK_STYLES.sent : LIGHT_STYLES[status] || LIGHT_STYLES.sent;

  return (
    <div 
      className={`text-[8px] sm:text-[9px] font-medium ${className}`}
      style={styleObj}
    >
      {statusText}
    </div>
  );
};

// Maximum optimization: only re-render if status actually changes
// Ignore className changes if they don't affect visual output
export default React.memo(MessageStatus, (prevProps, nextProps) => {
  // Only care about status changes - className is usually static
  return prevProps.status === nextProps.status;
});