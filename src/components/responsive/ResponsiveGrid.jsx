/**
 * ResponsiveGrid - A flexible grid component that adapts to different screen sizes
 */
const ResponsiveGrid = ({ 
  children, 
  className = '',
  cols = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 4,
  minItemWidth = 280
}) => {
  const getGridClasses = () => {
    const gapClass = `gap-${gap}`;
    
    // Use CSS Grid with auto-fit for truly responsive behavior
    const style = {
      display: 'grid',
      gridTemplateColumns: `repeat(auto-fit, minmax(${minItemWidth}px, 1fr))`,
      gap: `${gap * 0.25}rem`
    };

    return {
      className: `grid ${gapClass} ${className}`,
      style
    };
  };

  const gridProps = getGridClasses();

  return (
    <div {...gridProps}>
      {children}
    </div>
  );
};

export default ResponsiveGrid;