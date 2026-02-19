import { useTheme } from '../context/ThemeContext';

/**
 * ScreenContainer - Reusable container component for screen layouts
 * 
 * Provides consistent styling across all screens with:
 * - Responsive padding
 * - Rounded corners (desktop only)
 * - Border and shadow
 * - Background color
 * - Full height layout
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to render inside the container
 * @param {string} props.className - Additional CSS classes (optional)
 * @param {Object} props.style - Additional inline styles (optional)
 * @param {boolean} props.noPadding - Remove default padding (default: false)
 * @param {boolean} props.fullHeight - Use full height (default: true)
 * 
 * @example
 * <ScreenContainer>
 *   <h1>My Screen Content</h1>
 * </ScreenContainer>
 * 
 * @example
 * <ScreenContainer noPadding>
 *   <div className="p-4">Custom padding content</div>
 * </ScreenContainer>
 */
export default function ScreenContainer({ 
  children, 
  className = '', 
  style = {}, 
  noPadding = false,
  fullHeight = true 
}) {
  const { isDark } = useTheme();

  return (
    <div 
      className={`flex flex-col ${fullHeight ? 'h-full' : ''} overflow-hidden`} 
      style={{ backgroundColor: 'var(--bg-secondary)' }}
    >
      <div 
        className={`flex flex-col ${fullHeight ? 'h-full' : ''} gap-0 ${noPadding ? 'p-0' : 'p-0 md:p-3'} flex-1`}
      >
        <div 
          className={`${fullHeight ? 'h-full' : ''} flex flex-col md:rounded-xl shadow-sm border-0 md:border overflow-hidden ${className}`}
          style={{ 
            backgroundColor: 'var(--card-bg)', 
            borderColor: 'var(--border-color)',
            ...style 
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
