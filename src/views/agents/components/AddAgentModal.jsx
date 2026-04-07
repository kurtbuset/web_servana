import { Eye, EyeOff } from "react-feather";
import Modal from "../../../components/Modal";

/**
 * AddAgentModal - Modal for adding a new agent with email and password
 */
export default function AddAgentModal({
  editForm,
  setEditForm,
  showPassword,
  setShowPassword,
  modalError,
  setModalError,
  onClose,
  onSave,
  isDark
}) {
  return (
    <Modal
      isOpen
      onClose={onClose}
      title="Add Agent"
      isDark={isDark}
      actions={[
        { label: 'Cancel', onClick: onClose, variant: 'secondary' },
        {
          label: 'Save',
          onClick: onSave,
          variant: 'primary',
          disabled: !editForm.email.trim() || !editForm.password.trim(),
        },
      ]}
    >
      {modalError && (
        <div className="bg-red-50 text-red-700 px-3 sm:px-4 py-2.5 rounded-lg mb-4 text-sm font-medium border border-red-200">
          {modalError}
        </div>
      )}

      <label className="block mb-2 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
        Email
      </label>
      <input
        type="email"
        value={editForm.email}
        onChange={(e) => {
          setEditForm({ ...editForm, email: e.target.value });
          if (modalError) setModalError(null);
        }}
        placeholder="agent@example.com"
        className="w-full mb-4 px-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6237A0] focus:border-transparent"
        style={{
          backgroundColor: 'var(--input-bg)',
          color: 'var(--text-primary)',
          border: `1px solid var(--border-color)`
        }}
        autoFocus
      />

      <label className="block mb-2 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
        Password
      </label>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          value={editForm.password}
          onChange={(e) => {
            setEditForm({ ...editForm, password: e.target.value });
            if (modalError) setModalError(null);
          }}
          placeholder="Enter password"
          className="w-full px-3 py-2.5 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6237A0] focus:border-transparent"
          style={{
            backgroundColor: 'var(--input-bg)',
            color: 'var(--text-primary)',
            border: `1px solid var(--border-color)`
          }}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute top-1/2 -translate-y-1/2 right-3 hover:text-gray-700 transition-colors"
          style={{ color: 'var(--text-secondary)' }}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </Modal>
  );
}
