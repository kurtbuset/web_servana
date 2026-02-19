import Modal from '../../../components/Modal';

/**
 * DeleteReplyModal - Confirmation modal for deleting an auto-reply
 */
export default function DeleteReplyModal({
  isOpen,
  isDark,
  onDelete,
  onClose
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Reply"
      isDark={isDark}
      actions={[
        {
          label: 'Cancel',
          onClick: onClose,
          variant: 'secondary'
        },
        {
          label: 'Delete',
          onClick: onDelete,
          variant: 'danger'
        }
      ]}
    >
      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
        Are you sure you want to delete this auto-reply? This action cannot be undone.
      </p>
    </Modal>
  );
}
