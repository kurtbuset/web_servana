import { Search, X } from 'react-feather';

/**
 * DepartmentSidebar Component
 * Displays a filterable list of departments for macro filtering
 * 
 * @param {Array} departments - List of departments
 * @param {string} selectedDepartment - Currently selected department
 * @param {Function} onSelectDepartment - Handler for department selection
 * @param {string} searchQuery - Department search query
 * @param {Function} onSearchChange - Handler for search input change
 * @param {boolean} loading - Loading state
 * @param {boolean} isDark - Dark mode flag
 */
export default function DepartmentSidebar({
  departments,
  selectedDepartment,
  onSelectDepartment,
  searchQuery,
  onSearchChange,
  loading,
  isDark
}) {
  return (
    <div className="grid-sidebar overflow-y-auto custom-scrollbar p-2" style={{ borderRight: `1px solid var(--border-color)`, backgroundColor: isDark ? '#1e1e1e' : '#f9fafb' }}>
      <h3 className="text-xs font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Departments</h3>
      
      {/* Department Search Bar */}
      <div className="mb-2 flex items-center px-2 py-1.5 rounded relative border" style={{ borderColor: 'var(--border-color)', backgroundColor: 'transparent' }}>
        <Search size={12} className="mr-1.5 flex-shrink-0" style={{ color: 'var(--text-secondary)' }} />
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="bg-transparent focus:outline-none text-xs w-full pr-5"
          style={{ color: 'var(--text-primary)' }}
        />
        {searchQuery && (
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
          onClick={() => onSelectDepartment('All')}
          className="w-full text-left px-2 py-1.5 rounded text-xs transition-colors hover:bg-purple-50 dark:hover:bg-purple-900/10"
          style={
            selectedDepartment === 'All'
              ? { backgroundColor: 'transparent', color: '#6237A0', fontWeight: 'bold' }
              : { color: 'var(--text-primary)', backgroundColor: 'transparent' }
          }
        >
          @everyone
        </button>
        {departments && departments.length > 0 ? (
          departments
            .filter((dept) => 
              dept.dept_name.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((dept) => (
            <button
              key={dept.dept_id}
              onClick={() => dept.dept_is_active && onSelectDepartment(dept.dept_name)}
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
          ))
        ) : (
          <p className="text-xs px-2 py-1.5" style={{ color: 'var(--text-secondary)' }}>
            {loading ? 'Loading departments...' : 'No departments available'}
          </p>
        )}
      </div>
    </div>
  );
}
