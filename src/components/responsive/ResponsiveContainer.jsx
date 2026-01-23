import { useState, useEffect } from 'react';

/**
 * ResponsiveContainer - A container component that provides responsive breakpoints
 * and device detection for optimal UI rendering across devices
 */
const ResponsiveContainer = ({ children, className = '' }) => {
  const [screenSize, setScreenSize] = useState('desktop');
  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setDimensions({ width, height });
      
      // Define breakpoints
      if (width < 640) {
        setScreenSize('mobile');
      } else if (width < 1024) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
    };

    // Set initial size
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Provide context to children
  const contextValue = {
    screenSize,
    dimensions,
    isMobile: screenSize === 'mobile',
    isTablet: screenSize === 'tablet',
    isDesktop: screenSize === 'desktop',
    isMobileOrTablet: screenSize === 'mobile' || screenSize === 'tablet'
  };

  return (
    <div className={`responsive-container ${className}`}>
      {typeof children === 'function' ? children(contextValue) : children}
    </div>
  );
};

export default ResponsiveContainer;