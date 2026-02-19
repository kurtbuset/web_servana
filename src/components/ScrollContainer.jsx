import React from 'react';
import '../styles/scrollbar.css';

/**
 * ScrollContainer - A reusable scrollable container with custom scrollbar
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to be scrolled
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.variant - Scrollbar variant: 'default', 'thin', 'hidden'
 * @param {string} props.direction - Scroll direction: 'vertical', 'horizontal', 'both'
 * @param {Object} props.style - Inline styles
 * @param {Function} props.onScroll - Scroll event handler
 * 
 * @example
 * <ScrollContainer variant="thin" direction="vertical">
 *   <div>Your content here</div>
 * </ScrollContainer>
 */
const ScrollContainer = React.forwardRef(({
  children,
  className = '',
  variant = 'default',
  direction = 'vertical',
  style = {},
  onScroll,
  ...props
}, ref) => {
  // Determine scrollbar class based on variant
  const scrollbarClass = variant === 'thin' 
    ? 'custom-scrollbar-thin' 
    : variant === 'hidden' 
    ? 'custom-scrollbar-hidden' 
    : 'custom-scrollbar';

  // Determine overflow based on direction
  const overflowStyle = direction === 'horizontal' 
    ? { overflowX: 'auto', overflowY: 'hidden' }
    : direction === 'both'
    ? { overflowX: 'auto', overflowY: 'auto' }
    : { overflowX: 'hidden', overflowY: 'auto' };

  return (
    <div
      ref={ref}
      className={`${scrollbarClass} ${className}`}
      style={{ ...overflowStyle, ...style }}
      onScroll={onScroll}
      {...props}
    >
      {children}
    </div>
  );
});

ScrollContainer.displayName = 'ScrollContainer';

export default ScrollContainer;
