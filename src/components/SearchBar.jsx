import { Search, X } from 'react-feather';

/**
 * SearchBar - Reusable search input component
 * 
 * Features:
 * - Search icon on the left
 * - Clear button (X) when there's text
 * - Customizable placeholder
 * - Dark mode support
 * - Responsive sizing
 * 
 * @param {string} value - Current search value
 * @param {function} onChange - Callback when value changes
 * @param {string} placeholder - Placeholder text (default: "Search...")
 * @param {boolean} isDark - Dark mode flag
 * @param {string} className - Additional CSS classes
 */
export default function SearchBar({ 
  value, 
  onChange, 
  placeholder = "Search...", 
  isDark,
  className = ""
}) {
  const handleClear = () => {
    onChange("");
  };

  return (
    <div 
      className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${className}`}
      style={{ 
        backgroundColor: 'var(--bg-secondary)', 
        borderColor: 'var(--border-color)' 
      }}
    >
      <Search 
        size={14} 
        className="flex-shrink-0" 
        style={{ color: 'var(--text-secondary)' }} 
      />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent focus:outline-none text-xs w-full"
        style={{ color: 'var(--text-primary)' }}
      />
      {value && (
        <X
          size={14}
          className="cursor-pointer flex-shrink-0 transition-colors hover:opacity-70"
          style={{ color: 'var(--text-secondary)' }}
          onClick={handleClear}
        />
      )}
    </div>
  );
}
