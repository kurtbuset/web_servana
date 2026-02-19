/**
 * DetailHeader - Reusable header for detail panels with back button, title, and actions
 */
export default function DetailHeader({ 
  title, 
  subtitle, 
  onBack, 
  actions,
  isDark = false,
  className = "" 
}) {
  return (
    <div 
      className={`p-2.5 sm:p-3 md:p-4 ${className}`}
      style={{ 
        borderBottom: '1px solid var(--border-color)', 
        backgroundColor: 'var(--card-bg)' 
      }}
    >
      <div className="flex items-center justify-between gap-2 mb-2 md:mb-0">
        {onBack && (
          <button
            onClick={onBack}
            className="md:hidden p-1.5 rounded-lg transition-colors"
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = isDark ? 'rgba(139, 92, 246, 0.05)' : 'rgba(249, 250, 251, 1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            title="Back"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-bold truncate" style={{ color: 'var(--text-primary)' }}>
            {title}
          </h3>
          {subtitle && (
            <p className="text-[10px] sm:text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
              {subtitle}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
