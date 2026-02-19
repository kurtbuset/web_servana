import Modal from '../../../components/Modal';

/**
 * AddReplyModal - Modal for adding a new auto-reply
 */
export default function AddReplyModal({
  isOpen,
  editText,
  modalDepartment,
  allDepartments,
  isDark,
  onTextChange,
  onDepartmentChange,
  onSave,
  onClose
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Reply"
      isDark={isDark}
      actions={[
        {
          label: 'Cancel',
          onClick: onClose,
          variant: 'secondary'
        },
        {
          label: 'Create Reply',
          onClick: onSave,
          variant: 'primary',
          disabled: !editText.trim()
        }
      ]}
    >
      <div className="mb-4">
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
      </div>

      <div>
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
          onChange={(e) => onDepartmentChange(e.target.value)}
        >
          <option value="All">@everyone</option>
          {allDepartments && allDepartments.length > 0 && allDepartments.map((dept) => (
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
    </Modal>
  );
}
