import { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import { useTheme } from "../context/ThemeContext";

/**
 * DepartmentUsersPanel - Shows all users in the current user's department
 * Slide-in panel with blur overlay
 */
export default function DepartmentUsersPanel({ isOpen, onClose }) {
  const { userData } = useUser();
  const { isDark } = useTheme();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const departmentName = userData?.department?.dept_name || "Unknown Department";

  useEffect(() => {
    if (isOpen && userData?.department?.dept_id) {
      fetchDepartmentUsers();
    }
  }, [isOpen, userData]);

  const fetchDepartmentUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      // TODO: Replace with actual API endpoint
      const response = await fetch(`/api/departments/${userData.department.dept_id}/users`, {
        credentials: 'include'
      });
      
      if (!response.ok) throw new Error('Failed to fetch users');
      
      const data = await response.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error('Error fetching department users:', err);
      setError('Failed to load department users');
      // Mock data for development
      setUsers([
        {
          id: 1,
          name: "John Doe",
          email: "john@example.com",
          role: "Agent",
          status: "online",
          avatar: null
        },
        {
          id: 2,
          name: "Jane Smith",
          email: "jane@example.com",
          role: "Supervisor",
          status: "online",
          avatar: null
        },
        {
          id: 3,
          name: "Mike Johnson",
          email: "mike@example.com",
          role: "Agent",
          status: "offline",
          avatar: null
        }
      ]);
    } finally {
      setLoading(false);
    }
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
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Department Team
              </h2>
              <p className="text-purple-100 text-sm mt-1">{departmentName}</p>
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
          <div className="flex gap-4 relative z-10">
            <div className="flex-1 bg-white/20 backdrop-blur-sm rounded-lg p-3 border border-white/30">
              <p className="text-xs text-purple-100">Total Members</p>
              <p className="text-2xl font-bold">{users.length}</p>
            </div>
            <div className="flex-1 bg-white/20 backdrop-blur-sm rounded-lg p-3 border border-white/30">
              <p className="text-xs text-purple-100">Online</p>
              <p className="text-2xl font-bold">{users.filter(u => u.status === 'online').length}</p>
            </div>
          </div>

          {/* Decorative dots */}
          <div className="mt-4 flex justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-white/40"></div>
            <div className="w-2 h-2 rounded-full bg-white/60"></div>
            <div className="w-2 h-2 rounded-full bg-white/80"></div>
          </div>
        </div>

        {/* Users List */}
        <div className="p-6 space-y-3 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 280px)', background: isDark ? 'linear-gradient(to bottom, #1e1e1e, #2a2a2a)' : 'linear-gradient(to bottom, #f9fafb, #ffffff)' }}>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#6237A0]"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <svg className="w-12 h-12 mx-auto mb-3" style={{ color: isDark ? '#6b7280' : '#9ca3af' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{error}</p>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-12 h-12 mx-auto mb-3" style={{ color: isDark ? '#6b7280' : '#9ca3af' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>No team members found</p>
            </div>
          ) : (
            users.map((user) => (
              <UserCard key={user.id} user={user} isDark={isDark} />
            ))
          )}
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6" style={{ background: isDark ? 'linear-gradient(to top, #1e1e1e, #2a2a2a)' : 'linear-gradient(to top, #f3f4f6, #f9fafb)', borderTop: `1px solid var(--border-color)` }}>
          <button
            onClick={onClose}
            className="w-full py-3 rounded-lg font-semibold transition-all hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-2 group"
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
 * UserCard - Individual user card component
 */
function UserCard({ user, isDark }) {
  const isOnline = user.status === 'online';
  
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl transition-all group shadow-sm hover:shadow-md relative overflow-hidden" style={{
      backgroundColor: 'var(--card-bg)',
      border: `1px solid ${isDark ? '#4a4a4a' : '#f3f4f6'}`
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.borderColor = isDark ? '#6237A0' : '#c4b5fd';
      e.currentTarget.style.background = isDark ? 'linear-gradient(to right, rgba(98, 55, 160, 0.05), transparent)' : 'linear-gradient(to right, rgba(243, 232, 255, 1), transparent)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = isDark ? '#4a4a4a' : '#f3f4f6';
      e.currentTarget.style.backgroundColor = 'var(--card-bg)';
    }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-[#6237A0]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      
      {/* Avatar */}
      <div className="relative flex-shrink-0 z-10">
        <img
          src={user.avatar || "profile_picture/DefaultProfile.jpg"}
          alt={user.name}
          className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md group-hover:scale-105 transition-transform"
        />
        <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 ${isOnline ? 'bg-green-500' : 'bg-gray-400'} border-2 border-white rounded-full ${isOnline ? 'animate-pulse' : ''}`}></div>
      </div>

      {/* User Info */}
      <div className="flex-1 min-w-0 z-10">
        <h4 className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{user.name}</h4>
        <p className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>{user.email}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            {user.role}
          </span>
          <span className={`text-xs font-medium ${isOnline ? 'text-green-600' : 'text-gray-400'}`}>
            {isOnline ? 'Online' : 'Offline'}
          </span>
        </div>
      </div>

      {/* Action Icon */}
      <div className="flex-shrink-0 z-10">
        <button className="p-2 hover:text-[#6237A0] hover:bg-purple-50 rounded-lg transition-all" style={{ color: 'var(--text-secondary)' }}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
