import { Eye, EyeOff, X } from "react-feather";

/**
 * AddEditAdminModal - Modal for adding or editing administrators
 */
export default function AddEditAdminModal({
  isOpen,
  isEdit,
  email,
  password,
  showPassword,
  error,
  isDark,
  onEmailChange,
  onPasswordChange,
  onTogglePassword,
  onSave,
  onClose
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
      <div className="rounded-lg shadow-xl p-5 sm:p-6 w-full max-w-md" style={{ backgroundColor: 'var(--card-bg)' }}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg sm:text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
            {isEdit ? "Edit Admin" : "Add Admin"}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded transition-colors"
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = isDark ? 'rgba(139, 92, 246, 0.05)' : 'rgba(249, 250, 251, 1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 px-3 sm:px-4 py-2.5 rounded-lg mb-4 text-sm font-medium border border-red-200">
            {error}
          </div>
        )}

        <label className="block mb-4">
          <span className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
            Email
          </span>
          <input
            type="email"
            className="w-full rounded-lg p-2.5 sm:p-3 text-sm focus:ring-2 focus:ring-[#6237A0] focus:border-transparent outline-none"
            style={{
              backgroundColor: 'var(--input-bg)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-color)'
            }}
            placeholder="admin@example.com"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            autoFocus
          />
        </label>

        <label className="block mb-5 relative">
          <span className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
            Password
          </span>
          <input
            type={showPassword ? "text" : "password"}
            className="w-full rounded-lg p-2.5 sm:p-3 pr-10 text-sm focus:ring-2 focus:ring-[#6237A0] focus:border-transparent outline-none"
            style={{
              backgroundColor: 'var(--input-bg)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-color)'
            }}
            placeholder="Enter password"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
          />
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-3 top-[38px] transition-colors"
            style={{ color: 'var(--text-secondary)' }}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </label>

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
            disabled={!email.trim() || !password.trim()}
            className={`w-full sm:w-auto px-4 py-2 rounded-lg font-medium transition-colors ${
              email.trim() && password.trim()
                ? "bg-[#6237A0] text-white hover:bg-[#552C8C]"
                : "cursor-not-allowed"
            }`}
            style={!(email.trim() && password.trim()) ? {
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
