import { useState, useCallback, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'react-feather';

/**
 * MonthSlider Component
 * Allows navigation through different months when period is set to 'monthly'
 */
const MonthSlider = ({ selectedMonth, onMonthChange, className = '' }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Get month start date from selectedMonth (YYYY-MM format)
  const getMonthStart = useCallback((monthString) => {
    const [year, month] = monthString.split('-');
    return new Date(parseInt(year), parseInt(month) - 1, 1);
  }, []);

  // Format month for display
  const formatDisplayMonth = useCallback((monthString) => {
    const monthDate = getMonthStart(monthString);
    const today = new Date();
    const currentMonth = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}`;
    
    // Check if it's current month
    if (monthString === currentMonth) {
      return 'This Month';
    }
    
    // Check if it's last month
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastMonthString = `${lastMonth.getFullYear()}-${(lastMonth.getMonth() + 1).toString().padStart(2, '0')}`;
    if (monthString === lastMonthString) {
      return 'Last Month';
    }
    
    // Check if it's next month
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    const nextMonthString = `${nextMonth.getFullYear()}-${(nextMonth.getMonth() + 1).toString().padStart(2, '0')}`;
    if (monthString === nextMonthString) {
      return 'Next Month';
    }
    
    // Format as "Mar 2024"
    return monthDate.toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric'
    });
  }, [getMonthStart]);

  // Navigate to previous month
  const goToPreviousMonth = useCallback(() => {
    const currentMonthDate = getMonthStart(selectedMonth);
    const prevMonth = new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() - 1, 1);
    const prevMonthString = `${prevMonth.getFullYear()}-${(prevMonth.getMonth() + 1).toString().padStart(2, '0')}`;
    onMonthChange(prevMonthString);
  }, [selectedMonth, onMonthChange, getMonthStart]);

  // Navigate to next month
  const goToNextMonth = useCallback(() => {
    const currentMonthDate = getMonthStart(selectedMonth);
    const nextMonth = new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 1);
    const nextMonthString = `${nextMonth.getFullYear()}-${(nextMonth.getMonth() + 1).toString().padStart(2, '0')}`;
    onMonthChange(nextMonthString);
  }, [selectedMonth, onMonthChange, getMonthStart]);

  // Handle month picker change
  const handleMonthPickerChange = useCallback((event) => {
    onMonthChange(event.target.value);
    setShowDatePicker(false);
  }, [onMonthChange]);

  // Check if we can go to next month (not future)
  const canGoNext = useMemo(() => {
    const today = new Date();
    const currentMonth = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}`;
    return selectedMonth < currentMonth;
  }, [selectedMonth]);

  // Get max month (current month)
  const maxMonth = useMemo(() => {
    const today = new Date();
    return `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}`;
  }, []);

  // Get current month for "This Month" button
  const getCurrentMonth = useCallback(() => {
    const today = new Date();
    return `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}`;
  }, []);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Previous Month Button */}
      <button
        onClick={goToPreviousMonth}
        className="p-1.5 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
        style={{ color: 'var(--text-secondary)' }}
        title="Previous month"
      >
        <ChevronLeft size={16} />
      </button>

      {/* Month Display / Picker */}
      <div className="relative">
        <button
          onClick={() => setShowDatePicker(!showDatePicker)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 w-[140px] justify-center"
          style={{ color: 'var(--text-primary)' }}
          title="Click to select month"
        >
          <Calendar size={14} />
          <span className="text-sm font-medium">
            {formatDisplayMonth(selectedMonth)}
          </span>
        </button>

        {/* Month Picker Dropdown */}
        {showDatePicker && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setShowDatePicker(false)}
            />
            
            {/* Month Picker */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-20">
              <div 
                className="rounded-lg shadow-lg border p-2"
                style={{ 
                  backgroundColor: 'var(--card-bg)',
                  borderColor: 'var(--border-color)'
                }}
              >
                <div className="text-xs text-center mb-2 px-2" style={{ color: 'var(--text-secondary)' }}>
                  Select month
                </div>
                <input
                  type="month"
                  value={selectedMonth}
                  max={maxMonth}
                  onChange={handleMonthPickerChange}
                  className="w-full px-3 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-violet-500/30"
                  style={{
                    backgroundColor: 'var(--input-bg)',
                    color: 'var(--text-primary)',
                    borderColor: 'var(--border-color)'
                  }}
                />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Next Month Button */}
      <button
        onClick={goToNextMonth}
        disabled={!canGoNext}
        className={`p-1.5 rounded-lg transition-colors ${
          canGoNext 
            ? 'hover:bg-gray-100 dark:hover:bg-gray-800' 
            : 'opacity-50 cursor-not-allowed'
        }`}
        style={{ color: 'var(--text-secondary)' }}
        title={canGoNext ? "Next month" : "Cannot go to future months"}
      >
        <ChevronRight size={16} />
      </button>

      {/* Quick Navigation */}
      <div className="flex items-center gap-1 ml-2">
        <button
          onClick={() => onMonthChange(getCurrentMonth())}
          className="px-2 py-1 text-xs rounded transition-colors hover:bg-violet-100 dark:hover:bg-violet-900/20 text-violet-600 dark:text-violet-400"
          title="Go to this month"
        >
          This Month
        </button>
      </div>
    </div>
  );
};

export default MonthSlider;