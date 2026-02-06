import { useState } from 'react';
import TopNavbar from '../../../src/components/TopNavbar';
import Sidebar from '../../../src/components/Sidebar';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Edit3, Search, X } from 'react-feather';
import useMacros from '../../hooks/useMacros';
import { useUser } from '../../context/UserContext';
import { useTheme } from '../../context/ThemeContext';
import '../../App.css';

export default function MacrosAgentsScreen() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);
  const [editText, setEditText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All'); // For filtering the main table
  const [modalSelectedDepartment, setModalSelectedDepartment] = useState('All'); // For the modal department selection
  
  // Get user ID from UserContext
  const { getUserId } = useUser();
  const currentUserId = getUserId();
  const { isDark } = useTheme();

  // Use the macros hook with "agent" role type
  const {
    macros,
    departments,
    loading,
    error,
    createMacro,
    updateMacro,
    toggleActive,
    changeDepartment,
  } = useMacros('agent');

  // Filter macros based on search and department
  const filteredReplies = macros.filter((reply) => {
    const matchesSearch = reply.text
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesDepartment =
      selectedDepartment === 'All' ||
      reply.dept_id ===
        departments.find((d) => d.dept_name === selectedDepartment)?.dept_id;
    return matchesSearch && matchesDepartment;
  });

  const handleSaveMacro = async () => {
    if (currentEditId !== null) {
      // Update existing macro
      const macro = macros.find((m) => m.id === currentEditId);
      if (!macro) return;

      const success = await updateMacro(
        currentEditId,
        editText,
        macro.active,
        macro.dept_id,
        currentUserId
      );

      if (success) {
        setIsModalOpen(false);
      }
    } else {
      // Create new macro
      const selectedDept = departments.find(
        (dept) => dept.dept_name === modalSelectedDepartment
      );
      const dept_id = modalSelectedDepartment === 'All' ? null : selectedDept?.dept_id;

      const success = await createMacro(editText, dept_id, currentUserId);

      if (success) {
        setIsModalOpen(false);
      }
    }
  };

  const handleToggleActive = (id) => {
    toggleActive(id, currentUserId);
  };

  const handleChangeDepartment = (id, dept_id) => {
    changeDepartment(id, dept_id, currentUserId);
  };

  const toggleDropdown = (name) => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  const toggleSidebar = () => {
    setMobileSidebarOpen((prev) => !prev);
  };

  return (
    <>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${isDark ? '#2a2a2a' : '#f1f1f1'};
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #6237A0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #552C8C;
        }
      `}</style>
      <div className="flex flex-col h-screen overflow-hidden">
        <TopNavbar toggleSidebar={toggleSidebar} />

        <div className="flex flex-1 overflow-hidden">
          <Sidebar
            isMobile={true}
            isOpen={mobileSidebarOpen}
            toggleDropdown={toggleDropdown}
            openDropdown={openDropdown}
          />

          <Sidebar
            isMobile={false}
            toggleDropdown={toggleDropdown}
            openDropdown={openDropdown}
          />

          <main className="flex-1 p-2 sm:p-3 md:p-4 overflow-hidden" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <div className="p-3 sm:p-4 rounded-lg shadow-sm h-full flex flex-col" style={{ backgroundColor: 'var(--card-bg)' }}>
              {/* Header Section */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <h1 className="text-lg sm:text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Agent Macros</h1>
                
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                  {/* Search Bar */}
                  <div className="flex items-center px-2.5 py-1.5 rounded-lg w-full sm:w-56 md:w-64" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                    <Search size={16} className="mr-2 flex-shrink-0" style={{ color: 'var(--text-secondary)' }} />
                    <input
                      type="text"
                      placeholder="Search macros..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-transparent focus:outline-none text-xs w-full pr-6"
                      style={{ color: 'var(--text-primary)' }}
                    />
                    {searchQuery && (
                      <X
                        size={14}
                        className="cursor-pointer transition-colors"
                        style={{ color: 'var(--text-secondary)' }}
                        onClick={() => setSearchQuery('')}
                      />
                    )}
                  </div>

                  {/* Add Button */}
                  <button
                    onClick={() => {
                      setEditText('');
                      setModalSelectedDepartment('All'); // Reset modal department selection
                      setCurrentEditId(null);
                      setIsModalOpen(true);
                    }}
                    className="bg-[#6237A0] text-white px-3 py-1.5 rounded-lg text-xs hover:bg-[#552C8C] transition-colors whitespace-nowrap"
                  >
                    + Add Macro
                  </button>
                </div>
              </div>

              {/* Table Container */}
              <div className="flex-1 overflow-hidden">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="flex items-center space-x-3">
                      <div className="animate-spin rounded-full h-8 w-8 border-3 border-t-[#6237A0]" style={{ borderColor: 'var(--border-color)', borderTopColor: '#6237A0' }}></div>
                      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Loading agent macros...</span>
                    </div>
                  </div>
                ) : error ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-red-600 text-sm font-semibold">
                      {error}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto overflow-y-auto h-full custom-scrollbar">
                    <table className="w-full text-xs">
                      <thead className="sticky top-0 z-10" style={{ color: 'var(--text-secondary)', backgroundColor: isDark ? '#2a2a2a' : '#f9fafb', borderBottom: `1px solid var(--border-color)` }}>
                        <tr>
                          <th className="py-2 px-2.5 sm:px-3 text-left font-semibold text-xs">Message</th>
                          <th className="py-2 px-2.5 sm:px-3 text-center font-semibold w-28 sm:w-32 text-xs">Status</th>
                          <th className="py-2 px-2.5 sm:px-3 text-center font-semibold w-36 sm:w-40 text-xs">Department</th>
                        </tr>
                      </thead>
                      <tbody style={{ borderColor: 'var(--border-color)' }}>
                        {filteredReplies.length === 0 ? (
                          <tr>
                            <td colSpan={3} className="text-center py-12">
                              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                {searchQuery ? "No macros found matching your search" : "No agent macros available"}
                              </p>
                            </td>
                          </tr>
                        ) : (
                          filteredReplies.map((reply) => (
                            <tr
                              key={reply.id}
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
                                <div className="flex items-start gap-1.5">
                                  <span className="text-xs break-words flex-1 line-clamp-2" style={{ color: 'var(--text-primary)' }}>
                                    {reply.text}
                                  </span>
                                  <Edit3
                                    size={14}
                                    strokeWidth={1.5}
                                    className="cursor-pointer hover:text-[#6237A0] transition-colors flex-shrink-0 mt-0.5"
                                    style={{ color: 'var(--text-secondary)' }}
                                    onClick={() => {
                                      setCurrentEditId(reply.id);
                                      setEditText(reply.text);
                                      setIsModalOpen(true);
                                    }}
                                  />
                                </div>
                              </td>

                              <td className="py-2 px-2.5 sm:px-3 text-center">
                                <label className="inline-flex relative items-center cursor-pointer">
                                  <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={reply.active}
                                    onChange={() => handleToggleActive(reply.id)}
                                  />
                                  <div className="w-11 h-6 rounded-full peer transition-colors relative bg-gray-300 peer-checked:bg-[#6237A0] after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-transform peer-checked:after:translate-x-5" />
                                </label>
                              </td>

                              <td className="py-2 px-2.5 sm:px-3 text-center">
                                <select
                                  className="rounded-lg px-2 py-1 text-xs cursor-pointer hover:border-[#6237A0] focus:outline-none focus:ring-2 focus:ring-[#6237A0]/30"
                                  style={{
                                    backgroundColor: 'var(--input-bg)',
                                    color: 'var(--text-primary)',
                                    border: `1px solid var(--border-color)`
                                  }}
                                  value={reply.dept_id ?? ''}
                                  onChange={(e) =>
                                    handleChangeDepartment(
                                      reply.id,
                                      e.target.value ? parseInt(e.target.value) : null
                                    )
                                  }
                                >
                                  <option value="">All</option>
                                  {departments.map((dept) => (
                                    <option
                                      key={dept.dept_id}
                                      value={dept.dept_id}
                                      disabled={
                                        !dept.dept_is_active &&
                                        dept.dept_id !== reply.dept_id
                                      }
                                      className={
                                        !dept.dept_is_active ? 'text-red-400' : ''
                                      }
                                    >
                                      {dept.dept_name}
                                      {!dept.dept_is_active && ' (Inactive)'}
                                    </option>
                                  ))}
                                </select>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
              <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
                <div className="rounded-lg shadow-xl p-5 sm:p-6 w-full max-w-md sm:max-w-lg" style={{ backgroundColor: 'var(--card-bg)' }}>
                  <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                    {currentEditId ? 'Edit Macro' : 'Add Macro'}
                  </h2>

                  <label className="text-sm mb-1.5 block font-medium" style={{ color: 'var(--text-secondary)' }}>
                    Message
                  </label>
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full rounded-lg p-3 text-sm mb-4 h-32 focus:outline-none focus:ring-2 focus:ring-[#6237A0]/30 focus:border-[#6237A0]"
                    style={{
                      backgroundColor: 'var(--input-bg)',
                      color: 'var(--text-primary)',
                      border: `1px solid var(--border-color)`
                    }}
                    placeholder="Enter macro message..."
                  />

                  {!currentEditId && (
                    <div className="mb-4">
                      <label className="text-sm mb-1.5 block font-medium" style={{ color: 'var(--text-secondary)' }}>
                        Department
                      </label>
                      <select
                        className="w-full rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#6237A0]/30 focus:border-[#6237A0]"
                        style={{
                          backgroundColor: 'var(--input-bg)',
                          color: 'var(--text-primary)',
                          border: `1px solid var(--border-color)`
                        }}
                        value={modalSelectedDepartment}
                        onChange={(e) => setModalSelectedDepartment(e.target.value)}
                      >
                        <option value="All">All</option>
                        {departments.map((dept) => (
                          <option
                            key={dept.dept_id}
                            value={dept.dept_name}
                            disabled={!dept.dept_is_active}
                            className={!dept.dept_is_active ? 'text-red-400' : ''}
                          >
                            {dept.dept_name}
                            {!dept.dept_is_active && ' (Inactive)'}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3">
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 rounded-lg text-sm transition-colors"
                      style={{ 
                        backgroundColor: isDark ? '#4a4a4a' : '#e5e7eb',
                        color: 'var(--text-primary)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = isDark ? '#5a5a5a' : '#d1d5db';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = isDark ? '#4a4a4a' : '#e5e7eb';
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveMacro}
                      disabled={!editText.trim()}
                      className="bg-[#6237A0] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#552C8C] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}
