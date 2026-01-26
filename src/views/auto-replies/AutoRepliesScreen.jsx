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

        <main className="flex-1 bg-gray-100 p-[60px] transition-colors duration-300 flex flex-col min-h-0 w-full overflow-auto">
          <div className="bg-white p-4 rounded-lg flex flex-col flex-1 min-h-0 transition-all duration-300">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center bg-gray-100 px-3 py-2 rounded-md w-1/3 relative">
                <Search size={18} strokeWidth={1} className="text-gray-500 mr-2" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent focus:outline-none text-sm w-full pr-6"
                />
                {searchQuery && (
                  <X
                    size={16}
                    className="text-gray-500 cursor-pointer absolute right-3"
                    onClick={() => setSearchQuery("")}
                  />
                )}
              </div>

              <button
                onClick={openAddModal}
                disabled={!canEditAutoReplies}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  canEditAutoReplies
                    ? "bg-[#6237A0] text-white hover:bg-purple-800"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                title={!canEditAutoReplies ? "You don't have permission to edit auto-replies" : ""}
              >
                Add Replies
              </button>
            </div>

            <div className="flex-1 overflow-x-auto overflow-y-auto custom-scrollbar">
              <table className="w-full text-sm text-left">
                <thead className="text-gray-500 bg-white sticky top-0 z-10 shadow-[inset_0_-1px_0_0_#000000]">
                  <tr>
                    <th className="py-2 px-3">Replies</th>
                    <th className="py-2 px-3 text-center">Active Status</th>
                    <th className="py-2 px-3 text-center">Department</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <LoadingSpinner variant="table" message="Loading auto-replies..." />
                  ) : error ? (
                    <tr>
                      <td colSpan={3} className="text-center py-8 text-red-600">
                        {error}
                      </td>
                    </tr>
                  ) : filteredReplies.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="text-center py-8 text-gray-600">
                        No auto-replies found
                      </td>
                    </tr>
                  ) : (
                    filteredReplies.map((reply) => (
                      <tr
                        key={reply.auto_reply_id}
                        className="hover:bg-gray-100 transition-colors"
                      >
                        <td className="py-2 px-3 align-top">
                          <div className="max-w-xs break-words text-gray-800 relative pr-6">
                            <span>{reply.auto_reply_message}</span>
                            <div className="absolute top-1/2 right-0 -translate-y-1/2">
                              <Edit3
                                size={18}
                                className={`transition-colors ${
                                  canEditAutoReplies
                                    ? "text-gray-500 cursor-pointer hover:text-purple-700"
                                    : "text-gray-300 cursor-not-allowed"
                                }`}
                                onClick={() => openEditModal(reply)}
                                title={!canEditAutoReplies ? "You don't have permission to edit auto-replies" : ""}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="py-2 px-3 text-center">
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
                            <div className={`w-7 h-4 rounded-full peer relative after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-transform peer-checked:after:translate-x-3 ${
                              canEditAutoReplies
                                ? "bg-gray-200 peer-checked:bg-[#6237A0]"
                                : "bg-gray-100 peer-checked:bg-gray-300"
                            }`} />
                          </label>
                        </td>
                        <td className="py-2 px-3 text-center">
                          <select
                            value={reply.dept_id ?? ""}
                            onChange={(e) =>
                              handleDeptChange(
                                reply.auto_reply_id,
                                e.target.value ? parseInt(e.target.value) : null
                              )
                            }
                            disabled={!canEditAutoReplies}
                            className={`rounded-md px-2 py-1 text-sm border-none text-center ${
                              canEditAutoReplies
                                ? "text-gray-800 cursor-pointer"
                                : "text-gray-400 cursor-not-allowed bg-gray-100"
                            }`}
                            title={!canEditAutoReplies ? "You don't have permission to edit auto-replies" : ""}
                          >
                            <option value="">All</option>
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
          </div>

          {/* Edit Modal */}
          {isEditModalOpen && (
            <div className="fixed inset-0 bg-gray-400/50 flex justify-center items-center z-50">
              <div className="bg-white rounded-lg shadow-xl p-6 w-96">
                <h2 className="text-md font-semibold mb-2">Edit Reply</h2>
                <label className="text-sm text-gray-700 mb-1 block">
                  Message
                </label>
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="w-full border rounded-md p-2 text-sm mb-4 h-24 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setIsEditModalOpen(false)}
                    className="bg-gray-300 text-gray-800 px-4 py-1 rounded-lg text-sm hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    disabled={!canEditAutoReplies}
                    className={`px-4 py-1 rounded-lg text-sm transition-colors ${
                      canEditAutoReplies
                        ? "bg-purple-700 text-white hover:bg-purple-800"
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
            <div className="fixed inset-0 bg-gray-400/50 flex justify-center items-center z-50">
              <div className="bg-white rounded-lg shadow-xl p-6 w-96">
                <h2 className="text-md font-semibold mb-2">Add New Reply</h2>
                <label className="text-sm text-gray-700 mb-1 block">
                  Message
                </label>
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="w-full border rounded-md p-2 text-sm mb-4 h-24 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
                <label className="text-sm text-gray-700 mb-1 block">
                  Department
                </label>
                <select
                  value={selectedDeptId ?? ""}
                  onChange={(e) =>
                    setSelectedDeptId(
                      e.target.value ? parseInt(e.target.value) : null
                    )
                  }
                  className="w-full border rounded-md p-2 text-sm mb-4 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                >
                  <option value="">All</option>
                  {activeDepartments.map((dept) => (
                    <option key={dept.dept_id} value={dept.dept_id}>
                      {dept.dept_name}
                    </option>
                  ))}
                </select>

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setIsAddModalOpen(false)}
                    className="bg-gray-300 text-gray-800 px-4 py-1 rounded-lg text-sm hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveAdd}
                    disabled={!canEditAutoReplies}
                    className={`px-4 py-1 rounded-lg text-sm transition-colors ${
                      canEditAutoReplies
                        ? "bg-purple-700 text-white hover:bg-purple-800"
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
  );
}
