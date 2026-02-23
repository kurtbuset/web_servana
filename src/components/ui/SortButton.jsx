/**
 * SortButton Component
 * A reusable button for alphabetical sorting with three states:
 * - default: No sorting (shows inactive icon)
 * - alphabetical: A-Z sorting (shows up arrow)
 * - reverse: Z-A sorting (shows down arrow)
 * 
 * @param {string} sortBy - Current sort state ('default', 'alphabetical', 'reverse')
 * @param {Function} onSortChange - Callback when sort state changes
 * @param {string} className - Additional CSS classes
 * @param {boolean} isDark - Dark mode flag (optional)
 */
export default function SortButton({ sortBy = 'default', onSortChange, className = '', isDark = false }) {
  const handleClick = () => {
    if (sortBy === 'alphabetical') {
      onSortChange('reverse');
    } else if (sortBy === 'reverse') {
      onSortChange('default');
    } else {
      onSortChange('alphabetical');
    }
  };

  const getTitle = () => {
    switch (sortBy) {
      case 'alphabetical':
        return 'Sort Z-A';
      case 'reverse':
        return 'Sort by Default';
      default:
        return 'Sort A-Z';
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`p-1 rounded hover:bg-purple-100 dark:hover:bg-purple-900/20 transition-colors ${className}`}
      title={getTitle()}
      aria-label={getTitle()}
    >
      {sortBy === 'alphabetical' ? (
        // A-Z with up arrow (active)
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <text x="2" y="11" fontSize="10" fontWeight="bold" fill="#6237A0">A</text>
          <text x="2" y="22" fontSize="10" fontWeight="bold" fill="#6237A0">Z</text>
          <path d="M17 16V4M17 4L13 8M17 4L21 8" stroke="#6237A0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ) : sortBy === 'reverse' ? (
        // Z-A with down arrow (active)
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <text x="2" y="11" fontSize="10" fontWeight="bold" fill="#6237A0">A</text>
          <text x="2" y="22" fontSize="10" fontWeight="bold" fill="#6237A0">Z</text>
          <path d="M17 8V20M17 20L13 16M17 20L21 16" stroke="#6237A0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ) : (
        // Default state (inactive)
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <text x="2" y="11" fontSize="10" fontWeight="bold" fill="currentColor" opacity="0.4">A</text>
          <text x="2" y="22" fontSize="10" fontWeight="bold" fill="currentColor" opacity="0.4">Z</text>
          <path d="M17 16V4M17 4L13 8M17 4L21 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.4"/>
        </svg>
      )}
    </button>
  );
}
