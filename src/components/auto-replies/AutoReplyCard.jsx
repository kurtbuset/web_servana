import { useState } from 'react';
import { Edit3, Trash2, Copy, MessageCircle, Settings } from 'react-feather';

const AutoReplyCard = ({ 
  reply, 
  departments, 
  onEdit, 
  onToggleActive, 
  onChangeDepartment,
  onDelete,
  canEdit = true,
  isMobile = false,
  isTablet = false,
  viewMode = 'grid'
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showCopyFeedback, setShowCopyFeedback] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(reply.auto_reply_message);
      setShowCopyFeedback(true);
      setTimeout(() => setShowCopyFeedback(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const truncateText = (text, maxLength) => {
    // Adjust max length based on screen size and view mode
    let adjustedMaxLength = maxLength;
    if (isMobile) {
      adjustedMaxLength = 60; // Much shorter on mobile
    } else if (isTablet) {
      adjustedMaxLength = viewMode === 'list' ? 100 : 140;
    } else {
      adjustedMaxLength = viewMode === 'list' ? 150 : 100;
    }
    
    if (text.length <= adjustedMaxLength) return text;
    return text.substring(0, adjustedMaxLength) + '...';
  };

  const getDepartmentName = (deptId) => {
    if (!deptId) return 'All Departments';
    const dept = departments.find(d => d.dept_id === deptId);
    return dept ? dept.dept_name : 'Unknown';
  };

  const getDepartmentColor = (deptId) => {
    if (!deptId) return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
    const dept = departments.find(d => d.dept_id === deptId);
    if (!dept || !dept.dept_is_active) return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
    return 'bg-[#E6DCF7] dark:bg-purple-900/30 text-[#6237A0] dark:text-purple-400';
  };

  const detectArguments = (message) => {
    const argumentRegex = /\{\{(\w+):([^}]+)\}\}/g;
    const foundArguments = [];
    let match;
    
    while ((match = argumentRegex.exec(message)) !== null) {
      const [, argumentName, optionsString] = match;
      const options = optionsString.split(',').map(opt => opt.trim());
      foundArguments.push({
        name: argumentName,
        options: options
      });
    }
    
    return foundArguments;
  };

  const argumentsCount = detectArguments(reply.auto_reply_message).length;

  return (
    <div className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md dark:hover:shadow-gray-900/20 transition-all duration-200 group touch-target ${
      viewMode === 'list' && !isMobile
        ? 'p-3 sm:p-4' 
        : isMobile 
          ? 'p-2.5 shadow-sm' 
          : 'p-3 sm:p-4 md:p-4'
    }`}>
      {/* Header */}
      <div className={`flex items-start justify-between ${
        isMobile ? 'mb-2' : viewMode === 'list' && !isMobile ? 'mb-2' : 'mb-3'
      }`}>
        <div className="flex items-center gap-1 sm:gap-1.5 min-w-0 flex-1">
          <MessageCircle size={isMobile ? 12 : 16} className="text-[#6237A0] dark:text-purple-400 mt-0.5 flex-shrink-0" />
          <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full font-medium truncate ${
            isMobile ? 'text-xs' : 'text-xs'
          } ${getDepartmentColor(reply.dept_id)}`}>
            {getDepartmentName(reply.dept_id)}
          </span>
        </div>
        
        <div className={`flex items-center gap-0.5 transition-opacity flex-shrink-0 ${
          canEdit ? 'opacity-0 group-hover:opacity-100' : 'opacity-50'
        } ${isMobile ? 'opacity-100' : ''}`}>
          <button
            onClick={handleCopy}
            className={`text-gray-500 dark:text-gray-400 hover:text-[#6237A0] dark:hover:text-purple-400 hover:bg-[#E6DCF7] dark:hover:bg-purple-900/30 rounded-md transition-colors relative touch-target ${
              isMobile ? 'p-1' : 'p-1 sm:p-1.5'
            }`}
            title="Copy to clipboard"
          >
            <Copy size={isMobile ? 10 : 14} />
            {showCopyFeedback && (
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                Copied!
              </div>
            )}
          </button>
          {canEdit && (
            <>
              <button
                onClick={() => onEdit(reply)}
                className={`text-gray-500 dark:text-gray-400 hover:text-[#6237A0] dark:hover:text-purple-400 hover:bg-[#E6DCF7] dark:hover:bg-purple-900/30 rounded-md transition-colors touch-target ${
                  isMobile ? 'p-1' : 'p-1 sm:p-1.5'
                }`}
                title="Edit auto reply"
              >
                <Edit3 size={isMobile ? 10 : 14} />
              </button>
              {onDelete && (
                <button
                  onClick={() => onDelete(reply.auto_reply_id)}
                  className={`text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md transition-colors touch-target ${
                    isMobile ? 'p-1' : 'p-1 sm:p-1.5'
                  }`}
                  title="Delete auto reply"
                >
                  <Trash2 size={isMobile ? 10 : 14} />
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className={`${isMobile ? 'mb-2' : viewMode === 'list' && !isMobile ? 'mb-2' : 'mb-3'}`}>
        <p className={`text-gray-800 dark:text-gray-200 leading-relaxed ${
          isMobile ? 'text-xs' : isTablet ? 'text-sm' : 'text-sm'
        }`}>
          {isExpanded ? reply.auto_reply_message : truncateText(reply.auto_reply_message)}
        </p>
        {reply.auto_reply_message.length > (isMobile ? 60 : 100) && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[#6237A0] dark:text-purple-400 hover:text-[#4c2b7d] dark:hover:text-purple-300 text-xs mt-1 font-medium touch-target"
          >
            {isExpanded ? 'Less' : 'More'}
          </button>
        )}
      </div>

      {/* Footer */}
      <div className={`flex ${
        isMobile 
          ? 'flex-col gap-2' 
          : viewMode === 'list' && !isMobile 
            ? 'flex-row items-center justify-between' 
            : 'flex-row items-center justify-between'
      }`}>
        {/* Active Status Toggle */}
        <div className="flex items-center gap-1.5">
          <label className={`inline-flex relative items-center ${canEdit ? 'cursor-pointer' : 'cursor-not-allowed'}`}>
            <input
              type="checkbox"
              className="sr-only peer"
              checked={reply.auto_reply_is_active}
              onChange={() => onToggleActive(reply.auto_reply_id, reply.auto_reply_is_active)}
              disabled={!canEdit}
            />
            <div className={`${
              isMobile ? 'w-8 h-4' : 'w-9 h-5'
            } rounded-full peer relative after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full ${
              isMobile 
                ? 'after:h-3 after:w-3 after:transition-transform peer-checked:after:translate-x-4' 
                : 'after:h-4 after:w-4 after:transition-transform peer-checked:after:translate-x-4'
            } shadow-sm ${
              canEdit 
                ? 'bg-gray-200 dark:bg-gray-600 peer-checked:bg-[#6237A0] dark:peer-checked:bg-purple-600' 
                : 'bg-gray-100 dark:bg-gray-700 peer-checked:bg-gray-300 dark:peer-checked:bg-gray-600'
            }`} />
          </label>
          <span className={`font-medium ${
            isMobile ? 'text-xs' : 'text-xs'
          } ${reply.auto_reply_is_active ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
            {reply.auto_reply_is_active ? 'Active' : 'Inactive'}
          </span>
        </div>

        {/* Department Selector */}
        <select
          className={`border border-gray-200 dark:border-gray-600 rounded-md px-2 py-1 transition-colors touch-target bg-white dark:bg-gray-700 ${
            isMobile ? 'w-full text-xs' : 'max-w-[140px] text-xs'
          } ${
            canEdit 
              ? 'text-gray-700 dark:text-gray-300 hover:border-[#6237A0] dark:hover:border-purple-500 focus:border-[#6237A0] dark:focus:border-purple-500 focus:ring-1 focus:ring-[#6237A0] dark:focus:ring-purple-500 cursor-pointer' 
              : 'text-gray-400 dark:text-gray-500 cursor-not-allowed bg-gray-100 dark:bg-gray-800'
          }`}
          value={reply.dept_id ?? ''}
          onChange={(e) => onChangeDepartment(reply.auto_reply_id, e.target.value ? parseInt(e.target.value) : null)}
          disabled={!canEdit}
        >
          <option value="">All Departments</option>
          {departments.map((dept) => (
            <option
              key={dept.dept_id}
              value={dept.dept_id}
              disabled={!dept.dept_is_active && dept.dept_id !== reply.dept_id}
              className={!dept.dept_is_active ? 'text-red-400' : ''}
            >
              {dept.dept_name}
              {!dept.dept_is_active && ' (Inactive)'}
            </option>
          ))}
        </select>
      </div>

      {/* Arguments Count (if any) - Hidden on mobile to save space */}
      {argumentsCount > 0 && !isMobile && (
        <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-1.5">
            <Settings size={12} className="text-gray-400 dark:text-gray-500" />
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {argumentsCount} dynamic {argumentsCount === 1 ? 'argument' : 'arguments'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AutoReplyCard;