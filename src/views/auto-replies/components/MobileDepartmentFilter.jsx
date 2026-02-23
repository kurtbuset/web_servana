import { Search, X } from 'react-feather';

/**
 * MobileDepartmentFilter - Mobile modal for filtering by department
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
    <>
      {/* Trigger Button */}
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
      </div>

      {/* Modal Backdrop & Content */}
      {showMobileDeptFilter && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={onToggle}
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
                  onClick={onToggle}
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
                    value={departmentSearchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="bg-transparent focus:outline-none text-sm w-full pr-6"
                    style={{ color: 'var(--text-primary)' }}
                  />
                  {departmentSearchQuery && (
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
                      onToggle();
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
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
