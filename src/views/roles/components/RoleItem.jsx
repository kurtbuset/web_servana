import { ChevronDown, ChevronRight, Settings, Users } from "react-feather";
import MemberListItem from "./MemberListItem";

/**
 * RoleItem Component
 * Displays a single role in the sidebar with expandable member list
 * 
 * @param {Object} role - The role object
 * @param {boolean} isSelected - Whether this role is currently selected
 * @param {Function} onClick - Handler for role selection
 * @param {Function} onToggleActive - Handler for toggling role active status
 * @param {boolean} canManage - Whether user can manage roles
 * @param {boolean} isExpanded - Whether member list is expanded
 * @param {Array} members - Array of members in this role
 * @param {boolean} membersLoading - Whether members are loading
 * @param {string} membersError - Error message if members failed to load
 * @param {Function} onToggleExpansion - Handler for expanding/collapsing member list
 * @param {boolean} isDark - Dark mode flag
 */
export default function RoleItem({ 
  role, 
  isSelected, 
  onClick, 
  onToggleActive, 
  canManage,
  isExpanded,
  members,
  membersLoading,
  membersError,
  onToggleExpansion,
  isDark
}) {
  const handleExpansionClick = (e) => {
    e.stopPropagation();
    onToggleExpansion(role.role_id);
  };

  return (
    <div className="mb-1">
      <div
        className="p-2.5 sm:p-3 rounded-lg cursor-pointer transition-all duration-200"
        style={
          isSelected 
            ? { backgroundColor: '#6237A0', color: 'white' }
            : { color: 'var(--text-primary)' }
        }
        onClick={onClick}
        onMouseEnter={(e) => {
          if (!isSelected) {
            e.currentTarget.style.backgroundColor = isDark ? 'rgba(139, 92, 246, 0.05)' : 'rgba(249, 250, 251, 1)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isSelected) {
            e.currentTarget.style.backgroundColor = 'transparent';
          }
        }}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={handleExpansionClick}
                className={`p-1 rounded transition-colors flex-shrink-0 ${
                  isSelected
                    ? "hover:bg-purple-600 text-purple-100"
                    : ""
                }`}
                style={!isSelected ? { color: 'var(--text-secondary)' } : {}}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = isDark ? 'rgba(139, 92, 246, 0.1)' : 'rgba(229, 231, 235, 1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
                title={isExpanded ? "Collapse members" : "Expand members"}
              >
                {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm truncate">{role.name}</h4>
                <p className={`text-xs mt-0.5 sm:mt-1 truncate ${isSelected ? "text-purple-100" : ""}`} style={!isSelected ? { color: 'var(--text-secondary)' } : {}}>
                  {role.permissions.length} permissions
                  {members && ` • ${members.length} members`}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            <div
              className={`w-2 h-2 rounded-full ${
                role.active ? "bg-green-400" : "bg-gray-400"
              }`}
              title={role.active ? "Active" : "Inactive"}
            />
            {canManage && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleActive();
                }}
                className={`p-1 rounded transition-colors ${
                  isSelected
                    ? "hover:bg-purple-600 text-purple-100"
                    : ""
                }`}
                style={!isSelected ? { color: 'var(--text-secondary)' } : {}}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = isDark ? 'rgba(139, 92, 246, 0.1)' : 'rgba(229, 231, 235, 1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
                title="Toggle Active Status"
              >
                <Settings size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Member List */}
      {isExpanded && (
        <div className="ml-3 sm:ml-4 mt-2 rounded-lg p-2.5 sm:p-3" style={{ backgroundColor: isDark ? '#2a2a2a' : '#f9fafb' }}>
          <div className="flex items-center gap-2 mb-2 sm:mb-3">
            <Users size={14} className="flex-shrink-0" style={{ color: 'var(--text-secondary)' }} />
            <h5 className="font-medium text-xs sm:text-sm" style={{ color: 'var(--text-primary)' }}>Role Members</h5>
          </div>
          
          {membersLoading ? (
            <div className="py-4 flex items-center justify-center">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-t-[#6237A0]" style={{ borderColor: 'var(--border-color)', borderTopColor: '#6237A0' }}></div>
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Loading...</span>
              </div>
            </div>
          ) : membersError ? (
            <div className="text-center py-4">
              <p className="text-xs sm:text-sm text-red-600 mb-2">{membersError}</p>
              <button
                onClick={handleExpansionClick}
                className="text-xs text-[#6237A0] hover:underline"
              >
                Retry
              </button>
            </div>
          ) : !members || members.length === 0 ? (
            <p className="text-xs sm:text-sm text-center py-4" style={{ color: 'var(--text-secondary)' }}>No members in this role</p>
          ) : (
            <div className="space-y-1.5 sm:space-y-2">
              {members.map((member) => (
                <MemberListItem
                  key={member.sys_user_id}
                  member={member}
                  isDark={isDark}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
