import { ArrowLeft } from "react-feather";
import ScrollContainer from "../../../components/ScrollContainer";
import UnsavedChangesBar from "../../../components/UnsavedChangesBar";
import { Avatar } from "../../../components/ui";

/**
 * EditDepartmentView - Edit department assignments for an agent
 * 
 * Features:
 * - View currently assigned departments
 * - Checkbox list of all available departments
 * - Real-time agent count per department
 * - Unsaved changes tracking with save/reset
 */
export default function EditDepartmentView({ 
  agent, 
  allDepartments, 
  onBack, 
  onToggleDepartment, 
  onSave, 
  onReset, 
  hasUnsavedChanges, 
  canAssignDepartment, 
  isDark, 
  agents, 
  shakeBar 
}) {
  // Calculate real department counts from agents data
  const getDepartmentCount = (dept) => {
    if (!agents || agents.length === 0) return 0;
    return agents.filter(a => a.departments?.includes(dept)).length;
  };

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
          {/* Left Column - Assigned Departments (20% width) */}
          <div className="lg:w-[20%]">
            <h3 className="text-xs font-bold mb-2 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Assigned Departments</h3>
            <div className="p-3 rounded-lg" style={{ backgroundColor: isDark ? 'rgba(139, 92, 246, 0.05)' : '#f9fafb' }}>
              <div className="space-y-2">
                {agent.departments?.length > 0 ? (
                  agent.departments.map((dept, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-lg" style={{ backgroundColor: isDark ? 'rgba(139, 92, 246, 0.15)' : '#f3e8ff' }}>
                      <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{dept}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: isDark ? 'rgba(139, 92, 246, 0.2)' : '#e9d5ff', color: 'var(--text-secondary)' }}>
                        {getDepartmentCount(dept)}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-center py-4" style={{ color: 'var(--text-secondary)' }}>No departments assigned</p>
                )}
              </div>
            </div>
          </div>

          {/* Gap (10% width) with vertical line */}
          <div className="lg:w-[10%] flex justify-center">
            <div className="w-0.5 h-full" style={{ backgroundColor: 'var(--border-color)' }}></div>
          </div>

          {/* Right Column - All Department List (70% width) */}
          <div className="lg:w-[70%]">
            <h3 className="text-xs font-bold mb-2 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>All Departments</h3>
            <div className="p-3 rounded-lg space-y-1.5" style={{ backgroundColor: isDark ? 'rgba(139, 92, 246, 0.05)' : '#f9fafb' }}>
              {allDepartments.map((dept, idx) => {
                const isChecked = agent.departments?.includes(dept);
                const agentCount = getDepartmentCount(dept);
                
                return (
                  <label
                    key={idx}
                    className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                      isChecked ? 'bg-white shadow-sm' : ''
                    }`}
                    style={isChecked ? { 
                      backgroundColor: isDark ? 'rgba(139, 92, 246, 0.15)' : '#ffffff',
                      border: `1px solid ${isDark ? 'rgba(139, 92, 246, 0.3)' : '#e9d5ff'}`
                    } : {}}
                    onMouseEnter={(e) => {
                      if (!isChecked) {
                        e.currentTarget.style.backgroundColor = isDark ? 'rgba(139, 92, 246, 0.08)' : '#faf5ff';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isChecked) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => onToggleDepartment(dept)}
                        disabled={!canAssignDepartment}
                        className="w-4 h-4 rounded text-[#6237A0] focus:ring-[#6237A0] cursor-pointer"
                      />
                      <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{dept}</span>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: isDark ? 'rgba(139, 92, 246, 0.1)' : '#f3e8ff', color: 'var(--text-secondary)' }}>
                      {agentCount} {agentCount === 1 ? 'agent' : 'agents'}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <UnsavedChangesBar
        show={hasUnsavedChanges}
        onReset={onReset}
        onSave={onSave}
        shake={shakeBar}
      />
    </ScrollContainer>
  );
}
