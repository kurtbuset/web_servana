import { Eye, EyeOff } from "react-feather";

/**
 * AddAgentModal Component
 * Modal for adding a new agent with email and password
 * 
 * @param {Object} editForm - Form state with email and password
 * @param {Function} setEditForm - Function to update form state
 * @param {boolean} showPassword - Whether to show password in plain text
 * @param {Function} setShowPassword - Function to toggle password visibility
 * @param {string} modalError - Error message to display
 * @param {Function} setModalError - Function to clear error message
 * @param {Function} onClose - Function to close the modal
 * @param {Function} onSave - Function to save the new agent
 * @param {boolean} isDark - Dark mode flag
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
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4">
      <div className="rounded-lg p-5 sm:p-6 w-full max-w-md" style={{ backgroundColor: 'var(--card-bg)' }}>
        <h2 className="text-lg sm:text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          Add Agent
        </h2>
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
        <div className="relative mb-5">
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

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 rounded-lg font-medium transition-colors"
            style={{ 
              backgroundColor: isDark ? '#4a4a4a' : '#e5e7eb',
              color: 'var(--text-primary)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = isDark ? '#5a5a5a' : '#d1d5db';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = isDark ? '#4a4a4a' : '#e5e7eb';
            }}
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={!editForm.email.trim() || !editForm.password.trim()}
            className={`w-full sm:w-auto px-4 py-2 rounded-lg font-medium transition-colors ${
              editForm.email.trim() && editForm.password.trim()
                ? "bg-[#6237A0] text-white hover:bg-[#552C8C]"
                : "cursor-not-allowed"
            }`}
            style={!(editForm.email.trim() && editForm.password.trim()) ? {
              backgroundColor: isDark ? '#4a4a4a' : '#d1d5db',
              color: isDark ? '#9ca3af' : '#6b7280'
            } : {}}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
