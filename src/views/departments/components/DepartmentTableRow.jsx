import { Edit3 } from 'react-feather';
import ToggleSwitch from '../../../components/ToggleSwitch';
import IconButton from '../../../components/ui/IconButton';
import { useTableRowHover } from '../../../hooks/useTableRowHover';

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
  const rowHover = useTableRowHover(isDark);

  return (
    <tr
      className="transition-colors"
      style={{ borderTop: `1px solid ${isDark ? 'rgba(74, 74, 74, 0.3)' : 'var(--border-color)'}` }}
      {...rowHover}
    >
      <td className="py-2 px-2.5 sm:px-3">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <p className="text-xs break-words flex-1" style={{ color: 'var(--text-primary)' }}>
            {department.dept_name}
          </p>
          <IconButton
            onClick={onEdit}
            disabled={!canEditDepartments}
            isDark={isDark}
            title={!canEditDepartments ? "You don't have permission to edit departments" : "Edit"}
            className="flex-shrink-0"
          >
            <Edit3 size={14} />
          </IconButton>
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
