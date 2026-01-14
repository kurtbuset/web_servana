import React, { useState, useEffect } from "react";
import { Edit3, Search, X } from "react-feather";
import TopNavbar from "../components/TopNavbar";
import Sidebar from "../components/Sidebar";
import "../src/App.css";
import api from "../src/api";

export default function ManageRoles() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [roles, setRoles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEditIndex, setCurrentEditIndex] = useState(null);
  const [editForm, setEditForm] = useState({ name: "" });

  const permissions = [
    "Can view Chats",
    "Can Reply",
    "Can Manage Profile",
    "Can send Macros",
    "Can End Chat",
    "Can Transfer Department",
    "Can Edit Department",
    "Can Assign Department",
    "Can Edit Roles",
    "Can Assign Roles",
    "Can Add Admin Accounts",
    "Can Edit Auto-Replies",
  ];

  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSidebar = () => setMobileSidebarOpen((prev) => !prev);

const handleOpenEditModal = (index = null) => {
  setCurrentEditIndex(index);
  setEditForm({
    name: index !== null ? roles[index].name : "",
    permissions: index !== null ? roles[index].permissions : [],
  });
  setIsModalOpen(true);
};


  const handleSaveRole = async () => {
    const payload = {
      name: editForm.name,
      permissions: editForm.permissions || [],
      created_by: 1,
      updated_by: 1,
      active: true,
    };

    try {
      if (currentEditIndex !== null) {
        const roleId = roles[currentEditIndex].role_id;
        await api.put(`/roles/${roleId}`, {
          ...payload,
          active: roles[currentEditIndex].active,
        });
      } else {
        await api.post("/roles", payload);
      }

      setIsModalOpen(false);
      const updated = await api.get("/roles");
      setRoles(updated.data);
    } catch (err) {
      console.error("Error saving role:", err);
    }
  };

  const handleToggleActive = async (index) => {
    const updatedRole = {
      ...roles[index],
      active: !roles[index].active,
      updated_by: 1,
    };

    try {
      await api.put(`/roles/${roles[index].role_id}`, updatedRole);
      setRoles((prev) =>
        prev.map((role, i) =>
          i === index ? { ...role, active: !role.active } : role
        )
      );
    } catch (err) {
      console.error("Failed to update active status:", err);
    }
  };

  const handleTogglePermission = async (roleIndex, permission) => {
    const role = roles[roleIndex];
    const updatedPermissions = role.permissions.includes(permission)
      ? role.permissions.filter((p) => p !== permission)
      : [...role.permissions, permission];

    try {
      await api.put(`/roles/${role.role_id}`, {
        ...role,
        permissions: updatedPermissions,
        updated_by: 1,
      });

      setRoles((prev) =>
        prev.map((r, i) =>
          i === roleIndex ? { ...r, permissions: updatedPermissions } : r
        )
      );
    } catch (err) {
      console.error("Failed to update permission:", err);
    }
  };

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await api.get("/roles");
        setRoles(res.data);
      } catch (err) {
        console.error("Failed to fetch roles:", err);
      }
    };
    fetchRoles();
  }, []);

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
        <main className="flex-1 bg-gray-100 p-15 overflow-y-auto transition-colors duration-300">
          <div className="bg-white p-4 rounded-lg min-h-[80vh] transition-all duration-300">
            <div className="flex justify-between items-center mb-4">
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search roles..."
              />
              <button
                onClick={() => handleOpenEditModal()}
                className="bg-[#6237A0] text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-800 transition-colors duration-300"
              >
                Add Role
              </button>
            </div>
            <div className="overflow-x-auto max-h-[70vh] overflow-y-auto relative custom-scrollbar">
              <table className="min-w-full text-sm text-left border-separate border-spacing-0">
                <thead className="text-gray-500 sticky top-0 bg-white z-20 shadow-sm">
                  <tr>
                    <th className="sticky left-0 z-30 bg-white py-2 px-3 w-48 border-b border-gray-500">
                      Role Name
                    </th>
                    <th className="sticky left-48 z-30 bg-white py-2 px-3 text-center w-24 border-b border-gray-500">
                      Active Status
                    </th>
                    {permissions.map((perm, i) => (
                      <th
                        key={i}
                        className="py-2 px-3 text-center min-w-[120px] border-b border-gray-500"
                      >
                        {perm}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredRoles.map((role, idx) => (
                    <tr key={idx}>
                      <td className="sticky left-0 bg-white py-3 px-3 z-10 w-[192px] min-w-[192px] max-w-[192px]">
                        <div className="relative w-full">
                          <span className="break-words whitespace-normal text-sm block">
                            {role.name}
                          </span>
                          <Edit3
                            size={18}
                            strokeWidth={1}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-700 cursor-pointer"
                            onClick={() => handleOpenEditModal(idx)}
                          />
                        </div>
                      </td>
                      <td className="sticky left-[192px] bg-white py-3 px-3 z-10 text-center w-[96px] min-w-[96px] max-w-[96px]">
                        <ToggleSwitch
                          checked={role.active}
                          onChange={() => handleToggleActive(idx)}
                        />
                      </td>
                      {permissions.map((perm, i) => (
                        <td key={i} className="py-3 px-3 text-center">
                          <input
                            type="checkbox"
                            checked={role.permissions.includes(perm)}
                            onChange={() => handleTogglePermission(idx, perm)}
                            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {isModalOpen && (
            <RoleModal
              isEdit={currentEditIndex !== null}
              formData={editForm}
              onFormChange={setEditForm}
              onClose={() => setIsModalOpen(false)}
              onSave={handleSaveRole}
            />
          )}
        </main>
      </div>
    </div>
  );
}

function SearchInput({ value, onChange, placeholder }) {
  return (
    <div className="flex items-center bg-gray-100 px-3 py-2 rounded-md w-1/3 relative">
      <Search
        size={18}
        strokeWidth={1}
        className="text-gray-500 mr-2 flex-shrink-0"
      />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent focus:outline-none text-sm w-full pr-6"
      />
      {value && (
        <X
          size={16}
          strokeWidth={1}
          className="text-gray-500 cursor-pointer absolute right-3"
          onClick={() => onChange("")}
        />
      )}
    </div>
  );
}

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

function RoleModal({ isEdit, formData, onFormChange, onClose, onSave }) {
  return (
    <div className="fixed inset-0 bg-gray-400/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-96">
        <h2 className="text-md font-semibold mb-4">
          {isEdit ? "Edit Role" : "Add Role"}
        </h2>

        <FormField
          label="Role Name"
          value={formData.name}
          onChange={(value) => onFormChange({ ...formData, name: value })}
        />

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-800 px-4 py-1 rounded-lg text-sm hover:bg-gray-400 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="bg-purple-700 text-white px-4 py-1 rounded-lg text-sm hover:bg-purple-800 transition-colors duration-300"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

function FormField({ label, type = "text", value, onChange }) {
  return (
    <div>
      <label className="text-sm text-gray-700 mb-1 block">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded-md p-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all duration-300"
      />
    </div>
  );
}
