import { useState, useEffect } from 'react';
import { X, MessageSquare, Home } from 'react-feather';

const MacroModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  macro = null, 
  departments = [],
  title = "Add Macro"
}) => {
  const [text, setText] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [isLoading, setIsLoading] = useState(false);
  const [charCount, setCharCount] = useState(0);

  const maxChars = 500;
  const isEditing = !!macro;

  useEffect(() => {
    if (isOpen) {
      if (macro) {
        setText(macro.text);
        const dept = departments.find(d => d.dept_id === macro.dept_id);
        setSelectedDepartment(dept ? dept.dept_name : 'All');
      } else {
        setText('');
        setSelectedDepartment('All');
      }
      setCharCount(macro?.text?.length || 0);
    }
  }, [isOpen, macro, departments]);

  const handleTextChange = (e) => {
    const newText = e.target.value;
    if (newText.length <= maxChars) {
      setText(newText);
      setCharCount(newText.length);
    }
  };

  const handleSave = async () => {
    if (!text.trim()) return;
    
    setIsLoading(true);
    try {
      await onSave(text.trim(), selectedDepartment);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSave();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="p-2 bg-[#E6DCF7] rounded-lg flex-shrink-0">
              <MessageSquare size={20} className="text-[#6237A0]" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-semibold text-gray-900 truncate">
                {title}
              </h2>
              <p className="text-sm text-gray-500 hidden sm:block">
                {isEditing ? 'Update your macro message' : 'Create a reusable message template'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Message Input */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <MessageSquare size={16} />
              Message
            </label>
            <div className="relative">
              <textarea
                value={text}
                onChange={handleTextChange}
                onKeyDown={handleKeyDown}
                placeholder="Enter your macro message here..."
                className="w-full border border-gray-300 rounded-lg p-3 text-sm resize-none focus:ring-2 focus:ring-[#6237A0] focus:border-[#6237A0] transition-colors"
                rows={window.innerWidth < 640 ? 4 : 6}
                autoFocus
              />
              <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                {charCount}/{maxChars}
              </div>
            </div>
            {charCount > maxChars * 0.9 && (
              <p className="text-xs text-amber-600 mt-1">
                Approaching character limit
              </p>
            )}
          </div>

          {/* Department Selection (only for new macros) */}
          {!isEditing && (
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Home size={16} />
                Department
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#6237A0] focus:border-[#6237A0] transition-colors"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
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
          )}

          {/* Tips */}
          <div className="bg-[#E6DCF7] border border-[#6237A0]/20 rounded-lg p-3 sm:p-4">
            <h4 className="text-sm font-medium text-[#6237A0] mb-2">💡 Tips</h4>
            <ul className="text-xs text-[#5C2E90] space-y-1">
              <li>• Keep messages clear and professional</li>
              <li>• Use placeholders like [Customer Name] for personalization</li>
              <li className="hidden sm:list-item">• Press Ctrl+Enter (Cmd+Enter on Mac) to save quickly</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3 p-4 sm:p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="w-full sm:w-auto px-4 py-2.5 sm:py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-[#6237A0] focus:ring-offset-2 transition-colors disabled:opacity-50 order-2 sm:order-1"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!text.trim() || isLoading}
            className="w-full sm:w-auto px-4 py-2.5 sm:py-2 text-sm font-medium text-white bg-[#6237A0] rounded-lg hover:bg-[#4c2b7d] focus:ring-2 focus:ring-[#6237A0] focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 order-1 sm:order-2"
          >
            {isLoading && (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            {isEditing ? 'Update Macro' : 'Create Macro'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MacroModal;