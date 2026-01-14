import React, { useState, useEffect, useRef } from "react";
import { Edit3, Search, X, Eye, EyeOff, Filter } from "react-feather";
import TopNavbar from "../components/TopNavbar";
import Sidebar from "../components/Sidebar";
import "../src/App.css";
import api from "../src/api";

export default function ManageAgents() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [currentEditIndex, setCurrentEditIndex] = useState(null);
  const [editForm, setEditForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [agents, setAgents] = useState([]);
  const [allDepartments, setAllDepartments] = useState([]);
  const [modalError, setModalError] = useState(null);
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [selectedDepartmentsFilter, setSelectedDepartmentsFilter] = useState(
    []
  );
  const [loading, setLoading] = useState(false);
  const filterRef = useRef(null);

  // Define default role ID for new agents
  const DEFAULT_ROLE_ID = 2;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [agentsRes, departmentsRes] = await Promise.all([
          api.get(`/manage-agents/agents`),
          api.get(`/manage-agents/departments`),
        ]);

        setAgents(agentsRes.data);
        setAllDepartments(departmentsRes.data);
      } catch (error) {
        console.error("Error fetching agents or departments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setFilterDropdownOpen(false);
      }
    }
    if (filterDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [filterDropdownOpen]);

  const filteredAgents = agents.filter((agent) => {
    const email = agent.email?.toLowerCase() || "";
    const matchesSearch = email.includes(searchQuery.toLowerCase());

    if (selectedDepartmentsFilter.length === 0) {
      return matchesSearch;
    }

    const hasAllDepartments = selectedDepartmentsFilter.every((dept) =>
      (agent.departments || []).includes(dept)
    );

    return matchesSearch && hasAllDepartments;
  });

  const toggleSidebar = () => setMobileSidebarOpen((prev) => !prev);

  const handleOpenEditModal = (index = null) => {
    setCurrentEditIndex(index);
    setEditForm(
      index !== null
        ? { email: agents[index].email, password: "" }
        : { email: "", password: "" }
    );
    setShowPassword(false);
    setIsModalOpen(true);
    setModalError("");
  };

  const handleSaveAgent = async () => {
    const editEmail = editForm.email.trim();
    const editPassword = editForm.password.trim();

    if (!editEmail || !editPassword) {
      setModalError("Email and password are required.");
      return;
    }

    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValidEmail(editEmail)) {
      setModalError("Please enter a valid email address.");
      return;
    }

    const emailAlreadyExists = (email, currentId) => {
      return agents.some(
        (agent) =>
          agent.email.toLowerCase() === email.toLowerCase() &&
          agent.id !== currentId
      );
    };

    if (emailAlreadyExists(editEmail, agents[currentEditIndex]?.id)) {
      setModalError("Email is already taken.");
      return;
    }

    setIsModalOpen(false);
    setIsConfirmModalOpen(true);
  };

  const confirmSaveAgent = async () => {
    try {
      const isEdit = currentEditIndex !== null;
      const endpoint = isEdit
        ? `/manage-agents/agents/${agents[currentEditIndex].id}`
        : `/manage-agents/agents`;
      const method = isEdit ? "put" : "post";

      const payload = {
        email: editForm.email,
        password: editForm.password,
        active: true,
        departments: agents[currentEditIndex]?.departments || [], 
        roleId: DEFAULT_ROLE_ID,
      };

      const res = await api[method](endpoint, payload);

      if (isEdit) {
        setAgents((prev) =>
          prev.map((a, i) =>
            i === currentEditIndex ? { ...a, email: editForm.email } : a
          )
        );
      } else {
        const newAgent = {
          id: res.data.id,
          email: res.data.email || editForm.email,
          password: editForm.password,
          departments: [],
          active: true,
        };
        setAgents((prev) => [...prev, newAgent]);
      }

      setIsModalOpen(false);
      setIsConfirmModalOpen(false);
      setEditForm({ email: "", password: "" });
      setModalError(null);
    } catch (error) {
      console.error("Error saving agent:", error);

      const errMsg =
        error.response?.data?.error || "Failed to save agent (server error)";
      setModalError(errMsg);
      setIsModalOpen(true);
      setIsConfirmModalOpen(false);
    }
  };

  const handleToggleActive = async (index) => {
    const agent = agents[index];
    const updatedAgent = { ...agent, active: !agent.active };

    try {
      await api.put(`/manage-agents/agents/${agent.id}`, {
        email: agent.email,
        active: updatedAgent.active,
        departments: agent.departments,
      });

      setAgents((prev) => prev.map((a, i) => (i === index ? updatedAgent : a)));
    } catch (error) {
      console.error("Error updating active status:", error);
    }
  };

  const handleToggleDepartment = async (agentIndex, dept) => {
    const agent = agents[agentIndex];
    const updatedDepartments = (agent.departments || []).includes(dept)
      ? agent.departments.filter((d) => d !== dept)
      : [...(agent.departments || []), dept];

    try {
      await api.put(`/manage-agents/agents/${agent.id}`, {
        email: agent.email,
        active: agent.active,
        departments: updatedDepartments,
      });

      setAgents((prev) =>
        prev.map((a, i) =>
          i === agentIndex ? { ...a, departments: updatedDepartments } : a
        )
      );
    } catch (error) {
      console.error("Error updating departments:", error);
    }
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
        <main className="flex-1 bg-gray-100 p-15 overflow-hidden relative">
          <div className="bg-white p-4 rounded-lg h-full flex flex-col">
            <div className="flex justify-between items-center mb-4 relative">
              <div className="relative w-1/3" ref={filterRef}>
                <SearchInput
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Search agents..."
                  onFilterClick={() => setFilterDropdownOpen((prev) => !prev)}
                  filterDropdownOpen={filterDropdownOpen}
                  selectedFilters={selectedDepartmentsFilter}
                />
                {filterDropdownOpen && (
                  <div
                    className="absolute mt-1 bg-white border border-gray-300 rounded-md shadow-lg w-64 max-h-60 overflow-auto z-50"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="p-2">
                      {allDepartments.map((dept) => (
                        <label
                          key={dept}
                          className="flex items-center gap-2 mb-1 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedDepartmentsFilter.includes(dept)}
                            onChange={() => {
                              setSelectedDepartmentsFilter((prev) =>
                                prev.includes(dept)
                                  ? prev.filter((d) => d !== dept)
                                  : [...prev, dept]
                              );
                            }}
                            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                          />
                          <span className="text-sm">{dept}</span>
                        </label>
                      ))}
                      {selectedDepartmentsFilter.length > 0 && (
                        <button
                          onClick={() => setSelectedDepartmentsFilter([])}
                          className="mt-2 text-sm text-purple-600 hover:underline"
                        >
                          Clear Filters
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => handleOpenEditModal()}
                className="bg-[#6237A0] text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-800"
              >
                Add Agent
              </button>
            </div>

            <div className="overflow-x-auto flex-1">
              <div className="h-full overflow-y-auto custom-scrollbar">
                <table className="min-w-full text-sm text-left border-separate border-spacing-0">
                  <thead className="text-gray-500 sticky top-0 bg-white z-20 shadow-sm">
                    <tr>
                      <th className="sticky top-0 left-0 z-30 bg-white py-2 px-3 w-48 border-b border-gray-500">
                        Email
                      </th>
                      <th className="sticky left-[250px] z-30 bg-white py-2 px-3 text-center w-32 border-b border-gray-500">
                        Active Status
                      </th>

                      {allDepartments.map((dept, i) => (
                        <th
                          key={i}
                          className="py-2 px-3 text-center min-w-[120px] border-b border-gray-500 bg-white sticky top-0 z-20"
                        >
                          {dept}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredAgents.map((agent, idx) => (
                      <tr key={idx}>
                        <td className="sticky left-0 bg-white py-3 px-3 z-10 w-[250px] min-w-[250px]">
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-sm break-words max-w-[200px]">
                              {agent.email}
                            </span>
                            <Edit3
                              size={18}
                              strokeWidth={1}
                              className="text-gray-500 cursor-pointer hover:text-purple-700 flex-shrink-0 mt-1"
                              onClick={() => handleOpenEditModal(idx)}
                            />
                          </div>
                        </td>

                        <td className="sticky left-[250px] bg-white py-3 px-3 z-20 text-center w-32">
                          <ToggleSwitch
                            checked={agent.active}
                            onChange={() => handleToggleActive(idx)}
                          />
                        </td>

                        {allDepartments.map((dept, i) => (
                          <td key={i} className="py-3 px-3 text-center">
                            <input
                              type="checkbox"
                              checked={agent.departments.includes(dept)}
                              onChange={() => handleToggleDepartment(idx, dept)}
                              className="w-4 h-4 cursor-pointer"
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>

        {/* Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-400/50 z-50 flex justify-center items-center">
            <div className="bg-white rounded-lg p-6 w-96 relative">
              <h2 className="text-xl font-semibold mb-4">
                {currentEditIndex !== null ? "Edit Agent" : "Add Agent"}
              </h2>
              {modalError && (
                <div className="bg-red-100 text-red-700 px-4 py-2 rounded-md mb-3 text-sm font-medium border border-red-300">
                  {modalError}
                </div>
              )}
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={editForm.email}
                onChange={(e) => {
                  setEditForm({ ...editForm, email: e.target.value });
                  if (modalError) setModalError(null); // Clear error on typing
                }}
                className="w-full mb-4 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
              />

              <label className="block mb-2 text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={editForm.password}
                  onChange={(e) => {
                    setEditForm({ ...editForm, password: e.target.value });
                    if (modalError) setModalError(null); // Clear error on typing
                  }}
                  className="w-full mb-4 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
                {showPassword ? (
                  <EyeOff
                    size={18}
                    className="absolute top-3 right-3 cursor-pointer text-gray-500"
                    onClick={() => setShowPassword(false)}
                  />
                ) : (
                  <Eye
                    size={18}
                    className="absolute top-3 right-3 cursor-pointer text-gray-500"
                    onClick={() => setShowPassword(true)}
                  />
                )}
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setModalError(null); // Clear error on cancel
                  }}
                  className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveAgent}
                  className="px-4 py-2 rounded-md bg-purple-700 text-white hover:bg-purple-800"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Confirm Save Modal */}
        {isConfirmModalOpen && (
          <div className="fixed inset-0 bg-gray-200/40 z-60 flex justify-center items-center">
            <div className="bg-white rounded-lg p-6 w-80">
              <h3 className="text-lg font-semibold mb-4">Confirm Save</h3>
              <p className="mb-6">
                Are you sure you want to save these changes?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setIsConfirmModalOpen(false);
                    setIsModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmSaveAgent}
                  className="px-4 py-2 rounded-md bg-purple-700 text-white hover:bg-purple-800"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ToggleSwitch component
function ToggleSwitch({ checked, onChange }) {
  return (
    <label className="inline-flex relative items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        onChange={onChange}
      />
      <div className="w-7 h-4 bg-gray-200 rounded-full peer peer-checked:bg-[#6237A0] transition-colors duration-300 relative after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-transform peer-checked:after:translate-x-3" />
    </label>
  );
}

function SearchInput({
  value,
  onChange,
  placeholder,
  onFilterClick,
  filterDropdownOpen,
  selectedFilters,
}) {
  return (
    <div className="flex items-center bg-gray-100 px-3 py-2 rounded-md w-full relative">
      <Search size={18} strokeWidth={1} className="text-gray-500 mr-2" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent focus:outline-none text-sm w-full pr-12"
      />
      {value && (
        <X
          size={16}
          strokeWidth={1}
          className="text-gray-500 cursor-pointer absolute right-7"
          onClick={() => onChange("")}
        />
      )}
      <Filter
        size={16}
        strokeWidth={1}
        className={`text-gray-500 cursor-pointer absolute right-3 ${
          filterDropdownOpen ? "text-purple-700" : ""
        }`}
        onClick={onFilterClick}
      />
      {selectedFilters.length > 0 && (
        <div className="absolute right-8 top-1 text-xs bg-purple-600 text-white rounded-full px-1.5 select-none">
          {selectedFilters.length}
        </div>
      )}
    </div>
  );
}
