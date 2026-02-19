import { useState, useEffect, useCallback } from 'react';
import Layout from '../../components/Layout';
import ScreenContainer from '../../components/ScreenContainer';
import SearchBar from '../../components/SearchBar';
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
            <div className="relative">
              <h1 className="text-lg sm:text-xl font-bold relative inline-block" style={{ color: 'var(--text-primary)' }}>
                Auto Replies
                <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-[#6237A0] via-[#8B5CF6] to-transparent rounded-full"></div>
              </h1>
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
                  <AutoReplyTable
                    replies={filteredReplies}
                    allDepartments={allDepartments}
                    loading={loading}
                    error={error}
                    searchQuery={searchQuery}
                    isDark={isDark}
                    onEdit={openEditModal}
                    onToggleStatus={handleStatusToggle}
                    onTransfer={handleOpenTransferModal}
                    onDelete={handleOpenDeleteModal}
                  />
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
