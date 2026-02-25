import { useState, useEffect, useCallback } from 'react';
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
import { useAutoReplies } from '../../hooks/useAutoReplies';
import { useUser } from '../../context/UserContext';
import { useTheme } from '../../context/ThemeContext';
import { useUnsavedChanges } from '../../context/UnsavedChangesContext';
import toast from '../../utils/toast';
import DepartmentSidebar from './components/DepartmentSidebar';
import MobileDepartmentFilter from './components/MobileDepartmentFilter';
import AutoReplyTable from './components/AutoReplyTable';
import EditReplyModal from './components/EditReplyModal';
import AddReplyModal from './components/AddReplyModal';
import TransferReplyModal from './components/TransferReplyModal';
import DeleteReplyModal from './components/DeleteReplyModal';
import InfoNote from './components/InfoNote';
import { HelpCircle } from 'react-feather';
import '../../App.css';
import '../../styles/GridLayout.css';

export default function AutoRepliesScreen() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editText, setEditText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentSearchQuery, setDepartmentSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [modalDepartment, setModalDepartment] = useState('All');
  const [editingReplyId, setEditingReplyId] = useState(null);
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedReplyId, setSelectedReplyId] = useState(null);
  const [transferToDept, setTransferToDept] = useState('');
  const [originalTransferDept, setOriginalTransferDept] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showMobileDeptFilter, setShowMobileDeptFilter] = useState(false);
  const [shakeBar, setShakeBar] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState('default');

  const { userData, hasPermission, getUserId } = useUser();
  const currentUserId = getUserId();
  const { isDark } = useTheme();
  const { setHasUnsavedChanges: setGlobalUnsavedChanges, setOnNavigationBlocked } = useUnsavedChanges();
  const canEditAutoReplies = hasPermission("priv_can_manage_auto_reply");
  const {
    replies,
    allDepartments,
    loading,
    error,
    createAutoReply,
    updateAutoReply,
    toggleAutoReply,
    updateDepartment,
    deleteAutoReply,
  } = useAutoReplies();

  const triggerShake = useCallback(() => {
    setShakeBar(prev => prev + 1);
  }, []);

  // Set up the navigation blocked callback
  useEffect(() => {
    setOnNavigationBlocked(triggerShake);
  }, [setOnNavigationBlocked, triggerShake]);

  // Sync local unsaved changes with global context
  useEffect(() => {
    setGlobalUnsavedChanges(hasUnsavedChanges);
  }, [hasUnsavedChanges, setGlobalUnsavedChanges]);

  // Filter replies based on search and selected department
  const filteredReplies = replies.filter((reply) => {
    const matchesSearch = reply.auto_reply_message
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    
    // Filter by department
    const matchesDepartment = 
      selectedDepartment === 'All' 
        ? reply.dept_id === null
        : reply.dept_id === allDepartments.find((d) => d.dept_name === selectedDepartment)?.dept_id;
    
    return matchesSearch && matchesDepartment;
  });

  // Sort filtered replies
  const sortedReplies = [...filteredReplies].sort((a, b) => {
    switch (sortBy) {
      case 'alphabetical':
        return (a.auto_reply_message || '').toLowerCase().localeCompare((b.auto_reply_message || '').toLowerCase());
      case 'reverse':
        return (b.auto_reply_message || '').toLowerCase().localeCompare((a.auto_reply_message || '').toLowerCase());
      case 'default':
      default:
        return b.auto_reply_id - a.auto_reply_id; // Newest first
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

  // Get current page replies
  const paginatedReplies = sortedReplies.slice(startIndex, endIndex);

  // Reset to page 1 when search query, department, sort, or items per page changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedDepartment, sortBy, itemsPerPage]);

  const handleSaveEdit = async () => {
    if (!canEditAutoReplies) {
      console.warn("User does not have permission to edit auto-replies");
      toast.error("You don't have permission to edit auto-replies");
      return;
    }
    
    if (!editingReplyId || !userData?.sys_user_id) return;

    const success = await updateAutoReply(
      editingReplyId,
      editText,
      undefined,
      userData.sys_user_id
    );

    if (success) {
      setIsEditModalOpen(false);
      setEditText("");
      setEditingReplyId(null);
    }
  };

  const handleSaveAdd = async () => {
    if (!canEditAutoReplies) {
      console.warn("User does not have permission to edit auto-replies");
      toast.error("You don't have permission to edit auto-replies");
      return;
    }
    
    if (!currentUserId) return;

    const selectedDept = allDepartments.find(
      (dept) => dept.dept_name === modalDepartment
    );
    const dept_id = modalDepartment === 'All' ? null : selectedDept?.dept_id;

    const success = await createAutoReply(
      editText,
      dept_id,
      currentUserId
    );

    if (success) {
      setIsAddModalOpen(false);
      setEditText("");
      setModalDepartment('All');
    }
  };

  const handleStatusToggle = async (id, currentActive) => {
    if (!canEditAutoReplies) {
      console.warn("User does not have permission to edit auto-replies");
      toast.error("You don't have permission to edit auto-replies");
      return;
    }
    
    if (!userData?.sys_user_id) return;
    await toggleAutoReply(id, currentActive, userData.sys_user_id);
  };

  const handleTransferReply = async () => {
    if (selectedReplyId && transferToDept !== '') {
      const dept_id = transferToDept === 'All' ? null : parseInt(transferToDept);
      const success = await updateDepartment(selectedReplyId, dept_id, currentUserId);
      if (success) {
        setTransferModalOpen(false);
        setSelectedReplyId(null);
        setTransferToDept('');
        setOriginalTransferDept('');
        setHasUnsavedChanges(false);
      }
    }
  };

  const handleTransferDeptChange = (newDept) => {
    setTransferToDept(newDept);
    setHasUnsavedChanges(newDept !== originalTransferDept);
  };

  const handleResetTransfer = () => {
    setTransferToDept(originalTransferDept);
    setHasUnsavedChanges(false);
  };

  const handleCloseTransferModal = () => {
    setTransferModalOpen(false);
    setSelectedReplyId(null);
    setTransferToDept('');
    setOriginalTransferDept('');
    setHasUnsavedChanges(false);
  };

  const handleDeleteReply = async () => {
    if (selectedReplyId) {
      const success = await deleteAutoReply(selectedReplyId, currentUserId);
      if (success) {
        setDeleteModalOpen(false);
        setSelectedReplyId(null);
      }
    }
  };

  const openEditModal = (reply) => {
    if (!canEditAutoReplies) {
      console.warn("User does not have permission to edit auto-replies");
      toast.error("You don't have permission to edit auto-replies");
      return;
    }
    
    setEditText(reply.auto_reply_message);
    setEditingReplyId(reply.auto_reply_id);
    setIsEditModalOpen(true);
  };

  const openAddModal = () => {
    if (!canEditAutoReplies) {
      console.warn("User does not have permission to edit auto-replies");
      toast.error("You don't have permission to edit auto-replies");
      return;
    }
    
    setEditText("");
    setModalDepartment('All');
    setIsAddModalOpen(true);
  };

  const handleOpenTransferModal = (reply) => {
    setSelectedReplyId(reply.auto_reply_id);
    const initialDept = reply.dept_id?.toString() || 'All';
    setTransferToDept(initialDept);
    setOriginalTransferDept(initialDept);
    setHasUnsavedChanges(false);
    setTransferModalOpen(true);
  };

  const handleOpenDeleteModal = (replyId) => {
    setSelectedReplyId(replyId);
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setSelectedReplyId(null);
  };

  return (
    <Layout>
      <ScreenContainer>
        <div className="p-3 sm:p-4 flex flex-col h-full overflow-hidden">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="relative flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold relative inline-block" style={{ color: 'var(--text-primary)' }}>
                Auto Replies
                <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-[#6237A0] via-[#8B5CF6] to-transparent rounded-full"></div>
              </h1>
              <Tooltip 
                content="Set up automated responses for common inquiries. Create, edit, and manage auto-replies that can be assigned to specific departments or used across all departments."
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
                onClick={openAddModal}
                disabled={!canEditAutoReplies}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                  canEditAutoReplies
                    ? "bg-[#6237A0] text-white hover:bg-[#552C8C]"
                    : "cursor-not-allowed"
                }`}
                style={!canEditAutoReplies ? {
                  backgroundColor: isDark ? '#4a4a4a' : '#d1d5db',
                  color: isDark ? '#9ca3af' : '#6b7280'
                } : {}}
              >
                + Add Reply
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-hidden">
            <div className="rounded-lg shadow-sm h-full grid-layout" style={{ backgroundColor: 'var(--card-bg)' }}>
              {/* Mobile Department Filter */}
              <MobileDepartmentFilter
                allDepartments={allDepartments}
                selectedDepartment={selectedDepartment}
                departmentSearchQuery={departmentSearchQuery}
                showMobileDeptFilter={showMobileDeptFilter}
                isDark={isDark}
                onToggle={() => setShowMobileDeptFilter(!showMobileDeptFilter)}
                onSelectDepartment={setSelectedDepartment}
                onSearchChange={setDepartmentSearchQuery}
              />

              {/* Desktop Department Sidebar */}
              <DepartmentSidebar
                allDepartments={allDepartments}
                selectedDepartment={selectedDepartment}
                departmentSearchQuery={departmentSearchQuery}
                loading={loading}
                isDark={isDark}
                onSelectDepartment={setSelectedDepartment}
                onSearchChange={setDepartmentSearchQuery}
              />

              {/* Main Content */}
              <div className="grid-content overflow-hidden p-2">
                <div className="flex flex-col h-full">
                  {/* Info Note and Search Bar Row */}
                  <div className="mb-2 flex flex-col md:flex-row gap-2">
                    <InfoNote selectedDepartment={selectedDepartment} isDark={isDark} />

                    {/* Search Bar - 40% on desktop, full width on mobile */}
                    <SearchBar
                      value={searchQuery}
                      onChange={setSearchQuery}
                      placeholder="Search replies..."
                      isDark={isDark}
                      className="md:flex-[0.4]"
                    />
                  </div>

                  {/* Auto Replies Table */}
                  <div className="flex-1 overflow-hidden flex flex-col">
                    <AutoReplyTable
                      replies={paginatedReplies}
                      allDepartments={allDepartments}
                      loading={loading}
                      error={error}
                      searchQuery={searchQuery}
                      sortBy={sortBy}
                      onSortChange={setSortBy}
                      isDark={isDark}
                      onEdit={openEditModal}
                      onToggleStatus={handleStatusToggle}
                      onTransfer={handleOpenTransferModal}
                      onDelete={handleOpenDeleteModal}
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
                            Showing {startIndex + 1} to {Math.min(endIndex, sortedReplies.length)} of {sortedReplies.length} replies
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Modals */}
          <EditReplyModal
            isOpen={isEditModalOpen}
            editText={editText}
            isDark={isDark}
            onTextChange={setEditText}
            onSave={handleSaveEdit}
            onClose={() => {
              setIsEditModalOpen(false);
              setEditText("");
              setEditingReplyId(null);
            }}
          />

          <AddReplyModal
            isOpen={isAddModalOpen}
            editText={editText}
            modalDepartment={modalDepartment}
            allDepartments={allDepartments}
            isDark={isDark}
            onTextChange={setEditText}
            onDepartmentChange={setModalDepartment}
            onSave={handleSaveAdd}
            onClose={() => {
              setIsAddModalOpen(false);
              setEditText("");
              setModalDepartment('All');
            }}
          />

          {transferModalOpen && (
            <TransferReplyModal
              isOpen={true}
              transferToDept={transferToDept}
              allDepartments={allDepartments}
              hasUnsavedChanges={hasUnsavedChanges}
              shakeBar={shakeBar}
              isDark={isDark}
              onDepartmentChange={handleTransferDeptChange}
              onTransfer={handleTransferReply}
              onReset={handleResetTransfer}
              onClose={handleCloseTransferModal}
            />
          )}

          <DeleteReplyModal
            isOpen={deleteModalOpen}
            isDark={isDark}
            onDelete={handleDeleteReply}
            onClose={handleCloseDeleteModal}
          />
        </div>
      </ScreenContainer>
    </Layout>
  );
}
