import { getProfilePictureUrl } from "../../utils/imageUtils";

/**
 * ProfilePicture - Reusable profile picture component
 * 
 * Supports multiple sizes, status indicators, borders, and hover effects
 */
export default function ProfilePicture({
  src,
  alt = "Profile",
  size = "md",
  showStatus = false,
  isOnline = false,
  border = false,
  borderColor = "white",
  shadow = false,
  hover = false,
  className = "",
  onClick,
  useImageUtils = true
}) {
  // Size mappings
  const sizeClasses = {
    xs: "w-6 h-6",
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
    "2xl": "w-20 h-20",
    "3xl": "w-24 h-24",
    "4xl": "w-28 h-28"
  };

  // Status indicator size mappings
  const statusSizes = {
    xs: "w-1.5 h-1.5",
    sm: "w-2 h-2",
    md: "w-2.5 h-2.5",
    lg: "w-3 h-3",
    xl: "w-4 h-4",
    "2xl": "w-5 h-5",
    "3xl": "w-5 h-5",
    "4xl": "w-6 h-6"
  };

  // Process image source
  const imageSrc = useImageUtils && src ? getProfilePictureUrl(src) : (src || "profile_picture/DefaultProfile.jpg");

  return (
    <div className={`relative inline-block ${className}`}>
      <img
        src={imageSrc}
        alt={alt}
        className={`
          ${sizeClasses[size] || sizeClasses.md}
          rounded-full object-cover
          ${border ? `border-2 border-${borderColor}` : ''}
          ${shadow ? 'shadow-lg' : ''}
          ${hover ? 'transition-transform duration-300 hover:scale-105' : ''}
          ${onClick ? 'cursor-pointer' : ''}
        `}
        onClick={onClick}
      />
      
      {/* Status Indicator */}
      {showStatus && (
        <div 
          className={`
            absolute -bottom-0.5 -right-0.5
            ${statusSizes[size] || statusSizes.md}
            rounded-full border-2
            ${isOnline ? 'bg-green-500' : 'bg-gray-400'}
          `}
          style={{ borderColor: borderColor === 'white' ? '#fff' : 'var(--card-bg)' }}
        />
      )}
    </div>
  );
}
