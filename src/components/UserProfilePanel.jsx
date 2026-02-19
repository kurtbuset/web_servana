import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { LogOut } from "react-feather";
import api from "../api";
import { getAvatarUrl } from "../utils/imageUtils";

/**
 * UserProfilePanel - Slide-in profile panel for logged-in user
 * Shows brief info with option to see full profile page
 * Styled to match the login screen design
 */
export default function UserProfilePanel({ userData, isOpen, onClose }) {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  if (!userData) return null;

  // Build full name
  const fullName = [
    userData.profile?.prof_firstname,
    userData.profile?.prof_middlename,
    userData.profile?.prof_lastname
  ].filter(Boolean).join(" ");

  const avatarUrl = getAvatarUrl(userData);
  const email = userData.profile?.prof_email || userData.email;
  const phone = userData.profile?.prof_phone;
  const address = userData.profile?.prof_address;
  const dob = userData.profile?.prof_dob;
  const role = userData.role?.role_name;
  const departments = userData.departments || [];
  
  // Debug log to see userData structure
  // console.log("UserProfilePanel - userData:", userData);
  // console.log("UserProfilePanel - departments:", departments);

  const handleViewFullProfile = () => {
    onClose();
    navigate("/profile");
  };

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout", {}, { withCredentials: true });
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      // Always clear local storage and redirect, even if API fails
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
      localStorage.setItem("logout", Date.now());
      navigate("/");
    }
  };

  return (
    <>
      {/* Blur Overlay */}
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-[75] transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Slide-in Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 shadow-2xl z-[80] transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)' }}
      >
        {/* Header with gradient and animated elements */}
        <div className="bg-gradient-to-br from-[#6237A0] via-[#7A4ED9] to-[#8B5CF6] p-6 text-white relative overflow-hidden">
          {/* Animated background circles */}
          <div className="absolute top-5 right-5 w-20 h-20 border-2 border-white/20 rounded-full animate-ping-slow"></div>
          <div className="absolute bottom-5 left-5 w-16 h-16 bg-white/10 rounded-full blur-xl animate-float"></div>
          
          {/* Header without close button */}
          <div className="flex items-center justify-between mb-4 relative z-10">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              My Profile
            </h2>
          </div>

          {/* Profile Picture with animated ring */}
          <div className="flex flex-col items-center relative z-10">
            <div className="relative group">
              <div className="absolute inset-0 bg-white/30 rounded-full blur-xl animate-pulse"></div>
              <div className="absolute -inset-1 bg-gradient-to-r from-white/40 to-white/20 rounded-full animate-spin-slow"></div>
              <img
                src={avatarUrl}
                alt={fullName}
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-2xl relative z-10 group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-500 border-4 border-white rounded-full z-20 animate-pulse"></div>
            </div>
            <h3 className="text-xl font-bold mt-4 drop-shadow-lg">{fullName || 'User'}</h3>
            {role && (
              <span className="mt-2 px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold border border-white/30 shadow-lg">
                {role}
              </span>
            )}
          </div>

          {/* Decorative line */}
          <div className="mt-4 flex justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-white/40"></div>
            <div className="w-2 h-2 rounded-full bg-white/60"></div>
            <div className="w-2 h-2 rounded-full bg-white/80"></div>
          </div>
        </div>

        {/* Department Section - Between header and content */}
        <div className="px-6 py-4 border-b" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-4 h-4 text-[#6237A0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span className="text-sm font-semibold uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>
              Department{departments && departments.length > 1 ? 's' : ''}
            </span>
          </div>
          {departments && departments.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {departments.map((dept, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold border shadow-sm"
                  style={{
                    backgroundColor: isDark ? 'rgba(139, 92, 246, 0.15)' : '#f5f3ff',
                    borderColor: isDark ? 'rgba(139, 92, 246, 0.4)' : '#e9d5ff',
                    color: isDark ? '#c4b5fd' : '#6237A0'
                  }}
                >
                  {dept.dept_name || dept}
                </span>
              ))}
            </div>
          ) : (
            <div className="text-xs italic" style={{ color: 'var(--text-secondary)' }}>
              No departments assigned
            </div>
          )}
        </div>

        {/* Brief Info with enhanced styling */}
        <div className="p-6 space-y-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 380px)', background: 'linear-gradient(to bottom, var(--bg-secondary), var(--bg-primary))' }}>
          <div className="space-y-3">
            {email && (
              <InfoItem
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                }
                label="Email"
                value={email}
              />
            )}

            {phone && (
              <InfoItem
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                }
                label="Phone"
                value={phone}
              />
            )}

            {address && (
              <InfoItem
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                }
                label="Address"
                value={address}
              />
            )}

            {dob && (
              <InfoItem
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                }
                label="Date of Birth"
                value={new Date(dob).toLocaleDateString()}
              />
            )}

            {role && (
              <InfoItem
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                }
                label="Role"
                value={role}
              />
            )}
          </div>

          {/* Divider with gradient */}
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" style={{ borderColor: 'var(--border-color)' }}></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 text-xs font-medium uppercase tracking-wider" style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-secondary)' }}>Quick Actions</span>
            </div>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-between gap-3 p-4 rounded-xl transition-all group border-2 shadow-sm hover:shadow-md relative overflow-hidden mb-3"
            style={{ 
              backgroundColor: 'var(--bg-tertiary)', 
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)'
            }}
          >
            <div className="flex items-center gap-3 relative z-10">
              {isDark ? (
                <svg className="w-5 h-5 text-yellow-500 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-indigo-600 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
              <span className="text-sm font-semibold">
                {isDark ? 'Light Mode' : 'Dark Mode'}
              </span>
            </div>
            {/* Toggle Switch */}
            <div className={`relative w-12 h-6 rounded-full transition-colors ${isDark ? 'bg-indigo-600' : 'bg-gray-300'}`}>
              <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${isDark ? 'translate-x-6' : 'translate-x-0'}`}></div>
            </div>
          </button>

          {/* View Full Profile Button with gradient */}
          <button
            onClick={handleViewFullProfile}
            className="w-full flex items-center justify-center gap-3 p-4 rounded-xl transition-all group border-2 shadow-sm hover:shadow-md relative overflow-hidden"
            style={{ 
              backgroundColor: isDark ? 'rgba(139, 92, 246, 0.15)' : '#f5f3ff',
              borderColor: isDark ? 'rgba(139, 92, 246, 0.4)' : '#e9d5ff',
              color: isDark ? '#c4b5fd' : '#6237A0'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-sm font-semibold relative z-10">View Full Profile</span>
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>

        {/* Footer Action with Close and Logout buttons */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t" style={{ background: 'linear-gradient(to top, var(--bg-tertiary), var(--bg-secondary))', borderColor: 'var(--border-color)' }}>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="py-3 rounded-lg font-semibold transition-all hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-2 group"
              style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)', width: '75%' }}
            >
              <svg className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Close
            </button>
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="py-3 rounded-lg font-semibold transition-all hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-2 group"
              style={{ backgroundColor: '#dc2626', color: 'white', width: '25%' }}
              title="Logout"
            >
              <LogOut size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal - Outside panel for true screen centering */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[90] p-4 sm:p-6 animate-fadeIn">
          <div 
            className="rounded-xl shadow-2xl p-6 sm:p-8 max-w-sm w-full transform transition-all animate-scaleIn"
            style={{ backgroundColor: 'var(--card-bg)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-red-100 mx-auto mb-5">
              <LogOut size={28} className="text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-center mb-3" style={{ color: 'var(--text-primary)' }}>
              Confirm Logout
            </h3>
            <p className="text-sm text-center mb-8 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Are you sure you want to log out? You'll need to sign in again to access your account.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-3 rounded-lg font-semibold transition-all hover:shadow-md active:scale-[0.98]"
                style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-3 rounded-lg font-semibold transition-all hover:shadow-md hover:bg-red-700 active:scale-[0.98]"
                style={{ backgroundColor: '#dc2626', color: 'white' }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes ping-slow {
          0% { transform: scale(1); opacity: 1; }
          75%, 100% { transform: scale(2); opacity: 0; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-ping-slow { animation: ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite; }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
        .animate-scaleIn { animation: scaleIn 0.3s ease-out; }
      `}</style>
    </>
  );
}

/**
 * InfoItem - Reusable info item component with enhanced styling
 */
function InfoItem({ icon, label, value }) {
  return (
    <div 
      className="flex items-start gap-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-transparent transition-all group border shadow-sm hover:shadow-md relative overflow-hidden"
      style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div className="flex-shrink-0 text-[#6237A0] mt-0.5 group-hover:scale-110 transition-transform relative z-10">
        {icon}
      </div>
      <div className="flex-1 min-w-0 relative z-10">
        <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>{label}</p>
        <p className="text-sm font-medium mt-0.5 break-words" style={{ color: 'var(--text-primary)' }}>{value}</p>
      </div>
    </div>
  );
}
