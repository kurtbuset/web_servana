import React, { useState } from "react";
import TopNavbar from "../../../src/components/TopNavbar";
import Sidebar from "../../../src/components/Sidebar";
import LoadingSpinner from "../../components/LoadingSpinner";
import { Edit3, Search, X } from "react-feather";
import { useAutoReplies } from "../../hooks/useAutoReplies";
import { useUser } from "../../../src/context/UserContext";
import { toast } from "react-toastify";
import "../../App.css";

export default function AutoRepliesScreen() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editText, setEditText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDeptId, setSelectedDeptId] = useState(null);
  const [editingReplyId, setEditingReplyId] = useState(null);

  const { userData, hasPermission } = useUser();
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

  const toggleSidebar = () => setMobileSidebarOpen((prev) => !prev);

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
    <>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
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
      <div className="flex flex-col h-screen overflow-hidden">
        <TopNavbar toggleSidebar={toggleSidebar} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          isMobile={true}
          isOpen={mobileSidebarOpen}
          toggleDropdown={setOpenDropdown}
          openDropdown={openDropdown}
        />
        <Sidebar
          isMobile={false}
          toggleDropdown={setOpenDropdown}
          openDropdown={openDropdown}
        />

        <main className="flex-1 bg-gradient-to-br from-[#F7F5FB] via-[#F0EBFF] to-[#F7F5FB] p-2 sm:p-3 md:p-4 overflow-hidden">
          <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm h-full flex flex-col">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <h1 className="text-lg sm:text-xl font-bold text-gray-800">Auto Replies</h1>
              
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                {/* Search Bar */}
                <div className="flex items-center bg-gray-100 px-2.5 py-1.5 rounded-lg flex-1 sm:flex-initial sm:w-56 md:w-64">
                  <Search size={16} className="text-gray-500 mr-2 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Search replies..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent focus:outline-none text-xs w-full pr-6"
                  />
                  {searchQuery && (
                    <X
                      size={14}
                      className="text-gray-500 cursor-pointer hover:text-gray-700 transition-colors"
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
                    <div className="animate-spin rounded-full h-8 w-8 border-3 border-gray-200 border-t-[#6237A0]"></div>
                    <span className="text-gray-600 text-sm">Loading auto-replies...</span>
                  </div>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-red-600 text-sm font-semibold">{error}</p>
                </div>
              ) : (
                <div className="overflow-x-auto overflow-y-auto h-full custom-scrollbar">
                  <table className="w-full text-xs">
                    <thead className="text-gray-600 bg-gray-50 sticky top-0 z-10 border-b border-gray-200">
                      <tr>
                        <th className="py-2 px-2.5 sm:px-3 text-left font-semibold text-xs">Reply Message</th>
                        <th className="py-2 px-2.5 sm:px-3 text-center font-semibold w-28 sm:w-32 text-xs">Status</th>
                        <th className="py-2 px-2.5 sm:px-3 text-center font-semibold w-36 sm:w-40 text-xs">Department</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredReplies.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="text-center py-12">
                            <p className="text-gray-500 text-sm">
                              {searchQuery ? "No replies found matching your search" : "No auto-replies available"}
                            </p>
                          </td>
                        </tr>
                      ) : (
                      filteredReplies.map((reply) => (
                        <tr
                          key={reply.auto_reply_id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="py-2 px-2.5 sm:px-3">
                            <div className="flex items-start gap-1.5 sm:gap-2">
                              <p className="text-xs text-gray-800 break-words flex-1 line-clamp-2">
                                {reply.auto_reply_message}
                              </p>
                              <button
                                onClick={() => openEditModal(reply)}
                                disabled={!canEditAutoReplies}
                                className={`flex-shrink-0 p-1 rounded transition-colors ${
                                  canEditAutoReplies
                                    ? "text-gray-500 hover:text-[#6237A0] hover:bg-purple-50"
                                    : "text-gray-300 cursor-not-allowed"
                                }`}
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
                              className={`rounded-lg px-2 py-1 text-xs border border-gray-200 ${
                                canEditAutoReplies
                                  ? "text-gray-800 cursor-pointer hover:border-[#6237A0] focus:outline-none focus:ring-2 focus:ring-[#6237A0]/30"
                                  : "text-gray-400 cursor-not-allowed bg-gray-100"
                              }`}
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
              <div className="bg-white rounded-lg shadow-xl p-5 sm:p-6 w-full max-w-md">
                <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">
                  Edit Reply
                </h2>
                <label className="text-sm text-gray-700 mb-2 block font-medium">
                  Message
                </label>
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  placeholder="Enter reply message"
                  className="w-full border border-gray-300 rounded-lg p-2.5 sm:p-3 text-sm mb-5 h-24 focus:ring-2 focus:ring-[#6237A0] focus:border-transparent outline-none resize-none"
                  autoFocus
                />
                <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3">
                  <button
                    onClick={() => setIsEditModalOpen(false)}
                    className="w-full sm:w-auto bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    disabled={!canEditAutoReplies || !editText.trim()}
                    className={`w-full sm:w-auto px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      canEditAutoReplies && editText.trim()
                        ? "bg-[#6237A0] text-white hover:bg-[#552C8C]"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
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
              <div className="bg-white rounded-lg shadow-xl p-5 sm:p-6 w-full max-w-md">
                <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">
                  Add New Reply
                </h2>
                <label className="text-sm text-gray-700 mb-2 block font-medium">
                  Message
                </label>
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  placeholder="Enter reply message"
                  className="w-full border border-gray-300 rounded-lg p-2.5 sm:p-3 text-sm mb-4 h-24 focus:ring-2 focus:ring-[#6237A0] focus:border-transparent outline-none resize-none"
                  autoFocus
                />
                <label className="text-sm text-gray-700 mb-2 block font-medium">
                  Department
                </label>
                <select
                  value={selectedDeptId ?? ""}
                  onChange={(e) =>
                    setSelectedDeptId(
                      e.target.value ? parseInt(e.target.value) : null
                    )
                  }
                  className="w-full border border-gray-300 rounded-lg p-2.5 sm:p-3 text-sm mb-5 focus:ring-2 focus:ring-[#6237A0] focus:border-transparent outline-none"
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
                    className="w-full sm:w-auto bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveAdd}
                    disabled={!canEditAutoReplies || !editText.trim()}
                    className={`w-full sm:w-auto px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      canEditAutoReplies && editText.trim()
                        ? "bg-[#6237A0] text-white hover:bg-[#552C8C]"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
    </>
  );
}
