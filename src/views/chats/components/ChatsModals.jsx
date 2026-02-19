import ConfirmDialog from "../../../components/chat/ConfirmDialog";
import TransferModal from "../../../components/chat/TransferModal";

/**
 * ChatsModals - All modal dialogs for ChatsScreen
 * 
 * Props grouped into 2 objects:
 * - state: Modal visibility and data state
 * - actions: All handlers and setters
 */
export default function ChatsModals({ state, actions }) {
  const {
    showEndChatModal,
    showTransferModal,
    showTransferConfirmModal,
    allDepartments,
    transferDepartment,
    selectedDepartment,
  } = state;

  const {
    confirmEndChat,
    cancelEndChat,
    setTransferDepartment,
    handleDepartmentSelect,
    confirmTransfer,
    cancelTransfer,
    cancelTransferConfirm,
  } = actions;
  return (
    <>
      {/* End Chat Modal */}
      <ConfirmDialog
        isOpen={showEndChatModal}
        title="End Chat"
        message="Are you sure you want to end this chat session?"
        onConfirm={confirmEndChat}
        onCancel={cancelEndChat}
        confirmText="Confirm"
        confirmButtonClass="bg-red-500 hover:bg-red-600"
      />

      {/* Transfer Modal */}
      <TransferModal
        isOpen={showTransferModal}
        departments={allDepartments.map(dept => dept.dept_name)}
        selectedDepartment={transferDepartment}
        currentDepartment={selectedDepartment}
        onDepartmentChange={setTransferDepartment}
        onConfirm={handleDepartmentSelect}
        onCancel={cancelTransfer}
      />

      {/* Transfer Confirm Modal */}
      <ConfirmDialog
        isOpen={showTransferConfirmModal}
        title="Confirm Transfer"
        message={`Are you sure you want to transfer this customer to ${transferDepartment}?`}
        onConfirm={confirmTransfer}
        onCancel={cancelTransferConfirm}
      />
    </>
  );
}
