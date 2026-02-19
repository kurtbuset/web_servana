/**
 * MemberListItem Component
 * Displays a single member in the role's member list
 * 
 * @param {Object} member - The member object
 * @param {boolean} isDark - Dark mode flag
 */
export default function MemberListItem({ member, isDark }) {
  // Generate initials from name or email for profile picture placeholder
  const getInitials = (member) => {
    if (member.profile?.prof_firstname && member.profile?.prof_lastname) {
      return `${member.profile.prof_firstname.charAt(0)}${member.profile.prof_lastname.charAt(0)}`.toUpperCase();
    }
    // Fallback to email initials
    const name = member.sys_user_email.split('@')[0];
    return name.substring(0, 2).toUpperCase();
  };

  // Get display name
  const getDisplayName = (member) => {
    if (member.profile?.full_name && member.profile.full_name.trim()) {
      return member.profile.full_name;
    }
    // Fallback to email
    return member.sys_user_email;
  };

  // Check if profile image exists
  const hasProfileImage = member.profile?.profile_image;

  return (
    <div className="flex items-center p-2 sm:p-3 rounded transition-colors" style={{ backgroundColor: 'var(--card-bg)', border: `1px solid var(--border-color)` }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = isDark ? 'rgba(139, 92, 246, 0.05)' : 'rgba(249, 250, 251, 1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--card-bg)';
      }}
    >
      {/* Profile Picture */}
      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full mr-2 sm:mr-3 flex-shrink-0 overflow-hidden">
        {hasProfileImage ? (
          <img
            src={member.profile.profile_image}
            alt={getDisplayName(member)}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback to initials if image fails to load
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div 
          className={`w-full h-full bg-[#6237A0] rounded-full flex items-center justify-center text-white font-medium text-xs sm:text-sm ${hasProfileImage ? 'hidden' : 'flex'}`}
        >
          {getInitials(member)}
        </div>
      </div>
      
      {/* User Info */}
      <div className="flex-1 min-w-0">
        <p className="text-xs sm:text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
          {getDisplayName(member)}
        </p>
        <p className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>
          {member.profile?.full_name ? member.sys_user_email : (member.sys_user_is_active ? "Active" : "Inactive")}
        </p>
      </div>
    </div>
  );
}
