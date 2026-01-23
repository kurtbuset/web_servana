import { useState } from "react";
import { Plus, MessageCircle, Zap } from "react-feather";
import TopNavbar from "../../components/TopNavbar";
import Sidebar from "../../components/Sidebar";
import AutoReplyCard from "../../components/auto-replies/AutoReplyCard";
import AutoReplyModal from "../../components/auto-replies/AutoReplyModal";
import AutoReplyFilters from "../../components/auto-replies/AutoReplyFilters";
import ResponsiveContainer from "../../components/responsive/ResponsiveContainer";
import { useAutoReplies } from "../../hooks/useAutoReplies";
import { useUser } from "../../context/UserContext";
import { toast } from "react-toastify";
import "../../App.css";

export default function AutoRepliesScreen() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEditReply, setCurrentEditReply] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [viewMode, setViewMode] = useState("grid");

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

  // Filter replies based on search and department
  const filteredReplies = replies.filter((reply) => {
    const matchesSearch = reply.auto_reply_message
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesDepartment =
      selectedDepartment === "All" ||
      reply.dept_id ===
        allDepartments.find((d) => d.dept_name === selectedDepartment)?.dept_id;
    return matchesSearch && matchesDepartment;
  });

  return (
    <ResponsiveContainer>
      {({ isMobile, isTablet }) => {
        
        const handleEditReply = (reply) => {
          if (!canEditAutoReplies) {
            toast.error("You don't have permission to edit auto-replies", {
              position: isMobile ? "bottom-center" : "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              className: "text-sm",
              bodyClassName: "text-sm",
            });
            return;
          }
          setCurrentEditReply(reply);
          setIsModalOpen(true);
        };

        const handleAddReply = () => {
          if (!canEditAutoReplies) {
            toast.error("You don't have permission to edit auto-replies", {
              position: isMobile ? "bottom-center" : "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              className: "text-sm",
              bodyClassName: "text-sm",
            });
            return;
          }
          setCurrentEditReply(null);
          setIsModalOpen(true);
        };

        const handleToggleActive = async (id, currentActive) => {
          if (!canEditAutoReplies) {
            toast.error("You don't have permission to edit auto-replies", {
              position: isMobile ? "bottom-center" : "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              className: "text-sm",
              bodyClassName: "text-sm",
            });
            return;
          }
          await toggleAutoReply(id, currentActive, userData?.sys_user_id);
        };

        const handleChangeDepartment = async (id, newDeptId) => {
          if (!canEditAutoReplies) {
            toast.error("You don't have permission to edit auto-replies", {
              position: isMobile ? "bottom-center" : "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              className: "text-sm",
              bodyClassName: "text-sm",
            });
            return;
          }
          await updateDepartment(id, newDeptId, userData?.sys_user_id);
        };

        const toggleDropdown = (name) => {
          setOpenDropdown((prev) => (prev === name ? null : name));
        };

        const getActiveCount = () => replies.filter(r => r.auto_reply_is_active).length;
        const getInactiveCount = () => replies.filter(r => !r.auto_reply_is_active).length;

        const handleSaveReply = async (message, departmentName) => {
          if (!canEditAutoReplies) {
            toast.error("You don't have permission to edit auto-replies", {
              position: isMobile ? "bottom-center" : "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              className: "text-sm",
              bodyClassName: "text-sm",
            });
            return;
          }

          if (currentEditReply) {
            // Update existing reply
            const success = await updateAutoReply(
              currentEditReply.auto_reply_id,
              message,
              currentEditReply.dept_id,
              userData?.sys_user_id
            );

            if (success) {
              setIsModalOpen(false);
              setCurrentEditReply(null);
            }
          } else {
            // Create new reply
            const selectedDept = activeDepartments.find(
              (dept) => dept.dept_name === departmentName
            );
            const dept_id = departmentName === "All" ? null : selectedDept?.dept_id;

            const success = await createAutoReply(
              message,
              dept_id,
              userData?.sys_user_id
            );

            if (success) {
              setIsModalOpen(false);
            }
          }
        };

        return (
          <div className="flex flex-col h-screen overflow-hidden">
            <TopNavbar toggleSidebar={toggleSidebar} />

            <div className="flex flex-1 overflow-hidden">
              <Sidebar
                isMobile={true}
                isOpen={mobileSidebarOpen}
                toggleDropdown={toggleDropdown}
                openDropdown={openDropdown}
                onClose={() => setMobileSidebarOpen(false)}
              />
              <Sidebar
                isMobile={false}
                toggleDropdown={toggleDropdown}
                openDropdown={openDropdown}
              />

              <main className="flex-1 bg-gray-50 dark:bg-gray-900 overflow-hidden flex flex-col transition-colors duration-200">
                {/* Header */}
                <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-3 sm:p-4 md:p-6 transition-colors duration-200">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                    <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                      <div className={`p-2 sm:p-2.5 md:p-3 bg-[#E6DCF7] dark:bg-purple-900/30 rounded-lg md:rounded-xl ${isMobile ? 'flex-shrink-0' : ''} transition-colors duration-200`}>
                        <Zap size={isMobile ? 18 : isTablet ? 20 : 24} className="text-[#6237A0] dark:text-purple-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 truncate">Auto Replies</h1>
                        <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 mt-0.5 sm:mt-1">
                          {isMobile ? "Manage auto responses" : "Manage automatic response messages for incoming chats"}
                        </p>
                      </div>
                    </div>
                    
                    <button
                      onClick={handleAddReply}
                      disabled={!canEditAutoReplies}
                      className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 shadow-sm touch-target ${
                        canEditAutoReplies
                          ? "bg-[#6237A0] dark:bg-purple-600 text-white hover:bg-[#4c2b7d] dark:hover:bg-purple-700 focus:ring-2 focus:ring-[#6237A0] dark:focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                          : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                      } ${isMobile ? 'w-full sm:w-auto justify-center' : ''}`}
                      title={!canEditAutoReplies ? "You don't have permission to edit auto-replies" : ""}
                    >
                      <Plus size={isMobile ? 16 : 18} />
                      {isMobile ? "Add Reply" : "Add Auto Reply"}
                    </button>
                  </div>

                  {/* Stats */}
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 md:gap-6 mt-3 sm:mt-4">
                    <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full"></div>
                      <span className="text-gray-600 dark:text-gray-400">Active: </span>
                      <span className="font-semibold text-gray-900 dark:text-gray-100">{getActiveCount()}</span>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-gray-400 rounded-full"></div>
                      <span className="text-gray-600 dark:text-gray-400">Inactive: </span>
                      <span className="font-semibold text-gray-900 dark:text-gray-100">{getInactiveCount()}</span>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                      <MessageCircle size={isMobile ? 12 : 14} className="text-gray-500 dark:text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-400">Total: </span>
                      <span className="font-semibold text-gray-900 dark:text-gray-100">{replies.length}</span>
                    </div>
                  </div>
                </div>

                {/* Filters */}
                <AutoReplyFilters
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  selectedDepartment={selectedDepartment}
                  onDepartmentChange={setSelectedDepartment}
                  departments={allDepartments}
                  viewMode={viewMode}
                  onViewModeChange={setViewMode}
                  totalCount={replies.length}
                  filteredCount={filteredReplies.length}
                  isMobile={isMobile}
                  isTablet={isTablet}
                />

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-2 sm:p-3 md:p-4 lg:p-6 custom-scrollbar">
                  {loading && (
                    <div className="flex items-center justify-center h-32 sm:h-48 md:h-64">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 border-2 border-[#6237A0] dark:border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Loading auto replies...</span>
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 sm:w-5 sm:h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs">!</span>
                        </div>
                        <p className="text-red-800 dark:text-red-200 font-medium text-sm sm:text-base">Error loading auto replies</p>
                      </div>
                      <p className="text-red-600 dark:text-red-300 text-xs sm:text-sm mt-1">{error}</p>
                    </div>
                  )}

                  {!loading && !error && filteredReplies.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-32 sm:h-48 md:h-64 text-center px-4">
                      <div className="p-3 sm:p-4 bg-gray-100 dark:bg-gray-800 rounded-full mb-3 sm:mb-4">
                        <MessageCircle size={isMobile ? 24 : isTablet ? 28 : 32} className="text-gray-400 dark:text-gray-500" />
                      </div>
                      <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-gray-100 mb-1 sm:mb-2">
                        {replies.length === 0 ? 'No auto replies yet' : 'No auto replies found'}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base mb-3 sm:mb-4 max-w-sm">
                        {replies.length === 0 
                          ? 'Create your first auto reply to automatically respond to incoming chats.'
                          : 'Try adjusting your search or filter criteria.'
                        }
                      </p>
                      {replies.length === 0 && canEditAutoReplies && (
                        <button
                          onClick={handleAddReply}
                          className="flex items-center gap-1.5 sm:gap-2 bg-[#6237A0] dark:bg-purple-600 text-white px-3 sm:px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#4c2b7d] dark:hover:bg-purple-700 transition-colors touch-target"
                        >
                          <Plus size={14} />
                          Create First Auto Reply
                        </button>
                      )}
                    </div>
                  )}

                  {!loading && !error && filteredReplies.length > 0 && (
                    <div className={
                      viewMode === 'grid' 
                        ? `grid gap-2 sm:gap-3 md:gap-4 ${
                            isMobile 
                              ? 'grid-cols-1' 
                              : isTablet 
                                ? 'grid-cols-1 sm:grid-cols-2' 
                                : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                          }`
                        : 'space-y-2 sm:space-y-3'
                    }>
                      {filteredReplies.map((reply) => (
                        <AutoReplyCard
                          key={reply.auto_reply_id}
                          reply={reply}
                          departments={allDepartments}
                          onEdit={handleEditReply}
                          onToggleActive={handleToggleActive}
                          onChangeDepartment={handleChangeDepartment}
                          canEdit={canEditAutoReplies}
                          isMobile={isMobile}
                          isTablet={isTablet}
                          viewMode={isMobile ? 'grid' : viewMode}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Modal */}
                <AutoReplyModal
                  isOpen={isModalOpen}
                  onClose={() => {
                    setIsModalOpen(false);
                    setCurrentEditReply(null);
                  }}
                  onSave={handleSaveReply}
                  reply={currentEditReply}
                  departments={activeDepartments}
                  canEdit={canEditAutoReplies}
                  isMobile={isMobile}
                  isTablet={isTablet}
                />
              </main>
            </div>
          </div>
        );
      }}
    </ResponsiveContainer>
  );
}