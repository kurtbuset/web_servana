import PermissionItem from "./PermissionItem";

/**
 * PermissionCategory Component
 * Groups related permissions under a category with an icon
 * 
 * @param {string} name - Category name
 * @param {Component} icon - Icon component for the category
 * @param {Array} permissions - Array of permission objects
 * @param {Array} rolePermissions - Array of enabled permission keys for the role
 * @param {Function} onTogglePermission - Handler for toggling a permission
 * @param {boolean} canManage - Whether user can manage permissions
 * @param {boolean} isDark - Dark mode flag
 */
export default function PermissionCategory({ 
  name, 
  icon: Icon, 
  permissions, 
  rolePermissions, 
  onTogglePermission, 
  canManage, 
  isDark 
}) {
  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex items-center gap-2 mb-3 sm:mb-4">
        <Icon size={16} className="flex-shrink-0" style={{ color: 'var(--text-secondary)' }} />
        <h4 className="font-semibold uppercase text-xs tracking-wide" style={{ color: 'var(--text-primary)' }}>{name}</h4>
      </div>
      <div className="space-y-2 sm:space-y-3">
        {permissions.map((permission) => (
          <PermissionItem
            key={permission.key}
            permission={permission}
            isEnabled={rolePermissions.includes(permission.key)}
            onToggle={() => onTogglePermission(permission.key)}
            canManage={canManage}
            isDark={isDark}
          />
        ))}
      </div>
    </div>
  );
}
