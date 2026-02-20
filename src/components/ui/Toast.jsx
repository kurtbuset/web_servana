import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'react-feather';

/**
 * Toast - Custom toast notification component
 * 
 * A modern, reusable toast component with support for different types:
 * - success: Green with checkmark icon
 * - error: Red with X icon
 * - warning: Yellow/Orange with triangle icon
 * - info: Blue with info icon
 * 
 * Features:
 * - Light and dark mode support
 * - Smooth animations
 * - Auto-dismiss with progress bar
 * - Manual close button
 * - Accessible
 * - Compact design with vertical layout
 */

const Toast = ({ type = 'info', title, message, onClose }) => {
  // Dynamically track dark mode changes using data-theme attribute
  const [isDark, setIsDark] = useState(document.documentElement.getAttribute('data-theme') === 'dark');

  useEffect(() => {
    // Create observer to watch for dark mode changes
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.getAttribute('data-theme') === 'dark');
    });

    // Observe changes to the html element's attributes
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });

    return () => observer.disconnect();
  }, []);
  
  const getTypeStyles = () => {
    const baseStyles = "flex items-start gap-2 p-2.5 rounded-lg shadow-lg w-[320px] transition-all";
    
    switch (type) {
      case 'success':
        return {
          container: `${baseStyles} ${isDark ? 'bg-[#1a1a1a] border border-green-500/20' : 'bg-white border border-green-200'}`,
          icon: <CheckCircle size={18} className="flex-shrink-0 mt-0.5" style={{ color: '#10b981' }} />,
          titleColor: isDark ? '#10b981' : '#059669',
          messageColor: isDark ? '#d1d5db' : '#6b7280'
        };
      case 'error':
        return {
          container: `${baseStyles} ${isDark ? 'bg-[#1a1a1a] border border-red-500/20' : 'bg-white border border-red-200'}`,
          icon: <XCircle size={18} className="flex-shrink-0 mt-0.5" style={{ color: '#ef4444' }} />,
          titleColor: isDark ? '#ef4444' : '#dc2626',
          messageColor: isDark ? '#d1d5db' : '#6b7280'
        };
      case 'warning':
        return {
          container: `${baseStyles} ${isDark ? 'bg-[#1a1a1a] border border-yellow-500/20' : 'bg-white border border-yellow-200'}`,
          icon: <AlertTriangle size={18} className="flex-shrink-0 mt-0.5" style={{ color: '#f59e0b' }} />,
          titleColor: isDark ? '#f59e0b' : '#d97706',
          messageColor: isDark ? '#d1d5db' : '#6b7280'
        };
      case 'info':
      default:
        return {
          container: `${baseStyles} ${isDark ? 'bg-[#1a1a1a] border border-blue-500/20' : 'bg-white border border-blue-200'}`,
          icon: <Info size={18} className="flex-shrink-0 mt-0.5" style={{ color: '#3b82f6' }} />,
          titleColor: isDark ? '#3b82f6' : '#2563eb',
          messageColor: isDark ? '#d1d5db' : '#6b7280'
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div className={styles.container}>
      {/* Icon */}
      {styles.icon}

      {/* Content - Vertical Layout */}
      <div className="flex-1 min-w-0">
        {/* Title - Bigger */}
        <h4 className="text-sm font-semibold mb-0" style={{ color: styles.titleColor }}>
          {title}
        </h4>
        {/* Message - Smaller and more compact */}
        <p className="text-xs leading-tight mt-0.5" style={{ color: styles.messageColor }}>
          {message}
        </p>
      </div>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="flex-shrink-0 p-0.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label="Close notification"
      >
        <X size={13} style={{ color: isDark ? '#9ca3af' : '#6b7280' }} />
      </button>
    </div>
  );
};

export default Toast;
