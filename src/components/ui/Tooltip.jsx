import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

/**
 * Tooltip Component
 * A reusable tooltip that appears on hover with enhanced styling
 * 
 * @param {React.ReactNode} children - The element that triggers the tooltip
 * @param {string} content - The tooltip text content
 * @param {string} title - Optional title for the tooltip
 * @param {string} position - Tooltip position: 'top', 'bottom', 'left', 'right' (default: 'top')
 * @param {boolean} isDark - Dark mode flag
 */
export default function Tooltip({ 
  children, 
  content, 
  title,
  position = 'top',
  isDark 
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);

  useEffect(() => {
    if (isVisible && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
      
      let top = 0;
      let left = 0;

      switch (position) {
        case 'bottom':
          top = rect.bottom + scrollTop + 12;
          left = rect.left + scrollLeft;
          break;
        case 'top':
          top = rect.top + scrollTop - 12;
          left = rect.left + scrollLeft;
          break;
        case 'left':
          top = rect.top + scrollTop + rect.height / 2;
          left = rect.left + scrollLeft - 12;
          break;
        case 'right':
          top = rect.top + scrollTop + rect.height / 2;
          left = rect.right + scrollLeft + 12;
          break;
        default:
          top = rect.bottom + scrollTop + 12;
          left = rect.left + scrollLeft;
      }

      setTooltipPosition({ top, left });
    }
  }, [isVisible, position]);

  const positionClasses = {
    top: '-translate-y-full',
    bottom: '',
    left: '-translate-x-full -translate-y-1/2',
    right: '-translate-y-1/2'
  };

  const arrowClasses = {
    top: 'top-full left-6 -mt-[1px]',
    bottom: 'bottom-full left-6 -mb-[1px]',
    left: 'left-full top-1/2 -translate-y-1/2 -ml-[1px]',
    right: 'right-full top-1/2 -translate-y-1/2 -mr-[1px]'
  };

  const arrowBorderClasses = {
    top: 'border-l-transparent border-r-transparent border-b-transparent',
    bottom: 'border-l-transparent border-r-transparent border-t-transparent',
    left: 'border-t-transparent border-b-transparent border-r-transparent',
    right: 'border-t-transparent border-b-transparent border-l-transparent'
  };

  const getBackgroundStyle = () => {
    if (isDark) {
      return {
        background: 'linear-gradient(135deg, #2a2a2a 0%, #1f1f1f 100%)',
        border: '1px solid rgba(139, 92, 246, 0.3)',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.3)'
      };
    }
    return {
      background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
      border: '1px solid rgba(139, 92, 246, 0.2)',
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.2)'
    };
  };

  const getArrowColor = () => {
    return isDark ? '#2a2a2a' : '#1f2937';
  };

  const tooltipContent = isVisible && content && (
    <div 
      className={`fixed rounded-lg pointer-events-none animate-fadeIn ${positionClasses[position]}`}
      style={{
        ...getBackgroundStyle(),
        width: '280px',
        zIndex: 9999,
        top: `${tooltipPosition.top}px`,
        left: `${tooltipPosition.left}px`
      }}
    >
      <div className="px-3 py-2">
        {title && (
          <div className="flex items-center gap-1.5 mb-1.5 pb-1.5 border-b border-white/10">
            <div className="w-1 h-1 rounded-full bg-gradient-to-r from-purple-400 to-pink-400"></div>
            <h4 className="text-xs font-semibold text-white">
              {title}
            </h4>
          </div>
        )}
        <p 
          className="text-xs leading-snug"
          style={{ 
            color: 'rgba(255, 255, 255, 0.9)',
            lineHeight: '1.4'
          }}
        >
          {content}
        </p>
      </div>
      
      {/* Arrow */}
      <div 
        className={`absolute w-0 h-0 border-[5px] ${arrowClasses[position]} ${arrowBorderClasses[position]}`}
        style={{
          borderTopColor: position === 'bottom' ? 'transparent' : getArrowColor(),
          borderBottomColor: position === 'top' ? 'transparent' : getArrowColor(),
          borderLeftColor: position === 'right' ? 'transparent' : getArrowColor(),
          borderRightColor: position === 'left' ? 'transparent' : getArrowColor(),
          filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))'
        }}
      />
    </div>
  );

  return (
    <>
      <div 
        ref={triggerRef}
        className="relative inline-flex items-center"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      
      {typeof document !== 'undefined' && createPortal(
        tooltipContent,
        document.body
      )}
    </>
  );
}
