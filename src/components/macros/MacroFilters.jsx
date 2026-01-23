import { Search, X, Filter, Grid, List, ChevronDown } from 'react-feather';
import { useState } from 'react';

const MacroFilters = ({
  searchQuery,
  onSearchChange,
  selectedDepartment,
  onDepartmentChange,
  departments,
  viewMode,
  onViewModeChange,
  totalCount,
  filteredCount
}) => {
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  return (
    <div className="bg-white border-b border-gray-200">
      {/* Mobile Layout */}
      <div className="block sm:hidden">
        {/* Mobile Header */}
        <div className="p-4 space-y-3">
          {/* Search Bar */}
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search macros..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#6237A0] focus:border-[#6237A0] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Mobile Filter Toggle and View Mode */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Filter size={16} />
              Filters
              <ChevronDown 
                size={14} 
                className={`transition-transform ${showMobileFilters ? 'rotate-180' : ''}`} 
              />
            </button>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => onViewModeChange('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white text-[#6237A0] shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                title="Grid view"
              >
                <Grid size={16} />
              </button>
              <button
                onClick={() => onViewModeChange('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white text-[#6237A0] shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                title="List view"
              >
                <List size={16} />
              </button>
            </div>
          </div>

          {/* Mobile Filters Dropdown */}
          {showMobileFilters && (
            <div className="space-y-3 pt-3 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department
                </label>
                <select
                  value={selectedDepartment}
                  onChange={(e) => onDepartmentChange(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#6237A0] focus:border-[#6237A0] transition-colors"
                >
                  <option value="All">All Departments</option>
                  {departments.map((dept) => (
                    <option
                      key={dept.dept_id}
                      value={dept.dept_name}
                      disabled={!dept.dept_is_active}
                      className={!dept.dept_is_active ? 'text-red-400' : ''}
                    >
                      {dept.dept_name}
                      {!dept.dept_is_active && ' (Inactive)'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Results Count */}
              <div className="text-sm text-gray-500 text-center py-2">
                {searchQuery || selectedDepartment !== 'All' ? (
                  <span>
                    Showing {filteredCount} of {totalCount} macros
                  </span>
                ) : (
                  <span>{totalCount} macros total</span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Desktop/Tablet Layout */}
      <div className="hidden sm:block p-4 space-y-4">
        {/* Top Row - Search and Actions */}
        <div className="flex items-center justify-between gap-4">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search macros..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#6237A0] focus:border-[#6237A0] transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white text-[#6237A0] shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              title="Grid view"
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-white text-[#6237A0] shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              title="List view"
            >
              <List size={16} />
            </button>
          </div>
        </div>

        {/* Bottom Row - Filters and Stats */}
        <div className="flex items-center justify-between gap-4">
          {/* Department Filter */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Department:</span>
            </div>
            <select
              value={selectedDepartment}
              onChange={(e) => onDepartmentChange(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-[#6237A0] focus:border-[#6237A0] transition-colors"
            >
              <option value="All">All Departments</option>
              {departments.map((dept) => (
                <option
                  key={dept.dept_id}
                  value={dept.dept_name}
                  disabled={!dept.dept_is_active}
                  className={!dept.dept_is_active ? 'text-red-400' : ''}
                >
                  {dept.dept_name}
                  {!dept.dept_is_active && ' (Inactive)'}
                </option>
              ))}
            </select>
          </div>

          {/* Results Count */}
          <div className="text-sm text-gray-500">
            {searchQuery || selectedDepartment !== 'All' ? (
              <span>
                Showing {filteredCount} of {totalCount} macros
              </span>
            ) : (
              <span>{totalCount} macros total</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MacroFilters;