import { Avatar } from '../../../components/ui';
import ToggleSwitch from '../../../components/ToggleSwitch';

/**
 * UserRoleTableRow - Individual row in the user roles table
 */
export default function UserRoleTableRow({
  user,
  availableRoles,
  canAssignRoles,
  isDark,
  onToggleActive,
  onChangeRole
}) {
  return (
    <tr
      className="transition-colors"
      style={{ borderTop: `1px solid ${isDark ? 'rgba(74, 74, 74, 0.3)' : 'var(--border-color)'}` }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = isDark ? 'rgba(139, 92, 246, 0.05)' : 'rgba(249, 250, 251, 1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
      }}
    >
      <td className="py-2 px-2.5 sm:px-3">
        <div className="flex items-center gap-2">
          <Avatar
            src={user.profile_picture}
            name={user.sys_user_email}
            alt={user.sys_user_email}
            size="sm"
            border
            shadow
            className="flex-shrink-0"
          />
          <span className="text-xs break-words" style={{ color: 'var(--text-primary)' }}>
            {user.sys_user_email}
          </span>
        </div>
      </td>

      <td className="py-2 px-2.5 sm:px-3 text-center">
        <div 
          className="inline-block"
          title={!canAssignRoles ? "You don't have permission to modify user status" : ""}
        >
          <ToggleSwitch
            checked={user.sys_user_is_active || false}
            onChange={onToggleActive}
            disabled={!canAssignRoles}
            size="md"
          />
        </div>
      </td>

      <td className="py-2 px-2.5 sm:px-3 text-center">
        <select
          value={user.role_id ?? ""}
          onChange={(e) => onChangeRole(e.target.value ? parseInt(e.target.value) : null)}
          disabled={!canAssignRoles}
          className={`rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-[#6237A0]/30 ${
            canAssignRoles
              ? "cursor-pointer hover:border-[#6237A0]"
              : "cursor-not-allowed"
          }`}
          style={{
            backgroundColor: canAssignRoles ? 'var(--input-bg)' : (isDark ? '#2a2a2a' : '#f3f4f6'),
            color: canAssignRoles ? 'var(--text-primary)' : 'var(--text-secondary)',
            border: `1px solid var(--border-color)`
          }}
          title={!canAssignRoles ? "You don't have permission to change user roles" : ""}
        >
          {availableRoles.map((role) => (
            <option
              key={role.role_id}
              value={role.role_id}
              disabled={
                !role.role_is_active &&
                role.role_id !== user.role_id
              }
              className={
                !role.role_is_active ? "text-red-400" : ""
              }
            >
              {role.role_name}
              {!role.role_is_active && " (Inactive)"}
            </option>
          ))}
        </select>
      </td>
    </tr>
  );
}
