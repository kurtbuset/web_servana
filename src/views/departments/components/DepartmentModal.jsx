import Modal from '../../../components/Modal';

/**
 * DepartmentModal - Modal for adding or editing departments
 */
export default function DepartmentModal({
  isOpen,
  isEdit,
  departmentName,
  canEditDepartment,
  isDark,
  onNameChange,
  onSave,
  onClose
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Edit Department" : "Add Department"}
      isDark={isDark}
      actions={[
        {
          label: 'Cancel',
          onClick: onClose,
          variant: 'secondary'
        },
        {
          label: 'Save',
          onClick: onSave,
          variant: 'primary',
          disabled: !canEditDepartment || !departmentName.trim()
        }
      ]}
    >
      <label className="text-sm mb-2 block font-medium" style={{ color: 'var(--text-primary)' }}>
        Department Name
      </label>
      <input
        type="text"
        value={departmentName}
        onChange={(e) => onNameChange(e.target.value)}
        placeholder="Enter department name"
        className="w-full border rounded-lg p-2.5 sm:p-3 text-sm focus:ring-2 focus:ring-[#6237A0] focus:border-transparent outline-none"
        style={{ 
          backgroundColor: 'var(--input-bg)', 
          borderColor: 'var(--border-color)',
          color: 'var(--text-primary)'
        }}
        autoFocus
      />
    </Modal>
  );
}
