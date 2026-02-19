/**
 * DepartmentsList - Grid of user's departments
 */
export default function DepartmentsList({ departments, isDark, onViewDepartment }) {
  if (!departments || departments.length === 0) {
    return null;
  }

  return (
    <div className="mt-6">
      <div className="flex items-center gap-2 mb-3">
        <svg className="w-4 h-4 text-[#6237A0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
          My Departments
        </h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {departments.map((dept) => (
          <button
            key={dept.dept_id}
            onClick={() => onViewDepartment(dept)}
            className="p-3 rounded-lg transition-all group text-left relative overflow-hidden"
            style={{ 
              background: isDark ? 'linear-gradient(to bottom right, #2a2a2a, #1e1e1e)' : 'linear-gradient(to bottom right, #f9fafb, #ffffff)',
              border: `1px solid ${isDark ? '#4a4a4a' : '#f3f4f6'}`
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#6237A0';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = isDark ? '#4a4a4a' : '#f3f4f6';
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#6237A0]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6237A0] to-[#7A4ED9] flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform flex-shrink-0" style={{ color: 'var(--text-secondary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <h4 className="font-semibold text-xs mb-0.5 truncate" style={{ color: 'var(--text-primary)' }}>
                {dept.dept_name}
              </h4>
              <p className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>
                View team
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
