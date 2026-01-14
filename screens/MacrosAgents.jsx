import React, { useEffect, useState } from "react";
import TopNavbar from "../components/TopNavbar";
import Sidebar from "../components/Sidebar";
import { Edit3, Search, X } from "react-feather";
import api from "../src/api";
import "../src/App.css";

export default function MacrosAgents() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [replies, setReplies] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentUserId] = useState(1); // authenticated user ID

  useEffect(() => {
    setLoading(true);
    setError("");

    api
      .get("/agents")
      .then((res) => {
        setReplies(
          res.data.macros.map((macro) => ({
            id: macro.canned_id,
            text: macro.canned_message,
            active: macro.canned_is_active,
            dept_id: macro.dept_id,
            department: macro.department?.dept_name || "All",
          }))
        );
        setDepartments(res.data.departments);
      })
      .catch((err) => {
        console.error("Failed to fetch macros:", err);
        setError("Failed to fetch Agent's canned messages.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filteredReplies = replies.filter((reply) => {
    const matchesSearch = reply.text.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = 
      selectedDepartment === "All" || 
      reply.dept_id === (departments.find((d) => d.dept_name === selectedDepartment)?.dept_id);
    return matchesSearch && matchesDepartment;
  });

  const handleSaveMacro = () => {
    if (currentEditId !== null) {
      const updated = replies.find((r) => r.id === currentEditId);
      if (!updated) return;

      const updatedMacro = {
        text: editText,
        active: updated.active,
        dept_id: updated.dept_id,
        updated_by: currentUserId,
      };

      api
        .put(`/agents/${currentEditId}`, updatedMacro)
        .then((res) => {
          setReplies((prev) =>
            prev.map((r) => (r.id === currentEditId ? res.data : r))
          );
          setIsModalOpen(false);
        })
        .catch((err) => console.error("Failed to update macro:", err));
    } else {
      const newMacro = {
        text: editText,
        active: true,
        dept_id: departments.find((d) => d.dept_name === selectedDepartment)?.dept_id || null,
        created_by: currentUserId,
      };

      api
        .post("/agents", newMacro)
        .then((res) => {
          setReplies((prev) => [...prev, res.data]);
          setIsModalOpen(false);
        })
        .catch((err) => console.error("Failed to add macro:", err));
    }
  };

  const handleToggleActive = (id) => {
    const reply = replies.find((r) => r.id === id);
    if (!reply) return;

    const updated = {
      ...reply,
      active: !reply.active,
      updated_by: currentUserId,
    };

    api
      .put(`/agents/${id}`, updated)
      .then((res) => {
        setReplies((prev) =>
          prev.map((r) => (r.id === id ? res.data : r))
        );
      })
      .catch((err) => console.error("Failed to toggle active:", err));
  };

  const handleChangeDepartment = (id, dept_id) => {
    const reply = replies.find((r) => r.id === id);
    if (!reply) return;

    const updated = {
      ...reply,
      dept_id: dept_id,
      updated_by: currentUserId,
    };

    api
      .put(`/agents/${id}`, updated)
      .then((res) => {
        setReplies((prev) =>
          prev.map((r) => (r.id === id ? res.data : r))
        );
      })
      .catch((err) => console.error("Failed to update department:", err));
  };

  const toggleDropdown = (name) => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  const toggleSidebar = () => {
    setMobileSidebarOpen((prev) => !prev);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden relative">
      <TopNavbar toggleSidebar={toggleSidebar} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          isMobile={true}
          isOpen={mobileSidebarOpen}
          toggleDropdown={toggleDropdown}
          openDropdown={openDropdown}
        />

        <Sidebar
          isMobile={false}
          toggleDropdown={toggleDropdown}
          openDropdown={openDropdown}
        />

        <main className="flex-1 bg-gray-100 p-15 overflow-y-auto transition-colors duration-300">
          <div className="bg-white p-4 rounded-lg min-h-[80vh] transition-all duration-300">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center bg-gray-100 px-3 py-2 rounded-md w-1/3 relative">
                <Search size={18} className="text-gray-500 mr-2" />
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
                onClick={() => {
                  setEditText("");
                  setSelectedDepartment("All");
                  setCurrentEditId(null);
                  setIsModalOpen(true);
                }}
                className="bg-[#6237A0] text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-800 transition-colors duration-300"
              >
                Add Macro
              </button>
            </div>

            <div className="overflow-y-auto max-h-[65vh] w-full custom-scrollbar">
              <table className="w-full text-sm text-left">
                <thead className="text-gray-500 bg-white sticky top-0 z-10 shadow-[inset_0_-1px_0_0_#000000]">
                  <tr>
                    <th className="py-2 px-3 pl-3">Replies</th>
                    <th className="py-2 px-3 text-center">Active Status</th>
                    <th className="py-2 px-3 text-center">Department</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReplies.map((reply) => (
                    <tr key={reply.id} className="hover:bg-gray-100">
                      <td className="py-2 px-3 align-top">
                        <div className="max-w-xs break-words text-gray-800 relative pr-6">
                          <span>{reply.text}</span>
                          <div className="absolute top-1/2 right-0 -translate-y-1/2">
                            <Edit3
                              size={18}
                              strokeWidth={1}
                              className="text-gray-500 cursor-pointer hover:text-purple-700"
                              onClick={() => {
                                setCurrentEditId(reply.id);
                                setEditText(reply.text);
                                setIsModalOpen(true);
                              }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-2 px-3 text-center">
                        <label className="inline-flex relative items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={reply.active}
                            onChange={() => handleToggleActive(reply.id)}
                          />
                          <div className="w-7 h-4 bg-gray-200 rounded-full peer peer-checked:bg-[#6237A0] transition-colors duration-300 relative after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-transform peer-checked:after:translate-x-3" />
                        </label>
                      </td>
                      <td className="py-2 px-3 text-center">
                        <select
                          className="rounded-md px-2 py-1 text-sm text-gray-800 border-none text-center"
                          value={reply.dept_id ?? ""}
                          onChange={(e) =>
                            handleChangeDepartment(
                              reply.id,
                              e.target.value ? parseInt(e.target.value) : null
                            )
                          }
                        >
                          <option value="">All</option>
                          {departments.map((dept) => (
                            <option
                              key={dept.dept_id}
                              value={dept.dept_id}
                              disabled={!dept.dept_is_active && dept.dept_id !== reply.dept_id}
                              className={!dept.dept_is_active ? "text-red-400" : ""}
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
                <p className="pt-15 text-center text-gray-600 py-4">Loading...</p>
              )}

              {error && (
                <p className="pt-15 text-center text-red-600 mb-4 font-semibold">{error}</p>
              )}
            </div>
          </div>

          {isModalOpen && (
            <div className="fixed inset-0 bg-gray-400/50 flex justify-center items-center z-50">
              <div className="bg-white rounded-lg shadow-xl p-6 w-96">
                <h2 className="text-md font-semibold mb-2">
                  {currentEditId ? "Edit Macro" : "Add Macro"}
                </h2>

                <label className="text-sm text-gray-700 mb-1 block">Message</label>
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="w-full border rounded-md p-2 text-sm mb-4 h-24 focus:ring-2 focus:ring-purple-500"
                />

                {!currentEditId && (
                  <div className="mb-4">
                    <label className="text-sm text-gray-700 mb-1 block">Department</label>
                    <select
                      className="w-full border rounded-md p-2 text-sm"
                      value={selectedDepartment}
                      onChange={(e) => setSelectedDepartment(e.target.value)}
                    >
                      <option value="All">All</option>
                      {departments.map((dept) => (
                        <option
                          key={dept.dept_id}
                          value={dept.dept_name}
                          disabled={!dept.dept_is_active}
                          className={!dept.dept_is_active ? "text-red-400" : ""}
                        >
                          {dept.dept_name}
                          {!dept.dept_is_active && " (Inactive)"}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="bg-gray-300 text-gray-800 px-4 py-1 rounded-lg text-sm hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveMacro}
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