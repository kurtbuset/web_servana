/**
 * EmptyState - Reusable empty state component with icon, title, and description
 */
export default function EmptyState({ 
  icon: Icon, 
  title, 
  description,
  iconSize = 48,
  isDark = false 
}) {
  return (
    <div className="flex-1 flex items-center justify-center" style={{ backgroundColor: isDark ? '#2a2a2a' : '#f9fafb' }}>
      <div className="text-center p-4">
        {Icon && (
          <Icon 
            size={iconSize} 
            className="mx-auto mb-4" 
            style={{ color: isDark ? '#4a4a4a' : '#d1d5db' }} 
          />
        )}
        <h3 className="text-base sm:text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          {title}
        </h3>
        {description && (
          <p className="text-xs sm:text-sm px-4" style={{ color: 'var(--text-secondary)' }}>
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
