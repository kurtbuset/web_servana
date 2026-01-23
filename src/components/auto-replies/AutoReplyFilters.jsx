import { Search, X, Filter, Grid, List } from 'react-feather';

const AutoReplyFilters = ({
  searchQuery,
  onSearchChange,
  selectedDepartment,
  onDepartmentChange,
  departments,
  viewMode,
  onViewModeChange,
  totalCount,
  filteredCount,
  isMobile = false,
  isTablet = false
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-3 sm:p-4 space-y-3 sm:space-y-4 transition-colors duration-200">
      {/* Top Row - Search and Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
        {/* Search */}
        <div className="flex-1 max-w-full sm:max-w-md">
          <div className="relative">
            <Search size={isMobile ? 16 : 18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder={isMobile ? "Search..." : "Search auto replies..."}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 sm:pl-10 pr-9 sm:pr-10 py-2 sm:py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#6237A0] dark:focus:ring-purple-500 focus:border-[#6237A0] dark:focus:border-purple-500 transition-colors touch-target"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 touch-target"
              >
                <X size={isMobile ? 14 : 16} />
              </button>
            )}
          </div>
        </div>

        {/* View Mode Toggle - Hidden on Mobile */}
        {!isMobile && (
          <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1 self-center">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-1.5 sm:p-2 rounded-md transition-colors touch-target ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-gray-600 text-[#6237A0] dark:text-purple-400 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
              title="Grid view"
            >
              <Grid size={isMobile ? 14 : 16} />
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              className={`p-1.5 sm:p-2 rounded-md transition-colors touch-target ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-gray-600 text-[#6237A0] dark:text-purple-400 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
              title="List view"
            >
              <List size={isMobile ? 14 : 16} />
            </button>
          </div>
        )}
      </div>

      {/* Bottom Row - Filters and Stats */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
        {/* Department Filter */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Filter size={isMobile ? 14 : 16} className="text-gray-500 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Department:</span>
          </div>
          <select
            value={selectedDepartment}
            onChange={(e) => onDepartmentChange(e.target.value)}
            className="w-full sm:w-auto border border-gray-300 dark:border-gray-600 rounded-lg px-2.5 sm:px-3 py-1.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#6237A0] dark:focus:ring-purple-500 focus:border-[#6237A0] dark:focus:border-purple-500 transition-colors touch-target"
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
        <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center sm:text-right">
          {searchQuery || selectedDepartment !== 'All' ? (
            <span>
              Showing {filteredCount} of {totalCount} {isMobile ? 'replies' : 'auto replies'}
            </span>
          ) : (
            <span>{totalCount} {isMobile ? 'replies' : 'auto replies'} total</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default AutoReplyFilters;