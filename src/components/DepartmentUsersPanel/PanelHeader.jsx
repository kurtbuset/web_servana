import React from "react";

/**
 * PanelHeader - Header section with department info and navigation
 */
export function PanelHeader({ 
  isDark, 
  loading, 
  currentDepartment, 
  departmentsData, 
  currentDeptIndex, 
  onClose, 
  onPrevDepartment, 
  onNextDepartment, 
  onDepartmentSelect 
}) {
  return (
    <div className="p-4" style={{ 
      background: isDark 
        ? 'linear-gradient(135deg, #6237A0 0%, #7A4ED9 50%, #8B5CF6 100%)'
        : 'linear-gradient(135deg, #6237A0 0%, #7A4ED9 50%, #8B5CF6 100%)',
      color: '#ffffff'
    }}>
      {/* Close button for mobile/tablet */}
      <button
        onClick={onClose}
        className="lg:hidden absolute top-4 right-4 p-1 hover:bg-white/20 rounded-md transition-all"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="mb-3">
        <h2 className="text-sm font-bold flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Team
        </h2>
        <p className="text-purple-100 text-xs mt-1 truncate">
          {loading ? "Loading..." : currentDepartment?.dept_name || "No Department"}
        </p>
      </div>

      {/* Stats */}
      {!loading && currentDepartment && (
        <div className="flex gap-2">
          <div className="flex-1 bg-white/20 backdrop-blur-sm rounded-md p-2 border border-white/30">
            <p className="text-[10px] text-purple-100">Members</p>
            <p className="text-lg font-bold">{currentDepartment.totalMembers}</p>
          </div>
          <div className="flex-1 bg-white/20 backdrop-blur-sm rounded-md p-2 border border-white/30">
            <p className="text-[10px] text-purple-100">Online</p>
            <p className="text-lg font-bold">{currentDepartment.onlineMembers}</p>
          </div>
        </div>
      )}

      {/* Department Navigation Dots */}
      {departmentsData.length > 1 && (
        <div className="mt-3 flex justify-center items-center gap-2">
          <button
            onClick={onPrevDepartment}
            className="p-0.5 hover:bg-white/20 rounded-full transition-all"
            disabled={loading}
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex gap-1.5">
            {departmentsData.map((_, index) => (
              <button
                key={index}
                onClick={() => onDepartmentSelect(index)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  index === currentDeptIndex ? 'bg-white w-4' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
          <button
            onClick={onNextDepartment}
            className="p-0.5 hover:bg-white/20 rounded-full transition-all"
            disabled={loading}
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
