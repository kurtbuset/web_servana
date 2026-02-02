import { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import { useTheme } from "../context/ThemeContext";
import api from "../api";

/**
 * DepartmentUsersPanel - Shows all users in the current user's departments
 * If user has multiple departments, shows them as sections
 * Slide-in panel with blur overlay
 */
export default function DepartmentUsersPanel({ isOpen, onClose }) {
  const { userData } = useUser();
  const { isDark } = useTheme();
  const [departmentsData, setDepartmentsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentDeptIndex, setCurrentDeptIndex] = useState(0);

  const departments = userData?.departments || [];
  const currentDepartment = departmentsData[currentDeptIndex];

  useEffect(() => {
    if (isOpen && departments.length > 0) {
      fetchAllDepartmentsUsers();
    }
  }, [isOpen, userData]);

  const fetchAllDepartmentsUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch users for all departments
      const promises = departments.map(dept => 
        api.get(`/departments/${dept.dept_id}/members`, { withCredentials: true })
          .then(res => ({
            ...dept,
            members: res.data.members || [],
            totalMembers: res.data.members?.length || 0,
            onlineMembers: res.data.members?.filter(m => m.sys_user_is_active).length || 0
          }))
          .catch(err => {
            console.error(`Error fetching members for ${dept.dept_name}:`, err);
            return {
              ...dept,
              members: [],
              totalMembers: 0,
              onlineMembers: 0,
              error: true
            };
          })
      );

      const results = await Promise.all(promises);
      setDepartmentsData(results);
    } catch (err) {
      console.error('Error fetching department users:', err);
      setError('Failed to load department users');
    } finally {
      setLoading(false);
    }
  };

  const handleNextDepartment = () => {
    setCurrentDeptIndex((prev) => (prev + 1) % departmentsData.length);
  };

  const handlePrevDepartment = () => {
    setCurrentDeptIndex((prev) => (prev - 1 + departmentsData.length) % departmentsData.length);
  };

  return (
    <>
      {/* Blur Overlay */}
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Slide-in Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 shadow-2xl z-50 transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ backgroundColor: 'var(--card-bg)' }}
      >
        {/* Header with gradient */}
        <div className="bg-gradient-to-br from-[#6237A0] via-[#7A4ED9] to-[#8B5CF6] p-6 text-white relative overflow-hidden">
          {/* Animated background circles */}
          <div className="absolute top-5 right-5 w-20 h-20 border-2 border-white/20 rounded-full animate-ping-slow"></div>
          <div className="absolute bottom-5 left-5 w-16 h-16 bg-white/10 rounded-full blur-xl animate-float"></div>
          
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="flex-1">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Department Team
              </h2>
              <p className="text-purple-100 text-sm mt-1">
                {loading ? "Loading..." : currentDepartment?.dept_name || "No Department"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-all hover:rotate-90 duration-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Stats */}
          {!loading && currentDepartment && (
            <div className="flex gap-4 relative z-10">
              <div className="flex-1 bg-white/20 backdrop-blur-sm rounded-lg p-3 border border-white/30">
                <p className="text-xs text-purple-100">Total Members</p>
                <p className="text-2xl font-bold">{currentDepartment.totalMembers}</p>
              </div>
              <div className="flex-1 bg-white/20 backdrop-blur-sm rounded-lg p-3 border border-white/30">
                <p className="text-xs text-purple-100">Online</p>
                <p className="text-2xl font-bold">{currentDepartment.onlineMembers}</p>
              </div>
            </div>
          )}

          {/* Department Navigation Dots */}
          {departmentsData.length > 1 && (
            <div className="mt-4 flex justify-center items-center gap-3 relative z-10">
              <button
                onClick={handlePrevDepartment}
                className="p-1 hover:bg-white/20 rounded-full transition-all"
                disabled={loading}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="flex gap-2">
                {departmentsData.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentDeptIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentDeptIndex ? 'bg-white w-6' : 'bg-white/40'
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={handleNextDepartment}
                className="p-1 hover:bg-white/20 rounded-full transition-all"
                disabled={loading}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Users List */}
        <div className="p-4 space-y-2 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 280px)', background: isDark ? 'linear-gradient(to bottom, #1e1e1e, #2a2a2a)' : 'linear-gradient(to bottom, #f9fafb, #ffffff)' }}>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-8 w-8 border-3 border-t-[#6237A0]" style={{ borderColor: 'var(--border-color)', borderTopColor: '#6237A0' }}></div>
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Loading members...</span>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <svg className="w-12 h-12 mx-auto mb-3" style={{ color: isDark ? '#6b7280' : '#9ca3af' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{error}</p>
            </div>
          ) : !currentDepartment ? (
            <div className="text-center py-12">
              <svg className="w-12 h-12 mx-auto mb-3" style={{ color: isDark ? '#6b7280' : '#9ca3af' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>No departments assigned</p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>You are not assigned to any department</p>
            </div>
          ) : currentDepartment.members.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-12 h-12 mx-auto mb-3" style={{ color: isDark ? '#6b7280' : '#9ca3af' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>No team members found</p>
            </div>
          ) : (
            currentDepartment.members.map((member) => (
              <UserCard key={member.sys_user_id} user={member} isDark={isDark} />
            ))
          )}
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4" style={{ background: isDark ? 'linear-gradient(to top, #1e1e1e, #2a2a2a)' : 'linear-gradient(to top, #f3f4f6, #f9fafb)', borderTop: `1px solid var(--border-color)` }}>
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-lg font-semibold transition-all hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-2 group"
            style={{
              background: isDark ? 'linear-gradient(to right, #4a4a4a, #5a5a5a)' : 'linear-gradient(to right, #e5e7eb, #d1d5db)',
              color: 'var(--text-primary)'
            }}
          >
            <svg className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Close
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes ping-slow {
          0% { transform: scale(1); opacity: 1; }
          75%, 100% { transform: scale(2); opacity: 0; }
        }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-ping-slow { animation: ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite; }
      `}</style>
    </>
  );
}

/**
 * UserCard - Individual user card component (compact version)
 */
function UserCard({ user, isDark }) {
  const isOnline = user.sys_user_is_active;
  const fullName = [
    user.profile?.prof_firstname,
    user.profile?.prof_middlename,
    user.profile?.prof_lastname
  ].filter(Boolean).join(" ") || user.sys_user_email;
  
  const avatarUrl = user.image?.img_location || "profile_picture/DefaultProfile.jpg";
  
  return (
    <div className="flex items-center gap-2.5 p-2.5 rounded-lg transition-all group" style={{
      backgroundColor: 'var(--card-bg)',
      border: `1px solid ${isDark ? '#4a4a4a' : '#f3f4f6'}`
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.borderColor = isDark ? '#6237A0' : '#c4b5fd';
      e.currentTarget.style.backgroundColor = isDark ? 'rgba(98, 55, 160, 0.05)' : 'rgba(243, 232, 255, 0.3)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = isDark ? '#4a4a4a' : '#f3f4f6';
      e.currentTarget.style.backgroundColor = 'var(--card-bg)';
    }}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <img
          src={avatarUrl}
          alt={fullName}
          className="w-10 h-10 rounded-full object-cover border-2 border-[#6237A0] group-hover:scale-105 transition-transform"
        />
        <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 ${isOnline ? 'bg-green-500' : 'bg-gray-400'} border-2 rounded-full`} style={{ borderColor: 'var(--card-bg)' }}></div>
      </div>

      {/* User Info */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{fullName}</h4>
      </div>
    </div>
  );
}
