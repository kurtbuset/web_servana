import { FiLogOut } from "react-icons/fi";

/**
 * LogoutConfirmModal - Confirmation modal for logout action
 */
export default function LogoutConfirmModal({ isOpen, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 sm:p-6 animate-fadeIn">
      <div 
        className="rounded-xl shadow-2xl p-6 sm:p-8 max-w-sm w-full transform transition-all animate-scaleIn"
        style={{ backgroundColor: 'var(--card-bg)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-red-100 mx-auto mb-5">
          <FiLogOut className="w-7 h-7 text-red-600" />
        </div>
        <h3 className="text-xl font-bold text-center mb-3" style={{ color: 'var(--text-primary)' }}>
          Confirm Logout
        </h3>
        <p className="text-sm text-center mb-8 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          Are you sure you want to log out? You'll need to sign in again to access your account.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-lg font-semibold transition-all hover:shadow-md active:scale-[0.98]"
            style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 rounded-lg font-semibold transition-all hover:shadow-md hover:bg-red-700 active:scale-[0.98]"
            style={{ backgroundColor: '#dc2626', color: 'white' }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
