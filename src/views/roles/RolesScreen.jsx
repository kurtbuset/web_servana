import { useState, useEffect } from "react";
import { 
    Plus, Users, Shield, Settings, ArrowLeft, ChevronDown, ChevronRight
} from "react-feather";
import TopNavbar from "../../../src/components/TopNavbar";
import Sidebar from "../../components/Sidebar";
import { useUser } from "../../../src/context/UserContext";
import { useRoles } from "../../hooks/useRoles";
import RoleService from "../../services/role.service";
import { toast } from "react-toastify";
import ResponsiveContainer from "../../components/responsive/ResponsiveContainer";
import "../../App.css";

const PERMISSION_SECTIONS = [
  {
    title: "COMMUNICATION PERMISSIONS",
    icon: "💬",
    permissions: [
      { key: "Can view Chats", label: "View Chats", description: "Allows members to view chat messages and conversations" },
      { key: "Can Reply", label: "Reply to Chats", description: "Allows members to send messages and reply to conversations" },
      { key: "Can End Chat", label: "End Chats", description: "Allows members to end or close chat conversations" },
      { key: "Can Transfer Department", label: "Transfer Chats", description: "Allows members to transfer chats between departments" },
      { key: "Can send Macros", label: "Send Macros", description: "Allows members to use predefined message templates" },
    ]
  },
  {
    title: "MANAGEMENT PERMISSIONS",
    icon: "⚙️",
    permissions: [
      { key: "Can Edit Department", label: "Edit Departments", description: "Allows members to create, edit, and manage departments" },
      { key: "Can Assign Department", label: "Assign Departments", description: "Allows members to assign users to departments" },
      { key: "Can Edit Roles", label: "Edit Roles", description: "Allows members to create and modify user roles" },
      { key: "Can Assign Roles", label: "Assign Roles", description: "Allows members to assign roles to other users" },
      { key: "Can Add Admin Accounts", label: "Add Admins", description: "Allows members to create new administrator accounts" },
      { key: "Can Edit Auto-Replies", label: "Edit Auto-Replies", description: "Allows members to manage automated response messages" },
      { key: "Can Manage Profile", label: "Manage Profile", description: "Allows members to edit their own profile information" },
    ]
  }
];

const PERMISSIONS = PERMISSION_SECTIONS.flatMap(section => section.permissions);

