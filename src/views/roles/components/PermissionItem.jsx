import PermissionToggle from "./PermissionToggle";

/**
 * PermissionItem Component
 * Displays a single permission with its description and toggle
 * 
 * @param {Object} permission - Permission object with key and description
 * @param {boolean} isEnabled - Whether the permission is enabled
 * @param {Function} onToggle - Handler for toggling the permission
 * @param {boolean} canManage - Whether user can manage permissions
 * @param {boolean} isDark - Dark mode flag
 */
export default function PermissionItem({ permission, isEnabled, onToggle, canManage, isDark }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between p-3 sm:p-4 rounded-lg transition-colors gap-3" style={{ backgroundColor: isDark ? '#1e1e1e' : 'var(--card-bg)', border: `1px solid var(--border-color)` }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = isDark ? '#5a5a5a' : '#d1d5db';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-color)';
      }}
    >
      <div className="flex-1 min-w-0">
        <h5 className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{permission.key}</h5>
        <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{permission.description}</p>
      </div>
      <div className="flex items-center justify-end sm:justify-start gap-2">
        <PermissionToggle
          state={isEnabled ? "enabled" : "disabled"}
          onChange={onToggle}
          disabled={!canManage}
        />
      </div>
    </div>
  );
}
