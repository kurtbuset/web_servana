import { Edit3, Eye } from "react-feather";
import { Avatar } from "../../../components/ui";
import IconButton from "../../../components/ui/IconButton";
import ToggleSwitch from "../../../components/ToggleSwitch";
import { useTableRowHover } from "../../../hooks/useTableRowHover";

/**
 * AdminTableRow - Individual row in the admin table
 */
export default function AdminTableRow({
  agent,
  isSelf,
  isDark,
  onViewProfile,
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
          <Avatar
            src={agent.profile_picture}
            name={agent.email}
            alt="Profile"
            size="sm"
            className="flex-shrink-0"
          />
          <p className="text-xs break-words flex-1" style={{ color: 'var(--text-primary)' }}>
            {agent.email}
            {isSelf && (
              <span className="ml-2 text-xs text-purple-600 font-medium">
                (You)
              </span>
            )}
          </p>
          <div className="flex items-center gap-1 flex-shrink-0">
            <IconButton
              onClick={onViewProfile}
              isDark={isDark}
              title="View Profile"
            >
              <Eye size={14} />
            </IconButton>
            <IconButton
              onClick={onEdit}
              disabled={isSelf}
              isDark={isDark}
              title={isSelf ? "You cannot edit your own account" : "Edit"}
            >
              <Edit3 size={14} />
            </IconButton>
          </div>
        </div>
      </td>
      <td className="py-2 px-2.5 sm:px-3 text-center">
        <div
          className="inline-block"
          title={isSelf ? "You cannot deactivate your own account" : ""}
        >
          <ToggleSwitch
            checked={agent.active}
            onChange={onToggleStatus}
            disabled={isSelf}
            size="md"
          />
        </div>
      </td>
    </tr>
  );
}
