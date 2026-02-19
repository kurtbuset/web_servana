import { Avatar } from "../../../components/ui";

/**
 * DepartmentMembersModal - Modal showing department members
 */
export default function DepartmentMembersModal({ 
  selectedDepartment, 
  departmentMembers, 
  loadingMembers,
  onClose 
}) {
  if (!selectedDepartment) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-fadeIn">
      <div 
        className="rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden transform transition-all animate-scaleIn"
        style={{ backgroundColor: 'var(--card-bg)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Gradient */}
        <div className="bg-gradient-to-br from-[#6237A0] via-[#7A4ED9] to-[#8B5CF6] p-6 text-white relative overflow-hidden">
          <div className="absolute top-5 right-5 w-20 h-20 border-2 border-white/20 rounded-full animate-ping-slow"></div>
          <div className="absolute bottom-5 left-5 w-16 h-16 bg-white/10 rounded-full blur-xl animate-float"></div>
          
          <div className="flex items-center justify-between mb-4 relative z-10">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Department Team
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-all hover:rotate-90 duration-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <h3 className="text-lg font-semibold relative z-10">{selectedDepartment.dept_name}</h3>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 mt-4 relative z-10">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 border border-white/30">
              <p className="text-xs text-purple-100 mb-1">Total Members</p>
              <p className="text-2xl font-bold">{departmentMembers.length}</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 border border-white/30">
              <p className="text-xs text-purple-100 mb-1">Online</p>
              <p className="text-2xl font-bold">
                {departmentMembers.filter(m => m.sys_user_is_active).length}
              </p>
            </div>
          </div>

          {/* Decorative dots */}
          <div className="mt-4 flex justify-center gap-2 relative z-10">
            <div className="w-2 h-2 rounded-full bg-white/40"></div>
            <div className="w-2 h-2 rounded-full bg-white/60"></div>
            <div className="w-2 h-2 rounded-full bg-white/80"></div>
          </div>
        </div>

        {/* Members List */}
        <div className="p-6 max-h-[50vh] overflow-y-auto custom-scrollbar" style={{ backgroundColor: 'var(--bg-secondary)' }}>
          {loadingMembers ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-8 w-8 border-3 border-t-[#6237A0]" style={{ borderColor: 'var(--border-color)', borderTopColor: '#6237A0' }}></div>
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Loading members...</span>
              </div>
            </div>
          ) : departmentMembers.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--text-secondary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>No team members found</p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>This department doesn't have any members yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {departmentMembers.map((member) => (
                <div
                  key={member.sys_user_id}
                  className="flex items-center gap-3 p-3 rounded-lg transition-all group"
                  style={{ 
                    backgroundColor: 'var(--card-bg)',
                    border: `1px solid var(--border-color)`
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#6237A0';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                  }}
                >
                  <Avatar
                    src={member.image?.img_location}
                    name={member.profile?.full_name || member.sys_user_email}
                    alt={member.profile?.full_name || member.sys_user_email}
                    size="lg"
                    showStatus
                    isOnline={member.sys_user_is_active}
                    border
                    borderColor="#6237A0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                      {member.profile?.full_name || member.sys_user_email}
                    </p>
                    <p className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>
                      {member.role?.role_name || 'No role'}
                    </p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    member.sys_user_is_active 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {member.sys_user_is_active ? 'Online' : 'Offline'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)' }}>
          <button
            onClick={onClose}
            className="w-full py-3 rounded-lg font-semibold transition-all hover:shadow-md active:scale-[0.98] flex items-center justify-center gap-2"
            style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
