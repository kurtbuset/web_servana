import { useCallback } from 'react';

/**
 * useChatHandlers - Event handlers for ChatsScreen
 * Handles UI interactions and user actions
 */
export const useChatHandlers = ({
  canTransfer,
  canEndChat,
  canMessage,
  isMobile,
  allDepartments,
  textareaRef,
  setOpenDropdown,
  setShowTransferModal,
  setTransferDepartment,
  selectedDepartment,
  setShowTransferConfirmModal,
  setShowEndChatModal,
  setInputMessage,
  setView,
  setShowProfilePanel,
  selectCustomer,
  sendMessage,
  endChat,
  transferChat,
}) => {
  const handleTransferClick = useCallback(() => {
    if (!canTransfer) return;
    setOpenDropdown(null);
    setShowTransferModal(true);
    setTransferDepartment(selectedDepartment);
  }, [canTransfer, selectedDepartment, setOpenDropdown, setShowTransferModal, setTransferDepartment]);

  const handleDepartmentSelect = useCallback(() => {
    setShowTransferModal(false);
    setShowTransferConfirmModal(true);
  }, [setShowTransferModal, setShowTransferConfirmModal]);

  const confirmTransfer = useCallback(async (transferDepartment) => {
    setShowTransferConfirmModal(false);
    const selectedDept = allDepartments.find(dept => dept.dept_name === transferDepartment);
    if (selectedDept) {
      const success = await transferChat(selectedDept.dept_id);
      if (success && isMobile) setView("chatList");
    }
  }, [allDepartments, transferChat, isMobile, setView, setShowTransferConfirmModal]);

  const cancelTransfer = useCallback(() => {
    setShowTransferModal(false);
    setTransferDepartment(null);
  }, [setShowTransferModal, setTransferDepartment]);

  const cancelTransferConfirm = useCallback(() => {
    setShowTransferConfirmModal(false);
  }, [setShowTransferConfirmModal]);

  const handleEndChat = useCallback(() => {
    if (!canEndChat) return;
    setOpenDropdown(null);
    setShowEndChatModal(true);
  }, [canEndChat, setOpenDropdown, setShowEndChatModal]);

  const confirmEndChat = useCallback(() => {
    setShowEndChatModal(false);
    endChat();
    if (isMobile) setView("chatList");
  }, [endChat, isMobile, setView, setShowEndChatModal]);

  const cancelEndChat = useCallback(() => {
    setShowEndChatModal(false);
  }, [setShowEndChatModal]);

  const handleInputChange = useCallback((e) => {
    setInputMessage(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [setInputMessage, textareaRef]);

  const handleSendMessage = useCallback(() => {
    if (!canMessage) return;
    sendMessage();
  }, [canMessage, sendMessage]);

  const handleChatClick = useCallback(async (customer) => {
    await selectCustomer(customer);
    if (isMobile) setView("conversation");
  }, [selectCustomer, isMobile, setView]);

  const handleBackClick = useCallback(() => {
    setView("chatList");
  }, [setView]);

  const handleProfileClick = useCallback(() => {
    setShowProfilePanel(true);
  }, [setShowProfilePanel]);

  const handleCloseProfile = useCallback(() => {
    setShowProfilePanel(false);
  }, [setShowProfilePanel]);

  return {
    handleTransferClick,
    handleDepartmentSelect,
    confirmTransfer,
    cancelTransfer,
    cancelTransferConfirm,
    handleEndChat,
    confirmEndChat,
    cancelEndChat,
    handleInputChange,
    handleSendMessage,
    handleChatClick,
    handleBackClick,
    handleProfileClick,
    handleCloseProfile,
  };
};
