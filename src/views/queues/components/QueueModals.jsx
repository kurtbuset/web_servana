import ConfirmDialog from "../../../components/chat/ConfirmDialog";
import TransferModal from "../../../components/chat/TransferModal";

/**
 * QueueModals - All modal dialogs for the queue interface
 */
export default function QueueModals({
  showEndChatModal,
  showTransferModal,
  showTransferConfirmModal,
  departments,
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
        departments={departments}
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
