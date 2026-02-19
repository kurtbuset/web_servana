import { getProfilePictureUrl } from "../../utils/imageUtils";

/**
 * Avatar - Advanced profile picture component with more features
 * 
 * Features:
 * - Multiple sizes and shapes
 * - Status indicators
 * - Badges/counters
 * - Borders and rings
 * - Hover effects
 * - Click handlers
 * - Fallback initials
 */
export default function Avatar({
  src,
  alt = "Profile",
  name,
  size = "md",
  shape = "circle", // circle, square, rounded
  showStatus = false,
  isOnline = false,
  badge,
  border = false,
  borderColor = "white",
  borderWidth = 2,
  ring = false,
  ringColor = "#6237A0",
  shadow = false,
  hover = false,
  className = "",
  onClick,
  useImageUtils = true,
  fallbackInitials = true
}) {
  // Size mappings
  const sizes = {
    xs: { container: "w-6 h-6", text: "text-[8px]", status: "w-1.5 h-1.5", badge: "text-[8px] px-1" },
    sm: { container: "w-8 h-8", text: "text-[10px]", status: "w-2 h-2", badge: "text-[9px] px-1" },
    md: { container: "w-10 h-10", text: "text-xs", status: "w-2.5 h-2.5", badge: "text-[10px] px-1.5" },
    lg: { container: "w-12 h-12", text: "text-sm", status: "w-3 h-3", badge: "text-xs px-1.5" },
    xl: { container: "w-16 h-16", text: "text-base", status: "w-4 h-4", badge: "text-xs px-2" },
    "2xl": { container: "w-20 h-20", text: "text-lg", status: "w-5 h-5", badge: "text-sm px-2" },
    "3xl": { container: "w-24 h-24", text: "text-xl", status: "w-5 h-5", badge: "text-sm px-2" },
    "4xl": { container: "w-28 h-28", text: "text-2xl", status: "w-6 h-6", badge: "text-base px-2.5" }
  };

  const currentSize = sizes[size] || sizes.md;

  // Shape classes
  const shapeClasses = {
    circle: "rounded-full",
    square: "rounded-none",
    rounded: "rounded-lg"
  };

  // Process image source
  const imageSrc = useImageUtils && src ? getProfilePictureUrl(src) : (src || null);

  // Generate initials from name
  const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const initials = name ? getInitials(name) : alt.substring(0, 2).toUpperCase();

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Main Avatar */}
      <div
        className={`
          ${currentSize.container}
          ${shapeClasses[shape]}
          ${border ? `border-${borderWidth}` : ''}
          ${ring ? 'ring-2 ring-offset-2' : ''}
          ${shadow ? 'shadow-lg' : ''}
          ${hover ? 'transition-all duration-300 hover:scale-105' : ''}
          ${onClick ? 'cursor-pointer' : ''}
          overflow-hidden
          flex items-center justify-center
          bg-gradient-to-br from-purple-400 to-purple-600
        `}
        style={{
          borderColor: border ? borderColor : undefined,
          ringColor: ring ? ringColor : undefined
        }}
        onClick={onClick}
      >
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={alt}
            className="w-full h-full object-cover"
          />
        ) : fallbackInitials ? (
          <span className={`${currentSize.text} font-semibold text-white`}>
            {initials}
          </span>
        ) : (
          <svg className="w-2/3 h-2/3 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        )}
      </div>

      {/* Status Indicator */}
      {showStatus && (
        <div
          className={`
            absolute -bottom-0.5 -right-0.5
            ${currentSize.status}
            ${shapeClasses[shape]}
            border-2
            ${isOnline ? 'bg-green-500' : 'bg-gray-400'}
          `}
          style={{ borderColor: borderColor === 'white' ? '#fff' : 'var(--card-bg)' }}
        />
      )}

      {/* Badge/Counter */}
      {badge && (
        <div
          className={`
            absolute -top-1 -right-1
            ${currentSize.badge}
            bg-red-500 text-white
            rounded-full
            font-semibold
            flex items-center justify-center
            min-w-[16px]
            shadow-md
          `}
        >
          {badge}
        </div>
      )}
    </div>
  );
}
