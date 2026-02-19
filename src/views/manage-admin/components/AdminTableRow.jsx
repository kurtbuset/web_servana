import { Edit3, Eye } from "react-feather";
import { Avatar } from "../../../components/ui";
import ToggleSwitch from "../../../components/ToggleSwitch";

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
            <button
              onClick={onViewProfile}
              className="p-1 rounded transition-colors hover:text-[#6237A0]"
              style={{ color: 'var(--text-secondary)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = isDark ? 'rgba(139, 92, 246, 0.1)' : 'rgba(243, 232, 255, 1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
              title="View Profile"
            >
              <Eye size={14} />
            </button>
            <button
              onClick={onEdit}
              disabled={isSelf}
              className={`p-1 rounded transition-colors ${
                isSelf
                  ? "cursor-not-allowed"
                  : "hover:text-[#6237A0]"
              }`}
              style={{ color: isSelf ? '#d1d5db' : 'var(--text-secondary)' }}
              onMouseEnter={(e) => {
                if (!isSelf) {
                  e.currentTarget.style.backgroundColor = isDark ? 'rgba(139, 92, 246, 0.1)' : 'rgba(243, 232, 255, 1)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelf) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
              title={isSelf ? "You cannot edit your own account" : "Edit"}
            >
              <Edit3 size={14} />
            </button>
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
