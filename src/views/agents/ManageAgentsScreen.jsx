  import { useState, useEffect, useCallback } from "react";
import { Edit3, ChevronRight } from "react-feather";
import Layout from "../../components/Layout";
import ScreenContainer from "../../components/ScreenContainer";
import ScrollContainer from "../../components/ScrollContainer";
import SearchBar from "../../components/SearchBar";
import ToggleSwitch from "../../components/ToggleSwitch";
import AgentDetailView from "./components/AgentDetailView";
import EditDepartmentView from "./components/EditDepartmentView";
import AnalyticsView from "./components/AnalyticsView";
import AddAgentModal from "./components/AddAgentModal";
import { useAgents } from "../../hooks/useAgents";
import { useUser } from "../../context/UserContext";
import { useTheme } from "../../context/ThemeContext";
import { PERMISSIONS } from "../../constants/permissions";
import { useUnsavedChanges } from "../../context/UnsavedChangesContext";
import toast from "../../utils/toast";
import { Avatar } from "../../components/ui";
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
  const [shakeBar, setShakeBar] = useState(0);

  const { hasPermission } = useUser();
  const { isDark } = useTheme();
  const { setHasUnsavedChanges: setGlobalUnsavedChanges, setOnNavigationBlocked } = useUnsavedChanges();
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

  const triggerShake = useCallback(() => {
    setShakeBar(prev => prev + 1);
  }, []);

  // Set up the navigation blocked callback
  useEffect(() => {
    setOnNavigationBlocked(triggerShake);
    
    // Cleanup: reset when component unmounts
    return () => {
      setOnNavigationBlocked(null);
      setGlobalUnsavedChanges(false);
    };
  }, [setOnNavigationBlocked, triggerShake, setGlobalUnsavedChanges]);

  // Sync local unsaved changes with global context
  useEffect(() => {
    setGlobalUnsavedChanges(hasUnsavedChanges);
  }, [hasUnsavedChanges, setGlobalUnsavedChanges]);

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
      triggerShake();
      return;
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
      triggerShake();
      return;
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
    <Layout>
      <style>{`
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
      <ScreenContainer>
        <div className="p-3 sm:p-4 flex flex-col h-full overflow-hidden">
            
            {/* Breadcrumb Navigation - Only show when NOT on list view */}
            {currentView !== "list" && (
              <div className="flex items-center gap-2 mb-3 text-xs">
                <button
                  onClick={() => handleBreadcrumbClick("list")}
                  className="transition-colors hover:text-[#6237A0]"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Accounts
                </button>
                
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
            )}

            {/* Main Content */}
            <div className="flex-1 overflow-hidden flex flex-col">
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
                <AgentDetailView
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
                  shakeBar={shakeBar}
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
        </ScreenContainer>
      </Layout>
    );
  }

// ListView Component - Main accounts list
function ListView({ searchQuery, setSearchQuery, filteredAgents, loading, onAgentClick, onAddAgent, onToggleActive, canCreateAccount, isDark }) {
  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-3 mb-3 sm:mb-4 flex-shrink-0">
        <div className="relative">
          <h1 className="text-lg sm:text-xl font-bold relative inline-block" style={{ color: 'var(--text-primary)' }}>
            Accounts
            <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-[#6237A0] via-[#8B5CF6] to-transparent rounded-full"></div>
          </h1>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
          {/* Search Bar */}
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search agents..."
            isDark={isDark}
            className="flex-1 sm:flex-initial sm:w-56 md:w-64"
          />

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

      {/* Agents Table/Cards */}
      <div className="flex-1 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-8 w-8 border-3 border-t-[#6237A0]" style={{ borderColor: 'var(--border-color)', borderTopColor: '#6237A0' }}></div>
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Loading agents...</span>
            </div>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <ScrollContainer className="hidden md:block h-full">
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
                            <Avatar
                              src={agent.profile_picture}
                              name={agent.email}
                              alt={agent.email}
                              size="sm"
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
            </ScrollContainer>

            {/* Mobile Card View */}
            <ScrollContainer className="md:hidden h-full space-y-2">
              {filteredAgents.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {searchQuery ? "No agents found matching your search" : "No agents available"}
                  </p>
                </div>
              ) : (
                filteredAgents.map((agent, idx) => (
                  <div
                    key={idx}
                    onClick={() => onAgentClick(agent, idx)}
                    className="p-3 rounded-lg border transition-colors"
                    style={{ 
                      backgroundColor: 'var(--card-bg)',
                      borderColor: 'var(--border-color)'
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2 flex-1">
                        <Avatar
                          src={agent.profile_picture}
                          name={agent.email}
                          alt={agent.email}
                          size="md"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                            {agent.email?.split('@')[0]}
                          </p>
                          <p className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>
                            {agent.email}
                          </p>
                        </div>
                      </div>
                      <ChevronRight size={16} style={{ color: 'var(--text-secondary)' }} className="flex-shrink-0 mt-1" />
                    </div>
                    
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Status</span>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${agent.active ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                        <span className="text-xs" style={{ color: 'var(--text-primary)' }}>
                          {agent.active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    
                    {agent.departments && agent.departments.length > 0 && (
                      <div>
                        <span className="text-xs mb-1 block" style={{ color: 'var(--text-secondary)' }}>Departments</span>
                        <div className="flex flex-wrap gap-1">
                          {agent.departments.slice(0, 2).map((dept, i) => (
                            <span key={i} className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: isDark ? 'rgba(139, 92, 246, 0.1)' : '#f3e8ff', color: 'var(--text-secondary)' }}>
                              {dept}
                            </span>
                          ))}
                          {agent.departments.length > 2 && (
                            <span className="text-xs px-2 py-0.5" style={{ color: 'var(--text-secondary)' }}>
                              +{agent.departments.length - 2} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </ScrollContainer>
          </>
        )}
      </div>
    </div>
  );
}