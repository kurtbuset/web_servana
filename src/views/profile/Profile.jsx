import { useState, useEffect, useCallback } from "react";
import Layout from "../../components/Layout";
import LoadingSpinner from "../../components/LoadingSpinner";
import { FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import { useUser } from "../../../src/context/UserContext";
import { useTheme } from "../../context/ThemeContext";
import { PERMISSIONS } from "../../constants/permissions";
import toast from "../../utils/toast";
import { getProfilePictureUrl } from "../../utils/imageUtils";
import "../../styles/GridLayout.css";
import "../../styles/Animations.css";

// Import components
import AnimatedBackground from "./components/AnimatedBackground";
import ProfileHeader from "./components/ProfileHeader";
import ProfileDetails from "./components/ProfileDetails";
import DepartmentsList from "./components/DepartmentsList";
import EditProfileModal from "./components/EditProfileModal";
import DepartmentMembersModal from "./components/DepartmentMembersModal";
import LogoutConfirmModal from "./components/LogoutConfirmModal";

/**
 * Profile - User profile management screen
 * 
 * Features:
 * - View profile information
 * - Edit profile details
 * - Upload profile picture
 * - View departments
 * - View department members
 * - Logout functionality
 */
export default function Profile() {
  const [fileName, setFileName] = useState("Upload Image");
  const [profilePicture, setProfilePicture] = useState("profile_picture/DefaultProfile.jpg");
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUploaded, setImageUploaded] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [departmentMembers, setDepartmentMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
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
  const canManageProfile = hasPermission(PERMISSIONS.MANAGE_PROFILE);

  // ---------------- FETCH PROFILE ----------------
  const fetchProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/profile", { withCredentials: true });
      const { sys_user_email, profile, image, departments: userDepartments } = res.data;

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
        setProfilePicture(getProfilePictureUrl(image.img_location));
      }

      if (userDepartments && userDepartments.length > 0) {
        setDepartments(userDepartments);
      }
    } catch (error) {
      const status = error?.response?.status;
      if (status === 401) {
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
      toast.success("Profile picture updated successfully");
      await fetchProfile();
    } catch (error) {
      console.error("Image upload failed:", error?.response?.data || error);
      toast.error("Failed to update profile picture");
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
      toast.success("Profile updated successfully");
      await fetchProfile();
    } catch (error) {
      console.error("Profile update failed:", error?.response?.data || error);
      toast.error("Failed to update profile");
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
      const { clearSocket } = await import('../../socket');
      clearSocket();
      
      await api.post("/auth/logout", {}, { withCredentials: true });
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
      localStorage.setItem("logout", Date.now());
      setUserData(null);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error?.response?.data || error?.message);
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
      setUserData(null);
      navigate("/");
    }
  };

  // ---------------- FETCH DEPARTMENT MEMBERS ----------------
  const fetchDepartmentMembers = async (departmentId) => {
    try {
      setLoadingMembers(true);
      const res = await api.get(`/department/${departmentId}/members`, { withCredentials: true });
      setDepartmentMembers(res.data.members || []);
    } catch (error) {
      console.error("Failed to fetch department members:", error);
      toast.error("Failed to load department members");
      setDepartmentMembers([]);
    } finally {
      setLoadingMembers(false);
    }
  };

  const handleViewDepartment = (department) => {
    setSelectedDepartment(department);
    fetchDepartmentMembers(department.dept_id);
  };

  return (
    <Layout>
      <div className="flex flex-col h-full overflow-hidden" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="flex flex-col h-full gap-0 p-0 md:p-3 flex-1">
          <div className="h-full flex flex-col md:rounded-xl shadow-sm border-0 md:border overflow-hidden" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <main className="p-4 sm:p-6 min-h-full flex flex-col justify-center items-center relative overflow-hidden" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                {/* Animated background elements */}
                <AnimatedBackground isDark={isDark} />

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
                      {/* Profile Header */}
                      <ProfileHeader
                        profilePicture={profilePicture}
                        profileData={profileData}
                        fileName={fileName}
                        imageUploaded={imageUploaded}
                        canManageProfile={canManageProfile}
                        onFileChange={handleFileChange}
                        onSaveImage={handleSaveImage}
                      />

                      {/* Profile Details */}
                      <div className="p-4 sm:p-6">
                        <ProfileDetails profileData={profileData} isDark={isDark} />

                        {/* Departments Section */}
                        <DepartmentsList
                          departments={departments}
                          isDark={isDark}
                          onViewDepartment={handleViewDepartment}
                        />

                        {/* Action Buttons */}
                        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                          <button
                            onClick={openEditModal}
                            disabled={!canManageProfile}
                            className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                              canManageProfile
                                ? "bg-gradient-to-r from-[#6237A0] to-[#7A4ED9] text-white hover:shadow-lg"
                                : "bg-gray-200 text-gray-400 cursor-not-allowed"
                            }`}
                            title={!canManageProfile ? "You don't have permission to edit your profile" : ""}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                            Edit Profile
                          </button>

                          <button
                            onClick={() => setShowLogoutConfirm(true)}
                            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg text-sm font-semibold hover:shadow-lg transition-all"
                          >
                            <FiLogOut className="w-4 h-4" />
                            Logout
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </main>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        profileData={profileData}
        canManageProfile={canManageProfile}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSave}
        onProfileDataChange={setProfileData}
      />

      <DepartmentMembersModal
        selectedDepartment={selectedDepartment}
        departmentMembers={departmentMembers}
        loadingMembers={loadingMembers}
        onClose={() => setSelectedDepartment(null)}
      />

      <LogoutConfirmModal
        isOpen={showLogoutConfirm}
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </Layout>
  );
}
