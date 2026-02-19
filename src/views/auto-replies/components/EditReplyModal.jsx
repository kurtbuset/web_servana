import Modal from '../../../components/Modal';

/**
 * EditReplyModal - Modal for editing an existing auto-reply
 */
export default function EditReplyModal({
  isOpen,
  editText,
  isDark,
  onTextChange,
  onSave,
  onClose
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Reply"
      isDark={isDark}
      actions={[
        {
          label: 'Cancel',
          onClick: onClose,
          variant: 'secondary'
        },
        {
          label: 'Save Changes',
          onClick: onSave,
          variant: 'primary',
          disabled: !editText.trim()
        }
      ]}
    >
      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
        Message
      </label>
      <textarea
        value={editText}
        onChange={(e) => onTextChange(e.target.value)}
        className="w-full rounded-lg px-3 py-2.5 text-sm h-32 focus:outline-none focus:ring-2 focus:ring-[#6237A0]/30 focus:border-[#6237A0]"
        style={{
          backgroundColor: 'var(--input-bg)',
          color: 'var(--text-primary)',
          border: `1px solid var(--border-color)`
        }}
        placeholder="Enter reply message..."
        autoFocus
      />
    </Modal>
  );
}
