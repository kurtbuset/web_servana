import { ChevronDown, ChevronRight, Settings, Users } from "react-feather";
import RolePreviewDropdown from "../../../components/RolePreviewDropdown";

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
  isDark
}) {

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
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm truncate">{role.name}</h4>
                <p className={`text-xs mt-0.5 sm:mt-1 truncate ${isSelected ? "text-purple-100" : ""}`} style={!isSelected ? { color: 'var(--text-secondary)' } : {}}>
                  {role.permissions.length} permissions
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
            <RolePreviewDropdown role={role} />
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
    </div>
  );
}
