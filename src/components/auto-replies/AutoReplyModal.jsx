import { useState, useEffect } from 'react';
import { X, MessageCircle, Home, Settings, Eye } from 'react-feather';

const AutoReplyModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  reply = null, 
  departments = [],
  canEdit = true,
  isMobile = false,
  isTablet = false
}) => {
  const [message, setMessage] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [isLoading, setIsLoading] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [detectedArguments, setDetectedArguments] = useState([]);
  const [showArgumentsHelper, setShowArgumentsHelper] = useState(false);

  const maxChars = 500;
  const isEditing = !!reply;

  useEffect(() => {
    if (isOpen) {
      if (reply) {
        setMessage(reply.auto_reply_message);
        const dept = departments.find(d => d.dept_id === reply.dept_id);
        setSelectedDepartment(dept ? dept.dept_name : 'All');
      } else {
        setMessage('');
        setSelectedDepartment('All');
      }
      setCharCount(reply?.auto_reply_message?.length || 0);
    }
  }, [isOpen, reply, departments]);

  const handleMessageChange = (e) => {
    const newMessage = e.target.value;
    if (newMessage.length <= maxChars) {
      setMessage(newMessage);
      setCharCount(newMessage.length);
      
      // Detect arguments in the message
      const argumentRegex = /\{\{(\w+):([^}]+)\}\}/g;
      const foundArguments = [];
      let match;
      
      while ((match = argumentRegex.exec(newMessage)) !== null) {
        const [fullMatch, argumentName, optionsString] = match;
        const options = optionsString.split(',').map(opt => opt.trim());
        foundArguments.push({
          name: argumentName,
          options: options,
          placeholder: fullMatch
        });
      }
      
      setDetectedArguments(foundArguments);
    }
  };

  const handleSave = async () => {
    if (!message.trim() || !canEdit) return;
    
    setIsLoading(true);
    try {
      await onSave(message.trim(), selectedDepartment);
    } finally {
      setIsLoading(false);
    }
  };

  const insertArgument = (argumentName, options) => {
    const argumentText = `{{${argumentName}:${options.join(',')}}}`;
    const textarea = document.querySelector('textarea[placeholder*="Enter your auto reply"]');
    
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newMessage = message.substring(0, start) + argumentText + message.substring(end);
      
      if (newMessage.length <= maxChars) {
        setMessage(newMessage);
        setCharCount(newMessage.length);
        
        // Update cursor position
        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(start + argumentText.length, start + argumentText.length);
        }, 0);
        
        // Re-detect arguments
        handleMessageChange({ target: { value: newMessage } });
      }
    }
  };

  const getPreviewMessage = () => {
    if (detectedArguments.length === 0) return message;
    
    let preview = message;
    detectedArguments.forEach(arg => {
      const firstOption = arg.options[0] || '';
      preview = preview.replace(arg.placeholder, `[${firstOption}]`);
    });
    
    return preview;
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSave();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex justify-center items-center z-50 p-3 sm:p-4">
      <div className={`bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-2xl w-full overflow-hidden animate-fade-in transition-colors duration-200 ${
        isMobile 
          ? 'max-w-full max-h-[95vh]' 
          : isTablet 
            ? 'max-w-2xl max-h-[90vh]' 
            : 'max-w-lg max-h-[90vh]'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <div className="p-1.5 sm:p-2 bg-[#E6DCF7] dark:bg-purple-900/30 rounded-lg flex-shrink-0">
              <MessageCircle size={isMobile ? 16 : 20} className="text-[#6237A0] dark:text-purple-400" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
                {isEditing ? 'Edit Auto Reply' : 'Add New Auto Reply'}
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                {isEditing ? 'Update your auto reply message' : 'Create an automatic response template'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0 touch-target"
          >
            <X size={isMobile ? 18 : 20} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto custom-scrollbar" style={{ maxHeight: isMobile ? 'calc(95vh - 140px)' : 'calc(90vh - 140px)' }}>
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            {/* Message Input */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <label className="flex items-center gap-1.5 sm:gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <MessageCircle size={isMobile ? 14 : 16} />
                  Auto Reply Message
                </label>
                <button
                  type="button"
                  onClick={() => setShowArgumentsHelper(!showArgumentsHelper)}
                  className="flex items-center gap-1 text-xs text-[#6237A0] dark:text-purple-400 hover:text-[#4c2b7d] dark:hover:text-purple-300 transition-colors self-start sm:self-auto touch-target"
                >
                  <Settings size={12} />
                  {showArgumentsHelper ? 'Hide' : 'Show'} Arguments Helper
                </button>
              </div>
              
              {/* Arguments Helper */}
              {showArgumentsHelper && (
                <div className="mb-3 p-3 bg-[#E6DCF7] dark:bg-purple-900/30 border border-[#6237A0]/20 dark:border-purple-700/30 rounded-lg">
                  <h4 className="text-sm font-medium text-[#6237A0] dark:text-purple-400 mb-2">Quick Arguments</h4>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <button
                      type="button"
                      onClick={() => insertArgument('greeting', ['Hello', 'Hi', 'Good morning', 'Good afternoon'])}
                      className="px-2 py-1 text-xs bg-white dark:bg-gray-700 border border-[#6237A0] dark:border-purple-500 text-[#6237A0] dark:text-purple-400 rounded hover:bg-[#6237A0] dark:hover:bg-purple-600 hover:text-white transition-colors touch-target"
                    >
                      + Greeting
                    </button>
                    <button
                      type="button"
                      onClick={() => insertArgument('timeframe', ['immediately', 'within 5 minutes', 'within 10 minutes', 'shortly'])}
                      className="px-2 py-1 text-xs bg-white dark:bg-gray-700 border border-[#6237A0] dark:border-purple-500 text-[#6237A0] dark:text-purple-400 rounded hover:bg-[#6237A0] dark:hover:bg-purple-600 hover:text-white transition-colors touch-target"
                    >
                      + Timeframe
                    </button>
                    <button
                      type="button"
                      onClick={() => insertArgument('priority', ['high', 'medium', 'low'])}
                      className="px-2 py-1 text-xs bg-white dark:bg-gray-700 border border-[#6237A0] dark:border-purple-500 text-[#6237A0] dark:text-purple-400 rounded hover:bg-[#6237A0] dark:hover:bg-purple-600 hover:text-white transition-colors touch-target"
                    >
                      + Priority
                    </button>
                  </div>
                  <p className="text-xs text-[#5C2E90] dark:text-purple-300">
                    <strong>Syntax:</strong> {`{{argumentName:option1,option2,option3}}`}
                  </p>
                </div>
              )}
              
              <div className="relative">
                <textarea
                  value={message}
                  onChange={handleMessageChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter your auto reply message here..."
                  className={`w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-sm resize-none transition-colors touch-target bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
                    canEdit 
                      ? 'focus:ring-2 focus:ring-[#6237A0] dark:focus:ring-purple-500 focus:border-[#6237A0] dark:focus:border-purple-500' 
                      : 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed'
                  }`}
                  rows={isMobile ? 4 : 6}
                  autoFocus={!isMobile}
                  disabled={!canEdit}
                />
                <div className="absolute bottom-2 right-2 text-xs text-gray-400 dark:text-gray-500">
                  {charCount}/{maxChars}
                </div>
              </div>
              
              {/* Arguments Detection */}
              {detectedArguments.length > 0 && (
                <div className="mt-2 p-2 sm:p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Settings size={isMobile ? 12 : 14} className="text-green-600 dark:text-green-400" />
                    <span className="text-xs sm:text-sm font-medium text-green-800 dark:text-green-200">
                      Detected Arguments ({detectedArguments.length})
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {detectedArguments.map((arg, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs bg-green-100 dark:bg-green-800/30 text-green-800 dark:text-green-200 rounded border"
                      >
                        {arg.name}: {arg.options.length} option{arg.options.length !== 1 ? 's' : ''}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {charCount > maxChars * 0.9 && (
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                  Approaching character limit
                </p>
              )}
            </div>

            {/* Message Preview */}
            {detectedArguments.length > 0 && (
              <div>
                <label className="flex items-center gap-1.5 sm:gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Eye size={isMobile ? 14 : 16} />
                  Preview (with first options)
                </label>
                <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-gray-50 dark:bg-gray-700 min-h-[60px] sm:min-h-[80px]">
                  <p className="text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                    {getPreviewMessage()}
                  </p>
                </div>
              </div>
            )}

            {/* Department Selection (only for new replies) */}
            {!isEditing && (
              <div>
                <label className="flex items-center gap-1.5 sm:gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Home size={isMobile ? 14 : 16} />
                  Department
                </label>
                <select
                  className={`w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 sm:p-3 text-sm transition-colors touch-target bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
                    canEdit 
                      ? 'focus:ring-2 focus:ring-[#6237A0] dark:focus:ring-purple-500 focus:border-[#6237A0] dark:focus:border-purple-500' 
                      : 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed'
                  }`}
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  disabled={!canEdit}
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
            <div className="bg-[#E6DCF7] dark:bg-purple-900/30 border border-[#6237A0]/20 dark:border-purple-700/30 rounded-lg p-3 sm:p-4">
              <h4 className="text-sm font-medium text-[#6237A0] dark:text-purple-400 mb-2">💡 Tips</h4>
              <ul className="text-xs text-[#5C2E90] dark:text-purple-300 space-y-1">
                <li>• Auto replies are sent immediately when a chat starts</li>
                <li>• Keep messages welcoming and informative</li>
                {!isMobile && <li>• Use placeholders like [Customer Name] for personalization</li>}
                <li>• Add dynamic arguments with: {`{{name:option1,option2,option3}}`}</li>
                {!isMobile && <li>• Arguments will show dropdown selectors when sending</li>}
                <li>• Press {isMobile ? 'Save' : 'Ctrl+Enter (Cmd+Enter on Mac)'} to save{!isMobile && ' quickly'}</li>
              </ul>
            </div>

            {!canEdit && (
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 sm:p-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs">!</span>
                  </div>
                  <p className="text-amber-800 dark:text-amber-200 font-medium text-sm">Permission Required</p>
                </div>
                <p className="text-amber-700 dark:text-amber-300 text-xs mt-1">
                  You don't have permission to edit auto-replies. Contact your administrator for access.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2.5 sm:py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 focus:ring-2 focus:ring-[#6237A0] dark:focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors disabled:opacity-50 touch-target"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!message.trim() || isLoading || !canEdit}
            className="px-4 py-2.5 sm:py-2 text-sm font-medium text-white bg-[#6237A0] dark:bg-purple-600 rounded-lg hover:bg-[#4c2b7d] dark:hover:bg-purple-700 focus:ring-2 focus:ring-[#6237A0] dark:focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 touch-target"
          >
            {isLoading && (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            {isEditing ? 'Update Reply' : 'Create Reply'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AutoReplyModal;