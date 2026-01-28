import { Filter, ChevronDown } from "react-feather";

/**
 * DepartmentFilter - Dropdown for filtering by department
 * Enhanced with responsive design and modern styling
 */
export default function DepartmentFilter({
  departments,
  selectedDepartment,
  onDepartmentChange,
  isOpen,
  onToggle,
}) {
  return (
    <div className="relative p-3 sm:p-4 border-b-0">
      <button
        className="w-full flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 bg-white hover:bg-purple-50 border border-gray-200 hover:border-[#6237A0] rounded-xl transition-all duration-200 shadow-sm hover:shadow-md group"
        onClick={onToggle}
      >
        <div className="flex items-center gap-2 sm:gap-3 flex-1">
          <div className="p-1.5 sm:p-2 bg-purple-100 rounded-lg group-hover:bg-[#6237A0] transition-colors">
            <Filter size={14} className="text-[#6237A0] group-hover:text-white transition-colors sm:w-4 sm:h-4" />
          </div>
          <div className="text-left flex-1">
            <p className="text-[10px] sm:text-xs text-gray-500 font-medium">Department</p>
            <p className="text-xs sm:text-sm font-semibold text-gray-800 truncate">
              {selectedDepartment}
            </p>
          </div>
        </div>
        <ChevronDown 
          size={16} 
          className={`text-gray-400 transition-transform duration-200 sm:w-5 sm:h-5 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={onToggle}
          />
          
          {/* Dropdown Menu */}
          <div className="absolute left-3 right-3 sm:left-4 sm:right-4 top-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden animate-slide-in max-h-64 overflow-y-auto custom-scrollbar">
            {departments.map((dept, index) => (
              <div
                key={dept}
                className={`px-3 sm:px-4 py-2.5 sm:py-3 cursor-pointer transition-all duration-150 flex items-center justify-between group ${
                  dept === selectedDepartment
                    ? "bg-gradient-to-r from-[#6237A0] to-[#7A4ED9] text-white font-semibold"
                    : "hover:bg-purple-50 text-gray-700"
                } ${index !== 0 ? 'border-t border-gray-100' : ''}`}
                onClick={() => {
                  onDepartmentChange(dept);
                  onToggle();
                }}
              >
                <span className="text-xs sm:text-sm">{dept}</span>
                {dept === selectedDepartment && (
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
