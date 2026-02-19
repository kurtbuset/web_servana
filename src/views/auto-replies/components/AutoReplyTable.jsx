import { LoadingState } from '../../../components/ui';
import AutoReplyTableRow from './AutoReplyTableRow';

/**
 * AutoReplyTable - Table displaying list of auto-replies
 */
export default function AutoReplyTable({
  replies,
  allDepartments,
  loading,
  error,
  searchQuery,
  isDark,
  onEdit,
  onToggleStatus,
  onTransfer,
  onDelete
}) {
  if (loading) {
    return <LoadingState message="Loading auto-replies..." />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-600 text-xs font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto overflow-y-auto flex-1 custom-scrollbar">
      <table className="w-full text-xs">
        <thead className="sticky top-0 z-10" style={{ color: 'var(--text-secondary)', backgroundColor: isDark ? '#2a2a2a' : '#f9fafb', borderBottom: `1px solid var(--border-color)` }}>
          <tr>
            <th className="py-2 px-2 text-left font-semibold">Message</th>
            <th className="py-2 px-2 text-center font-semibold w-24">Status</th>
            <th className="py-2 px-2 text-center font-semibold w-32">Department</th>
            <th className="py-2 px-2 text-center font-semibold w-20">Actions</th>
          </tr>
        </thead>
        <tbody style={{ borderColor: 'var(--border-color)' }}>
          {replies.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center py-12">
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {searchQuery ? "No replies found matching your search" : "No auto-replies available"}
                </p>
              </td>
            </tr>
          ) : (
            replies.map((reply) => {
              const deptName = reply.dept_id 
                ? allDepartments.find(d => d.dept_id === reply.dept_id)?.dept_name || 'Unknown'
                : '@everyone';
              
              return (
                <AutoReplyTableRow
                  key={reply.auto_reply_id}
                  reply={reply}
                  departmentName={deptName}
                  isDark={isDark}
                  onEdit={() => onEdit(reply)}
                  onToggleStatus={() => onToggleStatus(reply.auto_reply_id, reply.auto_reply_is_active)}
                  onTransfer={() => onTransfer(reply)}
                  onDelete={() => onDelete(reply.auto_reply_id)}
                />
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
