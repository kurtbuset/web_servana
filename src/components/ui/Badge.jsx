/**
 * Badge - Shared inline label/tag component
 *
 * Variants:
 *   'purple'          — bg-purple-100 text-purple-700 border-purple-200
 *   'purple-gradient' — gradient purple pill (role labels)
 *   'blue-gradient'   — gradient blue pill (department labels)
 *   'purple-soft'     — lighter purple pill (small tags)
 *   'neutral'         — theme-aware gray (table department column)  [needs isDark]
 *   'purple-theme'    — theme-aware purple (role in detail views)   [needs isDark]
 *
 * Sizes: 'xs' | 'sm' | 'md' | 'lg'
 * pill: true → rounded-full, false → rounded
 */
export default function Badge({
  children,
  variant = 'purple',
  size = 'md',
  pill = true,
  isDark = false,
  truncate = false,
  title,
  className = '',
}) {
  const sizeClasses = {
    xs: 'text-[9px] px-1.5 py-0.5',
    sm: 'text-[10px] px-1.5 py-0.5',
    md: 'text-xs px-2 py-0.5',
    lg: 'text-xs px-3 py-1',
  };

  const shapeClass = pill ? 'rounded-full' : 'rounded';
  const truncateClass = truncate ? 'max-w-[100px] truncate inline-block' : 'inline-block';
  const base = `font-medium ${sizeClasses[size]} ${shapeClass} ${truncateClass} ${className}`;

  const tailwindVariants = {
    purple: 'bg-purple-100 text-purple-700 border border-purple-200',
    'purple-gradient': 'bg-gradient-to-r from-purple-100 to-purple-50 text-purple-700 border border-purple-200',
    'blue-gradient': 'bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 border border-blue-200',
    'purple-soft': 'bg-purple-50 text-purple-600 border border-purple-200',
  };

  if (tailwindVariants[variant]) {
    return (
      <span className={`${base} ${tailwindVariants[variant]}`} title={title}>
        {children}
      </span>
    );
  }

  // Theme-aware variants require isDark
  let style = {};
  if (variant === 'neutral') {
    style = {
      backgroundColor: isDark ? '#3a3a3a' : '#e5e7eb',
      color: 'var(--text-primary)',
      border: '1px solid var(--border-color)',
    };
  } else if (variant === 'purple-theme') {
    style = {
      backgroundColor: isDark ? 'rgba(139, 92, 246, 0.1)' : '#f3e8ff',
      color: '#6237A0',
    };
  }

  return (
    <span className={base} style={style} title={title}>
      {children}
    </span>
  );
}
