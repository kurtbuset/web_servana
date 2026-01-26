import { useState } from "react";
import TopNavbar from "../../../src/components/TopNavbar";
import Sidebar from "../../../src/components/Sidebar";
import LoadingSpinner from "../../components/LoadingSpinner";
import { Edit3, Search, X } from "react-feather";
import { useDepartments } from "../../hooks/useDepartments";
import { useUser } from "../../context/UserContext";
import "../../../src/App.css";

/**
 * DepartmentScreen - Refactored department management interface
 * 
 * Uses the new useDepartments hook for business logic while maintaining
 * the exact same UI/UX as the original Department screen.
 * 
 * Features:
 * - View all departments
 * - Search departments
 * - Add new department
 * - Edit department name
 * - Toggle department active status
 * - Duplicate detection
 * - Responsive design
 */
export default function DepartmentScreen() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Get user permissions
  const { hasPermission } = useUser();
  const canEditDepartment = hasPermission("priv_can_manage_dept");

  // Get department state and actions from hook
  const {
    departments,
    loading,
    error,
    createDepartment,
    updateDepartment,
    toggleDepartment,
  } = useDepartments();

  const toggleSidebar = () => setMobileSidebarOpen((prev) => !prev);

  const filteredDepartments = departments.filter((dept) =>
    dept.dept_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSave = async () => {
    if (!canEditDepartment) {
      console.warn("User does not have permission to edit departments");
      return;
    }

    try {
      if (currentEditId) {
        await updateDepartment(currentEditId, editText);
      } else {
        await createDepartment(editText);
      }

      setIsModalOpen(false);
      setEditText("");
      setCurrentEditId(null);
    } catch (error) {
      // Error already handled by hook with toast
      console.error("Failed to save department:", error);
    }
  };

  const handleToggle = async (deptId, currentStatus) => {
    if (!canEditDepartment) {
      console.warn("User does not have permission to edit departments");
      return;
    }

    try {
      await toggleDepartment(deptId, currentStatus);
    } catch (error) {
      // Error already handled by hook with toast
      console.error("Failed to toggle status:", error);
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

        <main className="flex-1 bg-gray-100 p-15 overflow-hidden transition-colors duration-300">
          <div className="bg-white p-4 rounded-lg min-h-[80vh] transition-all duration-300">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center bg-gray-100 px-3 py-2 rounded-md w-1/3 relative">
                <Search
                  size={18}
                  strokeWidth={1}
                  className="text-gray-500 mr-2 flex-shrink-0"
                />
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
                    className="text-gray-500 cursor-pointer absolute right-3 hover:text-gray-700"
                    onClick={() => setSearchQuery("")}
                  />
                )}
              </div>

              <button
                onClick={() => {
                  if (!canEditDepartment) {
                    console.warn("User does not have permission to edit departments");
                    return;
                  }
                  setEditText("");
                  setCurrentEditId(null);
                  setIsModalOpen(true);
                }}
                disabled={!canEditDepartment}
                className={`px-4 py-2 rounded-lg text-sm transition-colors duration-300 ${
                  canEditDepartment
                    ? "bg-[#6237A0] text-white hover:bg-purple-800"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                title={!canEditDepartment ? "You don't have permission to edit departments" : ""}
              >
                Add Department
              </button>
            </div>

            <div className="overflow-y-auto max-h-[65vh] w-full custom-scrollbar">
              <table className="w-full text-sm text-left">
                <thead className="text-gray-500 bg-white sticky top-0 z-10 shadow-[inset_0_-1px_0_0_#000000]">
                  <tr>
                    <th className="py-2 px-3 pl-3">Department</th>
                    <th className="py-2 px-3 text-center">Active Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDepartments.map((dept) => (
                    <tr
                      key={dept.dept_id}
                      className="transition-colors duration-200 hover:bg-gray-100"
                    >
                      <td className="py-2 px-3 align-top">
                        <div className="flex items-center gap-2">
                          <p className="text-sm break-words max-w-[200px] whitespace-pre-wrap">
                            {dept.dept_name}
                          </p>
                          <Edit3
                            size={18}
                            strokeWidth={1}
                            className={`flex-shrink-0 transition-colors duration-200 ${
                              canEditDepartment
                                ? "text-gray-500 cursor-pointer hover:text-purple-700"
                                : "text-gray-300 cursor-not-allowed"
                            }`}
                            onClick={() => {
                              if (!canEditDepartment) {
                                console.warn("User does not have permission to edit departments");
                                return;
                              }
                              setCurrentEditId(dept.dept_id);
                              setEditText(dept.dept_name);
                              setIsModalOpen(true);
                            }}
                            title={!canEditDepartment ? "You don't have permission to edit departments" : ""}
                          />
                        </div>
                      </td>

                      <td className="py-2 px-3 text-center">
                        <label className={`inline-flex relative items-center ${
                          canEditDepartment ? "cursor-pointer" : "cursor-not-allowed"
                        }`}>
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={dept.dept_is_active}
                            onChange={() =>
                              handleToggle(dept.dept_id, dept.dept_is_active)
                            }
                            disabled={!canEditDepartment}
                            title={!canEditDepartment ? "You don't have permission to edit departments" : ""}
                          />
                          <div className={`w-7 h-4 rounded-full peer transition-colors duration-300 relative after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-transform after:duration-300 peer-checked:after:translate-x-3 ${
                            canEditDepartment
                              ? "bg-gray-200 peer-checked:bg-[#6237A0]"
                              : "bg-gray-100 peer-checked:bg-gray-300"
                          }`} />
                        </label>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {loading && (
                <LoadingSpinner variant="table" message="Loading departments..." />
              )}

              {error && (
                <p className="pt-15 text-center text-red-600 mb-4 font-semibold">
                  {error}
                </p>
              )}
            </div>
          </div>

          {/* Modal for Add/Edit */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-gray-400/50 flex justify-center items-center z-50 transition-opacity duration-300">
              <div className="bg-white rounded-lg shadow-xl p-6 w-96 transform scale-95 animate-fadeIn transition-transform duration-300 ease-out">
                <h2 className="text-md font-semibold mb-2">
                  {currentEditId ? "Edit Department" : "Add Department"}
                </h2>
                <label className="text-sm text-gray-700 mb-1 block">
                  Department Name
                </label>
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="w-full border rounded-md p-2 text-sm mb-4 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all duration-300"
                />

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="bg-gray-300 text-gray-800 px-4 py-1 rounded-lg text-sm hover:bg-gray-400 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={!canEditDepartment}
                    className={`px-4 py-1 rounded-lg text-sm transition-colors duration-300 ${
                      canEditDepartment
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
