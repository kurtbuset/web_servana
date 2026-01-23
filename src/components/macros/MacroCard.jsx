import { useState } from 'react';
import { Edit3, Trash2, Copy, MessageSquare, MoreVertical } from 'react-feather';

const MacroCard = ({ 
  macro, 
  departments, 
  onEdit, 
  onToggleActive, 
  onChangeDepartment,
  onDelete 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showCopyFeedback, setShowCopyFeedback] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(macro.text);
      setShowCopyFeedback(true);
      setTimeout(() => setShowCopyFeedback(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const truncateText = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const getDepartmentName = (deptId) => {
    if (!deptId) return 'All Departments';
    const dept = departments.find(d => d.dept_id === deptId);
    return dept ? dept.dept_name : 'Unknown';
  };

  const getDepartmentColor = (deptId) => {
    if (!deptId) return 'bg-gray-100 text-gray-700';
    const dept = departments.find(d => d.dept_id === deptId);
    if (!dept || !dept.dept_is_active) return 'bg-red-100 text-red-700';
    return 'bg-[#E6DCF7] text-[#6237A0]';
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-all duration-200 group relative">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <MessageSquare size={16} className="text-[#6237A0] mt-0.5 flex-shrink-0" />
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium truncate ${getDepartmentColor(macro.dept_id)}`}>
            {getDepartmentName(macro.dept_id)}
          </span>
        </div>
        
        {/* Desktop Actions */}
        <div className="hidden sm:flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleCopy}
            className="p-1.5 text-gray-500 hover:text-[#6237A0] hover:bg-[#E6DCF7] rounded-md transition-colors relative"
            title="Copy to clipboard"
          >
            <Copy size={14} />
            {showCopyFeedback && (
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                Copied!
              </div>
            )}
          </button>
          <button
            onClick={() => onEdit(macro)}
            className="p-1.5 text-gray-500 hover:text-[#6237A0] hover:bg-[#E6DCF7] rounded-md transition-colors"
            title="Edit macro"
          >
            <Edit3 size={14} />
          </button>
          {onDelete && (
            <button
              onClick={() => onDelete(macro.id)}
              className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
              title="Delete macro"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="sm:hidden relative">
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
          >
            <MoreVertical size={16} />
          </button>
          
          {/* Mobile Menu Dropdown */}
          {showMobileMenu && (
            <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-[140px]">
              <button
                onClick={() => {
                  handleCopy();
                  setShowMobileMenu(false);
                }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-t-lg"
              >
                <Copy size={14} />
                Copy
              </button>
              <button
                onClick={() => {
                  onEdit(macro);
                  setShowMobileMenu(false);
                }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <Edit3 size={14} />
                Edit
              </button>
              {onDelete && (
                <button
                  onClick={() => {
                    onDelete(macro.id);
                    setShowMobileMenu(false);
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-b-lg"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="mb-3">
        <p className="text-gray-800 text-sm leading-relaxed break-words">
          {isExpanded ? macro.text : truncateText(macro.text)}
        </p>
        {macro.text.length > 100 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[#6237A0] hover:text-[#4c2b7d] text-xs mt-1 font-medium"
          >
            {isExpanded ? 'Show less' : 'Show more'}
          </button>
        )}
      </div>

      {/* Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Active Status Toggle */}
        <div className="flex items-center gap-2">
          <label className="inline-flex relative items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={macro.active}
              onChange={() => onToggleActive(macro.id)}
            />
            <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:bg-[#6237A0] transition-colors duration-300 relative after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-transform peer-checked:after:translate-x-4 shadow-sm" />
          </label>
          <span className={`text-xs font-medium ${macro.active ? 'text-green-600' : 'text-gray-500'}`}>
            {macro.active ? 'Active' : 'Inactive'}
          </span>
        </div>

        {/* Department Selector */}
        <select
          className="text-xs border border-gray-200 rounded-md px-2 py-1.5 text-gray-700 hover:border-[#6237A0] focus:border-[#6237A0] focus:ring-1 focus:ring-[#6237A0] transition-colors bg-white min-w-0 flex-1 sm:flex-none sm:max-w-[140px]"
          value={macro.dept_id ?? ''}
          onChange={(e) => onChangeDepartment(macro.id, e.target.value ? parseInt(e.target.value) : null)}
        >
          <option value="">All Departments</option>
          {departments.map((dept) => (
            <option
              key={dept.dept_id}
              value={dept.dept_id}
              disabled={!dept.dept_is_active && dept.dept_id !== macro.dept_id}
              className={!dept.dept_is_active ? 'text-red-400' : ''}
            >
              {dept.dept_name}
              {!dept.dept_is_active && ' (Inactive)'}
            </option>
          ))}
        </select>
      </div>

      {/* Click outside to close mobile menu */}
      {showMobileMenu && (
        <div 
          className="fixed inset-0 z-10" 
          onClick={() => setShowMobileMenu(false)}
        />
      )}
    </div>
  );
};

export default MacroCard;