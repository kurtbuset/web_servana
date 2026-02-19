  import { useState, useRef, useEffect } from "react";
import { Edit3, Search, X, Eye, EyeOff, Filter, ChevronRight, ArrowLeft } from "react-feather";
import Layout from "../../components/Layout";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useAgents } from "../../hooks/useAgents";
import { useUser } from "../../context/UserContext";
import { useTheme } from "../../context/ThemeContext";
import { PERMISSIONS } from "../../constants/permissions";
import { toast } from "react-toastify";
import "../../../src/App.css";

/**
 * ManageAgentsScreen - Breadcrumb-based agent management interface
 * 
 * Flow:
 * 1. Accounts List (main view)
 * 2. Agent Detail View (click on agent row)
 * 3. Edit Department View (click "Edit Department" button)
 * 
 * Features:
 * - Breadcrumb navigation
 * - View all agents
 * - Search agents by email
 * - Add new agent
 * - Edit agent email/password
 * - Toggle agent active status
 * - Assign/unassign departments
 */
export default function ManageAgentsScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentView, setCurrentView] = useState("list"); // "list", "detail", "editDept", "analytics"
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [selectedAgentIndex, setSelectedAgentIndex] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [modalError, setModalError] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [originalDepartments, setOriginalDepartments] = useState([]);

  const { hasPermission } = useUser();
  const { isDark } = useTheme();
  const canAssignDepartment = hasPermission(PERMISSIONS.ASSIGN_DEPT);
  const canCreateAccount = hasPermission(PERMISSIONS.CREATE_ACCOUNT);

  const {
    agents,
    allDepartments,
    loading,
    createAgent,
    updateAgent,
    toggleActive,
    toggleDepartment,
  } = useAgents();

  const filteredAgents = agents.filter((agent) => {
    const email = agent.email?.toLowerCase() || "";
    return email.includes(searchQuery.toLowerCase());
  });

  // Handle agent row click
  const handleAgentClick = (agent, index) => {
    setSelectedAgent(agent);
    setSelectedAgentIndex(index);
    setOriginalDepartments([...agent.departments]);
    setCurrentView("detail");
    setHasUnsavedChanges(false);
  };

  // Handle back navigation
  const handleBack = () => {
    if (currentView === "editDept" && hasUnsavedChanges) {
      if (!confirm("You have unsaved changes. Are you sure you want to go back?")) {
        return;
      }
    }
    
    if (currentView === "editDept") {
      setCurrentView("detail");
      setHasUnsavedChanges(false);
    } else if (currentView === "detail") {
      setCurrentView("list");
      setSelectedAgent(null);
      setSelectedAgentIndex(null);
    } else if (currentView === "analytics") {
      setCurrentView("detail");
    }
  };

  // Handle breadcrumb click
  const handleBreadcrumbClick = (view) => {
    if (currentView === "editDept" && hasUnsavedChanges && view !== "editDept") {
      if (!confirm("You have unsaved changes. Are you sure you want to leave?")) {
        return;
      }
    }
    
    if (view === "list") {
      setCurrentView("list");
      setSelectedAgent(null);
      setSelectedAgentIndex(null);
      setHasUnsavedChanges(false);
    } else if (view === "detail") {
      setCurrentView("detail");
      setHasUnsavedChanges(false);
    }
  };

  // Handle view analytics click
  const handleViewAnalytics = () => {
    setCurrentView("analytics");
  };

  // Handle edit department click
  const handleEditDepartment = () => {
    setCurrentView("editDept");
    setHasUnsavedChanges(false);
  };

  // Handle department toggle in edit view
  const handleDepartmentToggle = async (dept) => {
    if (!canAssignDepartment) {
      toast.error("You don't have permission to assign departments");
      return;
    }

    const updatedAgent = { ...selectedAgent };
    if (updatedAgent.departments.includes(dept)) {
      updatedAgent.departments = updatedAgent.departments.filter(d => d !== dept);
    } else {
      updatedAgent.departments = [...updatedAgent.departments, dept];
    }
    
    setSelectedAgent(updatedAgent);
    setHasUnsavedChanges(true);
  };

  // Save department changes
  const handleSaveDepartments = async () => {
    try {
      // Update each department change
      const departmentsToAdd = selectedAgent.departments.filter(d => !originalDepartments.includes(d));
      const departmentsToRemove = originalDepartments.filter(d => !selectedAgent.departments.includes(d));
      
      for (const dept of departmentsToAdd) {
        await toggleDepartment(selectedAgentIndex, dept);
      }
      
      for (const dept of departmentsToRemove) {
        await toggleDepartment(selectedAgentIndex, dept);
      }
      
      setOriginalDepartments([...selectedAgent.departments]);
      setHasUnsavedChanges(false);
      toast.success("Departments updated successfully");
      setCurrentView("detail");
    } catch (error) {
      console.error("Error saving departments:", error);
    }
  };

  // Reset department changes
  const handleResetDepartments = () => {
    setSelectedAgent({ ...selectedAgent, departments: [...originalDepartments] });
    setHasUnsavedChanges(false);
  };

  // Handle add agent
  const handleAddAgent = async () => {
    try {
      await createAgent(editForm.email, editForm.password);
      setIsAddModalOpen(false);
      setEditForm({ email: "", password: "" });
      setModalError(null);
    } catch (error) {
      setModalError(error.message);
    }
  };

  // Handle toggle active
  const handleToggleActive = async (index) => {
    if (!canCreateAccount) {
      toast.error("You don't have permission to modify account status");
      return;
    }
    await toggleActive(index);
  };

  return (
    <>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${isDark ? '#2a2a2a' : '#f1f1f1'};
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #6237A0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #552C8C;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes ping-slow {
          0% { transform: scale(1); opacity: 1; }
          75%, 100% { transform: scale(2); opacity: 0; }
        }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-ping-slow { animation: ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite; }
      `}</style>
      <Layout>
        <div className="flex flex-col h-full overflow-hidden" style={{ backgroundColor: 'var(--bg-secondary)' }}>
          <div className="flex flex-col h-full gap-0 p-0 md:p-3 flex-1">
            <div className="h-full flex flex-col md:rounded-xl shadow-sm border-0 md:border overflow-hidden" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
              <div className="p-3 sm:p-4">
            
            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-2 mb-3 text-xs">
              <button
                onClick={() => handleBreadcrumbClick("list")}
                className={`transition-colors ${
                  currentView === "list" 
                    ? "font-semibold text-[#6237A0]" 
                    : "hover:text-[#6237A0]"
                }`}
                style={currentView !== "list" ? { color: 'var(--text-secondary)' } : {}}
              >
                
              </button>
              
              {currentView !== "list" && (
                <>
                  <ChevronRight size={14} style={{ color: 'var(--text-secondary)' }} />
                  <button
                    onClick={() => handleBreadcrumbClick("detail")}
                    className={`transition-colors ${
                      currentView === "detail" 
                        ? "font-semibold text-[#6237A0]" 
                        : "hover:text-[#6237A0]"
                    }`}
                    style={currentView !== "detail" ? { color: 'var(--text-secondary)' } : {}}
                  >
                    {selectedAgent?.email?.split('@')[0] || "Agent"}
                  </button>
                </>
              )}
              
              {currentView === "editDept" && (
                <>
                  <ChevronRight size={14} style={{ color: 'var(--text-secondary)' }} />
                  <span className="font-semibold text-[#6237A0]">Edit Department</span>
                </>
              )}

              {currentView === "analytics" && (
                <>
                  <ChevronRight size={14} style={{ color: 'var(--text-secondary)' }} />
                  <span className="font-semibold text-[#6237A0]">Analytics</span>
                </>
              )}
            </div>

            {/* Main Content */}
            {currentView === "list" && (
              <ListView
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                filteredAgents={filteredAgents}
                loading={loading}
                onAgentClick={handleAgentClick}
                onAddAgent={() => setIsAddModalOpen(true)}
                onToggleActive={handleToggleActive}
                canCreateAccount={canCreateAccount}
                isDark={isDark}
              />
            )}

            {currentView === "detail" && selectedAgent && (
              <DetailView
                agent={selectedAgent}
                onBack={handleBack}
                onEditDepartment={handleEditDepartment}
                onViewAnalytics={handleViewAnalytics}
                onToggleActive={() => handleToggleActive(selectedAgentIndex)}
                canCreateAccount={canCreateAccount}
                isDark={isDark}
              />
            )}

            {currentView === "editDept" && selectedAgent && (
              <EditDepartmentView
                agent={selectedAgent}
                allDepartments={allDepartments}
                agents={agents}
                onBack={handleBack}
                onToggleDepartment={handleDepartmentToggle}
                onSave={handleSaveDepartments}
                onReset={handleResetDepartments}
                hasUnsavedChanges={hasUnsavedChanges}
                canAssignDepartment={canAssignDepartment}
                isDark={isDark}
              />
            )}

            {currentView === "analytics" && selectedAgent && (
              <AnalyticsView
                agent={selectedAgent}
                onBack={handleBack}
                isDark={isDark}
              />
            )}
              </div>
            </div>
          </div>
        </div>

        {/* Add Agent Modal */}
        {isAddModalOpen && (
          <AddAgentModal
            editForm={editForm}
            setEditForm={setEditForm}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            modalError={modalError}
            setModalError={setModalError}
            onClose={() => {
              setIsAddModalOpen(false);
              setEditForm({ email: "", password: "" });
              setModalError(null);
            }}
            onSave={handleAddAgent}
            isDark={isDark}
          />
        )}
      </Layout>
    </>
  );
}

// ListView Component - Main accounts list
function ListView({ searchQuery, setSearchQuery, filteredAgents, loading, onAgentClick, onAddAgent, onToggleActive, canCreateAccount, isDark }) {
  return (
    <>
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-3">
        <h1 className="text-base sm:text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Accounts</h1>
        
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          {/* Search Bar */}
          <div className="relative flex-1 sm:flex-initial sm:w-56 md:w-64">
            <div className="flex items-center px-2 py-1.5 rounded-lg w-full" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
              <Search size={14} className="mr-2 flex-shrink-0" style={{ color: 'var(--text-secondary)' }} />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent focus:outline-none text-xs w-full"
                style={{ color: 'var(--text-primary)' }}
              />
              {searchQuery && (
                <X
                  size={14}
                  className="cursor-pointer hover:text-gray-700 transition-colors"
                  style={{ color: 'var(--text-secondary)' }}
                  onClick={() => setSearchQuery("")}
                />
              )}
            </div>
          </div>

          {/* Add Button */}
          <button
            onClick={onAddAgent}
            disabled={!canCreateAccount}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
              canCreateAccount
                ? "bg-[#6237A0] text-white hover:bg-[#552C8C]"
                : "cursor-not-allowed"
            }`}
            style={!canCreateAccount ? {
              backgroundColor: isDark ? '#4a4a4a' : '#d1d5db',
              color: isDark ? '#9ca3af' : '#6b7280'
            } : {}}
          >
            Add Account
          </button>
        </div>
      </div>

      {/* Agents Table */}
      <div className="flex-1 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-8 w-8 border-3 border-t-[#6237A0]" style={{ borderColor: 'var(--border-color)', borderTopColor: '#6237A0' }}></div>
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Loading agents...</span>
            </div>
          </div>
        ) : (
          <div className="h-full overflow-y-auto custom-scrollbar">
            <table className="min-w-full text-sm">
              <thead className="sticky top-0 z-10" style={{ backgroundColor: isDark ? '#2a2a2a' : '#f9fafb' }}>
                <tr>
                  <th className="py-2 px-3 text-left font-semibold text-xs" style={{ color: 'var(--text-secondary)' }}>Accounts</th>
                  <th className="py-2 px-3 text-center font-semibold text-xs" style={{ color: 'var(--text-secondary)' }}>Edit</th>
                  <th className="py-2 px-3 text-center font-semibold text-xs" style={{ color: 'var(--text-secondary)' }}>Active</th>
                  <th className="py-2 px-3 text-left font-semibold text-xs" style={{ color: 'var(--text-secondary)' }}>Departments</th>
                  <th className="py-2 px-3 text-center font-semibold text-xs" style={{ color: 'var(--text-secondary)' }}></th>
                </tr>
              </thead>
              <tbody>
                {filteredAgents.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12">
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        {searchQuery ? "No agents found matching your search" : "No agents available"}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredAgents.map((agent, idx) => (
                    <tr 
                      key={idx}
                      className="border-t transition-colors"
                      style={{ borderColor: 'var(--border-color)' }}
                    >
                      <td className="py-2 px-3">
                        <div className="flex items-center gap-2">
                          <img
                            src={agent.profile_picture || "profile_picture/DefaultProfile.jpg"}
                            alt={agent.email}
                            className="w-7 h-7 rounded-full object-cover"
                          />
                          <span className="text-xs" style={{ color: 'var(--text-primary)' }}>{agent.email?.split('@')[0]}</span>
                        </div>
                      </td>
                      <td className="py-2 px-3 text-center">
                        <button className="p-1 rounded hover:bg-gray-100" onClick={(e) => { e.stopPropagation(); }}>
                          <Edit3 size={14} style={{ color: 'var(--text-secondary)' }} />
                        </button>
                      </td>
                      <td className="py-2 px-3 text-center">
                        <ToggleSwitch 
                          checked={agent.active} 
                          onChange={(e) => {
                            e.stopPropagation();
                            onToggleActive(idx);
                          }} 
                          disabled={!canCreateAccount} 
                        />
                      </td>
                      <td className="py-2 px-3">
                        <div className="flex flex-wrap gap-1">
                          {agent.departments?.slice(0, 3).map((dept, i) => (
                            <span key={i} className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: isDark ? 'rgba(139, 92, 246, 0.1)' : '#f3e8ff', color: 'var(--text-secondary)' }}>
                              {dept}
                            </span>
                          ))}
                          {agent.departments?.length > 3 && (
                            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>+{agent.departments.length - 3}</span>
                          )}
                        </div>
                      </td>
                      <td className="py-2 px-3 text-center">
                        <button
                          onClick={() => onAgentClick(agent, idx)}
                          className="p-1.5 rounded-full transition-colors inline-flex items-center justify-center"
                          style={{ color: 'var(--text-secondary)' }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = isDark ? 'rgba(139, 92, 246, 0.15)' : 'rgba(243, 232, 255, 1)';
                            e.currentTarget.style.color = '#6237A0';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = 'var(--text-secondary)';
                          }}
                        >
                          <ChevronRight size={14} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

// DetailView Component - Agent detail view
function DetailView({ agent, onBack, onEditDepartment, onViewAnalytics, onToggleActive, canCreateAccount, isDark }) {
  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar pb-4">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="mb-3 flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors hover:bg-opacity-80"
        style={{ backgroundColor: isDark ? 'rgba(139, 92, 246, 0.1)' : '#f3e8ff', color: '#6237A0' }}
      >
        <ArrowLeft size={14} />
        <span className="text-xs font-medium">Back</span>
      </button>

      {/* Purple Header */}
      <div className="bg-gradient-to-r from-[#6237A0] to-[#7A4ED9] rounded-t-lg p-4 pb-8 text-white relative overflow-hidden">
        {/* Animated background circles */}
        <div className="absolute top-3 right-3 w-20 h-20 border-2 border-white/20 rounded-full animate-ping-slow"></div>
        <div className="absolute bottom-3 left-3 w-16 h-16 bg-white/10 rounded-full blur-xl animate-float"></div>
        
        <div className="flex items-start gap-3 relative z-10">
          <div className="w-12 h-12"></div> {/* Spacer for alignment */}
          <div className="pt-1">
            <h2 className="text-base font-bold">{agent.email?.split('@')[0]}</h2>
            <p className="text-xs text-purple-100">{agent.email}</p>
          </div>
        </div>
        
        {/* Profile Picture - Positioned at border */}
        <div className="absolute left-4 -bottom-6">
          <img
            src={agent.profile_picture || "profile_picture/DefaultProfile.jpg"}
            alt={agent.email}
            className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg"
          />
        </div>
      </div>

      {/* Content */}
      <div className="border-x border-b rounded-b-lg p-4 pt-10" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--card-bg)' }}>
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Left Column - Department Section (20% width) */}
          <div className="lg:w-[20%]">
            <h3 className="text-xs font-bold mb-2 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Department</h3>
            <div className="p-3 rounded-lg mb-3" style={{ backgroundColor: isDark ? 'rgba(139, 92, 246, 0.05)' : '#f9fafb' }}>
              <div className="flex flex-wrap gap-2">
                {agent.departments?.length > 0 ? (
                  agent.departments.map((dept, i) => (
                    <span key={i} className="px-2 py-1 rounded-lg text-xs" style={{ backgroundColor: isDark ? 'rgba(139, 92, 246, 0.15)' : '#f3e8ff', color: 'var(--text-primary)' }}>
                      {dept}
                    </span>
                  ))
                ) : (
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>No departments assigned</span>
                )}
              </div>
            </div>
            <button
              onClick={onEditDepartment}
              className="w-full px-3 py-1.5 rounded-lg bg-[#6237A0] text-white text-xs font-medium hover:bg-[#552C8C] transition-colors"
            >
              Edit Department
            </button>
          </div>

          {/* Right Column - Agent Information (80% width) */}
          <div className="lg:w-[80%]">
            <h3 className="text-xs font-bold mb-2 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Information</h3>
            <div className="p-3 rounded-lg" style={{ backgroundColor: isDark ? 'rgba(139, 92, 246, 0.05)' : '#f9fafb' }}>
              <div className="space-y-2">
                {/* Agent ID */}
                <div className="flex justify-between items-center">
                  <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Agent ID</p>
                  <p className="text-xs" style={{ color: 'var(--text-primary)' }}>#{agent.id || 'N/A'}</p>
                </div>
                
                {/* Username */}
                <div className="flex justify-between items-center">
                  <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Username</p>
                  <p className="text-xs" style={{ color: 'var(--text-primary)' }}>{agent.email?.split('@')[0] || 'N/A'}</p>
                </div>
                
                {/* Email */}
                <div className="flex justify-between items-center">
                  <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Email</p>
                  <p className="text-xs truncate ml-2" style={{ color: 'var(--text-primary)' }}>{agent.email || 'N/A'}</p>
                </div>
                
                {/* Role */}
                <div className="flex justify-between items-center">
                  <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Role</p>
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold" style={{ backgroundColor: isDark ? 'rgba(139, 92, 246, 0.1)' : '#f3e8ff', color: '#6237A0' }}>
                    AGENT
                  </span>
                </div>
                
                {/* Status */}
                <div className="flex justify-between items-center">
                  <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Status</p>
                  <div className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${agent.active ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                    <span className="text-xs" style={{ color: 'var(--text-primary)' }}>
                      {agent.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                
                {/* Total Departments */}
                <div className="flex justify-between items-center">
                  <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Departments</p>
                  <p className="text-xs" style={{ color: 'var(--text-primary)' }}>{agent.departments?.length || 0} assigned</p>
                </div>
                
                {/* Created Date (if available) */}
                {agent.created_at && (
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Created</p>
                    <p className="text-xs" style={{ color: 'var(--text-primary)' }}>
                      {new Date(agent.created_at).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Personal Analytics Section */}
        <div className="mt-4">
          <h3 className="text-xs font-bold mb-2 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Personal Analytics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {/* Total Chats */}
            <div className="p-3 rounded-lg" style={{ backgroundColor: isDark ? 'rgba(139, 92, 246, 0.05)' : '#f9fafb' }}>
              <div className="flex items-center gap-2 mb-1">
                <svg className="w-4 h-4" style={{ color: '#6237A0' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Total Chats</p>
              </div>
              <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>247</p>
              <p className="text-[10px] mt-1" style={{ color: '#10b981' }}>+12% this week</p>
            </div>

            {/* Avg Response Time */}
            <div className="p-3 rounded-lg" style={{ backgroundColor: isDark ? 'rgba(139, 92, 246, 0.05)' : '#f9fafb' }}>
              <div className="flex items-center gap-2 mb-1">
                <svg className="w-4 h-4" style={{ color: '#6237A0' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Avg Response</p>
              </div>
              <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>2.3m</p>
              <p className="text-[10px] mt-1" style={{ color: '#10b981' }}>-15% faster</p>
            </div>

            {/* Satisfaction Rate */}
            <div className="p-3 rounded-lg" style={{ backgroundColor: isDark ? 'rgba(139, 92, 246, 0.05)' : '#f9fafb' }}>
              <div className="flex items-center gap-2 mb-1">
                <svg className="w-4 h-4" style={{ color: '#6237A0' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Satisfaction</p>
              </div>
              <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>4.8/5</p>
              <p className="text-[10px] mt-1" style={{ color: '#10b981' }}>+0.3 rating</p>
            </div>

            {/* Resolved Tickets */}
            <div className="p-3 rounded-lg" style={{ backgroundColor: isDark ? 'rgba(139, 92, 246, 0.05)' : '#f9fafb' }}>
              <div className="flex items-center gap-2 mb-1">
                <svg className="w-4 h-4" style={{ color: '#6237A0' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Resolved</p>
              </div>
              <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>234</p>
              <p className="text-[10px] mt-1" style={{ color: '#10b981' }}>94.7% rate</p>
            </div>
          </div>

          {/* View Full Analytics Button */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={onViewAnalytics}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
              style={{ color: isDark ? '#ffffff' : '#6237A0' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = isDark ? '#e0e0e0' : '#552C8C';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = isDark ? '#ffffff' : '#6237A0';
              }}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              View Full Analytics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// EditDepartmentView Component - Edit department assignments
function EditDepartmentView({ agent, allDepartments, onBack, onToggleDepartment, onSave, onReset, hasUnsavedChanges, canAssignDepartment, isDark, agents }) {
  // Calculate real department counts from agents data
  const getDepartmentCount = (dept) => {
    if (!agents || agents.length === 0) return 0;
    return agents.filter(a => a.departments?.includes(dept)).length;
  };

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar pb-4">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="mb-3 flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors hover:bg-opacity-80"
        style={{ backgroundColor: isDark ? 'rgba(139, 92, 246, 0.1)' : '#f3e8ff', color: '#6237A0' }}
      >
        <ArrowLeft size={14} />
        <span className="text-xs font-medium">Back</span>
      </button>

      {/* Purple Header */}
      <div className="bg-gradient-to-r from-[#6237A0] to-[#7A4ED9] rounded-t-lg p-4 pb-8 text-white relative overflow-hidden">
        {/* Animated background circles */}
        <div className="absolute top-3 right-3 w-20 h-20 border-2 border-white/20 rounded-full animate-ping-slow"></div>
        <div className="absolute bottom-3 left-3 w-16 h-16 bg-white/10 rounded-full blur-xl animate-float"></div>
        
        <div className="flex items-start gap-3 relative z-10">
          <div className="w-12 h-12"></div> {/* Spacer for alignment */}
          <div className="pt-1">
            <h2 className="text-base font-bold">{agent.email?.split('@')[0]}</h2>
            <p className="text-xs text-purple-100">{agent.email}</p>
          </div>
        </div>
        
        {/* Profile Picture - Positioned at border */}
        <div className="absolute left-4 -bottom-6">
          <img
            src={agent.profile_picture || "profile_picture/DefaultProfile.jpg"}
            alt={agent.email}
            className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg"
          />
        </div>
      </div>

      {/* Content */}
      <div className="border-x border-b rounded-b-lg p-4 pt-10" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--card-bg)' }}>
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Left Column - Assigned Departments (20% width) */}
          <div className="lg:w-[20%]">
            <h3 className="text-xs font-bold mb-2 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Assigned Departments</h3>
            <div className="p-3 rounded-lg" style={{ backgroundColor: isDark ? 'rgba(139, 92, 246, 0.05)' : '#f9fafb' }}>
              <div className="space-y-2">
                {agent.departments?.length > 0 ? (
                  agent.departments.map((dept, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-lg" style={{ backgroundColor: isDark ? 'rgba(139, 92, 246, 0.15)' : '#f3e8ff' }}>
                      <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{dept}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: isDark ? 'rgba(139, 92, 246, 0.2)' : '#e9d5ff', color: 'var(--text-secondary)' }}>
                        {getDepartmentCount(dept)}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-center py-4" style={{ color: 'var(--text-secondary)' }}>No departments assigned</p>
                )}
              </div>
            </div>
          </div>

          {/* Gap (10% width) with vertical line */}
          <div className="lg:w-[10%] flex justify-center">
            <div className="w-0.5 h-full" style={{ backgroundColor: 'var(--border-color)' }}></div>
          </div>

          {/* Right Column - All Department List (70% width) */}
          <div className="lg:w-[70%]">
            <h3 className="text-xs font-bold mb-2 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>All Departments</h3>
            <div className="p-3 rounded-lg space-y-1.5" style={{ backgroundColor: isDark ? 'rgba(139, 92, 246, 0.05)' : '#f9fafb' }}>
              {allDepartments.map((dept, idx) => {
                const isChecked = agent.departments?.includes(dept);
                const agentCount = getDepartmentCount(dept);
                
                return (
                  <label
                    key={idx}
                    className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                      isChecked ? 'bg-white shadow-sm' : ''
                    }`}
                    style={isChecked ? { 
                      backgroundColor: isDark ? 'rgba(139, 92, 246, 0.15)' : '#ffffff',
                      border: `1px solid ${isDark ? 'rgba(139, 92, 246, 0.3)' : '#e9d5ff'}`
                    } : {}}
                    onMouseEnter={(e) => {
                      if (!isChecked) {
                        e.currentTarget.style.backgroundColor = isDark ? 'rgba(139, 92, 246, 0.08)' : '#faf5ff';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isChecked) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => onToggleDepartment(dept)}
                        disabled={!canAssignDepartment}
                        className="w-4 h-4 rounded text-[#6237A0] focus:ring-[#6237A0] cursor-pointer"
                      />
                      <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{dept}</span>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: isDark ? 'rgba(139, 92, 246, 0.1)' : '#f3e8ff', color: 'var(--text-secondary)' }}>
                      {agentCount} {agentCount === 1 ? 'agent' : 'agents'}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Unsaved Changes Bar */}
      {hasUnsavedChanges && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 flex items-center justify-between shadow-lg z-50">
          <span className="text-sm font-medium">Careful - Unsaved Changes</span>
          <div className="flex gap-3">
            <button
              onClick={onReset}
              className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-sm font-medium transition-colors"
            >
              Reset
            </button>
            <button
              onClick={onSave}
              className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-sm font-medium transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// AddAgentModal Component
function AddAgentModal({ editForm, setEditForm, showPassword, setShowPassword, modalError, setModalError, onClose, onSave, isDark }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4">
      <div className="rounded-lg p-5 sm:p-6 w-full max-w-md" style={{ backgroundColor: 'var(--card-bg)' }}>
        <h2 className="text-lg sm:text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          Add Agent
        </h2>
        {modalError && (
          <div className="bg-red-50 text-red-700 px-3 sm:px-4 py-2.5 rounded-lg mb-4 text-sm font-medium border border-red-200">
            {modalError}
          </div>
        )}
        <label className="block mb-2 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
          Email
        </label>
        <input
          type="email"
          value={editForm.email}
          onChange={(e) => {
            setEditForm({ ...editForm, email: e.target.value });
            if (modalError) setModalError(null);
          }}
          placeholder="agent@example.com"
          className="w-full mb-4 px-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6237A0] focus:border-transparent"
          style={{ 
            backgroundColor: 'var(--input-bg)', 
            color: 'var(--text-primary)',
            border: `1px solid var(--border-color)`
          }}
          autoFocus
        />

        <label className="block mb-2 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
          Password
        </label>
        <div className="relative mb-5">
          <input
            type={showPassword ? "text" : "password"}
            value={editForm.password}
            onChange={(e) => {
              setEditForm({ ...editForm, password: e.target.value });
              if (modalError) setModalError(null);
            }}
            placeholder="Enter password"
            className="w-full px-3 py-2.5 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6237A0] focus:border-transparent"
            style={{ 
              backgroundColor: 'var(--input-bg)', 
              color: 'var(--text-primary)',
              border: `1px solid var(--border-color)`
            }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-1/2 -translate-y-1/2 right-3 hover:text-gray-700 transition-colors"
            style={{ color: 'var(--text-secondary)' }}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 rounded-lg font-medium transition-colors"
            style={{ 
              backgroundColor: isDark ? '#4a4a4a' : '#e5e7eb',
              color: 'var(--text-primary)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = isDark ? '#5a5a5a' : '#d1d5db';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = isDark ? '#4a4a4a' : '#e5e7eb';
            }}
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={!editForm.email.trim() || !editForm.password.trim()}
            className={`w-full sm:w-auto px-4 py-2 rounded-lg font-medium transition-colors ${
              editForm.email.trim() && editForm.password.trim()
                ? "bg-[#6237A0] text-white hover:bg-[#552C8C]"
                : "cursor-not-allowed"
            }`}
            style={!(editForm.email.trim() && editForm.password.trim()) ? {
              backgroundColor: isDark ? '#4a4a4a' : '#d1d5db',
              color: isDark ? '#9ca3af' : '#6b7280'
            } : {}}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

// ToggleSwitch component
function ToggleSwitch({ checked, onChange, disabled = false }) {
  return (
    <label 
      className={`inline-flex relative items-center ${
        disabled ? "cursor-not-allowed" : "cursor-pointer"
      }`}
      onClick={(e) => e.stopPropagation()}
    >
      <input
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
      />
      <div className={`w-11 h-6 rounded-full peer transition-colors relative after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-transform peer-checked:after:translate-x-5 ${
        disabled
          ? "bg-gray-200 peer-checked:bg-gray-400"
          : "bg-gray-300 peer-checked:bg-[#6237A0]"
      }`} />
    </label>
  );
}


// AnalyticsView Component - Full analytics view
function AnalyticsView({ agent, onBack, isDark }) {
  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar pb-4">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="mb-3 flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors hover:bg-opacity-80"
        style={{ backgroundColor: isDark ? 'rgba(139, 92, 246, 0.1)' : '#f3e8ff', color: '#6237A0' }}
      >
        <ArrowLeft size={14} />
        <span className="text-xs font-medium">Back</span>
      </button>

      {/* Header */}
      <div className="mb-4">
        <h2 className="text-lg font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
          Analytics for {agent.email?.split('@')[0]}
        </h2>
        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          Performance metrics and insights
        </p>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {/* Total Chats */}
        <div className="p-3 rounded-lg" style={{ backgroundColor: isDark ? 'rgba(139, 92, 246, 0.05)' : '#f9fafb' }}>
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-4 h-4" style={{ color: '#6237A0' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Total Chats</p>
          </div>
          <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>247</p>
          <p className="text-[10px] mt-1" style={{ color: '#10b981' }}>+12% this week</p>
        </div>

        {/* Avg Response Time */}
        <div className="p-3 rounded-lg" style={{ backgroundColor: isDark ? 'rgba(139, 92, 246, 0.05)' : '#f9fafb' }}>
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-4 h-4" style={{ color: '#6237A0' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Avg Response</p>
          </div>
          <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>2.3m</p>
          <p className="text-[10px] mt-1" style={{ color: '#10b981' }}>-15% faster</p>
        </div>

        {/* Satisfaction Rate */}
        <div className="p-3 rounded-lg" style={{ backgroundColor: isDark ? 'rgba(139, 92, 246, 0.05)' : '#f9fafb' }}>
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-4 h-4" style={{ color: '#6237A0' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Satisfaction</p>
          </div>
          <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>4.8/5</p>
          <p className="text-[10px] mt-1" style={{ color: '#10b981' }}>+0.3 rating</p>
        </div>

        {/* Resolved Tickets */}
        <div className="p-3 rounded-lg" style={{ backgroundColor: isDark ? 'rgba(139, 92, 246, 0.05)' : '#f9fafb' }}>
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-4 h-4" style={{ color: '#6237A0' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Resolved</p>
          </div>
          <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>234</p>
          <p className="text-[10px] mt-1" style={{ color: '#10b981' }}>94.7% rate</p>
        </div>
      </div>

      {/* Performance Graph */}
      <div className="p-4 rounded-lg" style={{ backgroundColor: isDark ? 'rgba(139, 92, 246, 0.05)' : '#f9fafb' }}>
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Chat Performance (Last 7 Days)</h4>
          <span className="text-[10px] px-2 py-1 rounded" style={{ backgroundColor: isDark ? 'rgba(139, 92, 246, 0.1)' : '#f3e8ff', color: '#6237A0' }}>
            Weekly
          </span>
        </div>
        
        {/* Simple SVG Line Graph */}
        <div className="relative h-32">
          <svg className="w-full h-full" viewBox="0 0 350 100" preserveAspectRatio="none">
            {/* Grid lines */}
            <line x1="0" y1="25" x2="350" y2="25" stroke={isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} strokeWidth="0.5" />
            <line x1="0" y1="50" x2="350" y2="50" stroke={isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} strokeWidth="0.5" />
            <line x1="0" y1="75" x2="350" y2="75" stroke={isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} strokeWidth="0.5" />
            
            {/* Area under the line */}
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#6237A0', stopOpacity: 0.3 }} />
                <stop offset="100%" style={{ stopColor: '#6237A0', stopOpacity: 0 }} />
              </linearGradient>
            </defs>
            <path
              d="M 0 80 L 50 65 L 100 70 L 150 45 L 200 50 L 250 35 L 300 40 L 350 25 L 350 100 L 0 100 Z"
              fill="url(#lineGradient)"
            />
            
            {/* Line */}
            <path
              d="M 0 80 L 50 65 L 100 70 L 150 45 L 200 50 L 250 35 L 300 40 L 350 25"
              fill="none"
              stroke="#6237A0"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            
            {/* Data points */}
            <circle cx="0" cy="80" r="3" fill="#6237A0" />
            <circle cx="50" cy="65" r="3" fill="#6237A0" />
            <circle cx="100" cy="70" r="3" fill="#6237A0" />
            <circle cx="150" cy="45" r="3" fill="#6237A0" />
            <circle cx="200" cy="50" r="3" fill="#6237A0" />
            <circle cx="250" cy="35" r="3" fill="#6237A0" />
            <circle cx="300" cy="40" r="3" fill="#6237A0" />
            <circle cx="350" cy="25" r="3" fill="#6237A0" />
          </svg>
          
          {/* X-axis labels */}
          <div className="flex justify-between mt-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
              <span key={i} className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>{day}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
