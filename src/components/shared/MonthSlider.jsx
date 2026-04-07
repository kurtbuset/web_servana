import { useCallback, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'react-feather';

/**
 * MonthSlider Component
 * Allows navigation through different months when period is set to 'monthly'
 */
const MonthSlider = ({ selectedMonth, onMonthChange, className = '' }) => {
  // Format month for display
  const formatDisplayMonth = useCallback((monthString) => {
    const [year, month] = monthString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    const today = new Date();
    
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;
    const selectedYear = parseInt(year);
    const selectedMonthNum = parseInt(month);
    
    if (selectedYear === currentYear && selectedMonthNum === currentMonth) {
      return 'This Month';
    } else if (selectedYear === currentYear && selectedMonthNum === currentMonth - 1) {
      return 'Last Month';
    } else if (selectedYear === currentYear && selectedMonthNum === currentMonth + 1) {
      return 'Next Month';
    }
    
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    });
  }, []);

  // Navigate to previous month
  const goToPreviousMonth = useCallback(() => {
    const [year, month] = selectedMonth.split('-');
    const prevMonth = new Date(parseInt(year), parseInt(month) - 2, 1); // -2 because month is 1-indexed
    const prevYear = prevMonth.getFullYear();
    const prevMonthNum = prevMonth.getMonth() + 1;
    onMonthChange(`${prevYear}-${prevMonthNum.toString().padStart(2, '0')}`);
  }, [selectedMonth, onMonthChange]);

  // Navigate to next month
  const goToNextMonth = useCallback(() => {
    const [year, month] = selectedMonth.split('-');
    const nextMonth = new Date(parseInt(year), parseInt(month), 1); // month is 1-indexed, so this gives us next month
    const nextYear = nextMonth.getFullYear();
    const nextMonthNum = nextMonth.getMonth() + 1;
    onMonthChange(`${nextYear}-${nextMonthNum.toString().padStart(2, '0')}`);
  }, [selectedMonth, onMonthChange]);

  // Handle month picker change
  const handleMonthPickerChange = useCallback((event) => {
    onMonthChange(event.target.value);
  }, [onMonthChange]);

  // Check if we can go to next month (not future)
  const canGoNext = useMemo(() => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;
    
    const [year, month] = selectedMonth.split('-');
    const selectedYear = parseInt(year);
    const selectedMonthNum = parseInt(month);
    
    return selectedYear < currentYear || 
           (selectedYear === currentYear && selectedMonthNum < currentMonth);
  }, [selectedMonth]);

  // Get current month for "This Month" button
  const getCurrentMonth = useCallback(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    return `${year}-${month.toString().padStart(2, '0')}`;
  }, []);

  // Get max month (current month)
  const maxMonth = useMemo(() => {
    return getCurrentMonth();
  }, [getCurrentMonth]);

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
        <input
          type="month"
          value={selectedMonth}
          onChange={handleMonthPickerChange}
          max={maxMonth} // Prevent future months
          className="absolute inset-0 opacity-0 cursor-pointer"
          title="Click to select month"
        />
        <button
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 w-[140px] justify-center"
          style={{ color: 'var(--text-primary)' }}
          title="Click to select month"
        >
          <Calendar size={14} />
          <span className="text-sm font-medium">
            {formatDisplayMonth(selectedMonth)}
          </span>
        </button>
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