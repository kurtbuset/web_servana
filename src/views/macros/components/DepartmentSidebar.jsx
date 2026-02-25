import { Search, X } from 'react-feather';

/**
 * DepartmentSidebar Component
 * Displays a filterable list of departments for macro filtering
 * Supports both desktop sidebar and mobile modal views
 * 
 * @param {Array} departments - List of departments
 * @param {string} selectedDepartment - Currently selected department
 * @param {Function} onSelectDepartment - Handler for department selection
 * @param {string} searchQuery - Department search query
 * @param {Function} onSearchChange - Handler for search input change
 * @param {boolean} loading - Loading state
 * @param {boolean} isDark - Dark mode flag
 * @param {boolean} isMobile - Mobile view flag
 * @param {boolean} showMobileFilter - Mobile filter visibility
 * @param {Function} onToggleMobile - Handler for mobile filter toggle
 */
export default function DepartmentSidebar({
  departments,
  selectedDepartment,
  onSelectDepartment,
  searchQuery,
  onSearchChange,
  loading,
  isDark,
  isMobile,
  showMobileFilter,
  onToggleMobile
}) {
  // Mobile View - Modal
  if (isMobile) {
    return (
      <>
        {/* Trigger Button */}
        <div className="md:hidden p-2" style={{ borderBottom: `1px solid var(--border-color)` }}>
          <button
            onClick={onToggleMobile}
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
                transform: showMobileFilter ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s'
              }}
            >
              <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Modal Backdrop & Content */}
        {showMobileFilter && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={onToggleMobile}
            />
            
            {/* Modal */}
            <div className="fixed inset-x-0 bottom-0 z-50 md:hidden animate-slide-up">
              <div 
                className="rounded-t-2xl shadow-2xl max-h-[70vh] flex flex-col"
                style={{ backgroundColor: 'var(--card-bg)' }}
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
                  <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Select Department
                  </h3>
                  <button
                    onClick={onToggleMobile}
                    className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <X size={20} style={{ color: 'var(--text-secondary)' }} />
                  </button>
                </div>

                {/* Search Bar */}
                <div className="p-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
                  <div className="flex items-center px-3 py-2 rounded-lg border" style={{ borderColor: 'var(--border-color)', backgroundColor: isDark ? '#1e1e1e' : '#f9fafb' }}>
                    <Search size={16} className="mr-2 flex-shrink-0" style={{ color: 'var(--text-secondary)' }} />
                    <input
                      type="text"
                      placeholder="Search departments..."
                      value={searchQuery}
                      onChange={(e) => onSearchChange(e.target.value)}
                      className="bg-transparent focus:outline-none text-sm w-full pr-6"
                      style={{ color: 'var(--text-primary)' }}
                    />
                    {searchQuery && (
                      <button
                        onClick={() => onSearchChange('')}
                        className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                      >
                        <X size={14} style={{ color: 'var(--text-secondary)' }} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Department List */}
                <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        onSelectDepartment('All');
                        onToggleMobile();
                      }}
                      className="w-full text-left px-4 py-3 rounded-lg text-sm transition-colors"
                      style={
                        selectedDepartment === 'All'
                          ? { backgroundColor: isDark ? 'rgba(139, 92, 246, 0.2)' : 'rgba(98, 55, 160, 0.1)', color: '#6237A0', fontWeight: '600' }
                          : { color: 'var(--text-primary)', backgroundColor: 'transparent' }
                      }
                    >
                      @everyone
                    </button>
                    {departments && departments.length > 0 ? (
                      departments
                        .filter((dept) => dept.dept_name.toLowerCase().includes(searchQuery.toLowerCase()))
                        .map((dept) => (
                        <button
                          key={dept.dept_id}
                          onClick={() => {
                            if (dept.dept_is_active) {
                              onSelectDepartment(dept.dept_name);
                              onToggleMobile();
                            }
                          }}
                          disabled={!dept.dept_is_active}
                          className="w-full text-left px-4 py-3 rounded-lg text-sm transition-colors"
                          style={
                            selectedDepartment === dept.dept_name
                              ? { backgroundColor: isDark ? 'rgba(139, 92, 246, 0.2)' : 'rgba(98, 55, 160, 0.1)', color: '#6237A0', fontWeight: '600' }
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
                      <p className="text-sm px-4 py-3" style={{ color: 'var(--text-secondary)' }}>
                        {loading ? 'Loading departments...' : 'No departments available'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </>
    );
  }

  // Desktop View - Sidebar
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
