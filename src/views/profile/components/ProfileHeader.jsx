import { Upload } from "react-feather";
import { Avatar } from "../../../components/ui";

/**
 * ProfileHeader - Profile header with picture, name, and upload functionality
 */
export default function ProfileHeader({ 
  profilePicture, 
  profileData, 
  fileName, 
  imageUploaded,
  canManageProfile,
  onFileChange,
  onSaveImage
}) {
  return (
    <div className="bg-gradient-to-br from-[#6237A0] via-[#7A4ED9] to-[#8B5CF6] p-4 sm:p-6 text-white relative overflow-hidden">
      {/* Animated background circles */}
      <div className="absolute top-3 right-3 w-20 h-20 border-2 border-white/20 rounded-full animate-ping-slow"></div>
      <div className="absolute bottom-3 left-3 w-16 h-16 bg-white/10 rounded-full blur-xl animate-float"></div>
      
      <div className="flex flex-col sm:flex-row items-center gap-4 relative z-10">
        {/* Profile Picture */}
        <Avatar
          src={profilePicture}
          name={`${profileData.firstName} ${profileData.lastName}`}
          alt="Profile Avatar"
          size="3xl"
          showStatus
          isOnline={true}
          border
          borderWidth={3}
          shadow
          hover
          className="flex-shrink-0"
          useImageUtils={false}
        />

        {/* Name and Upload */}
        <div className="flex-1 text-center sm:text-left min-w-0">
          <h2 className="text-lg sm:text-xl font-bold mb-1 drop-shadow-lg truncate">
            {profileData.firstName} {profileData.middleName} {profileData.lastName}
          </h2>
          <p className="text-purple-100 text-sm mb-3 truncate">{profileData.email}</p>
          
          {/* Upload Button */}
          <div className="flex flex-wrap gap-2 items-center justify-center sm:justify-start">
            <div className="relative">
              <input
                id="file-upload"
                type="file"
                className="hidden"
                onChange={onFileChange}
                disabled={!canManageProfile}
              />
              <label
                htmlFor="file-upload"
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-xs font-semibold transition-all ${
                  canManageProfile
                    ? "cursor-pointer hover:bg-white/30"
                    : "cursor-not-allowed opacity-50"
                }`}
                title={!canManageProfile ? "You don't have permission to edit your profile" : ""}
              >
                <Upload className="w-3.5 h-3.5" strokeWidth={2} />
                <span className="hidden sm:inline">
                  {fileName === "Upload Image" ? "Change Photo" : fileName}
                </span>
                <span className="sm:hidden">Change</span>
              </label>
            </div>

            {imageUploaded && (
              <button
                onClick={onSaveImage}
                disabled={!canManageProfile}
                className={`px-3 py-1.5 bg-white text-[#6237A0] rounded-lg text-xs font-semibold transition-all ${
                  canManageProfile
                    ? "hover:shadow-lg"
                    : "opacity-50 cursor-not-allowed"
                }`}
              >
                Save
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
