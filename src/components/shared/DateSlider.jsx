import { useCallback, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'react-feather';

/**
 * DateSlider Component
 * Allows navigation through different dates when period is set to 'daily'
 */
const DateSlider = ({ selectedDate, onDateChange, className = '' }) => {
  // Format date for display
  const formatDisplayDate = useCallback((dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    // Compare dates (ignore time)
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const yesterdayOnly = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());
    const tomorrowOnly = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate());
    
    if (dateOnly.getTime() === todayOnly.getTime()) {
      return 'Today';
    } else if (dateOnly.getTime() === yesterdayOnly.getTime()) {
      return 'Yesterday';
    } else if (dateOnly.getTime() === tomorrowOnly.getTime()) {
      return 'Tomorrow';
    }
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
    });
  }, []);

  // Navigate to previous date
  const goToPreviousDate = useCallback(() => {
    const prevDate = new Date(selectedDate);
    prevDate.setDate(prevDate.getDate() - 1);
    onDateChange(prevDate.toISOString().split('T')[0]);
  }, [selectedDate, onDateChange]);

  // Navigate to next date
  const goToNextDate = useCallback(() => {
    const nextDate = new Date(selectedDate);
    nextDate.setDate(nextDate.getDate() + 1);
    onDateChange(nextDate.toISOString().split('T')[0]);
  }, [selectedDate, onDateChange]);

  // Handle date picker change
  const handleDatePickerChange = useCallback((event) => {
    onDateChange(event.target.value);
  }, [onDateChange]);

  // Check if we can go to next date (not future)
  const canGoNext = useMemo(() => {
    const today = new Date();
    const selected = new Date(selectedDate);
    return selected < today;
  }, [selectedDate]);

  // Get today's date for "Today" button
  const getTodayDate = useCallback(() => {
    return new Date().toISOString().split('T')[0];
  }, []);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Previous Date Button */}
      <button
        onClick={goToPreviousDate}
        className="p-1.5 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
        style={{ color: 'var(--text-secondary)' }}
        title="Previous day"
      >
        <ChevronLeft size={16} />
      </button>

      {/* Date Display / Picker */}
      <div className="relative">
        <input
          type="date"
          value={selectedDate}
          onChange={handleDatePickerChange}
          max={new Date().toISOString().split('T')[0]} // Prevent future dates
          className="absolute inset-0 opacity-0 cursor-pointer"
          title="Click to select date"
        />
        <button
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 w-[140px] justify-center"
          style={{ color: 'var(--text-primary)' }}
          title="Click to select date"
        >
          <Calendar size={14} />
          <span className="text-sm font-medium">
            {formatDisplayDate(selectedDate)}
          </span>
        </button>
      </div>

      {/* Next Date Button */}
      <button
        onClick={goToNextDate}
        disabled={!canGoNext}
        className={`p-1.5 rounded-lg transition-colors ${
          canGoNext 
            ? 'hover:bg-gray-100 dark:hover:bg-gray-800' 
            : 'opacity-50 cursor-not-allowed'
        }`}
        style={{ color: 'var(--text-secondary)' }}
        title={canGoNext ? "Next day" : "Cannot go to future dates"}
      >
        <ChevronRight size={16} />
      </button>

      {/* Quick Navigation */}
      <div className="flex items-center gap-1 ml-2">
        <button
          onClick={() => onDateChange(getTodayDate())}
          className="px-2 py-1 text-xs rounded transition-colors hover:bg-violet-100 dark:hover:bg-violet-900/20 text-violet-600 dark:text-violet-400"
          title="Go to today"
        >
          Today
        </button>
      </div>
    </div>
  );
};

export default DateSlider;