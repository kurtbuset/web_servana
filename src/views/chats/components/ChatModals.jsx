import ConfirmDialog from "../../../components/chat/ConfirmDialog";
import TransferModal from "../../../components/chat/TransferModal";

/**
 * ChatModals - All modal dialogs for the chat interface
 */
export default function ChatModals({
  showEndChatModal,
  showTransferModal,
  showTransferConfirmModal,
  allDepartments,
  transferDepartment,
  selectedDepartment,
  onConfirmEndChat,
  onCancelEndChat,
  onDepartmentChange,
  onConfirmTransfer,
  onCancelTransfer,
  onConfirmTransferConfirm,
  onCancelTransferConfirm,
}) {
  return (
    <>
      {/* End Chat Modal */}
      <ConfirmDialog
        isOpen={showEndChatModal}
        title="End Chat"
        message="Are you sure you want to end this chat session?"
        onConfirm={onConfirmEndChat}
        onCancel={onCancelEndChat}
        confirmText="Confirm"
        confirmButtonClass="bg-red-500 hover:bg-red-600"
      />

      {/* Transfer Modal */}
      <TransferModal
        isOpen={showTransferModal}
        departments={allDepartments.map(dept => dept.dept_name)}
        selectedDepartment={transferDepartment}
        currentDepartment={selectedDepartment}
        onDepartmentChange={onDepartmentChange}
        onConfirm={onConfirmTransfer}
        onCancel={onCancelTransfer}
      />

      {/* Transfer Confirm Modal */}
      <ConfirmDialog
        isOpen={showTransferConfirmModal}
        title="Confirm Transfer"
        message={`Are you sure you want to transfer this customer to ${transferDepartment}?`}
        onConfirm={onConfirmTransferConfirm}
        onCancel={onCancelTransferConfirm}
      />
    </>
  );
}
