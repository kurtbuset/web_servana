import React, { useState, useEffect } from "react";
import api from "../../api";
import Layout from "../../components/Layout";
import LoadingSpinner from "../../components/LoadingSpinner";
import { Edit3, Search, X, Eye, EyeOff } from "react-feather";
import { useTheme } from "../../context/ThemeContext";
import "../../../src/App.css";

export default function ManageAgents() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agents, setAgents] = useState([]); // [{sys_user_id, email, password, active}]
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);
  const [editEmail, setEditEmail] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editActive, setEditActive] = useState(true);
  const [modalError, setModalError] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [viewProfileModal, setViewProfileModal] = useState(null);
  const { isDark } = useTheme();
  const toggleSidebar = () => setMobileSidebarOpen((prev) => !prev);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // lightweight syntax check; adjust if you need stricter rules
  const isValidEmail = (value) => emailRegex.test(value.trim());

  const fetchAdmins = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/admins");
      const { admins, currentUserId } = data;

      setAgents(
        admins.map((a) => ({
          sys_user_id: a.sys_user_id,
          email: a.sys_user_email,
          password: a.sys_user_password,
          active: a.sys_user_is_active,
          profile_picture: a.profile_picture,
        }))
      );
      setCurrentUserId(currentUserId); // ✅
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch admins");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const filteredAgents = agents.filter((agent) =>
    agent.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const resetModalFields = () => {
    setCurrentEditId(null);
    setEditEmail("");
    setEditPassword("");
    setEditActive(true);
    setShowPassword(false);
    setModalError(null);
  };

  const openAddModal = () => {
    resetModalFields();
    setIsModalOpen(true);
  };

  const openEditModal = (agent) => {
    setCurrentEditId(agent.sys_user_id);
    setEditEmail(agent.email);
    setEditPassword("");
    setEditActive(agent.active);
    setShowPassword(false);
    setModalError(null);
    setIsModalOpen(true);
  };

  const emailAlreadyExists = (email, ignoreId = null) => {
    const lower = email.trim().toLowerCase();
    return agents.some(
      (a) =>
        a.email.trim().toLowerCase() === lower && a.sys_user_id !== ignoreId
    );
  };

  const saveAdmin = async () => {
    setModalError(null); // reset modal error

    // required fields
    if (!editEmail || !editPassword) {
      setModalError("Email and password are required.");
      return;
    }

    // validate email syntax
    if (!isValidEmail(editEmail)) {
      setModalError("Please enter a valid email address.");
      return;
    }

    // check duplicate (client-side) — ignore current id when editing
    if (emailAlreadyExists(editEmail, currentEditId)) {
      setModalError("Email is already taken.");
      return;
    }

    const updatedBy = 1; // TODO: replace with real user id from auth context/session

    try {
      if (currentEditId !== null) {
        await api.put(`admins/${currentEditId}`, {
          sys_user_email: editEmail,
          ...(editPassword !== "" && { sys_user_password: editPassword }),
          sys_user_is_active: editActive,
          sys_user_updated_by: updatedBy,
        });
      } else {
        await api.post("/admins", {
          sys_user_email: editEmail,
          sys_user_password: editPassword,
          sys_user_is_active: true,
          sys_user_created_by: updatedBy,
        });
      }

      await fetchAdmins();
      setIsModalOpen(false);
      resetModalFields();
    } catch (err) {
      // parse server error for duplicate / validation messages
      const serverMsg = err.response?.data?.message || "Failed to save admin";
      const lowerMsg = serverMsg.toLowerCase();
      if (
        lowerMsg.includes("duplicate") ||
        lowerMsg.includes("exists") ||
        lowerMsg.includes("taken") ||
        lowerMsg.includes("unique")
      ) {
        setModalError("Email is already taken.");
      } else if (lowerMsg.includes("email")) {
        // backend returned email validation error
        setModalError(serverMsg);
      } else {
        setModalError(serverMsg);
      }
    }
  };

  const toggleActiveStatus = async (sys_user_id) => {
    const idx = agents.findIndex((a) => a.sys_user_id === sys_user_id);
    if (idx === -1) return;
    const admin = agents[idx];
    const updatedBy = 1; // TODO: replace with real user id

    try {
      // optimistic update
      setAgents((prev) =>
        prev.map((a) =>
          a.sys_user_id === sys_user_id ? { ...a, active: !a.active } : a
        )
      );

      await api.put(`admins/${sys_user_id}/toggle`, {
        sys_user_is_active: !admin.active,
        sys_user_updated_by: updatedBy,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to toggle active status");
      // revert optimistic update
      setAgents((prev) =>
        prev.map((a) =>
          a.sys_user_id === sys_user_id ? { ...a, active: admin.active } : a
        )
      );
    }
  };

  return (
    <Layout>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${isDark ? '#2a2a2a' : '#f1f1f1'};
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #6237A0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #552C8C;
        }
      `}</style>
      <div className="flex flex-col h-full overflow-hidden" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 p-2 sm:p-3 md:p-4 overflow-hidden">
            <div className="p-3 sm:p-4 rounded-lg shadow-sm h-full flex flex-col" style={{ backgroundColor: 'var(--card-bg)' }}>
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <h1 className="text-lg sm:text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Manage Admins</h1>
              
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                {/* Search Bar */}
                <div className="flex items-center px-2.5 py-1.5 rounded-lg flex-1 sm:flex-initial sm:w-56 md:w-64" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                  <Search size={16} className="mr-2 flex-shrink-0" style={{ color: 'var(--text-secondary)' }} />
                  <input
                    type="text"
                    placeholder="Search admins..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent focus:outline-none text-xs w-full pr-6"
                    style={{ color: 'var(--text-primary)' }}
                  />
                  {searchQuery && (
                    <X
                      size={14}
                      className="cursor-pointer transition-colors"
                      style={{ color: 'var(--text-secondary)' }}
                      onClick={() => setSearchQuery("")}
                    />
                  )}
                </div>

                {/* Add Button */}
                <button
                  onClick={openAddModal}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap bg-[#6237A0] text-white hover:bg-[#552C8C]"
                >
                  + Add Admin
                </button>
              </div>
            </div>

            {/* Table Container */}
            <div className="flex-1 overflow-hidden">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-3 border-t-[#6237A0]" style={{ borderColor: 'var(--border-color)', borderTopColor: '#6237A0' }}></div>
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Loading administrators...</span>
                  </div>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-red-600 text-sm font-semibold">{error}</p>
                </div>
              ) : (
                <div className="overflow-x-auto overflow-y-auto h-full custom-scrollbar">
                  <table className="w-full text-xs">
                    <thead className="sticky top-0 z-10" style={{ color: 'var(--text-secondary)', backgroundColor: isDark ? '#2a2a2a' : '#f9fafb', borderBottom: `1px solid var(--border-color)` }}>
                      <tr>
                        <th className="py-2 px-2.5 sm:px-3 text-left font-semibold text-xs">Email</th>
                        <th className="py-2 px-2.5 sm:px-3 text-center font-semibold w-28 sm:w-32 text-xs">Status</th>
                      </tr>
                    </thead>
                    <tbody style={{ borderColor: 'var(--border-color)' }}>
                      {filteredAgents.length === 0 ? (
                        <tr>
                          <td colSpan={2} className="text-center py-12">
                            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                              {searchQuery ? "No admins found matching your search" : "No administrators available"}
                            </p>
                          </td>
                        </tr>
                      ) : (
                        filteredAgents.map((agent) => {
                        const isSelf = agent.sys_user_id === currentUserId;

                        return (
                          <tr
                            key={agent.sys_user_id}
                            className="transition-colors"
                            style={{ borderTop: `1px solid ${isDark ? 'rgba(74, 74, 74, 0.3)' : 'var(--border-color)'}` }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = isDark ? 'rgba(139, 92, 246, 0.05)' : 'rgba(249, 250, 251, 1)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                          >
                            <td className="py-2 px-2.5 sm:px-3">
                              <div className="flex items-center gap-1.5 sm:gap-2">
                                <img
                                  src={agent.profile_picture || "profile_picture/DefaultProfile.jpg"}
                                  alt="Profile"
                                  className="w-7 h-7 rounded-full object-cover flex-shrink-0"
                                />
                                <p className="text-xs break-words flex-1" style={{ color: 'var(--text-primary)' }}>
                                  {agent.email}
                                  {isSelf && (
                                    <span className="ml-2 text-xs text-purple-600 font-medium">(You)</span>
                                  )}
                                </p>
                                <div className="flex items-center gap-1 flex-shrink-0">
                                  <button
                                    onClick={() => setViewProfileModal(agent)}
                                    className="p-1 rounded transition-colors hover:text-[#6237A0]"
                                    style={{ color: 'var(--text-secondary)' }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.backgroundColor = isDark ? 'rgba(139, 92, 246, 0.1)' : 'rgba(243, 232, 255, 1)';
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.backgroundColor = 'transparent';
                                    }}
                                    title="View Profile"
                                  >
                                    <Eye size={14} />
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (!isSelf) {
                                        openEditModal(agent);
                                        setError(null);
                                      }
                                    }}
                                    disabled={isSelf}
                                    className={`p-1 rounded transition-colors ${
                                      isSelf
                                        ? "cursor-not-allowed"
                                        : "hover:text-[#6237A0]"
                                    }`}
                                    style={{ color: isSelf ? '#d1d5db' : 'var(--text-secondary)' }}
                                    onMouseEnter={(e) => {
                                      if (!isSelf) {
                                        e.currentTarget.style.backgroundColor = isDark ? 'rgba(139, 92, 246, 0.1)' : 'rgba(243, 232, 255, 1)';
                                      }
                                    }}
                                    onMouseLeave={(e) => {
                                      if (!isSelf) {
                                        e.currentTarget.style.backgroundColor = 'transparent';
                                      }
                                    }}
                                    title={isSelf ? "You cannot edit your own account" : "Edit"}
                                  >
                                    <Edit3 size={14} />
                                  </button>
                                </div>
                              </div>
                            </td>

                            <td className="py-2 px-2.5 sm:px-3 text-center">
                              <label
                                title={isSelf ? "You cannot deactivate your own account" : ""}
                                className={`inline-flex relative items-center ${
                                  isSelf ? "cursor-not-allowed" : "cursor-pointer"
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  className="sr-only peer"
                                  checked={agent.active}
                                  disabled={isSelf}
                                  onChange={() => toggleActiveStatus(agent.sys_user_id)}
                                />
                                <div className={`w-11 h-6 rounded-full peer transition-colors relative after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-transform peer-checked:after:translate-x-5 ${
                                  isSelf
                                    ? "bg-gray-200 peer-checked:bg-gray-400"
                                    : "bg-gray-300 peer-checked:bg-[#6237A0]"
                                }`} />
                              </label>
                            </td>
                          </tr>
                        );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
              <div className="rounded-lg shadow-xl p-5 sm:p-6 w-full max-w-md" style={{ backgroundColor: 'var(--card-bg)' }}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg sm:text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {currentEditId !== null ? "Edit Admin" : "Add Admin"}
                  </h3>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-1 rounded transition-colors"
                    style={{ color: 'var(--text-secondary)' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = isDark ? 'rgba(139, 92, 246, 0.05)' : 'rgba(249, 250, 251, 1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <X size={20} />
                  </button>
                </div>

                {modalError && (
                  <div className="bg-red-50 text-red-700 px-3 sm:px-4 py-2.5 rounded-lg mb-4 text-sm font-medium border border-red-200">
                    {modalError}
                  </div>
                )}

                <label className="block mb-4">
                  <span className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                    Email
                  </span>
                  <input
                    type="email"
                    className="w-full rounded-lg p-2.5 sm:p-3 text-sm focus:ring-2 focus:ring-[#6237A0] focus:border-transparent outline-none"
                    style={{
                      backgroundColor: 'var(--input-bg)',
                      color: 'var(--text-primary)',
                      border: `1px solid var(--border-color)`
                    }}
                    placeholder="admin@example.com"
                    value={editEmail}
                    onChange={(e) => {
                      setEditEmail(e.target.value);
                      if (modalError) setModalError(null);
                    }}
                    autoFocus
                  />
                </label>

                <label className="block mb-5 relative">
                  <span className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                    Password
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full rounded-lg p-2.5 sm:p-3 pr-10 text-sm focus:ring-2 focus:ring-[#6237A0] focus:border-transparent outline-none"
                    style={{
                      backgroundColor: 'var(--input-bg)',
                      color: 'var(--text-primary)',
                      border: `1px solid var(--border-color)`
                    }}
                    placeholder="Enter password"
                    value={editPassword}
                    onChange={(e) => {
                      setEditPassword(e.target.value);
                      if (modalError) setModalError(null);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-[38px] transition-colors"
                    style={{ color: 'var(--text-secondary)' }}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </label>

                <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3">
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      setModalError(null);
                    }}
                    className="w-full sm:w-auto px-4 py-2 rounded-lg font-medium transition-colors"
                    style={{ 
                      backgroundColor: isDark ? '#4a4a4a' : '#e5e7eb',
                      color: 'var(--text-primary)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = isDark ? '#5a5a5a' : '#d1d5db';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = isDark ? '#4a4a4a' : '#e5e7eb';
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveAdmin}
                    disabled={!editEmail.trim() || !editPassword.trim()}
                    className={`w-full sm:w-auto px-4 py-2 rounded-lg font-medium transition-colors ${
                      editEmail.trim() && editPassword.trim()
                        ? "bg-[#6237A0] text-white hover:bg-[#552C8C]"
                        : "cursor-not-allowed"
                    }`}
                    style={!(editEmail.trim() && editPassword.trim()) ? {
                      backgroundColor: isDark ? '#4a4a4a' : '#d1d5db',
                      color: isDark ? '#9ca3af' : '#6b7280'
                    } : {}}
                  >
                  </button>
                </div>
              </div>
            </div>
          )}

        {/* View Profile Modal */}
        {viewProfileModal && (
          <ViewProfileModal
            user={viewProfileModal}
            onClose={() => setViewProfileModal(null)}
            isDark={isDark}
          />
        )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </Layout>
  );
}

function ViewProfileModal({ user, onClose, isDark }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4 animate-fadeIn" onClick={onClose}>
      <div 
        className="rounded-lg shadow-xl w-full max-w-sm overflow-hidden animate-slideUp" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Purple Gradient Header */}
        <div className="relative bg-gradient-to-br from-[#8B5CF6] via-[#7C3AED] to-[#6D28D9] p-5 text-white">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>

          {/* Profile Icon and Title */}
          <div className="flex items-center gap-2 mb-5">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            <h3 className="text-xl font-bold">Admin Profile</h3>
          </div>

          {/* Profile Picture */}
          <div className="flex justify-center mb-4">
            <div className="relative">
              <img
                src={user.profile_picture || "profile_picture/DefaultProfile.jpg"}
                alt="Profile"
                className="w-28 h-28 rounded-full object-cover ring-4 ring-white/30"
              />
              {/* Online Status Indicator */}
              <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white"></div>
            </div>
          </div>

          {/* Email/Username */}
          <h4 className="text-xl font-bold text-center mb-4">
            {user.email.split('@')[0]}
          </h4>

          {/* Three Dots Menu */}
          <div className="flex justify-center gap-1.5">
            <div className="w-2 h-2 bg-white/40 rounded-full"></div>
            <div className="w-2 h-2 bg-white/40 rounded-full"></div>
            <div className="w-2 h-2 bg-white/40 rounded-full"></div>
          </div>
        </div>

        {/* Dark Content Section */}
        <div className="p-5 bg-[#2b2d31]">
          <div className="space-y-4">
            <div>
              <p className="text-[10px] font-semibold mb-1.5 uppercase tracking-wider text-gray-400">Email Address</p>
              <p className="text-sm font-medium text-white">{user.email}</p>
            </div>
            
            <div>
              <p className="text-[10px] font-semibold mb-1.5 uppercase tracking-wider text-gray-400">Role</p>
              <p className="text-sm font-medium text-white">Administrator</p>
            </div>

            <div>
              <p className="text-[10px] font-semibold mb-1.5 uppercase tracking-wider text-gray-400">Status</p>
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${user.active ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                <p className="text-sm font-medium text-white">
                  {user.active ? 'Active' : 'Inactive'}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full mt-5 px-4 py-2.5 bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-white text-sm font-semibold rounded-lg hover:from-[#7C3AED] hover:to-[#6D28D9] transition-all shadow-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
