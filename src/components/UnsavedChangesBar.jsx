import { useTheme } from '../context/ThemeContext';

/**
 * UnsavedChangesBar - A reusable bottom notification bar for unsaved changes
 * 
 * @param {Object} props
 * @param {boolean} props.show - Whether to show the bar
 * @param {Function} props.onReset - Callback when reset button is clicked
 * @param {Function} props.onSave - Callback when save button is clicked
 * @param {string} props.message - Custom message to display (default: "Careful — you have unsaved changes!")
 * @param {string} props.resetText - Custom text for reset button (default: "Reset")
 * @param {string} props.saveText - Custom text for save button (default: "Save Changes")
 * @param {string} props.saveTextMobile - Custom text for save button on mobile (default: "Save")
 * @param {string} props.variant - Color variant: 'default', 'warning', 'danger' (default: 'default')
 * @param {string} props.position - Position: 'bottom', 'top' (default: 'bottom')
 * @param {boolean} props.fullWidth - Whether to take full width (default: false)
 * @param {boolean} props.isSaving - Whether save is in progress (shows loading state)
 * @param {string} props.savingText - Text to show when saving (default: "Saving...")
 * @param {string} props.savingTextMobile - Text to show when saving on mobile (default: "Save...")
 * @param {boolean} props.shake - Trigger shake animation (increment to trigger)
 * 
 * @example
 * <UnsavedChangesBar
 *   show={hasChanges}
 *   onReset={handleReset}
 *   onSave={handleSave}
 * />
 * 
 * @example
 * <UnsavedChangesBar
 *   show={hasChanges}
 *   onReset={handleReset}
 *   onSave={handleSave}
 *   isSaving={isSaving}
 *   shake={shakeCount}
 * />
 */
const UnsavedChangesBar = ({
  show = false,
  onReset,
  onSave,
  message = "Careful — you have unsaved changes!",
  resetText = "Reset",
  saveText = "Save Changes",
  saveTextMobile = "Save",
  savingText = "Saving...",
  savingTextMobile = "Save...",
  variant = 'default',
  position = 'bottom',
  fullWidth = false,
  isSaving = false,
  shake = 0,
}) => {
  const { isDark } = useTheme();

  if (!show) return null;

  // Variant colors
  const variants = {
    default: {
      bg: isDark ? '#111214' : '#2b2d31',
      border: isDark ? '#1e1f22' : '#3f4147',
      saveBtn: '#248046',
      saveBtnHover: '#1a5c34',
    },
    warning: {
      bg: isDark ? '#2d2416' : '#fef3c7',
      border: isDark ? '#3d3420' : '#fde68a',
      saveBtn: '#d97706',
      saveBtnHover: '#b45309',
    },
    danger: {
      bg: isDark ? '#2d1616' : '#fee2e2',
      border: isDark ? '#3d2020' : '#fecaca',
      saveBtn: '#dc2626',
      saveBtnHover: '#b91c1c',
    },
  };

  const colors = variants[variant] || variants.default;

  const positionClass = position === 'top' ? 'top-0' : 'bottom-0';

  return (
    <>
      <style>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        .slide-up-animation {
          animation: slideUp 0.3s ease-out;
        }
        
        .shake-animation {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
      
      <div 
        className={`fixed ${positionClass} left-0 right-0 z-[9999] flex justify-center px-2 sm:px-4 ${position === 'bottom' ? 'pb-2 sm:pb-4' : 'pt-2 sm:pt-4'} pointer-events-none slide-up-animation`}
      >
        <div 
          key={shake}
          className={`rounded-lg shadow-2xl px-3 sm:px-4 py-2.5 sm:py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 pointer-events-auto ${fullWidth ? 'w-full' : 'max-w-2xl w-full'} ${shake > 0 ? 'shake-animation' : ''}`}
          style={{ 
            backgroundColor: colors.bg,
            border: `1px solid ${colors.border}`,
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.24)'
          }}
        >
          <span 
            className="text-xs sm:text-sm font-medium"
            style={{ color: '#f2f3f5' }}
          >
            {message}
          </span>

          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            {onReset && (
              <button
                onClick={onReset}
                disabled={isSaving}
                className="text-xs sm:text-sm font-medium transition-colors flex-1 sm:flex-none py-2 sm:py-0"
                style={{ color: '#f2f3f5' }}
                onMouseEnter={(e) => {
                  if (!isSaving) {
                    e.currentTarget.style.textDecoration = 'underline';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSaving) {
                    e.currentTarget.style.textDecoration = 'none';
                  }
                }}
              >
                {resetText}
              </button>
            )}
            
            <button
              onClick={onSave}
              disabled={isSaving}
              className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded transition-colors text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 flex-1 sm:flex-none"
              style={{ 
                backgroundColor: colors.saveBtn,
                minWidth: '100px',
                maxWidth: '100%'
              }}
              onMouseEnter={(e) => {
                if (!isSaving) {
                  e.currentTarget.style.backgroundColor = colors.saveBtnHover;
                }
              }}
              onMouseLeave={(e) => {
                if (!isSaving) {
                  e.currentTarget.style.backgroundColor = colors.saveBtn;
                }
              }}
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-2 border-white border-t-transparent"></div>
                  <span className="hidden sm:inline">{savingText}</span>
                  <span className="sm:hidden">{savingTextMobile}</span>
                </>
              ) : (
                <>
                  <span className="hidden sm:inline">{saveText}</span>
                  <span className="sm:hidden">{saveTextMobile}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UnsavedChangesBar;
