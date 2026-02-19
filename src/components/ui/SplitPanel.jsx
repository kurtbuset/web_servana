/**
 * SplitPanel - Reusable two-panel layout component
 * Left panel for list, right panel for details
 */
export default function SplitPanel({ 
  leftPanel, 
  rightPanel, 
  showLeft = true,
  className = "" 
}) {
  return (
    <div 
      className={`rounded-lg shadow-sm h-full flex flex-col md:flex-row overflow-hidden ${className}`}
      style={{ backgroundColor: 'var(--card-bg)' }}
    >
      {/* Left Panel */}
      <div 
        className={`${showLeft ? 'flex' : 'hidden md:flex'} w-full md:w-80 lg:w-96 flex-col`}
        style={{ 
          backgroundColor: 'var(--card-bg)', 
          borderRight: '1px solid var(--border-color)' 
        }}
      >
        {leftPanel}
      </div>

      {/* Right Panel */}
      <div className={`${!showLeft ? 'flex' : 'hidden md:flex'} flex-1 flex-col overflow-hidden`}>
        {rightPanel}
      </div>
    </div>
  );
}