export default function RolesScreen() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({ name: "" });
  const [view, setView] = useState("roleList"); // roleList or roleDetails
  const [expandedRoles, setExpandedRoles] = useState(new Set());
  const [roleMembers, setRoleMembers] = useState({});
  const [membersLoading, setMembersLoading] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  const { userData, hasPermission } = useUser();
  const { roles, loading, createRole, toggleRoleActive, togglePermission } = useRoles();

  const canManageRoles = hasPermission("priv_can_manage_role");

  useEffect(() => {
    if (roles.length > 0 && !selectedRole) {
      setSelectedRole(roles[0]);
    }
  }, [roles, selectedRole]);

  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getInitials = (member) => {
    if (member.profile?.prof_firstname && member.profile?.prof_lastname) {
      return `${member.profile.prof_firstname.charAt(0)}${member.profile.prof_lastname.charAt(0)}`.toUpperCase();
    }
    const name = member.sys_user_email.split('@')[0];
    return name.substring(0, 2).toUpperCase();
  };

  const getDisplayName = (member) => {
    if (member.profile?.full_name && member.profile.full_name.trim()) {
      return member.profile.full_name;
    }
    return member.sys_user_email;
  };

  return (
    <ResponsiveContainer>
      {({ isMobile, isTablet }) => {
        
        const toggleRoleExpansion = async (roleId) => {
          const newExpandedRoles = new Set(expandedRoles);
          
          if (expandedRoles.has(roleId)) {
            newExpandedRoles.delete(roleId);
          } else {
            newExpandedRoles.add(roleId);
            await fetchRoleMembers(roleId);
          }
          
          setExpandedRoles(newExpandedRoles);
        };

        const fetchRoleMembers = async (roleId) => {
          if (roleMembers[roleId]) {
            return;
          }

          setMembersLoading(prev => ({ ...prev, [roleId]: true }));

          try {
            const response = await RoleService.getRoleMembers(roleId);
            setRoleMembers(prev => ({ ...prev, [roleId]: response.members || [] }));
          } catch (error) {
            console.error("Error fetching role members:", error);
            setRoleMembers(prev => ({ ...prev, [roleId]: [] }));
            toast.error("Failed to load role members", {
              position: isMobile ? "bottom-center" : "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              className: "text-sm",
              bodyClassName: "text-sm",
            });
          } finally {
            setMembersLoading(prev => ({ ...prev, [roleId]: false }));
          }
        };

        const handleCreateRole = () => {
          if (!canManageRoles) {
            toast.error("You don't have permission to create roles", {
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
          setEditForm({ name: "" });
          setIsModalOpen(true);
        };

        const handleSaveRole = async () => {
          if (!canManageRoles || !editForm.name.trim()) {
            return;
          }

          const userId = userData?.sys_user_id;
          if (!userId) return;

          try {
            const success = await createRole({
              name: editForm.name,
              permissions: [],
              created_by: userId,
              updated_by: userId,
            });

            if (success) {
              setIsModalOpen(false);
              setEditForm({ name: "" });
              toast.success(`Role "${editForm.name}" created successfully!`, {
                position: isMobile ? "bottom-center" : "top-right",
                autoClose: 2500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                className: "text-sm",
                bodyClassName: "text-sm",
              });
            }
          } catch (error) {
            toast.error("Failed to create role. Please try again.", {
              position: isMobile ? "bottom-center" : "top-right",
              autoClose: 4000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              className: "text-sm",
              bodyClassName: "text-sm",
            });
          }
        };

        const handleToggleActive = async (role) => {
          if (!canManageRoles) {
            toast.error("You don't have permission to modify roles", {
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

          const userId = userData?.sys_user_id;
          if (!userId) return;

          try {
            await toggleRoleActive(
              role.role_id,
              role.active,
              role.name,
              role.permissions,
              userId
            );

            if (selectedRole && selectedRole.role_id === role.role_id) {
              setSelectedRole({ ...role, active: !role.active });
            }

            toast.success(`Role "${role.name}" ${role.active ? 'deactivated' : 'activated'} successfully!`, {
              position: isMobile ? "bottom-center" : "top-right",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              className: "text-sm",
              bodyClassName: "text-sm",
            });
          } catch (error) {
            toast.error("Failed to update role status. Please try again.", {
              position: isMobile ? "bottom-center" : "top-right",
              autoClose: 4000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              className: "text-sm",
              bodyClassName: "text-sm",
            });
          }
        };

        const handleTogglePermission = async (permission) => {
          if (!canManageRoles) {
            toast.error("You don't have permission to modify role permissions", {
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
          
          if (!selectedRole) return;

          const userId = userData?.sys_user_id;
          if (!userId) return;

          try {
            await togglePermission(
              selectedRole.role_id,
              permission,
              selectedRole.permissions,
              selectedRole.name,
              selectedRole.active,
              userId
            );

            const hasPermission = selectedRole.permissions.includes(permission);
            const updatedPermissions = hasPermission
              ? selectedRole.permissions.filter(p => p !== permission)
              : [...selectedRole.permissions, permission];

            setSelectedRole({ ...selectedRole, permissions: updatedPermissions });

            const permissionLabel = PERMISSIONS.find(p => p.key === permission)?.label || permission;
            toast.success(`Permission "${permissionLabel}" ${hasPermission ? 'removed from' : 'added to'} ${selectedRole.name}`, {
              position: isMobile ? "bottom-center" : "top-right",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              className: "text-sm",
              bodyClassName: "text-sm",
            });
          } catch (error) {
            toast.error("Failed to update permission. Please try again.", {
              position: isMobile ? "bottom-center" : "top-right",
              autoClose: 4000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              className: "text-sm",
              bodyClassName: "text-sm",
            });
          }
        };

        const handleRoleClick = (role, isMobile) => {
          setSelectedRole(role);
          if (isMobile) {
            setView("roleDetails");
          }
        };

        const handleBackClick = () => {
          setView("roleList");
        };

        return (
          <div className="flex flex-col h-screen bg-gray-100">
            <TopNavbar toggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)} />
            
            <div className="flex flex-1 overflow-hidden">
              <Sidebar
                isMobile={true}
                isOpen={mobileSidebarOpen}
                toggleDropdown={setOpenDropdown}
                openDropdown={openDropdown}
                onClose={() => setMobileSidebarOpen(false)}
              />
              <Sidebar
                isMobile={false}
                toggleDropdown={setOpenDropdown}
                openDropdown={openDropdown}
              />
              
              <main className="flex-1 bg-white">
                <div className="flex flex-col md:flex-row h-full">
                  {/* Roles List */}
                  <div className={`${
                    view === "roleList" ? "block" : "hidden md:block"
                  } w-full md:w-80 lg:w-96 xl:w-80 bg-gray-50 border-b md:border-b-0 md:border-r border-gray-200 flex flex-col max-h-screen md:max-h-none custom-scrollbar`}>
                    <div className="p-2 sm:p-3 md:p-4 border-b border-gray-200 flex-shrink-0">
                      <div className="flex items-center justify-between mb-2 sm:mb-3 md:mb-4">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <Users size={isMobile ? 14 : 16} className="text-gray-600" />
                          <h2 className="text-xs sm:text-sm md:text-base font-semibold text-gray-900">Roles</h2>
                        </div>
                        {canManageRoles && (
                          <button
                            onClick={handleCreateRole}
                            className="flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 bg-gradient-to-r from-[#6237A0] to-[#7C4DFF] text-white rounded-md hover:from-[#552C8C] hover:to-[#6B46C1] transition-colors text-xs"
                          >
                            <Plus size={isMobile ? 10 : 12} />
                            {!isMobile && <span className="hidden sm:inline">Create</span>}
                          </button>
                        )}
                      </div>
                      
                      {/* Search Input */}
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search roles..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6237A0]/20 focus:border-[#6237A0] transition-colors"
                        />
                      </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                      {loading ? (
                        <div className="flex items-center justify-center p-4 sm:p-6 md:p-8">
                          <div className="animate-spin rounded-full h-4 w-4 sm:h-6 sm:w-6 md:h-8 md:w-8 border-2 border-[#6237A0] border-t-transparent"></div>
                        </div>
                      ) : filteredRoles.length === 0 ? (
                        <div className="flex items-center justify-center p-4 sm:p-6 md:p-8">
                          <div className="text-center">
                            <Users size={isMobile ? 24 : 32} className="text-gray-300 mx-auto mb-2" />
                            <p className="text-xs sm:text-sm text-gray-500">
                              {searchQuery ? "No roles found" : "No roles available"}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="p-1 sm:p-2">
                          {filteredRoles.map((role) => (
                            <div key={role.role_id} className="mb-1 sm:mb-2">
                              <div
                                onClick={() => handleRoleClick(role, isMobile)}
                                className={`p-2 sm:p-3 rounded-lg cursor-pointer transition-all duration-200 touch-target ${
                                  selectedRole?.role_id === role.role_id
                                    ? "bg-[#6237A0] text-white shadow-md"
                                    : "hover:bg-gray-100 hover:shadow-sm"
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1 sm:gap-2 md:gap-3 min-w-0 flex-1">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleRoleExpansion(role.role_id);
                                      }}
                                      className="p-0.5 hover:bg-black/10 rounded transition-colors flex-shrink-0 touch-target"
                                    >
                                      {expandedRoles.has(role.role_id) ? 
                                        <ChevronDown size={isMobile ? 10 : 12} /> : 
                                        <ChevronRight size={isMobile ? 10 : 12} />
                                      }
                                    </button>
                                    <div className={`w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 rounded-full flex-shrink-0 ${role.active ? 'bg-green-500' : 'bg-gray-400'}`} />
                                    <span className="font-medium text-xs sm:text-sm truncate">
                                      {role.name}
                                    </span>
                                  </div>
                                  {canManageRoles && selectedRole?.role_id === role.role_id && !isMobile && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleToggleActive(role);
                                      }}
                                      className="p-1 hover:bg-white/20 rounded text-white/80 flex-shrink-0 transition-colors touch-target"
                                    >
                                      <Settings size={12} />
                                    </button>
                                  )}
                                </div>
                                <div className="ml-4 sm:ml-5 md:ml-6 mt-0.5 sm:mt-1">
                                  <p className={`text-xs ${selectedRole?.role_id === role.role_id ? 'text-white/80' : 'text-gray-500'}`}>
                                    {role.permissions.length} permissions • {roleMembers[role.role_id]?.length || 0} members
                                  </p>
                                </div>
                              </div>

                              {/* Role Members */}
                              {expandedRoles.has(role.role_id) && (
                                <div className="ml-2 sm:ml-3 md:ml-4 mt-1 sm:mt-2 bg-white rounded-lg border border-gray-200 shadow-sm">
                                  <div className="p-2 sm:p-3">
                                    <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-3">
                                      <Users size={isMobile ? 12 : 14} className="text-gray-600" />
                                      <h4 className="text-xs font-semibold text-gray-900">Role Members</h4>
                                    </div>
                                    
                                    {membersLoading[role.role_id] ? (
                                      <div className="flex items-center justify-center py-3 sm:py-4">
                                        <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-2 border-[#6237A0] border-t-transparent"></div>
                                      </div>
                                    ) : roleMembers[role.role_id]?.length > 0 ? (
                                      <div className="space-y-1 sm:space-y-2 max-h-32 sm:max-h-40 overflow-y-auto custom-scrollbar member-list-mobile sm:member-list-tablet lg:member-list-desktop">
                                        {roleMembers[role.role_id].map((member) => (
                                          <div key={member.sys_user_id} className="flex items-center gap-2 sm:gap-3 p-1.5 sm:p-2 bg-gray-50 rounded-lg touch-target">
                                            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#6237A0] flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
                                              {getInitials(member)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                              <p className="text-xs font-medium text-gray-900 truncate">
                                                {getDisplayName(member)}
                                              </p>
                                              <p className="text-xs text-gray-500 truncate">
                                                {member.sys_user_email}
                                              </p>
                                            </div>
                                            <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium ${
                                              member.sys_user_is_active 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-gray-100 text-gray-800'
                                            }`}>
                                              {member.sys_user_is_active ? 'Active' : 'Inactive'}
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    ) : (
                                      <p className="text-xs text-gray-500 text-center py-3 sm:py-4">No members assigned to this role</p>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Role Details */}
                  <div className={`${
                    view === "roleDetails" ? "block" : "hidden md:flex"
                  } flex-1 flex flex-col min-h-0`}>
                    {selectedRole ? (
                      <>
                        {/* Header */}
                        <div className="p-2 sm:p-3 md:p-4 lg:p-6 border-b border-gray-200 flex-shrink-0">
                          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3 md:mb-0">
                            {isMobile && (
                              <button
                                onClick={handleBackClick}
                                className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                              >
                                <ArrowLeft size={14} className="text-gray-600" />
                              </button>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
                                <div className="min-w-0 flex-1">
                                  <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 truncate">{selectedRole.name}</h3>
                                  <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
                                    {selectedRole.permissions.length} of {PERMISSIONS.length} permissions granted
                                  </p>
                                </div>
                                <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    selectedRole.active 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-gray-100 text-gray-800'
                                  }`}>
                                    {selectedRole.active ? 'Active' : 'Inactive'}
                                  </span>
                                  {canManageRoles && (
                                    <button
                                      onClick={() => handleToggleActive(selectedRole)}
                                      className="p-1.5 sm:p-2 hover:bg-[#6237A0]/20 rounded text-[#6237A0] transition-colors touch-target"
                                    >
                                      <Settings size={isMobile ? 14 : 16} />
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Permissions */}
                        <div className="flex-1 overflow-y-auto p-2 sm:p-3 md:p-4 lg:p-6 custom-scrollbar">
                          {PERMISSION_SECTIONS.map((section, sectionIndex) => (
                            <div key={section.title} className={`${sectionIndex > 0 ? 'mt-4 sm:mt-5 md:mt-6' : ''} mb-4 sm:mb-5 md:mb-6`}>
                              <div className="flex items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                                <Settings size={isMobile ? 14 : 16} className="text-gray-600" />
                                <h4 className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">
                                  {section.title}
                                </h4>
                              </div>
                              
                              <div className="space-y-2 sm:space-y-3">
                                {section.permissions.map((permission) => (
                                  <div
                                    key={permission.key}
                                    className="flex items-start sm:items-center justify-between p-2.5 sm:p-3 md:p-4 bg-gray-50 rounded-lg gap-2 sm:gap-3 hover:bg-gray-100 transition-colors touch-target roles-permission-card"
                                  >
                                    <div className="flex-1 min-w-0">
                                      <h5 className="font-medium text-xs sm:text-sm md:text-base text-gray-900 leading-tight mb-0.5 sm:mb-1">
                                        {permission.label}
                                      </h5>
                                      <p className="text-xs sm:text-sm text-gray-500 break-words leading-relaxed">
                                        {permission.description}
                                      </p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 mt-1 sm:mt-0 roles-touch-target">
                                      <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={selectedRole.permissions.includes(permission.key)}
                                        onChange={() => handleTogglePermission(permission.key)}
                                        disabled={!canManageRoles}
                                      />
                                      <div className={`${
                                        isMobile ? 'w-10 h-5 after:h-4 after:w-4' : 'w-11 h-6 after:h-5 after:w-5'
                                      } bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#6237A0]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:transition-all peer-checked:bg-[#6237A0] ${!canManageRoles ? 'opacity-50 cursor-not-allowed' : ''}`}></div>
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="flex-1 flex items-center justify-center p-3 sm:p-4">
                        <div className="text-center max-w-xs sm:max-w-sm">
                          <Shield size={isMobile ? 28 : 36} className="text-gray-300 mx-auto mb-2 sm:mb-3 md:mb-4" />
                          <h3 className="text-xs sm:text-sm md:text-base font-medium text-gray-900 mb-1 sm:mb-2">Select a Role</h3>
                          <p className="text-xs sm:text-sm text-gray-500 px-2 sm:px-4">
                            Choose a role from the {isMobile ? 'list above' : 'left panel'} to view and manage its permissions
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </main>
            </div>

            {/* Create Role Modal */}
            {isModalOpen && (
              <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-sm sm:max-w-md shadow-xl animate-fade-in">
                  <h3 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4 text-gray-900">Create New Role</h3>
                  <input
                    type="text"
                    placeholder="Role name"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg mb-3 sm:mb-4 focus:outline-none focus:ring-2 focus:ring-[#6237A0] focus:border-[#6237A0] text-sm touch-target"
                    autoFocus
                  />
                  <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3">
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="w-full sm:w-auto px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors border border-gray-300 rounded-lg sm:border-0 touch-target"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveRole}
                      disabled={!editForm.name.trim()}
                      className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-[#6237A0] to-[#7C4DFF] text-white rounded-lg hover:from-[#552C8C] hover:to-[#6B46C1] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm touch-target"
                    >
                      Create
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      }}
    </ResponsiveContainer>
  );
}