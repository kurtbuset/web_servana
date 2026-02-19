import { useState } from 'react';
import Layout from '../../components/Layout';
import SearchBar from '../../components/SearchBar';
import DepartmentSidebar from './components/DepartmentSidebar';
import MacroTable from './components/MacroTable';
import useMacros from '../../hooks/useMacros';
import { useUser } from '../../context/UserContext';
import { useTheme } from '../../context/ThemeContext';
import '../../App.css';
import '../../styles/GridLayout.css';

export default function MacrosAgentsScreen() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);
  const [editText, setEditText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentSearchQuery, setDepartmentSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [modalDepartment, setModalDepartment] = useState('All'); // For modal dropdown
  const [sortBy, setSortBy] = useState('default'); // Sorting option
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedMacroId, setSelectedMacroId] = useState(null);
  const [transferToDept, setTransferToDept] = useState('');
  const [showMobileDeptFilter, setShowMobileDeptFilter] = useState(false);
  
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
    deleteMacro,
    changeDepartment,
  } = useMacros('agent');

  // Filter macros based on search and selected department
  const filteredReplies = macros.filter((reply) => {
    const matchesSearch = reply.text
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    
    // Filter by department
    // "All" (@everyone) shows ONLY macros with dept_id = null
    // Specific department shows ONLY that department's macros
    const matchesDepartment = 
      selectedDepartment === 'All' 
        ? reply.dept_id === null // @everyone shows ONLY macros tagged as @everyone
        : reply.dept_id === departments.find((d) => d.dept_name === selectedDepartment)?.dept_id;
    
    return matchesSearch && matchesDepartment;
  });

  // Sort filtered macros
  const sortedReplies = [...filteredReplies].sort((a, b) => {
    switch (sortBy) {
      case 'alphabetical':
        // Case-insensitive alphabetical sort (A-Z)
        return a.text.toLowerCase().localeCompare(b.text.toLowerCase());
      case 'reverse':
        // Case-insensitive reverse alphabetical sort (Z-A)
        return b.text.toLowerCase().localeCompare(a.text.toLowerCase());
      case 'oldest':
        return a.id - b.id; // Assuming lower ID = older
      case 'default':
      default:
        return b.id - a.id; // Newest first (higher ID = newer)
    }
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
        setEditText('');
        setCurrentEditId(null);
        setModalDepartment('All');
      }
    } else {
      // Create new macro with selected department
      const selectedDept = departments.find(
        (dept) => dept.dept_name === modalDepartment
      );
      const dept_id = modalDepartment === 'All' ? null : selectedDept?.dept_id;

      const success = await createMacro(editText, dept_id, currentUserId);

      if (success) {
        setIsModalOpen(false);
        setEditText('');
        setModalDepartment('All');
      }
    }
  };

  const handleToggleActive = (id) => {
    toggleActive(id, currentUserId);
  };

  const handleDeleteMacro = async () => {
    if (selectedMacroId) {
      const success = await deleteMacro(selectedMacroId, currentUserId);
      if (success) {
        setDeleteModalOpen(false);
        setSelectedMacroId(null);
      }
    }
  };

  const handleTransferMacro = async () => {
    if (selectedMacroId && transferToDept !== '') {
      const dept_id = transferToDept === 'All' ? null : parseInt(transferToDept);
      const success = await changeDepartment(selectedMacroId, dept_id, currentUserId);
      if (success) {
        setTransferModalOpen(false);
        setSelectedMacroId(null);
        setTransferToDept('');
      }
    }
  };

  return (
    <Layout>
      <div className="flex flex-col h-full overflow-hidden" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 p-2 overflow-hidden">
            <div className="rounded-lg shadow-sm h-full grid-layout" style={{ backgroundColor: 'var(--card-bg)' }}>
              {/* Header Section */}
              <div className="grid-header p-2.5 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2" style={{ borderBottom: `1px solid var(--border-color)` }}>
                <h1 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>Agent Macros</h1>
                
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  {/* Add Button */}
                  <button
                    onClick={() => {
                      setEditText('');
                      setCurrentEditId(null);
                      setModalDepartment('All');
                      setIsModalOpen(true);
                    }}
                    className="bg-[#6237A0] text-white px-3 py-1.5 rounded-lg text-xs hover:bg-[#552C8C] transition-colors whitespace-nowrap"
                  >
                    + Add Macro
                  </button>
                </div>
              </div>

              {/* Mobile Department Filter Button */}
              <div className="md:hidden p-2" style={{ borderBottom: `1px solid var(--border-color)` }}>
                <button
                  onClick={() => setShowMobileDeptFilter(!showMobileDeptFilter)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  style={{ 
                    backgroundColor: isDark ? '#2a2a2a' : '#f3f4f6',
                    color: 'var(--text-primary)'
                  }}
                >
                  <span>Department: {selectedDepartment === 'All' ? '@everyone' : selectedDepartment}</span>
                  <svg 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    style={{ 
                      transform: showMobileDeptFilter ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s'
                    }}
                  >
                    <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                
                {/* Mobile Department Dropdown */}
                {showMobileDeptFilter && (
                  <div className="mt-2 rounded-lg p-2 max-h-60 overflow-y-auto custom-scrollbar" style={{ backgroundColor: isDark ? '#1e1e1e' : '#f9fafb', border: `1px solid var(--border-color)` }}>
                    <div className="mb-2 flex items-center px-2 py-1.5 rounded relative border" style={{ borderColor: 'var(--border-color)', backgroundColor: 'transparent' }}>
                      <Search size={12} className="mr-1.5 flex-shrink-0" style={{ color: 'var(--text-secondary)' }} />
                      <input
                        type="text"
                        placeholder="Search..."
                        value={departmentSearchQuery}
                        onChange={(e) => setDepartmentSearchQuery(e.target.value)}
                        className="bg-transparent focus:outline-none text-xs w-full pr-5"
                        style={{ color: 'var(--text-primary)' }}
                      />
                      {departmentSearchQuery && (
                        <X
                          size={12}
                          className="cursor-pointer absolute right-2 transition-colors"
                          style={{ color: 'var(--text-secondary)' }}
                          onClick={() => setDepartmentSearchQuery('')}
                        />
                      )}
                    </div>
                    
                    <div className="space-y-0.5">
                      <button
                        onClick={() => {
                          setSelectedDepartment('All');
                          setShowMobileDeptFilter(false);
                        }}
                        className="w-full text-left px-2 py-1.5 rounded text-xs transition-colors"
                        style={
                          selectedDepartment === 'All'
                            ? { backgroundColor: 'transparent', color: '#6237A0', fontWeight: 'bold' }
                            : { color: 'var(--text-primary)', backgroundColor: 'transparent' }
                        }
                      >
                        @everyone
                      </button>
                      {departments && departments.length > 0 && departments
                        .filter((dept) => dept.dept_name.toLowerCase().includes(departmentSearchQuery.toLowerCase()))
                        .map((dept) => (
                        <button
                          key={dept.dept_id}
                          onClick={() => {
                            if (dept.dept_is_active) {
                              setSelectedDepartment(dept.dept_name);
                              setShowMobileDeptFilter(false);
                            }
                          }}
                          disabled={!dept.dept_is_active}
                          className="w-full text-left px-2 py-1.5 rounded text-xs transition-colors hover:bg-purple-50 dark:hover:bg-purple-900/10"
                          style={
                            selectedDepartment === dept.dept_name
                              ? { backgroundColor: 'transparent', color: '#6237A0', fontWeight: 'bold' }
                              : !dept.dept_is_active
                              ? { color: 'var(--text-secondary)', backgroundColor: 'transparent', opacity: 0.5, cursor: 'not-allowed' }
                              : { color: 'var(--text-primary)', backgroundColor: 'transparent' }
                          }
                        >
                          {dept.dept_name}
                          {!dept.dept_is_active && ' (Inactive)'}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Left Sidebar - Department Filter */}
              <DepartmentSidebar
                departments={departments}
                selectedDepartment={selectedDepartment}
                onSelectDepartment={setSelectedDepartment}
                searchQuery={departmentSearchQuery}
                onSearchChange={setDepartmentSearchQuery}
                loading={loading}
                isDark={isDark}
              />

              {/* Main Content */}
              <div className="grid-content overflow-hidden p-2">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-6 w-6 border-2 border-t-[#6237A0]" style={{ borderColor: 'var(--border-color)', borderTopColor: '#6237A0' }}></div>
                      <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Loading agent macros...</span>
                    </div>
                  </div>  
                ) : error ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-red-600 text-xs font-semibold">
                      {error}
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col h-full">
                    {/* Info Note and Search Bar Row */}
                    <div className="mb-2 flex flex-col md:flex-row gap-2">
                      {/* Info Note - 60% on desktop, full width on mobile */}
                      <div className="md:flex-[0.6] p-2 rounded flex items-start gap-1.5" style={{ backgroundColor: isDark ? 'rgba(98, 55, 160, 0.1)' : 'rgba(98, 55, 160, 0.05)', border: `1px solid ${isDark ? 'rgba(98, 55, 160, 0.2)' : 'rgba(98, 55, 160, 0.1)'}` }}>
                        <svg className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: '#6237A0' }} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <div className="flex-1">
                          <p className="text-xs" style={{ color: 'var(--text-primary)' }}>
                            {selectedDepartment === 'All' 
                              ? 'Macros tagged as @everyone can be used across all departments'
                              : `Macros tagged for ${selectedDepartment} can only be used within this department`
                            }
                          </p>
                        </div>
                      </div>

                      {/* Search Bar - 40% on desktop, full width on mobile */}
                      <SearchBar
                        value={searchQuery}
                        onChange={setSearchQuery}
                        placeholder="Search macros..."
                        isDark={isDark}
                        className="md:flex-[0.4]"
                      />
                    </div>

                    <MacroTable
                      macros={sortedReplies}
                      departments={departments}
                      sortBy={sortBy}
                      onSortChange={setSortBy}
                      onEdit={(reply) => {
                        setCurrentEditId(reply.id);
                        setEditText(reply.text);
                        setIsModalOpen(true);
                      }}
                      onToggleActive={handleToggleActive}
                      onTransfer={(reply) => {
                        setSelectedMacroId(reply.id);
                        setTransferToDept(reply.dept_id?.toString() || 'All');
                        setTransferModalOpen(true);
                      }}
                      onDelete={(id) => {
                        setSelectedMacroId(id);
                        setDeleteModalOpen(true);
                      }}
                      searchQuery={searchQuery}
                      isDark={isDark}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
              <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
                <div className="rounded-lg shadow-xl p-5 sm:p-6 w-full max-w-md" style={{ backgroundColor: 'var(--card-bg)' }}>
                  <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                    {currentEditId ? 'Edit Macro' : 'Add Macro'}
                  </h2>

                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                      Message
                    </label>
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="w-full rounded-lg px-3 py-2.5 text-sm h-32 focus:outline-none focus:ring-2 focus:ring-[#6237A0]/30 focus:border-[#6237A0]"
                      style={{
                        backgroundColor: 'var(--input-bg)',
                        color: 'var(--text-primary)',
                        border: `1px solid var(--border-color)`
                      }}
                      placeholder="Enter macro message..."
                      autoFocus
                    />
                  </div>

                  {!currentEditId && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                        Audience
                      </label>
                      <select
                        className="w-full rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#6237A0]/30 focus:border-[#6237A0]"
                        style={{
                          backgroundColor: 'var(--input-bg)',
                          color: 'var(--text-primary)',
                          border: `1px solid var(--border-color)`
                        }}
                        value={modalDepartment}
                        onChange={(e) => setModalDepartment(e.target.value)}
                      >
                        <option value="All">@everyone</option>
                        {departments && departments.length > 0 && departments.map((dept) => (
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
                      onClick={() => {
                        setIsModalOpen(false);
                        setEditText('');
                        setCurrentEditId(null);
                        setModalDepartment('All');
                      }}
                      className="px-4 py-2 text-sm rounded-lg transition-colors"
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
                      className="px-4 py-2 bg-[#6237A0] text-white text-sm rounded-lg hover:bg-[#552C8C] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                      {currentEditId ? 'Save Changes' : 'Create Macro'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Transfer Modal */}
            {transferModalOpen && (
              <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
                <div className="rounded-lg shadow-xl p-5 sm:p-6 w-full max-w-md" style={{ backgroundColor: 'var(--card-bg)' }}>
                  <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                    Transfer Macro
                  </h2>

                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                      Transfer to Department
                    </label>
                    <select
                      className="w-full rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#6237A0]/30 focus:border-[#6237A0]"
                      style={{
                        backgroundColor: 'var(--input-bg)',
                        color: 'var(--text-primary)',
                        border: `1px solid var(--border-color)`
                      }}
                      value={transferToDept}
                      onChange={(e) => setTransferToDept(e.target.value)}
                    >
                      <option value="All">@everyone</option>
                      {departments && departments.length > 0 && departments.map((dept) => (
                        <option
                          key={dept.dept_id}
                          value={dept.dept_id.toString()}
                          disabled={!dept.dept_is_active}
                        >
                          {dept.dept_name}
                          {!dept.dept_is_active && ' (Inactive)'}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3">
                    <button
                      onClick={() => {
                        setTransferModalOpen(false);
                        setSelectedMacroId(null);
                        setTransferToDept('');
                      }}
                      className="px-4 py-2 text-sm rounded-lg transition-colors"
                      style={{ 
                        backgroundColor: isDark ? '#4a4a4a' : '#e5e7eb',
                        color: 'var(--text-primary)'
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleTransferMacro}
                      className="px-4 py-2 bg-[#6237A0] text-white text-sm rounded-lg hover:bg-[#552C8C] transition-colors"
                    >
                      Transfer
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteModalOpen && (
              <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
                <div className="rounded-lg shadow-xl p-5 sm:p-6 w-full max-w-md" style={{ backgroundColor: 'var(--card-bg)' }}>
                  <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                    Delete Macro
                  </h2>

                  <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
                    Are you sure you want to delete this macro? This action cannot be undone.
                  </p>

                  <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3">
                    <button
                      onClick={() => {
                        setDeleteModalOpen(false);
                        setSelectedMacroId(null);
                      }}
                      className="px-4 py-2 text-sm rounded-lg transition-colors"
                      style={{ 
                        backgroundColor: isDark ? '#4a4a4a' : '#e5e7eb',
                        color: 'var(--text-primary)'
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteMacro}
                      className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
