import { ArrowLeft } from "react-feather";
import ScrollContainer from "../../../components/ScrollContainer";
import { Avatar } from "../../../components/ui";

/**
 * AgentDetailView - Displays detailed information about a specific agent
 * 
 * Features:
 * - Agent profile header with picture
 * - Department assignments
 * - Agent information (ID, email, status, etc.)
 * - Personal analytics summary
 * - Navigation to edit department and full analytics
 */
export default function AgentDetailView({ 
  agent, 
  onBack, 
  onEditDepartment, 
  onViewAnalytics, 
  onToggleActive, 
  canCreateAccount, 
  isDark 
}) {
  return (
    <ScrollContainer className="flex-1 pb-4">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="mb-3 flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors hover:bg-opacity-80"
        style={{ backgroundColor: isDark ? 'rgba(139, 92, 246, 0.1)' : '#f3e8ff', color: '#6237A0' }}
      >
        <ArrowLeft size={14} />
        <span className="text-xs font-medium">Back</span>
      </button>

      {/* Purple Header */}
      <div className="bg-gradient-to-r from-[#6237A0] to-[#7A4ED9] rounded-t-lg p-4 pb-8 text-white relative overflow-hidden">
        {/* Animated background circles */}
        <div className="absolute top-3 right-3 w-20 h-20 border-2 border-white/20 rounded-full animate-ping-slow"></div>
        <div className="absolute bottom-3 left-3 w-16 h-16 bg-white/10 rounded-full blur-xl animate-float"></div>
        
        <div className="flex items-start gap-3 relative z-10">
          <div className="w-12 h-12"></div> {/* Spacer for alignment */}
          <div className="pt-1">
            <h2 className="text-base font-bold">{agent.email?.split('@')[0]}</h2>
            <p className="text-xs text-purple-100">{agent.email}</p>
          </div>
        </div>
        
        {/* Profile Picture - Positioned at border */}
        <div className="absolute left-4 -bottom-6">
          <Avatar
            src={agent.profile_picture}
            name={agent.email}
            alt={agent.email}
            size="xl"
            border
            borderWidth={4}
            shadow
          />
        </div>
      </div>

      {/* Content */}
      <div className="border-x border-b rounded-b-lg p-4 pt-10" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--card-bg)' }}>
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Left Column - Department Section (20% width) */}
          <div className="lg:w-[20%]">
            <h3 className="text-xs font-bold mb-2 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Department</h3>
            <div className="p-3 rounded-lg mb-3" style={{ backgroundColor: isDark ? 'rgba(139, 92, 246, 0.05)' : '#f9fafb' }}>
              <div className="flex flex-wrap gap-2">
                {agent.departments?.length > 0 ? (
                  agent.departments.map((dept, i) => (
                    <span key={i} className="px-2 py-1 rounded-lg text-xs" style={{ backgroundColor: isDark ? 'rgba(139, 92, 246, 0.15)' : '#f3e8ff', color: 'var(--text-primary)' }}>
                      {dept}
                    </span>
                  ))
                ) : (
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>No departments assigned</span>
                )}
              </div>
            </div>
            <button
              onClick={onEditDepartment}
              className="w-full px-3 py-1.5 rounded-lg bg-[#6237A0] text-white text-xs font-medium hover:bg-[#552C8C] transition-colors"
            >
              Edit Department
            </button>
          </div>

          {/* Right Column - Agent Information (80% width) */}
          <div className="lg:w-[80%]">
            <h3 className="text-xs font-bold mb-2 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Information</h3>
            <div className="p-3 rounded-lg" style={{ backgroundColor: isDark ? 'rgba(139, 92, 246, 0.05)' : '#f9fafb' }}>
              <div className="space-y-2">
                {/* Agent ID */}
                <div className="flex justify-between items-center">
                  <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Agent ID</p>
                  <p className="text-xs" style={{ color: 'var(--text-primary)' }}>#{agent.id || 'N/A'}</p>
                </div>
                
                {/* Username */}
                <div className="flex justify-between items-center">
                  <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Username</p>
                  <p className="text-xs" style={{ color: 'var(--text-primary)' }}>{agent.email?.split('@')[0] || 'N/A'}</p>
                </div>
                
                {/* Email */}
                <div className="flex justify-between items-center">
                  <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Email</p>
                  <p className="text-xs truncate ml-2" style={{ color: 'var(--text-primary)' }}>{agent.email || 'N/A'}</p>
                </div>
                
                {/* Role */}
                <div className="flex justify-between items-center">
                  <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Role</p>
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold" style={{ backgroundColor: isDark ? 'rgba(139, 92, 246, 0.1)' : '#f3e8ff', color: '#6237A0' }}>
                    AGENT
                  </span>
                </div>
                
                {/* Status */}
                <div className="flex justify-between items-center">
                  <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Status</p>
                  <div className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${agent.active ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                    <span className="text-xs" style={{ color: 'var(--text-primary)' }}>
                      {agent.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                
                {/* Total Departments */}
                <div className="flex justify-between items-center">
                  <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Departments</p>
                  <p className="text-xs" style={{ color: 'var(--text-primary)' }}>{agent.departments?.length || 0} assigned</p>
                </div>
                
                {/* Created Date (if available) */}
                {agent.created_at && (
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Created</p>
                    <p className="text-xs" style={{ color: 'var(--text-primary)' }}>
                      {new Date(agent.created_at).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Personal Analytics Section */}
        <div className="mt-4">
          <h3 className="text-xs font-bold mb-2 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Personal Analytics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {/* Total Chats */}
            <div className="p-3 rounded-lg" style={{ backgroundColor: isDark ? 'rgba(139, 92, 246, 0.05)' : '#f9fafb' }}>
              <div className="flex items-center gap-2 mb-1">
                <svg className="w-4 h-4" style={{ color: '#6237A0' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Total Chats</p>
              </div>
              <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>247</p>
              <p className="text-[10px] mt-1" style={{ color: '#10b981' }}>+12% this week</p>
            </div>

            {/* Avg Response Time */}
            <div className="p-3 rounded-lg" style={{ backgroundColor: isDark ? 'rgba(139, 92, 246, 0.05)' : '#f9fafb' }}>
              <div className="flex items-center gap-2 mb-1">
                <svg className="w-4 h-4" style={{ color: '#6237A0' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Avg Response</p>
              </div>
              <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>2.3m</p>
              <p className="text-[10px] mt-1" style={{ color: '#10b981' }}>-15% faster</p>
            </div>

            {/* Satisfaction Rate */}
            <div className="p-3 rounded-lg" style={{ backgroundColor: isDark ? 'rgba(139, 92, 246, 0.05)' : '#f9fafb' }}>
              <div className="flex items-center gap-2 mb-1">
                <svg className="w-4 h-4" style={{ color: '#6237A0' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Satisfaction</p>
              </div>
              <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>4.8/5</p>
              <p className="text-[10px] mt-1" style={{ color: '#10b981' }}>+0.3 rating</p>
            </div>

            {/* Resolved Tickets */}
            <div className="p-3 rounded-lg" style={{ backgroundColor: isDark ? 'rgba(139, 92, 246, 0.05)' : '#f9fafb' }}>
              <div className="flex items-center gap-2 mb-1">
                <svg className="w-4 h-4" style={{ color: '#6237A0' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Resolved</p>
              </div>
              <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>234</p>
              <p className="text-[10px] mt-1" style={{ color: '#10b981' }}>94.7% rate</p>
            </div>
          </div>

          {/* View Full Analytics Button */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={onViewAnalytics}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
              style={{ color: isDark ? '#ffffff' : '#6237A0' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = isDark ? '#e0e0e0' : '#552C8C';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = isDark ? '#ffffff' : '#6237A0';
              }}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              View Full Analytics
            </button>
          </div>
        </div>
      </div>
    </ScrollContainer>
  );
}
