/**
 * ConfirmDialog - Reusable confirmation modal
 * Used for end chat, transfer confirmations, etc.
 */
export default function ConfirmDialog({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmButtonClass = "bg-[#6237A0] hover:bg-[#4c2b7d]",
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-400/50 bg-opacity-10 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-center gap-20">
          <button
            onClick={onCancel}
            className="px-5 py-2 border rounded-lg text-white bg-[#BCBCBC] hover:bg-gray-500 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-5 py-2 text-white rounded-lg transition-colors ${confirmButtonClass}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
