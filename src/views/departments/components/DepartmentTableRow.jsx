import { Edit3 } from 'react-feather';
import ToggleSwitch from '../../../components/ToggleSwitch';

/**
 * DepartmentTableRow - Individual row in the departments table
 */
export default function DepartmentTableRow({
  department,
  canEditDepartments,
  isDark,
  onEdit,
  onToggleStatus
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
        <div className="flex items-center gap-1.5 sm:gap-2">
          <p className="text-xs break-words flex-1" style={{ color: 'var(--text-primary)' }}>
            {department.dept_name}
          </p>
          <button
            onClick={onEdit}
            disabled={!canEditDepartments}
            className={`flex-shrink-0 p-1 rounded transition-colors ${
              canEditDepartments
                ? "hover:text-[#6237A0]"
                : "cursor-not-allowed"
            }`}
            style={canEditDepartments ? { color: 'var(--text-secondary)' } : { color: isDark ? '#4a4a4a' : '#d1d5db' }}
            onMouseEnter={(e) => {
              if (canEditDepartments) {
                e.currentTarget.style.backgroundColor = isDark ? 'rgba(139, 92, 246, 0.1)' : 'rgba(243, 232, 255, 1)';
              }
            }}
            onMouseLeave={(e) => {
              if (canEditDepartments) {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
            title={!canEditDepartments ? "You don't have permission to edit departments" : "Edit"}
          >
            <Edit3 size={14} />
          </button>
        </div>
      </td>

      <td className="py-2 px-2.5 sm:px-3 text-center">
        <div
          className="inline-block"
          title={!canEditDepartments ? "You don't have permission to edit departments" : ""}
        >
          <ToggleSwitch
            checked={department.dept_is_active}
            onChange={onToggleStatus}
            disabled={!canEditDepartments}
            size="md"
          />
        </div>
      </td>
    </tr>
  );
}
