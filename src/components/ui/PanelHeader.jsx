/**
 * PanelHeader - Reusable panel header component with title and optional action button
 */
export default function PanelHeader({ 
  icon: Icon, 
  title, 
  actionButton, 
  children,
  className = "" 
}) {
  return (
    <div 
      className={`p-2.5 sm:p-3 ${className}`}
      style={{ borderBottom: '1px solid var(--border-color)' }}
    >
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-base sm:text-lg font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          {Icon && <Icon size={18} />}
          {title}
        </h2>
        {actionButton}
      </div>
      {children}
    </div>
  );
}
