import React, { useState, useEffect, useCallback } from "react";
import TopNavbar from "../../../src/components/TopNavbar";
import Sidebar from "../../../src/components/Sidebar/index";
import LoadingSpinner from "../../components/LoadingSpinner";
import { FiLogOut } from "react-icons/fi";
import { Upload } from "react-feather";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import { useUser } from "../../../src/context/UserContext";
import { useTheme } from "../../context/ThemeContext";
import { toast } from "react-toastify";


/**
 * NOTE:
 * - Endpoints now rely on auth cookie; no userId needed in URL.
 * - All requests include { withCredentials: true } so cookies are sent.
 * - After save/update/image upload we refetch to keep UI in sync.
 */

export default function Profile() {
  
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [fileName, setFileName] = useState("Upload Image");
  const [profilePicture, setProfilePicture] = useState("profile_picture/DefaultProfile.jpg");
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUploaded, setImageUploaded] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // optional; no design change
  const [profileData, setProfileData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    address: "",
    dateOfBirth: "",
  });
  const { setUserData, hasPermission } = useUser();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const canManageProfile = hasPermission("priv_can_manage_profile");

  // ---------------- FETCH PROFILE ----------------
  const fetchProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log('profile')
      const res = await api.get("/profile", { withCredentials: true });
      const { sys_user_email, profile, image } = res.data;

      if (profile) {
        setProfileData({
          firstName: profile.prof_firstname || "",
          middleName: profile.prof_middlename || "",
          lastName: profile.prof_lastname || "",
          email: sys_user_email || "",
          address: profile.prof_address || "",
          dateOfBirth: profile.prof_date_of_birth
            ? profile.prof_date_of_birth.split("T")[0]
            : "",
        });
      }

      if (image?.img_location) {
        setProfilePicture(image.img_location);
      }
    } catch (error) {
      const status = error?.response?.status;
      if (status === 401) {
        // not authenticated -> go login
        navigate("/");
      } else {
        console.error("Failed to fetch profile:", error?.response?.data || error);
      }
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // ---------------- HANDLE IMAGE SELECTION ----------------
  const handleFileChange = (e) => {
    if (!canManageProfile) {
      console.warn("User does not have permission to manage profile");
      toast.error("You don't have permission to edit your profile");
      return;
    }

    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setSelectedFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        // show preview immediately
        setProfilePicture(reader.result);
        setImageUploaded(true);
      };
      reader.readAsDataURL(file);
    } else {
      setFileName("Upload Image");
      setSelectedFile(null);
      setProfilePicture("profile_picture/DefaultProfile.jpg");
      setImageUploaded(false);
    }
  };

  // ---------------- UPLOAD IMAGE ----------------
  const handleSaveImage = async () => {
    if (!canManageProfile) {
      console.warn("User does not have permission to manage profile");
      toast.error("You don't have permission to edit your profile");
      return;
    }

    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      await api.post("/profile/image", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      setImageUploaded(false);
      setFileName("Upload Image");
      // refetch to get canonical URL from server
      await fetchProfile();
    } catch (error) {
      console.error("Image upload failed:", error?.response?.data || error);
    }
  };

  // ---------------- UPDATE PROFILE ----------------
  const handleSave = async () => {
    if (!canManageProfile) {
      console.warn("User does not have permission to manage profile");
      toast.error("You don't have permission to edit your profile");
      return;
    }

    try {
      await api.put("/profile", profileData, { withCredentials: true });
      setIsEditModalOpen(false);
      await fetchProfile(); // refresh displayed data
    } catch (error) {
      console.error("Profile update failed:", error?.response?.data || error);
    }
  };

  // ---------------- OPEN EDIT MODAL ----------------
  const openEditModal = () => {
    if (!canManageProfile) {
      console.warn("User does not have permission to manage profile");
      toast.error("You don't have permission to edit your profile");
      return;
    }
    setIsEditModalOpen(true);
  };

  // ---------------- LOGOUT ----------------
  const handleLogout = async () => {
    try {
      await api.post("/auth/logout", {}, { withCredentials: true });
      localStorage.setItem("logout", Date.now()); // TRIGGERS logout in other tabs
      setUserData(null);  // Reset context
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error?.response?.data || error?.message);
    }
  };

  const toggleDropdown = (name) => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  const toggleSidebar = () => {
    setMobileSidebarOpen((prev) => !prev);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden relative">
      <TopNavbar toggleSidebar={toggleSidebar} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          isMobile={true}
          isOpen={mobileSidebarOpen}
          toggleDropdown={toggleDropdown}
          openDropdown={openDropdown}
        />
        <Sidebar
          isMobile={false}
          toggleDropdown={toggleDropdown}
          openDropdown={openDropdown}
        />

        <main className="flex-1 p-4 sm:p-6 min-h-[calc(100vh-64px)] flex flex-col justify-center items-center relative overflow-hidden" style={{ backgroundColor: 'var(--bg-secondary)' }}>
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob ${isDark ? 'bg-purple-600' : 'bg-purple-300'}`}></div>
            <div className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000 ${isDark ? 'bg-pink-600' : 'bg-pink-300'}`}></div>
            <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000 ${isDark ? 'bg-indigo-600' : 'bg-indigo-300'}`}></div>
          </div>

          <div className="relative z-10 w-full max-w-5xl">
            {/* Header with gradient */}
            <div className="text-center mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-[#8B5CF6] via-[#A78BFA] to-[#C4B5FD] bg-clip-text text-transparent mb-2">
                My Profile
              </h1>
              <p className="text-sm flex items-center justify-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                <span className="w-8 h-0.5 bg-gradient-to-r from-transparent to-[#6237A0]"></span>
                Manage your personal information
                <span className="w-8 h-0.5 bg-gradient-to-r from-[#6237A0] to-transparent"></span>
              </p>
            </div>

            {isLoading ? (
              <LoadingSpinner message="Loading profile..." />
            ) : (
              <div className="backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden" style={{ backgroundColor: isDark ? 'rgba(42, 42, 42, 0.8)' : 'rgba(255, 255, 255, 0.8)', border: `1px solid ${isDark ? 'rgba(74, 74, 74, 0.2)' : 'rgba(255, 255, 255, 0.2)'}` }}>
                {/* Profile Header with Gradient */}
                <div className="bg-gradient-to-br from-[#6237A0] via-[#7A4ED9] to-[#8B5CF6] p-8 sm:p-10 text-white relative overflow-hidden">
                  {/* Animated background circles */}
                  <div className="absolute top-5 right-5 w-32 h-32 border-2 border-white/20 rounded-full animate-ping-slow"></div>
                  <div className="absolute bottom-5 left-5 w-24 h-24 bg-white/10 rounded-full blur-xl animate-float"></div>
                  
                  <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
                    {/* Profile Picture */}
                    <div className="relative group">
                      <div className="absolute inset-0 bg-white/30 rounded-full blur-xl animate-pulse"></div>
                      <div className="absolute -inset-1 bg-gradient-to-r from-white/40 to-white/20 rounded-full animate-spin-slow"></div>
                      <img
                        src={profilePicture}
                        alt="Profile Avatar"
                        className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-white shadow-2xl relative z-10 group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 border-4 border-white rounded-full z-20 animate-pulse"></div>
                    </div>

                    {/* Name and Upload */}
                    <div className="flex-1 text-center sm:text-left">
                      <h2 className="text-2xl sm:text-3xl font-bold mb-2 drop-shadow-lg">
                        {profileData.firstName} {profileData.middleName} {profileData.lastName}
                      </h2>
                      <p className="text-purple-100 mb-4">{profileData.email}</p>
                      
                      {/* Upload Button */}
                      <div className="flex flex-col sm:flex-row gap-3 items-center justify-center sm:justify-start">
                        <div className="relative w-full sm:w-auto">
                          <input
                            id="file-upload"
                            type="file"
                            className="hidden"
                            onChange={handleFileChange}
                            disabled={!canManageProfile}
                          />
                          <label
                            htmlFor="file-upload"
                            className={`inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-lg transition-all ${
                              canManageProfile
                                ? "cursor-pointer hover:bg-white/30 hover:scale-105"
                                : "cursor-not-allowed opacity-50"
                            }`}
                            title={!canManageProfile ? "You don't have permission to edit your profile" : ""}
                          >
                            <Upload className="w-4 h-4" strokeWidth={2} />
                            <span className="text-sm font-semibold">
                              {fileName === "Upload Image" ? "Change Photo" : fileName}
                            </span>
                          </label>
                        </div>

                        {imageUploaded && (
                          <button
                            onClick={handleSaveImage}
                            disabled={!canManageProfile}
                            className={`px-4 py-2 bg-white text-[#6237A0] rounded-lg font-semibold transition-all ${
                              canManageProfile
                                ? "hover:shadow-lg hover:scale-105"
                                : "opacity-50 cursor-not-allowed"
                            }`}
                          >
                            Save Photo
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Decorative dots */}
                  <div className="mt-6 flex justify-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-white/40"></div>
                    <div className="w-2 h-2 rounded-full bg-white/60"></div>
                    <div className="w-2 h-2 rounded-full bg-white/80"></div>
                  </div>
                </div>

                {/* Profile Details */}
                <div className="p-8 sm:p-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InfoCard
                      icon={
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      }
                      label="Full Name"
                      value={`${profileData.firstName} ${profileData.middleName} ${profileData.lastName}`}
                      isDark={isDark}
                    />
                    <InfoCard
                      icon={
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      }
                      label="Date of Birth"
                      value={profileData.dateOfBirth || "Not provided"}
                      isDark={isDark}
                    />
                    <InfoCard
                      icon={
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      }
                      label="Email"
                      value={profileData.email || "Not provided"}
                      isDark={isDark}
                    />
                    <InfoCard
                      icon={
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      }
                      label="Address"
                      value={profileData.address || "Not provided"}
                      isDark={isDark}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={openEditModal}
                      disabled={!canManageProfile}
                      className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                        canManageProfile
                          ? "bg-gradient-to-r from-[#6237A0] to-[#7A4ED9] text-white hover:shadow-xl hover:shadow-purple-500/50 hover:scale-105"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                      title={!canManageProfile ? "You don't have permission to edit your profile" : ""}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                      Edit Profile
                    </button>

                    <button
                      onClick={handleLogout}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-semibold hover:shadow-xl hover:shadow-red-500/50 hover:scale-105 transition-all"
                    >
                      <FiLogOut className="w-5 h-5" />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {isEditModalOpen && (
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
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      firstName: e.target.value,
                    })
                  }
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
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      middleName: e.target.value,
                    })
                  }
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
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      lastName: e.target.value,
                    })
                  }
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
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      email: e.target.value,
                    })
                  }
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
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      address: e.target.value,
                    })
                  }
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
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      dateOfBirth: e.target.value,
                    })
                  }
                  disabled={!canManageProfile}
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-gray-50 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition-all hover:scale-105"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
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
      )}

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes ping-slow {
          0% { transform: scale(1); opacity: 1; }
          75%, 100% { transform: scale(2); opacity: 0; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-ping-slow { animation: ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite; }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
}

/**
 * InfoCard - Reusable info card component
 */
function InfoCard({ icon, label, value, isDark }) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl transition-all group shadow-sm hover:shadow-md relative overflow-hidden" style={{ 
      background: isDark ? 'linear-gradient(to bottom right, #2a2a2a, #1e1e1e)' : 'linear-gradient(to bottom right, #f9fafb, #ffffff)',
      border: `1px solid ${isDark ? '#4a4a4a' : '#f3f4f6'}`
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.borderColor = isDark ? '#6237A0' : '#c4b5fd';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = isDark ? '#4a4a4a' : '#f3f4f6';
    }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-[#6237A0]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div className="flex-shrink-0 text-[#6237A0] mt-0.5 group-hover:scale-110 transition-transform relative z-10">
        {icon}
      </div>
      <div className="flex-1 min-w-0 relative z-10">
        <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--text-secondary)' }}>{label}</p>
        <p className="text-sm font-medium break-words" style={{ color: 'var(--text-primary)' }}>{value}</p>
      </div>
    </div>
  );
}
