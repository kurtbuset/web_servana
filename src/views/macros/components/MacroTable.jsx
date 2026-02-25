import { Edit3 } from 'react-feather';
import ToggleSwitch from '../../../components/ToggleSwitch';
import { SortButton } from '../../../components/ui';

/**
 * MacroTable Component
 * Displays a table of macros with sorting, editing, and actions
 * 
 * @param {Array} macros - List of macros to display
 * @param {Array} departments - List of departments
 * @param {string} sortBy - Current sort option
 * @param {Function} onSortChange - Handler for sort change
 * @param {Function} onEdit - Handler for editing a macro
 * @param {Function} onToggleActive - Handler for toggling macro active status
 * @param {Function} onTransfer - Handler for transferring macro to another department
 * @param {Function} onDelete - Handler for deleting a macro
 * @param {string} searchQuery - Current search query
 * @param {boolean} isDark - Dark mode flag
 */
export default function MacroTable({
  macros,
  departments,
  sortBy,
  onSortChange,
  onEdit,
  onToggleActive,
  onTransfer,
  onDelete,
  searchQuery,
  isDark
}) {
  return (
    <div className="overflow-x-auto overflow-y-auto flex-1 custom-scrollbar">
      <table className="w-full text-xs">
        <thead className="sticky top-0 z-10" style={{ color: 'var(--text-secondary)', backgroundColor: isDark ? '#2a2a2a' : '#f9fafb', borderBottom: `1px solid var(--border-color)` }}>
          <tr>
            <th className="py-2 px-2 text-left font-semibold">
              <div className="flex items-center gap-2">
                <span>Message</span>
                <SortButton 
                  sortBy={sortBy} 
                  onSortChange={onSortChange}
                  isDark={isDark}
                />
              </div>
            </th>
            <th className="py-2 px-2 text-center font-semibold w-24">Status</th>
            <th className="py-2 px-2 text-center font-semibold w-32">Department</th>
            <th className="py-2 px-2 text-center font-semibold w-20">Actions</th>
          </tr>
        </thead>
        <tbody style={{ borderColor: 'var(--border-color)' }}>
          {macros.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center py-12">
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {searchQuery ? "No macros found matching your search" : "No client macros available"}
                </p>
              </td>
            </tr>
          ) : (
            macros.map((reply) => {
              // Find department name or show "@everyone" for macros with no department
              const deptName = reply.dept_id 
                ? departments.find(d => d.dept_id === reply.dept_id)?.dept_name || 'Unknown'
                : '@everyone';
              
              return (
                <tr
                  key={reply.id}
                  className="transition-colors"
                  style={{ borderTop: `1px solid var(--border-color)` }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = isDark ? 'rgba(139, 92, 246, 0.05)' : 'rgba(249, 250, 251, 1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <td className="py-3 px-3 sm:px-4">
                    <div className="flex items-start gap-2">
                      <span className="text-sm break-words flex-1 line-clamp-2" style={{ color: 'var(--text-primary)' }}>
                        {reply.text}
                      </span>
                      <Edit3
                        size={16}
                        strokeWidth={1.5}
                        className="cursor-pointer hover:text-[#6237A0] transition-colors flex-shrink-0 mt-0.5"
                        style={{ color: 'var(--text-secondary)' }}
                        onClick={() => onEdit(reply)}
                      />
                    </div>
                  </td>

                  <td className="py-3 px-3 sm:px-4 text-center">
                    <ToggleSwitch
                      checked={reply.active}
                      onChange={() => onToggleActive(reply.id)}
                      size="md"
                    />
                  </td>

                  <td className="py-3 px-3 sm:px-4 text-center">
                    <span className="text-xs px-2 py-0.5 rounded inline-block font-medium max-w-[100px] truncate" style={{
                      backgroundColor: isDark ? '#3a3a3a' : '#e5e7eb',
                      color: 'var(--text-primary)',
                      border: `1px solid var(--border-color)`
                    }} title={deptName}>
                      {deptName}
                    </span>
                  </td>

                  <td className="py-3 px-3 sm:px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onTransfer(reply)}
                        className="p-1.5 rounded hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-colors"
                        title="Transfer to another department"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M13 7L19 7M19 7L16 4M19 7L16 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M11 17H5M5 17L8 14M5 17L8 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M5 7H9M15 17H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      </button>
                      <button
                        onClick={() => onDelete(reply.id)}
                        className="p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors text-red-600"
                        title="Delete macro"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M19 7L18.1327 19.1425C18.0579 20.1891 17.187 21 16.1378 21H7.86224C6.81296 21 5.94208 20.1891 5.86732 19.1425L5 7M10 11V17M14 11V17M15 7V4C15 3.44772 14.5523 3 14 3H10C9.44772 3 9 3.44772 9 4V7M4 7H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
