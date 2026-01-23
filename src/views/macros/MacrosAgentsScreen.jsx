import { useState } from 'react';
import { Plus, MessageSquare, Users } from 'react-feather';
import TopNavbar from '../../../src/components/TopNavbar';
import Sidebar from '../../../src/components/Sidebar';
import MacroCard from '../../components/macros/MacroCard';
import MacroModal from '../../components/macros/MacroModal';
import MacroFilters from '../../components/macros/MacroFilters';
import ResponsiveContainer from '../../components/responsive/ResponsiveContainer';
import ResponsiveGrid from '../../components/responsive/ResponsiveGrid';
import useMacros from '../../hooks/useMacros';
import { useUser } from '../../context/UserContext';
import '../../App.css';

export default function MacrosAgentsScreen() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEditMacro, setCurrentEditMacro] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [viewMode, setViewMode] = useState('grid');

  const { getUserId } = useUser();
  const currentUserId = getUserId() || 1;

  // Use the macros hook with roleId = 3 (Agent)
  const {
    macros,
    departments,
    loading,
    error,
    createMacro,
    updateMacro,
    toggleActive,
    changeDepartment,
  } = useMacros(3);

  // Filter macros based on search and department
  const filteredMacros = macros.filter((macro) => {
    const matchesSearch = macro.text
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesDepartment =
      selectedDepartment === 'All' ||
      macro.dept_id ===
        departments.find((d) => d.dept_name === selectedDepartment)?.dept_id;
    return matchesSearch && matchesDepartment;
  });

  const handleSaveMacro = async (text, departmentName) => {
    if (currentEditMacro) {
      // Update existing macro
      const success = await updateMacro(
        currentEditMacro.id,
        text,
        currentEditMacro.active,
        currentEditMacro.dept_id,
        currentUserId
      );

      if (success) {
        setIsModalOpen(false);
        setCurrentEditMacro(null);
      }
    } else {
      // Create new macro
      const selectedDept = departments.find(
        (dept) => dept.dept_name === departmentName
      );
      const dept_id = departmentName === 'All' ? null : selectedDept?.dept_id;

      const success = await createMacro(text, dept_id, currentUserId);

      if (success) {
        setIsModalOpen(false);
      }
    }
  };

  const handleEditMacro = (macro) => {
    setCurrentEditMacro(macro);
    setIsModalOpen(true);
  };

  const handleAddMacro = () => {
    setCurrentEditMacro(null);
    setIsModalOpen(true);
  };

  const handleToggleActive = (id) => {
    toggleActive(id, currentUserId);
  };

  const handleChangeDepartment = (id, dept_id) => {
    changeDepartment(id, dept_id, currentUserId);
  };

  const toggleDropdown = (name) => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  const toggleSidebar = () => {
    setMobileSidebarOpen((prev) => !prev);
  };

  const getActiveCount = () => macros.filter(m => m.active).length;
  const getInactiveCount = () => macros.filter(m => !m.active).length;

  return (
    <ResponsiveContainer>
      {({ isMobile, isTablet, isDesktop }) => (
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

            <main className="flex-1 bg-gray-50 overflow-hidden flex flex-col">
              {/* Header */}
              <div className="bg-white border-b border-gray-200 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="p-2 sm:p-3 bg-[#E6DCF7] rounded-xl">
                      <Users size={isMobile ? 20 : 24} className="text-[#6237A0]" />
                    </div>
                    <div>
                      <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Agent Macros</h1>
                      <p className="text-sm sm:text-base text-gray-600">
                        {isMobile ? 'Quick response templates' : 'Manage quick response templates for agents'}
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleAddMacro}
                    className="flex items-center justify-center gap-2 bg-[#6237A0] text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[#4c2b7d] focus:ring-2 focus:ring-[#6237A0] focus:ring-offset-2 transition-all duration-200 shadow-sm w-full sm:w-auto"
                  >
                    <Plus size={18} />
                    {isMobile ? 'Add' : 'Add Macro'}
                  </button>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 sm:gap-6 mt-4 overflow-x-auto">
                  <div className="flex items-center gap-2 text-sm whitespace-nowrap">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-gray-600">Active: </span>
                    <span className="font-semibold text-gray-900">{getActiveCount()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm whitespace-nowrap">
                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                    <span className="text-gray-600">Inactive: </span>
                    <span className="font-semibold text-gray-900">{getInactiveCount()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm whitespace-nowrap">
                    <MessageSquare size={14} className="text-gray-500" />
                    <span className="text-gray-600">Total: </span>
                    <span className="font-semibold text-gray-900">{macros.length}</span>
                  </div>
                </div>
              </div>

              {/* Filters */}
              <MacroFilters
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedDepartment={selectedDepartment}
                onDepartmentChange={setSelectedDepartment}
                departments={departments}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                totalCount={macros.length}
                filteredCount={filteredMacros.length}
              />

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                {loading && (
                  <div className="flex items-center justify-center h-64">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 border-2 border-[#6237A0] border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-gray-600">Loading macros...</span>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">!</span>
                      </div>
                      <p className="text-red-800 font-medium">Error loading macros</p>
                    </div>
                    <p className="text-red-600 text-sm mt-1">{error}</p>
                  </div>
                )}

                {!loading && !error && filteredMacros.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-64 text-center px-4">
                    <div className="p-4 bg-gray-100 rounded-full mb-4">
                      <MessageSquare size={32} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {macros.length === 0 ? 'No macros yet' : 'No macros found'}
                    </h3>
                    <p className="text-gray-600 mb-4 max-w-sm text-sm sm:text-base">
                      {macros.length === 0 
                        ? 'Create your first macro to get started with quick responses.'
                        : 'Try adjusting your search or filter criteria.'
                      }
                    </p>
                    {macros.length === 0 && (
                      <button
                        onClick={handleAddMacro}
                        className="flex items-center gap-2 bg-[#6237A0] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#4c2b7d] transition-colors"
                      >
                        <Plus size={16} />
                        Create First Macro
                      </button>
                    )}
                  </div>
                )}

                {!loading && !error && filteredMacros.length > 0 && (
                  <>
                    {viewMode === 'grid' ? (
                      <ResponsiveGrid
                        cols={{ mobile: 1, tablet: 2, desktop: 3 }}
                        gap={4}
                        minItemWidth={280}
                      >
                        {filteredMacros.map((macro) => (
                          <MacroCard
                            key={macro.id}
                            macro={macro}
                            departments={departments}
                            onEdit={handleEditMacro}
                            onToggleActive={handleToggleActive}
                            onChangeDepartment={handleChangeDepartment}
                          />
                        ))}
                      </ResponsiveGrid>
                    ) : (
                      <div className="space-y-3">
                        {filteredMacros.map((macro) => (
                          <MacroCard
                            key={macro.id}
                            macro={macro}
                            departments={departments}
                            onEdit={handleEditMacro}
                            onToggleActive={handleToggleActive}
                            onChangeDepartment={handleChangeDepartment}
                          />
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Modal */}
              <MacroModal
                isOpen={isModalOpen}
                onClose={() => {
                  setIsModalOpen(false);
                  setCurrentEditMacro(null);
                }}
                onSave={handleSaveMacro}
                macro={currentEditMacro}
                departments={departments}
                title={currentEditMacro ? 'Edit Agent Macro' : 'Add Agent Macro'}
              />
            </main>
          </div>
        </div>
      )}
    </ResponsiveContainer>
  );
}
