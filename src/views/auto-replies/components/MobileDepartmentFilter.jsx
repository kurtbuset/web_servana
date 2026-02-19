import { Search, X } from 'react-feather';

/**
 * MobileDepartmentFilter - Mobile dropdown for filtering by department
 */
export default function MobileDepartmentFilter({
  allDepartments,
  selectedDepartment,
  departmentSearchQuery,
  showMobileDeptFilter,
  isDark,
  onToggle,
  onSelectDepartment,
  onSearchChange
}) {
  return (
    <div className="md:hidden p-2" style={{ borderBottom: `1px solid var(--border-color)` }}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors"
        style={{ 
          backgroundColor: isDark ? '#2a2a2a' : '#f3f4f6',
          color: 'var(--text-primary)'
        }}
      >
        <span>Department: {selectedDepartment === 'All' ? '@everyone' : selectedDepartment}</span>
        <svg 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          style={{ 
            transform: showMobileDeptFilter ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s'
          }}
        >
          <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      
      {/* Mobile Department Dropdown */}
      {showMobileDeptFilter && (
        <div className="mt-2 rounded-lg p-2 max-h-60 overflow-y-auto custom-scrollbar" style={{ backgroundColor: isDark ? '#1e1e1e' : '#f9fafb', border: `1px solid var(--border-color)` }}>
          <div className="mb-2 flex items-center px-2 py-1.5 rounded relative border" style={{ borderColor: 'var(--border-color)', backgroundColor: 'transparent' }}>
            <Search size={12} className="mr-1.5 flex-shrink-0" style={{ color: 'var(--text-secondary)' }} />
            <input
              type="text"
              placeholder="Search..."
              value={departmentSearchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="bg-transparent focus:outline-none text-xs w-full pr-5"
              style={{ color: 'var(--text-primary)' }}
            />
            {departmentSearchQuery && (
              <X
                size={12}
                className="cursor-pointer absolute right-2 transition-colors"
                style={{ color: 'var(--text-secondary)' }}
                onClick={() => onSearchChange('')}
              />
            )}
          </div>
          
          <div className="space-y-0.5">
            <button
              onClick={() => {
                onSelectDepartment('All');
                onToggle();
              }}
              className="w-full text-left px-2 py-1.5 rounded text-xs transition-colors hover:bg-purple-50 dark:hover:bg-purple-900/10"
              style={
                selectedDepartment === 'All'
                  ? { backgroundColor: 'transparent', color: '#6237A0', fontWeight: 'bold' }
                  : { color: 'var(--text-primary)', backgroundColor: 'transparent' }
              }
            >
              @everyone
            </button>
            {allDepartments && allDepartments.length > 0 && allDepartments
              .filter((dept) => dept.dept_name.toLowerCase().includes(departmentSearchQuery.toLowerCase()))
              .map((dept) => (
              <button
                key={dept.dept_id}
                onClick={() => {
                  if (dept.dept_is_active) {
                    onSelectDepartment(dept.dept_name);
                    onToggle();
                  }
                }}
                disabled={!dept.dept_is_active}
                className="w-full text-left px-2 py-1.5 rounded text-xs transition-colors hover:bg-purple-50 dark:hover:bg-purple-900/10"
                style={
                  selectedDepartment === dept.dept_name
                    ? { backgroundColor: 'transparent', color: '#6237A0', fontWeight: 'bold' }
                    : !dept.dept_is_active
                    ? { color: 'var(--text-secondary)', backgroundColor: 'transparent', opacity: 0.5, cursor: 'not-allowed' }
                    : { color: 'var(--text-primary)', backgroundColor: 'transparent' }
                }
              >
                {dept.dept_name}
                {!dept.dept_is_active && ' (Inactive)'}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
