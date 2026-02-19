import { useCallback } from 'react';
import { toast } from 'react-toastify';

/**
 * useQueuesHandlers - Event handlers for QueuesScreen
 * Handles UI interactions and user actions
 */
export const useQueuesHandlers = ({
  canTransfer,
  canEndChat,
  canMessage,
  isMobile,
  textareaRef,
  setOpenDropdown,
  setShowTransferModal,
  setTransferDepartment,
  selectedDepartment,
  setShowTransferConfirmModal,
  setShowEndChatModal,
  setInputMessage,
  setView,
  selectCustomer,
  acceptChat,
  sendMessageAction,
  endChat,
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

  const confirmTransfer = useCallback((transferDepartment) => {
    setShowTransferConfirmModal(false);
    console.log(`Transferring to ${transferDepartment}`);
    alert(`Customer transferred to ${transferDepartment}`);
  }, [setShowTransferConfirmModal]);

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
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  }, [setInputMessage, textareaRef]);

  const sendMessage = useCallback(() => {
    if (!canMessage) return;
    
    const trimmedMessage = textareaRef.current.value.replace(/\n+$/, "");
    if (!trimmedMessage.trim()) return;

    sendMessageAction(trimmedMessage);
    setInputMessage("");
  }, [canMessage, sendMessageAction, setInputMessage, textareaRef]);

  const handleChatClick = useCallback(async (customer) => {
    await selectCustomer(customer);
    if (isMobile) setView("conversation");
  }, [selectCustomer, isMobile, setView]);

  const handleAcceptChat = useCallback(async () => {
    const success = await acceptChat();
    if (success) {
      toast.success("Chat accepted! You can now communicate with the client.");
    } else {
      toast.error("Failed to accept chat. Please try again.");
    }
  }, [acceptChat]);

  const handleBackClick = useCallback(() => {
    setView("chatList");
  }, [setView]);

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
    sendMessage,
    handleChatClick,
    handleAcceptChat,
    handleBackClick,
  };
};
