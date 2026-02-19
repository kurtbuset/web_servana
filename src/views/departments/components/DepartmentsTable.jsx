import { LoadingState } from '../../../components/ui';
import DepartmentTableRow from './DepartmentTableRow';

/**
 * DepartmentsTable - Table displaying list of departments
 */
export default function DepartmentsTable({
  departments,
  loading,
  error,
  searchQuery,
  canEditDepartment,
  isDark,
  onEdit,
  onToggleStatus
}) {
  if (loading) {
    return <LoadingState message="Loading departments..." />;
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
        <thead className="sticky top-0 z-10" style={{ color: 'var(--text-secondary)', backgroundColor: isDark ? '#2a2a2a' : '#f9fafb', borderBottom: `1px solid var(--border-color)` }}>
          <tr>
            <th className="py-2 px-2.5 sm:px-3 text-left font-semibold text-xs">Department Name</th>
            <th className="py-2 px-2.5 sm:px-3 text-center font-semibold w-28 sm:w-32 text-xs">Status</th>
          </tr>
        </thead>
        <tbody style={{ borderColor: 'var(--border-color)' }}>
          {departments.length === 0 ? (
            <tr>
              <td colSpan={2} className="text-center py-12">
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {searchQuery ? "No departments found matching your search" : "No departments available"}
                </p>
              </td>
            </tr>
          ) : (
            departments.map((dept) => (
              <DepartmentTableRow
                key={dept.dept_id}
                department={dept}
                canEditDepartment={canEditDepartment}
                isDark={isDark}
                onEdit={() => onEdit(dept)}
                onToggleStatus={() => onToggleStatus(dept.dept_id, dept.dept_is_active)}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
