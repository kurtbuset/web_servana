import React from 'react';
import { X } from 'react-feather';

/**
 * Modal Component - Reusable modal dialog
 * 
 * @param {boolean} isOpen - Controls modal visibility
 * @param {function} onClose - Callback when modal should close
 * @param {string} title - Modal title
 * @param {React.ReactNode} children - Modal content (form fields, etc.)
 * @param {Array} actions - Array of action button configs
 * @param {boolean} showCloseIcon - Show X icon in top right (default: false)
 * @param {string} size - Modal size: 'sm', 'md', 'lg', 'xl' (default: 'md')
 * @param {boolean} isDark - Dark mode flag
 * 
 * Action button config:
 * {
 *   label: string,
 *   onClick: function,
 *   variant: 'primary' | 'secondary' | 'danger',
 *   disabled: boolean,
 *   className: string (optional override)
 * }
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  actions = [],
  showCloseIcon = false,
  size = 'md',
  isDark = false
}) {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl'
  };

  const getButtonStyles = (variant, disabled) => {
    if (disabled) {
      return {
        className: 'px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-not-allowed',
        style: {
          backgroundColor: isDark ? '#4a4a4a' : '#d1d5db',
          color: isDark ? '#9ca3af' : '#6b7280'
        }
      };
    }

    switch (variant) {
      case 'primary':
        return {
          className: 'px-4 py-2 bg-[#6237A0] text-white text-sm rounded-lg hover:bg-[#552C8C] transition-colors font-medium',
          style: {}
        };
      case 'danger':
        return {
          className: 'px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors font-medium',
          style: {}
        };
      case 'secondary':
      default:
        return {
          className: 'px-4 py-2 text-sm rounded-lg transition-colors font-medium',
          style: {
            backgroundColor: isDark ? '#4a4a4a' : '#e5e7eb',
            color: 'var(--text-primary)'
          },
          hoverStyle: {
            backgroundColor: isDark ? '#5a5a5a' : '#d1d5db'
          }
        };
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
      <div 
        className={`rounded-lg shadow-xl p-5 sm:p-6 w-full ${sizeClasses[size]}`}
        style={{ backgroundColor: 'var(--card-bg)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
            {title}
          </h2>
          {showCloseIcon && (
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              style={{ color: 'var(--text-secondary)' }}
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="mb-5">
          {children}
        </div>

        {/* Actions */}
        {actions.length > 0 && (
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3">
            {actions.map((action, index) => {
              const buttonStyles = getButtonStyles(action.variant, action.disabled);
              
              return (
                <button
                  key={index}
                  onClick={action.onClick}
                  disabled={action.disabled}
                  className={action.className || buttonStyles.className}
                  style={action.className ? {} : buttonStyles.style}
                  onMouseEnter={(e) => {
                    if (!action.disabled && buttonStyles.hoverStyle) {
                      Object.assign(e.currentTarget.style, buttonStyles.hoverStyle);
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!action.disabled && buttonStyles.hoverStyle) {
                      Object.assign(e.currentTarget.style, buttonStyles.style);
                    }
                  }}
                >
                  {action.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
