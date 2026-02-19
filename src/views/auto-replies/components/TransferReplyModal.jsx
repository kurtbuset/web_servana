import Modal from '../../../components/Modal';
import UnsavedChangesBar from '../../../components/UnsavedChangesBar';

/**
 * TransferReplyModal - Modal for transferring a reply to another department
 */
export default function TransferReplyModal({
  isOpen,
  transferToDept,
  allDepartments,
  hasUnsavedChanges,
  shakeBar,
  isDark,
  onDepartmentChange,
  onTransfer,
  onReset,
  onClose
}) {
  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Transfer Reply"
        isDark={isDark}
        actions={[
          {
            label: 'Cancel',
            onClick: onClose,
            variant: 'secondary'
          },
          {
            label: 'Transfer',
            onClick: onTransfer,
            variant: 'primary'
          }
        ]}
      >
        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
          Transfer to Department
        </label>
        <select
          className="w-full rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#6237A0]/30 focus:border-[#6237A0]"
          style={{
            backgroundColor: 'var(--input-bg)',
            color: 'var(--text-primary)',
            border: `1px solid var(--border-color)`
          }}
          value={transferToDept}
          onChange={(e) => onDepartmentChange(e.target.value)}
        >
          <option value="All">@everyone</option>
          {allDepartments && allDepartments.length > 0 && allDepartments.map((dept) => (
            <option
              key={dept.dept_id}
              value={dept.dept_id.toString()}
              disabled={!dept.dept_is_active}
            >
              {dept.dept_name}
              {!dept.dept_is_active && ' (Inactive)'}
            </option>
          ))}
        </select>
      </Modal>

      <UnsavedChangesBar
        show={hasUnsavedChanges}
        onReset={onReset}
        onSave={onTransfer}
        shake={shakeBar}
      />
    </>
  );
}
