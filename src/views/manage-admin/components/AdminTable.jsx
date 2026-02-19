import { LoadingState } from "../../../components/ui";
import AdminTableRow from "./AdminTableRow";

/**
 * AdminTable - Table displaying list of administrators
 */
export default function AdminTable({ 
  agents,
  currentUserId,
  loading,
  error,
  searchQuery,
  isDark,
  onViewProfile,
  onEdit,
  onToggleStatus
}) {
  if (loading) {
    return <LoadingState message="Loading administrators..." />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-600 text-sm font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto overflow-y-auto h-full custom-scrollbar">
      <table className="w-full text-xs">
        <thead 
          className="sticky top-0 z-10" 
          style={{ 
            color: 'var(--text-secondary)', 
            backgroundColor: isDark ? '#2a2a2a' : '#f9fafb', 
            borderBottom: '1px solid var(--border-color)' 
          }}
        >
          <tr>
            <th className="py-2 px-2.5 sm:px-3 text-left font-semibold text-xs">Email</th>
            <th className="py-2 px-2.5 sm:px-3 text-center font-semibold w-28 sm:w-32 text-xs">Status</th>
          </tr>
        </thead>
        <tbody style={{ borderColor: 'var(--border-color)' }}>
          {agents.length === 0 ? (
            <tr>
              <td colSpan={2} className="text-center py-12">
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {searchQuery ? "No admins found matching your search" : "No administrators available"}
                </p>
              </td>
            </tr>
          ) : (
            agents.map((agent) => (
              <AdminTableRow
                key={agent.sys_user_id}
                agent={agent}
                isSelf={agent.sys_user_id === currentUserId}
                isDark={isDark}
                onViewProfile={() => onViewProfile(agent)}
                onEdit={() => onEdit(agent)}
                onToggleStatus={() => onToggleStatus(agent.sys_user_id)}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
