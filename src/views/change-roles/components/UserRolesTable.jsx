import { LoadingState, SortButton } from '../../../components/ui';
import UserRoleTableRow from './UserRoleTableRow';

/**
 * UserRolesTable - Table displaying list of users with their roles
 */
export default function UserRolesTable({
  users,
  availableRoles,
  loading,
  searchQuery,
  sortBy,
  onSortChange,
  canAssignRoles,
  isDark,
  onToggleActive,
  onChangeRole
}) {
  if (loading) {
    return <LoadingState message="Loading users..." />;
  }

  return (
    <div className="overflow-x-auto overflow-y-auto h-full custom-scrollbar">
      <table className="w-full text-xs">
        <thead className="sticky top-0 z-10" style={{ color: 'var(--text-secondary)', backgroundColor: isDark ? '#2a2a2a' : '#f9fafb', borderBottom: `1px solid var(--border-color)` }}>
          <tr>
            <th className="py-2 px-2.5 sm:px-3 text-left font-semibold text-xs">
              <div className="flex items-center gap-2">
                <span>Email</span>
                <SortButton 
                  sortBy={sortBy} 
                  onSortChange={onSortChange}
                  isDark={isDark}
                />
              </div>
            </th>
            <th className="py-2 px-2.5 sm:px-3 text-center font-semibold w-28 sm:w-32 text-xs">Status</th>
            <th className="py-2 px-2.5 sm:px-3 text-center font-semibold w-36 sm:w-40 text-xs">Role</th>
          </tr>
        </thead>
        <tbody style={{ borderColor: 'var(--border-color)' }}>
          {users.length === 0 ? (
            <tr>
              <td colSpan={3} className="text-center py-12">
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {searchQuery ? "No users found matching your search" : "No users available"}
                </p>
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <UserRoleTableRow
                key={user.sys_user_id}
                user={user}
                availableRoles={availableRoles}
                canAssignRoles={canAssignRoles}
                isDark={isDark}
                onToggleActive={() => onToggleActive(user)}
                onChangeRole={(newRoleId) => onChangeRole(user, newRoleId)}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
