import React, { useState, useEffect } from "react";
import TopNavbar from "../components/TopNavbar";
import Sidebar from "../components/Sidebar";
import { Edit3, Search, X } from "react-feather";
import api from "../src/api";
import "../src/App.css";

export default function AutoReplies() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editText, setEditText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [replies, setReplies] = useState([]);
  const [activeDepartments, setActiveDepartments] = useState([]);
  const [allDepartments, setAllDepartments] = useState([]);
  const [selectedDeptId, setSelectedDeptId] = useState(null);
  const [editingReplyId, setEditingReplyId] = useState(null);
  const [currentUserId] = useState(1); // Replace with real user ID from auth

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleSidebar = () => setMobileSidebarOpen((prev) => !prev);

  const filteredReplies = replies.filter((reply) =>
    reply.auto_reply_message?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    fetchReplies();
    fetchDepartments();
  }, []);

  const fetchReplies = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/auto-replies");
      setReplies(data);
    } catch (err) {
      console.error("Failed to fetch auto replies:", err);
      setError("Failed to fetch auto replies.");
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const [{ data: active }, { data: all }] = await Promise.all([
        api.get("/auto-replies/departments/active"),
        api.get("/auto-replies/departments/all"),
      ]);
      setActiveDepartments(active);
      setAllDepartments(all);
    } catch (err) {
      console.error("Failed to fetch departments:", err);
    }
  };

  const handleSaveEdit = async () => {
    if (!editText || !editingReplyId) return;

    try {
      await api.put(`/auto-replies/${editingReplyId}`, {
        message: editText,
        updated_by: currentUserId,
      });

      setIsEditModalOpen(false);
      setEditText("");
      setEditingReplyId(null);
      fetchReplies();
    } catch (err) {
      console.error("Failed to save reply:", err);
    }
  };

  const handleSaveAdd = async () => {
    if (!editText || !selectedDeptId) return;

    try {
      await api.post("/auto-replies", {
        message: editText,
        dept_id: selectedDeptId,
        created_by: currentUserId,
      });

      setIsAddModalOpen(false);
      setEditText("");
      setSelectedDeptId(null);
      fetchReplies();
    } catch (err) {
      console.error("Failed to add reply:", err);
    }
  };

  const handleStatusToggle = async (id) => {
    const reply = replies.find((r) => r.auto_reply_id === id);
    if (!reply) return;

    try {
      await api.patch(`/auto-replies/${id}/toggle`, {
        is_active: !reply.auto_reply_is_active,
        updated_by: currentUserId,
      });

      const updated = replies.map((r) =>
        r.auto_reply_id === id
          ? { ...r, auto_reply_is_active: !r.auto_reply_is_active }
          : r
      );
      setReplies(updated);
    } catch (err) {
      console.error("Failed to toggle status:", err);
    }
  };

  const handleDeptChange = async (id, newDeptId) => {
    try {
      await api.put(`/auto-replies/${id}`, {
        dept_id: newDeptId,
        updated_by: currentUserId,
      });

      const updated = replies.map((r) =>
        r.auto_reply_id === id ? { ...r, dept_id: newDeptId } : r
      );
      setReplies(updated);
    } catch (err) {
      console.error("Failed to update department:", err);
    }
  };

  const openEditModal = (reply) => {
    setEditText(reply.auto_reply_message);
    setEditingReplyId(reply.auto_reply_id);
    setIsEditModalOpen(true);
  };

  const openAddModal = () => {
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
                className="bg-[#6237A0] text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-800"
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
                  {filteredReplies.map((reply) => (
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
                              className="text-gray-500 cursor-pointer hover:text-purple-700"
                              onClick={() => openEditModal(reply)}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-2 px-3 text-center">
                        <label className="inline-flex relative items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={reply.auto_reply_is_active}
                            onChange={() =>
                              handleStatusToggle(reply.auto_reply_id)
                            }
                          />
                          <div className="w-7 h-4 bg-gray-200 rounded-full peer peer-checked:bg-[#6237A0] relative after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-transform peer-checked:after:translate-x-3" />
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
                          className="rounded-md px-2 py-1 text-sm text-gray-800 border-none text-center"
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
                  ))}
                </tbody>
              </table>

              {loading && (
                <p className="pt-15 text-center text-gray-600 py-4">
                  Loading...
                </p>
              )}
              {error && (
                <p className="pt-15 text-center text-red-600 mb-2 font-semibold">
                  {error}
                </p>
              )}
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
                    className="bg-purple-700 text-white px-4 py-1 rounded-lg text-sm hover:bg-purple-800"
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
                    className="bg-purple-700 text-white px-4 py-1 rounded-lg text-sm hover:bg-purple-800"
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
