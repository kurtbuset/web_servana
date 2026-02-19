/**
 * ToggleSwitch Component
 * Reusable toggle switch for boolean states
 * 
 * @param {boolean} checked - Whether the toggle is checked
 * @param {Function} onChange - Function to handle toggle change
 * @param {boolean} disabled - Whether the toggle is disabled
 * @param {string} size - Size of the toggle ("sm" or "md")
 */
export default function ToggleSwitch({ checked, onChange, disabled = false, size = "md" }) {
  const sizeClasses = {
    sm: {
      container: "w-9 h-5",
      toggle: "after:h-4 after:w-4 peer-checked:after:translate-x-4"
    },
    md: {
      container: "w-11 h-6",
      toggle: "after:h-5 after:w-5 peer-checked:after:translate-x-5"
    }
  };

  const currentSize = sizeClasses[size] || sizeClasses.md;

  return (
    <label 
      className={`inline-flex relative items-center ${
        disabled ? "cursor-not-allowed" : "cursor-pointer"
      }`}
      onClick={(e) => e.stopPropagation()}
    >
      <input
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
      />
      <div className={`${currentSize.container} rounded-full peer transition-colors relative after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:transition-transform ${currentSize.toggle} ${
        disabled
          ? "bg-gray-200 peer-checked:bg-gray-400"
          : "bg-gray-300 peer-checked:bg-[#6237A0]"
      }`} />
    </label>
  );
}
