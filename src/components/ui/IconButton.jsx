/**
 * IconButton - Small icon button with consistent purple hover styling
 *
 * @param {React.ReactNode} children   — icon element
 * @param {Function}        onClick
 * @param {boolean}         disabled   — disables hover and shows muted color
 * @param {string}          title      — tooltip
 * @param {boolean}         isDark     — dark mode flag
 * @param {'sm'|'md'}       size       — 'sm' → p-1, 'md' → p-1.5
 * @param {string}          className  — extra classes
 */
export default function IconButton({
  children,
  onClick,
  disabled = false,
  title,
  isDark = false,
  size = 'sm',
  className = '',
  ...props
}) {
  const padding = size === 'md' ? 'p-1.5' : 'p-1';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`${padding} rounded transition-colors ${
        disabled ? 'cursor-not-allowed' : 'hover:text-[#6237A0]'
      } ${className}`}
      style={{ color: disabled ? (isDark ? '#4a4a4a' : '#d1d5db') : 'var(--text-secondary)' }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = isDark
            ? 'rgba(139, 92, 246, 0.1)'
            : 'rgba(243, 232, 255, 1)';
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = 'transparent';
        }
      }}
      {...props}
    >
      {children}
    </button>
  );
}
