import React, { useState, useEffect } from "react";
import api from "../../api";
import TopNavbar from "../../../src/components/TopNavbar";
import Sidebar from "../../../src/components/Sidebar/index";
import LoadingSpinner from "../../components/LoadingSpinner";
import { Edit3, Search, X, Eye, EyeOff } from "react-feather";
import "../../../src/App.css";

/*
  Refactor notes (July 17, 2025 @ Asia/Manila):
  -------------------------------------------------
  • Switched from generic "username" field to explicit "email" across state, props, and table display.
  • Client-side email syntax validation added before save (simple RFC-style regex; adjust as needed).
  • Client-side uniqueness check added (case-insensitive) against already-fetched agents before calling API.
  • Server-side duplicate detection: parse error response; if server indicates unique constraint violation, show specific error.
  • Reused existing modalError inline alert region — preserves design; no layout changes.
  • Minimal text updates (labels: "Email" instead of "Username") — considered a copy change, not a layout/design change.
*/

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
        {/* Mobile Sidebar */}
        <Sidebar
          isMobile={true}
          isOpen={mobileSidebarOpen}
          toggleDropdown={setOpenDropdown}
          openDropdown={openDropdown}
        />
        {/* Desktop Sidebar */}
        <Sidebar
          isMobile={false}
          toggleDropdown={setOpenDropdown}
          openDropdown={openDropdown}
        />

        <main className="flex-1 bg-gradient-to-br from-[#F7F5FB] via-[#F0EBFF] to-[#F7F5FB] p-2 sm:p-3 md:p-4 overflow-hidden">
          <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm h-full flex flex-col">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <h1 className="text-lg sm:text-xl font-bold text-gray-800">Manage Admins</h1>
              
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                {/* Search Bar */}
                <div className="flex items-center bg-gray-100 px-2.5 py-1.5 rounded-lg flex-1 sm:flex-initial sm:w-56 md:w-64">
                  <Search size={16} className="text-gray-500 mr-2 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Search admins..."
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
                    <div className="animate-spin rounded-full h-8 w-8 border-3 border-gray-200 border-t-[#6237A0]"></div>
                    <span className="text-gray-600 text-sm">Loading administrators...</span>
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
                        <th className="py-2 px-2.5 sm:px-3 text-left font-semibold text-xs">Email</th>
                        <th className="py-2 px-2.5 sm:px-3 text-center font-semibold w-28 sm:w-32 text-xs">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredAgents.length === 0 ? (
                        <tr>
                          <td colSpan={2} className="text-center py-12">
                            <p className="text-gray-500 text-sm">
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
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="py-2 px-2.5 sm:px-3">
                              <div className="flex items-center gap-1.5 sm:gap-2">
                                <p className="text-xs text-gray-800 break-words flex-1">
                                  {agent.email}
                                  {isSelf && (
                                    <span className="ml-2 text-xs text-purple-600 font-medium">(You)</span>
                                  )}
                                </p>
                                <button
                                  onClick={() => {
                                    if (!isSelf) {
                                      openEditModal(agent);
                                      setError(null);
                                    }
                                  }}
                                  disabled={isSelf}
                                  className={`flex-shrink-0 p-1 rounded transition-colors ${
                                    isSelf
                                      ? "text-gray-300 cursor-not-allowed"
                                      : "text-gray-500 hover:text-[#6237A0] hover:bg-purple-50"
                                  }`}
                                  title={isSelf ? "You cannot edit your own account" : "Edit"}
                                >
                                  <Edit3 size={14} />
                                </button>
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
              <div className="bg-white rounded-lg shadow-xl p-5 sm:p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                    {currentEditId !== null ? "Edit Admin" : "Add Admin"}
                  </h3>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-100 transition-colors"
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
                  <span className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </span>
                  <input
                    type="email"
                    className="w-full rounded-lg border border-gray-300 p-2.5 sm:p-3 text-sm focus:ring-2 focus:ring-[#6237A0] focus:border-transparent outline-none"
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
                  <span className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full rounded-lg border border-gray-300 p-2.5 sm:p-3 pr-10 text-sm focus:ring-2 focus:ring-[#6237A0] focus:border-transparent outline-none"
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
                    className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-700"
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
                    className="w-full sm:w-auto px-4 py-2 rounded-lg bg-gray-200 text-gray-800 font-medium hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveAdmin}
                    disabled={!editEmail.trim() || !editPassword.trim()}
                    className={`w-full sm:w-auto px-4 py-2 rounded-lg font-medium transition-colors ${
                      editEmail.trim() && editPassword.trim()
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
