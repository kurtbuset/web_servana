/**
 * PermissionToggle Component
 * Custom toggle switch for enabling/disabling permissions
 * 
 * @param {string} state - "enabled" or "disabled"
 * @param {Function} onChange - Handler for toggle change
 * @param {boolean} disabled - Whether the toggle is disabled
 */
export default function PermissionToggle({ state, onChange, disabled }) {
  const isEnabled = state === "enabled";
  
  return (
    <button
      onClick={() => !disabled && onChange()}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#6237A0] focus:ring-offset-2 ${
        disabled
          ? "cursor-not-allowed opacity-50 bg-gray-300"
          : isEnabled
          ? "bg-[#6237A0]"
          : "bg-gray-400"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
          isEnabled ? "translate-x-6" : "translate-x-1"
        }`}
      >
        <span className="flex items-center justify-center h-full w-full">
          {isEnabled ? (
            <svg className="h-3 w-3 text-[#6237A0]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="h-3 w-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          )}
        </span>
      </span>
    </button>
  );
}
