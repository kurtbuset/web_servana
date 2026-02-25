import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import ScreenContainer from '../../components/ScreenContainer';
import SearchBar from '../../components/SearchBar';
import { 
  Tooltip,
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../../components/ui';
import usePagination from '../../hooks/usePagination';
import DepartmentSidebar from './components/DepartmentSidebar';
import MacroTable from './components/MacroTable';
import useMacros from '../../hooks/useMacros';
import { useUser } from '../../context/UserContext';
import { useTheme } from '../../context/ThemeContext';
import { HelpCircle } from 'react-feather';
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
  const [isMobile, setIsMobile] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Detect mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
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

  // Pagination
  const {
    totalPages,
    paginationRange,
    hasNextPage,
    hasPreviousPage,
    startIndex,
    endIndex
  } = usePagination({
    totalItems: sortedReplies.length,
    itemsPerPage,
    currentPage,
    siblingCount: 1
  });

  // Get current page macros
  const paginatedReplies = sortedReplies.slice(startIndex, endIndex);

  // Reset to page 1 when search query, department, sort, or items per page changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedDepartment, sortBy, itemsPerPage]);

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
      <ScreenContainer>
        <div className="p-3 sm:p-4 flex flex-col h-full overflow-hidden">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="relative flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold relative inline-block" style={{ color: 'var(--text-primary)' }}>
                Agent Macros
                <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-[#6237A0] via-[#8B5CF6] to-transparent rounded-full"></div>
              </h1>
              <Tooltip 
                content="Create and manage quick response templates for agents. Organize macros by department or make them available to everyone. Speed up responses with pre-written messages."
                position="bottom"
                isDark={isDark}
              >
                <div className="flex items-center justify-center w-5 h-5 rounded-full transition-all duration-200 hover:bg-purple-100 dark:hover:bg-purple-900/20 cursor-help">
                  <HelpCircle 
                    size={16} 
                    className="transition-colors" 
                    style={{ color: '#8B5CF6' }}
                  />
                </div>
              </Tooltip>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
              {/* Add Button */}
              <button
                onClick={() => {
                  setEditText('');
                  setCurrentEditId(null);
                  setModalDepartment('All');
                  setIsModalOpen(true);
                }}
                className="bg-[#6237A0] text-white px-3 py-1.5 rounded-lg text-xs hover:bg-[#552C8C] transition-colors whitespace-nowrap font-medium"
              >
                + Add Macro
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-hidden">
            <div className="rounded-lg shadow-sm h-full grid-layout" style={{ backgroundColor: 'var(--card-bg)' }}>

              {/* Left Sidebar - Department Filter */}
              <DepartmentSidebar
                departments={departments}
                selectedDepartment={selectedDepartment}
                onSelectDepartment={setSelectedDepartment}
                searchQuery={departmentSearchQuery}
                onSearchChange={setDepartmentSearchQuery}
                loading={loading}
                isDark={isDark}
                isMobile={isMobile}
                showMobileFilter={showMobileDeptFilter}
                onToggleMobile={() => setShowMobileDeptFilter(!showMobileDeptFilter)}
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

                    {/* Macros Table */}
                    <div className="flex-1 overflow-hidden flex flex-col">
                      <MacroTable
                        macros={paginatedReplies}
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

                      {/* Pagination Controls */}
                      {!loading && !error && sortedReplies.length > 0 && (
                        <div className="mt-3 flex flex-col gap-2">
                          {/* Pagination */}
                          {totalPages > 1 && (
                            <div className="flex justify-center">
                              <Pagination>
                                <PaginationContent>
                                  <PaginationItem>
                                    <PaginationPrevious
                                      onClick={() => setCurrentPage(currentPage - 1)}
                                      disabled={!hasPreviousPage}
                                      isDark={isDark}
                                    />
                                  </PaginationItem>

                                  {paginationRange?.map((pageNumber, index) => {
                                    if (pageNumber === 'DOTS') {
                                      return (
                                        <PaginationItem key={`dots-${index}`}>
                                          <PaginationEllipsis />
                                        </PaginationItem>
                                      );
                                    }

                                    return (
                                      <PaginationItem key={pageNumber}>
                                        <PaginationLink
                                          onClick={() => setCurrentPage(pageNumber)}
                                          isActive={currentPage === pageNumber}
                                          isDark={isDark}
                                        >
                                          {pageNumber}
                                        </PaginationLink>
                                      </PaginationItem>
                                    );
                                  })}

                                  <PaginationItem>
                                    <PaginationNext
                                      onClick={() => setCurrentPage(currentPage + 1)}
                                      disabled={!hasNextPage}
                                      isDark={isDark}
                                    />
                                  </PaginationItem>
                                </PaginationContent>
                              </Pagination>
                            </div>
                          )}

                          {/* Page info and items per page selector */}
                          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                            <div className="flex items-center gap-2">
                              <span>Show</span>
                              <select
                                value={itemsPerPage}
                                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                                className="px-2 py-1 text-xs rounded border focus:outline-none focus:ring-2 focus:ring-[#6237A0]/30"
                                style={{
                                  backgroundColor: 'var(--input-bg)',
                                  color: 'var(--text-primary)',
                                  borderColor: 'var(--border-color)'
                                }}
                              >
                                <option value="10">10</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                              </select>
                              <span>per page</span>
                            </div>
                            
                            <div>
                              Showing {startIndex + 1} to {Math.min(endIndex, sortedReplies.length)} of {sortedReplies.length} macros
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
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
      </ScreenContainer>
    </Layout>
  );
}
