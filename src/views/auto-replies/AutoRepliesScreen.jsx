import React, { useState } from "react";
import Layout from "../../components/Layout";
import LoadingSpinner from "../../components/LoadingSpinner";
import { Edit3, Search, X } from "react-feather";
import { useAutoReplies } from "../../hooks/useAutoReplies";
import { useUser } from "../../../src/context/UserContext";
import { useTheme } from "../../../src/context/ThemeContext";
import { toast } from "react-toastify";
import "../../App.css";

export default function AutoRepliesScreen() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editText, setEditText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDeptId, setSelectedDeptId] = useState(null);
  const [editingReplyId, setEditingReplyId] = useState(null);

  const { userData, hasPermission } = useUser();
  const { isDark } = useTheme();
  const canEditAutoReplies = hasPermission("priv_can_manage_auto_reply");
  const {
    replies,
    activeDepartments,
    allDepartments,
    loading,
    error,
    createAutoReply,
    updateAutoReply,
    toggleAutoReply,
    updateDepartment,
  } = useAutoReplies();

  const filteredReplies = replies.filter((reply) =>
    reply.auto_reply_message?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSaveEdit = async () => {
    if (!canEditAutoReplies) {
      console.warn("User does not have permission to edit auto-replies");
      toast.error("You don't have permission to edit auto-replies");
      return;
    }
    
    if (!editingReplyId || !userData?.sys_user_id) return;

    const success = await updateAutoReply(
      editingReplyId,
      editText,
      undefined,
      userData.sys_user_id
    );

    if (success) {
      setIsEditModalOpen(false);
      setEditText("");
      setEditingReplyId(null);
    }
  };

  const handleSaveAdd = async () => {
    if (!canEditAutoReplies) {
      console.warn("User does not have permission to edit auto-replies");
      toast.error("You don't have permission to edit auto-replies");
      return;
    }
    
    if (!userData?.sys_user_id) return;

    const success = await createAutoReply(
      editText,
      selectedDeptId,
      userData.sys_user_id
    );

    if (success) {
      setIsAddModalOpen(false);
      setEditText("");
      setSelectedDeptId(null);
    }
  };

  const handleStatusToggle = async (id, currentActive) => {
    if (!canEditAutoReplies) {
      console.warn("User does not have permission to edit auto-replies");
      toast.error("You don't have permission to edit auto-replies");
      return;
    }
    
    if (!userData?.sys_user_id) return;
    await toggleAutoReply(id, currentActive, userData.sys_user_id);
  };

  const handleDeptChange = async (id, newDeptId) => {
    if (!canEditAutoReplies) {
      console.warn("User does not have permission to edit auto-replies");
      toast.error("You don't have permission to edit auto-replies");
      return;
    }
    
    if (!userData?.sys_user_id) return;
    await updateDepartment(id, newDeptId, userData.sys_user_id);
  };

  const openEditModal = (reply) => {
    if (!canEditAutoReplies) {
      console.warn("User does not have permission to edit auto-replies");
      toast.error("You don't have permission to edit auto-replies");
      return;
    }
    
    setEditText(reply.auto_reply_message);
    setEditingReplyId(reply.auto_reply_id);
    setIsEditModalOpen(true);
  };

  const openAddModal = () => {
    if (!canEditAutoReplies) {
      console.warn("User does not have permission to edit auto-replies");
      toast.error("You don't have permission to edit auto-replies");
      return;
    }
    
    setEditText("");
    setSelectedDeptId(activeDepartments[0]?.dept_id || null);
    setIsAddModalOpen(true);
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
              <h1 className="text-lg sm:text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Auto Replies</h1>
              
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                {/* Search Bar */}
                <div className="flex items-center px-2.5 py-1.5 rounded-lg flex-1 sm:flex-initial sm:w-56 md:w-64" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                  <Search size={16} className="mr-2 flex-shrink-0" style={{ color: 'var(--text-secondary)' }} />
                  <input
                    type="text"
                    placeholder="Search replies..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent focus:outline-none text-xs w-full pr-6"
                    style={{ color: 'var(--text-primary)' }}
                  />
                  {searchQuery && (
                    <X
                      size={14}
                      className="cursor-pointer hover:text-gray-700 transition-colors"
                      style={{ color: 'var(--text-secondary)' }}
                      onClick={() => setSearchQuery("")}
                    />
                  )}
                </div>

                {/* Add Button */}
                <button
                  onClick={openAddModal}
                  disabled={!canEditAutoReplies}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                    canEditAutoReplies
                      ? "bg-[#6237A0] text-white hover:bg-[#552C8C]"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                  title={!canEditAutoReplies ? "You don't have permission to edit auto-replies" : ""}
                >
                  + Add Reply
                </button>
              </div>
            </div>

            {/* Table Container */}
            <div className="flex-1 overflow-hidden">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-3 border-t-[#6237A0]" style={{ borderColor: 'var(--border-color)', borderTopColor: '#6237A0' }}></div>
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Loading auto-replies...</span>
                  </div>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-red-600 text-sm font-semibold">{error}</p>
                </div>
              ) : (
                <div className="overflow-x-auto overflow-y-auto h-full custom-scrollbar">
                  <table className="w-full text-xs">
                    <thead className="sticky top-0 z-10 border-b" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)', borderColor: 'var(--border-color)' }}>
                      <tr>
                        <th className="py-2 px-2.5 sm:px-3 text-left font-semibold text-xs">Reply Message</th>
                        <th className="py-2 px-2.5 sm:px-3 text-center font-semibold w-28 sm:w-32 text-xs">Status</th>
                        <th className="py-2 px-2.5 sm:px-3 text-center font-semibold w-36 sm:w-40 text-xs">Department</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y" style={{ borderColor: isDark ? 'rgba(74, 74, 74, 0.3)' : 'var(--border-color)' }}>
                      {filteredReplies.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="text-center py-12">
                            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                              {searchQuery ? "No replies found matching your search" : "No auto-replies available"}
                            </p>
                          </td>
                        </tr>
                      ) : (
                      filteredReplies.map((reply) => (
                        <tr
                          key={reply.auto_reply_id}
                          className="transition-colors"
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = isDark ? 'rgba(139, 92, 246, 0.05)' : 'rgba(249, 250, 251, 1)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          <td className="py-2 px-2.5 sm:px-3">
                            <div className="flex items-start gap-1.5 sm:gap-2">
                              <p className="text-xs break-words flex-1 line-clamp-2" style={{ color: 'var(--text-primary)' }}>
                                {reply.auto_reply_message}
                              </p>
                              <button
                                onClick={() => openEditModal(reply)}
                                disabled={!canEditAutoReplies}
                                className={`flex-shrink-0 p-1 rounded transition-colors ${
                                  canEditAutoReplies
                                    ? "hover:text-[#6237A0] hover:bg-purple-50"
                                    : "cursor-not-allowed"
                                }`}
                                style={canEditAutoReplies ? { color: 'var(--text-secondary)' } : { color: isDark ? '#4a4a4a' : '#d1d5db' }}
                                title={!canEditAutoReplies ? "You don't have permission to edit auto-replies" : "Edit"}
                              >
                                <Edit3 size={14} />
                              </button>
                            </div>
                          </td>

                          <td className="py-2 px-2.5 sm:px-3 text-center">
                            <label className={`inline-flex relative items-center ${
                              canEditAutoReplies ? "cursor-pointer" : "cursor-not-allowed"
                            }`}>
                              <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={reply.auto_reply_is_active}
                                onChange={() =>
                                  handleStatusToggle(
                                    reply.auto_reply_id,
                                    reply.auto_reply_is_active
                                  )
                                }
                                disabled={!canEditAutoReplies}
                                title={!canEditAutoReplies ? "You don't have permission to edit auto-replies" : ""}
                              />
                              <div className={`w-11 h-6 rounded-full peer transition-colors relative after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-transform peer-checked:after:translate-x-5 ${
                                canEditAutoReplies
                                  ? "bg-gray-300 peer-checked:bg-[#6237A0]"
                                  : "bg-gray-200 peer-checked:bg-gray-400"
                              }`} />
                            </label>
                          </td>

                          <td className="py-2 px-2.5 sm:px-3 text-center">
                            <select
                              value={reply.dept_id ?? ""}
                              onChange={(e) =>
                                handleDeptChange(
                                  reply.auto_reply_id,
                                  e.target.value ? parseInt(e.target.value) : null
                                )
                              }
                              disabled={!canEditAutoReplies}
                              className={`rounded-lg px-2 py-1 text-xs border ${
                                canEditAutoReplies
                                  ? "cursor-pointer hover:border-[#6237A0] focus:outline-none focus:ring-2 focus:ring-[#6237A0]/30"
                                  : "cursor-not-allowed"
                              }`}
                              style={canEditAutoReplies ? {
                                backgroundColor: 'var(--input-bg)',
                                borderColor: 'var(--border-color)',
                                color: 'var(--text-primary)'
                              } : {
                                backgroundColor: isDark ? '#2a2a2a' : '#f3f4f6',
                                borderColor: 'var(--border-color)',
                                color: 'var(--text-secondary)'
                              }}
                              title={!canEditAutoReplies ? "You don't have permission to edit auto-replies" : ""}
                            >
                              <option value="">All Departments</option>
                              {allDepartments.map((dept) => (
                                <option
                                  key={dept.dept_id}
                                  value={dept.dept_id}
                                  disabled={
                                    !dept.dept_is_active &&
                                    dept.dept_id !== reply.dept_id
                                  }
                                  className={
                                    !dept.dept_is_active ? "text-red-400" : ""
                                  }
                                >
                                  {dept.dept_name}
                                  {!dept.dept_is_active && " (Inactive)"}
                                </option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Edit Modal */}
          {isEditModalOpen && (
            <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
              <div className="rounded-lg shadow-xl p-5 sm:p-6 w-full max-w-md" style={{ backgroundColor: 'var(--card-bg)' }}>
                <h2 className="text-lg sm:text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                  Edit Reply
                </h2>
                <label className="text-sm mb-2 block font-medium" style={{ color: 'var(--text-primary)' }}>
                  Message
                </label>
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  placeholder="Enter reply message"
                  className="w-full border rounded-lg p-2.5 sm:p-3 text-sm mb-5 h-24 focus:ring-2 focus:ring-[#6237A0] focus:border-transparent outline-none resize-none"
                  style={{ 
                    backgroundColor: 'var(--input-bg)', 
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)'
                  }}
                  autoFocus
                />
                <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3">
                  <button
                    onClick={() => setIsEditModalOpen(false)}
                    className="w-full sm:w-auto px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    style={{ 
                      backgroundColor: 'var(--bg-tertiary)', 
                      color: 'var(--text-primary)'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    disabled={!canEditAutoReplies || !editText.trim()}
                    className={`w-full sm:w-auto px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      canEditAutoReplies && editText.trim()
                        ? "bg-[#6237A0] text-white hover:bg-[#552C8C]"
                        : "cursor-not-allowed"
                    }`}
                    style={!canEditAutoReplies || !editText.trim() ? {
                      backgroundColor: isDark ? '#4a4a4a' : '#d1d5db',
                      color: isDark ? '#9ca3af' : '#6b7280'
                    } : {}}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Add Modal */}
          {isAddModalOpen && (
            <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
              <div className="rounded-lg shadow-xl p-5 sm:p-6 w-full max-w-md" style={{ backgroundColor: 'var(--card-bg)' }}>
                <h2 className="text-lg sm:text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                  Add New Reply
                </h2>
                <label className="text-sm mb-2 block font-medium" style={{ color: 'var(--text-primary)' }}>
                  Message
                </label>
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  placeholder="Enter reply message"
                  className="w-full border rounded-lg p-2.5 sm:p-3 text-sm mb-4 h-24 focus:ring-2 focus:ring-[#6237A0] focus:border-transparent outline-none resize-none"
                  style={{ 
                    backgroundColor: 'var(--input-bg)', 
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)'
                  }}
                  autoFocus
                />
                <label className="text-sm mb-2 block font-medium" style={{ color: 'var(--text-primary)' }}>
                  Department
                </label>
                <select
                  value={selectedDeptId ?? ""}
                  onChange={(e) =>
                    setSelectedDeptId(
                      e.target.value ? parseInt(e.target.value) : null
                    )
                  }
                  className="w-full border rounded-lg p-2.5 sm:p-3 text-sm mb-5 focus:ring-2 focus:ring-[#6237A0] focus:border-transparent outline-none"
                  style={{ 
                    backgroundColor: 'var(--input-bg)', 
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)'
                  }}
                >
                  <option value="">All Departments</option>
                  {activeDepartments.map((dept) => (
                    <option key={dept.dept_id} value={dept.dept_id}>
                      {dept.dept_name}
                    </option>
                  ))}
                </select>

                <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3">
                  <button
                    onClick={() => setIsAddModalOpen(false)}
                    className="w-full sm:w-auto px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    style={{ 
                      backgroundColor: 'var(--bg-tertiary)', 
                      color: 'var(--text-primary)'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveAdd}
                    disabled={!canEditAutoReplies || !editText.trim()}
                    className={`w-full sm:w-auto px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      canEditAutoReplies && editText.trim()
                        ? "bg-[#6237A0] text-white hover:bg-[#552C8C]"
                        : "cursor-not-allowed"
                    }`}
                    style={!canEditAutoReplies || !editText.trim() ? {
                      backgroundColor: isDark ? '#4a4a4a' : '#d1d5db',
                      color: isDark ? '#9ca3af' : '#6b7280'
                    } : {}}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
