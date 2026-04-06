import { TrendingUp } from 'react-feather';

/**
 * StatCard - Metric display card
 *
 * variant='default' (dashboard)
 *   Full card with shadow/border, icon in a colored box on the right.
 *   Required: icon (component), color (Tailwind bg class)
 *
 * variant='compact' (agent detail, inline grids)
 *   Light background, icon inline with label, smaller value text.
 *   Required: icon (component), isDark
 */
export default function StatCard({
  icon: Icon,
  label,
  value,
  subLabel,
  trend,
  color,
  onClick,
  variant = 'default',
  isDark = false,
}) {
  if (variant === 'compact') {
    return (
      <div
        className="p-3 rounded-lg"
        style={{ backgroundColor: isDark ? 'rgba(139, 92, 246, 0.05)' : '#f9fafb' }}
      >
        <div className="flex items-center gap-2 mb-1">
          {Icon && <Icon className="w-4 h-4" style={{ color: '#6237A0' }} />}
          <p
            className="text-[10px] font-semibold uppercase tracking-wider"
            style={{ color: 'var(--text-secondary)' }}
          >
            {label}
          </p>
        </div>
        <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
          {value}
        </p>
        {trend && (
          <p className="text-[10px] mt-1" style={{ color: '#10b981' }}>
            {trend}
          </p>
        )}
      </div>
    );
  }

  return (
    <div
      className={`rounded-lg p-4 shadow-sm border hover:shadow-lg transition-all duration-300 ${onClick ? 'cursor-pointer' : ''}`}
      style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs mb-1 font-medium" style={{ color: 'var(--text-secondary)' }}>
            {label}
          </p>
          <h3 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
            {value}
          </h3>
          {subLabel && (
            <p
              className="text-[10px] mb-1 font-medium opacity-75"
              style={{ color: 'var(--text-secondary)' }}
            >
              {subLabel}
            </p>
          )}
          {trend && (
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp size={12} className="text-green-500" />
              <span className="text-xs text-green-500 font-medium">{trend}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color} shadow-lg`}>
          <Icon size={20} strokeWidth={2} className="text-white" />
        </div>
      </div>
    </div>
  );
}
