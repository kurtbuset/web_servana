import React, { useEffect, useState } from "react";
import TopNavbar from "../components/TopNavbar";
import Sidebar from "../components/Sidebar";
import { Edit3, Search, X } from "react-feather";
import api from "../src/api";
import { toast } from "react-toastify";
import "../src/App.css";

export default function MacrosClients() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [replies, setReplies] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUserId] = useState(1); // Temporary authenticated user

  useEffect(() => {
    setLoading(true);
    setError(null);

    api
      .get("/clients")
      .then((res) => {
        const mappedReplies = (res.data.macros || []).map((m) => ({
          id: m.canned_id,
          text: m.canned_message,
          active: m.canned_is_active,
          dept_id: m.dept_id,
          department: m.department?.dept_name || "All",
        }));
        setReplies(mappedReplies);
        setDepartments(res.data.departments || []);
      })
      .catch((err) => {
        console.error("Failed to fetch macros:", err);
        setError("Failed to fetch Client's Canned messages.");
        toast.error("Failed to load macros. Please refresh the page.", {
          position: "top-right",
          autoClose: 5000,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filteredReplies = replies.filter((reply) => {
    const matchesSearch = reply.text
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesDepartment =
      selectedDepartment === "All" ||
      reply.dept_id ===
        departments.find((d) => d.dept_name === selectedDepartment)?.dept_id;
    return matchesSearch && matchesDepartment;
  });

  const handleSaveMacro = () => {
    if (!editText.trim()) {
      toast.error("Message cannot be empty", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (currentEditId !== null) {
      // Check for duplicate when editing (excluding current macro)
      const isDuplicate = replies.some(
        (r) => r.id !== currentEditId && r.text.toLowerCase().trim() === editText.toLowerCase().trim()
      );

      if (isDuplicate) {
        toast.error("This macro already exists", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }

      const updated = replies.find((r) => r.id === currentEditId);
      if (!updated) return;

      const updatedMacro = {
        id: currentEditId,
        text: editText,
        active: updated.active,
        dept_id: updated.dept_id,
        updated_by: currentUserId,
      };

      api
        .put(`/clients/${currentEditId}`, updatedMacro)
        .then((res) => {
          const updatedReply = {
            id: res.data.id,
            text: res.data.text,
            active: res.data.active,
            dept_id: res.data.dept_id,
            department: res.data.department,
          };
          setReplies((prev) =>
            prev.map((r) => (r.id === currentEditId ? updatedReply : r))
          );
          setIsModalOpen(false);
          toast.success("Macro updated successfully", {
            position: "top-right",
            autoClose: 3000,
          });
        })
        .catch((err) => {
          console.error("Failed to update macro:", err);
          const errorMessage = err.response?.data?.error || "Failed to update macro";
          toast.error(errorMessage, {
            position: "top-right",
            autoClose: 3000,
          });
        });
    } else {
      // Check for duplicate when adding new macro
      const isDuplicate = replies.some(
        (r) => r.text.toLowerCase().trim() === editText.toLowerCase().trim()
      );

      if (isDuplicate) {
        toast.error("This macro already exists", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }

      const selectedDept = departments.find(
        (dept) => dept.dept_name === selectedDepartment
      );
      const dept_id =
        selectedDepartment === "All" ? null : selectedDept?.dept_id;

      const newMacro = {
        text: editText,
        active: true,
        dept_id,
        created_by: currentUserId,
      };

      api
        .post("/clients", newMacro)
        .then((res) => {
          const newReply = {
            id: res.data.id,
            text: res.data.text,
            active: res.data.active,
            dept_id: res.data.dept_id,
            department: res.data.department,
          };
          setReplies((prev) => [...prev, newReply]);
          setIsModalOpen(false);
          toast.success("Macro added successfully", {
            position: "top-right",
            autoClose: 3000,
          });
        })
        .catch((err) => {
          console.error("Failed to add macro:", err);
          const errorMessage = err.response?.data?.error || "Failed to add macro";
          toast.error(errorMessage, {
            position: "top-right",
            autoClose: 3000,
          });
        });
    }
  };

  const handleToggleActive = (id) => {
    setReplies((prev) => {
      const idx = prev.findIndex((r) => r.id === id);
      if (idx === -1) return prev;

      const updated = {
        ...prev[idx],
        active: !prev[idx].active,
        updated_by: currentUserId,
      };

      api
        .put(`/clients/${id}`, updated)
        .then(() => {
          toast.success(
            `Macro ${updated.active ? "activated" : "deactivated"} successfully`,
            {
              position: "top-right",
              autoClose: 2000,
            }
          );
        })
        .catch((err) => {
          console.error("Failed to toggle active:", err);
          toast.error("Failed to update macro status", {
            position: "top-right",
            autoClose: 3000,
          });
        });

      return prev.map((r, i) => (i === idx ? { ...updated } : r));
    });
  };

  const handleChangeDepartment = (id, dept_id) => {
    setReplies((prev) => {
      const idx = prev.findIndex((r) => r.id === id);
      if (idx === -1) return prev;

      const updated = {
        ...prev[idx],
        dept_id,
        updated_by: currentUserId,
      };

      api
        .put(`/clients/${id}`, updated)
        .then(() => {
          toast.success("Department updated successfully", {
            position: "top-right",
            autoClose: 2000,
          });
        })
        .catch((err) => {
          console.error("Failed to update department:", err);
          toast.error("Failed to update department", {
            position: "top-right",
            autoClose: 3000,
          });
        });

      return prev.map((r, i) => (i === idx ? { ...updated } : r));
    });
  };

  const toggleDropdown = (name) =>
    setOpenDropdown((prev) => (prev === name ? null : name));
  const toggleSidebar = () => setMobileSidebarOpen((prev) => !prev);

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
                <p className="pt-15 text-center text-red-600 mb-4 font-semibold">
                  {error}
                </p>
              )}
            </div>
          </div>

          {isModalOpen && (
            <div className="fixed inset-0 bg-gray-400/50 flex justify-center items-center z-50">
              <div className="bg-white rounded-lg shadow-xl p-6 w-96">
                <h2 className="text-md font-semibold mb-2">
                  {currentEditId ? "Edit Macro" : "Add Macro"}
                </h2>

                <label className="text-sm text-gray-700 mb-1 block">
                  Message
                </label>
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="w-full border rounded-md p-2 text-sm mb-4 h-24 focus:ring-2 focus:ring-purple-500"
                />

                {!currentEditId && (
                  <div className="mb-4">
                    <label className="text-sm text-gray-700 mb-1 block">
                      Department
                    </label>
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
