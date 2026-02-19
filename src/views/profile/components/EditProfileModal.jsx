/**
 * EditProfileModal - Modal for editing profile information
 */
export default function EditProfileModal({ 
  isOpen, 
  profileData, 
  canManageProfile,
  onClose, 
  onSave,
  onProfileDataChange
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-gray-100">
        {/* Modal Header with Gradient */}
        <div className="bg-gradient-to-r from-[#6237A0] to-[#7A4ED9] p-6 text-white sticky top-0 z-10">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Edit Profile
          </h2>
          <p className="text-purple-100 text-sm mt-1">Update your personal information</p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          <div className="space-y-1 group">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <svg className="w-4 h-4 text-[#6237A0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              First Name
            </label>
            <input
              type="text"
              className={`w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#6237A0]/50 focus:border-[#6237A0] transition-all ${
                canManageProfile ? "hover:border-gray-300" : "bg-gray-100 cursor-not-allowed"
              }`}
              value={profileData.firstName}
              onChange={(e) => onProfileDataChange({ ...profileData, firstName: e.target.value })}
              disabled={!canManageProfile}
            />
          </div>

          <div className="space-y-1 group">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <svg className="w-4 h-4 text-[#6237A0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Middle Name
            </label>
            <input
              type="text"
              className={`w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#6237A0]/50 focus:border-[#6237A0] transition-all ${
                canManageProfile ? "hover:border-gray-300" : "bg-gray-100 cursor-not-allowed"
              }`}
              value={profileData.middleName}
              onChange={(e) => onProfileDataChange({ ...profileData, middleName: e.target.value })}
              disabled={!canManageProfile}
            />
          </div>

          <div className="space-y-1 group">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <svg className="w-4 h-4 text-[#6237A0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Last Name
            </label>
            <input
              type="text"
              className={`w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#6237A0]/50 focus:border-[#6237A0] transition-all ${
                canManageProfile ? "hover:border-gray-300" : "bg-gray-100 cursor-not-allowed"
              }`}
              value={profileData.lastName}
              onChange={(e) => onProfileDataChange({ ...profileData, lastName: e.target.value })}
              disabled={!canManageProfile}
            />
          </div>

          <div className="space-y-1 group">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <svg className="w-4 h-4 text-[#6237A0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email
            </label>
            <input
              type="email"
              className={`w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#6237A0]/50 focus:border-[#6237A0] transition-all ${
                canManageProfile ? "hover:border-gray-300" : "bg-gray-100 cursor-not-allowed"
              }`}
              value={profileData.email}
              onChange={(e) => onProfileDataChange({ ...profileData, email: e.target.value })}
              disabled={!canManageProfile}
            />
          </div>

          <div className="space-y-1 group">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <svg className="w-4 h-4 text-[#6237A0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Address
            </label>
            <input
              type="text"
              className={`w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#6237A0]/50 focus:border-[#6237A0] transition-all ${
                canManageProfile ? "hover:border-gray-300" : "bg-gray-100 cursor-not-allowed"
              }`}
              value={profileData.address}
              onChange={(e) => onProfileDataChange({ ...profileData, address: e.target.value })}
              disabled={!canManageProfile}
            />
          </div>

          <div className="space-y-1 group">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <svg className="w-4 h-4 text-[#6237A0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Date of Birth
            </label>
            <input
              type="date"
              className={`w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#6237A0]/50 focus:border-[#6237A0] transition-all ${
                canManageProfile ? "hover:border-gray-300" : "bg-gray-100 cursor-not-allowed"
              }`}
              value={profileData.dateOfBirth}
              onChange={(e) => onProfileDataChange({ ...profileData, dateOfBirth: e.target.value })}
              disabled={!canManageProfile}
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 bg-gray-50 border-t border-gray-200 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition-all hover:scale-105"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={!canManageProfile}
            className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all ${
              canManageProfile
                ? "bg-gradient-to-r from-[#6237A0] to-[#7A4ED9] text-white hover:shadow-xl hover:shadow-purple-500/50 hover:scale-105"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            title={!canManageProfile ? "You don't have permission to edit your profile" : ""}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
