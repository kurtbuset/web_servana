import { useState, useCallback, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'react-feather';

/**
 * WeekSlider Component
 * Allows navigation through different weeks when period is set to 'weekly'
 */
const WeekSlider = ({ selectedWeek, onWeekChange, className = '' }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Get week start date (Monday) from selectedWeek
  const getWeekStart = useCallback((weekString) => {
    const date = new Date(weekString);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    return new Date(date.setDate(diff));
  }, []);

  // Get week end date (Sunday) from selectedWeek
  const getWeekEnd = useCallback((weekString) => {
    const weekStart = getWeekStart(weekString);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    return weekEnd;
  }, [getWeekStart]);

  // Format week for display
  const formatDisplayWeek = useCallback((weekString) => {
    const weekStart = getWeekStart(weekString);
    const weekEnd = getWeekEnd(weekString);
    
    const today = new Date();
    const currentWeekStart = getWeekStart(today.toISOString().split('T')[0]);
    
    // Check if it's current week
    if (weekStart.getTime() === currentWeekStart.getTime()) {
      return 'This Week';
    }
    
    // Check if it's last week
    const lastWeekStart = new Date(currentWeekStart);
    lastWeekStart.setDate(currentWeekStart.getDate() - 7);
    if (weekStart.getTime() === lastWeekStart.getTime()) {
      return 'Last Week';
    }
    
    // Check if it's next week
    const nextWeekStart = new Date(currentWeekStart);
    nextWeekStart.setDate(currentWeekStart.getDate() + 7);
    if (weekStart.getTime() === nextWeekStart.getTime()) {
      return 'Next Week';
    }
    
    // Format as "Jan 15 - 21"
    const startMonth = weekStart.toLocaleDateString('en-US', { month: 'short' });
    const startDay = weekStart.getDate();
    const endDay = weekEnd.getDate();
    
    // If same month
    if (weekStart.getMonth() === weekEnd.getMonth()) {
      return `${startMonth} ${startDay} - ${endDay}`;
    } else {
      // Different months
      const endMonth = weekEnd.toLocaleDateString('en-US', { month: 'short' });
      return `${startMonth} ${startDay} - ${endMonth} ${endDay}`;
    }
  }, [getWeekStart, getWeekEnd]);

  // Navigate to previous week
  const goToPreviousWeek = useCallback(() => {
    const currentWeekStart = getWeekStart(selectedWeek);
    currentWeekStart.setDate(currentWeekStart.getDate() - 7);
    onWeekChange(currentWeekStart.toISOString().split('T')[0]);
  }, [selectedWeek, onWeekChange, getWeekStart]);

  // Navigate to next week
  const goToNextWeek = useCallback(() => {
    const currentWeekStart = getWeekStart(selectedWeek);
    currentWeekStart.setDate(currentWeekStart.getDate() + 7);
    onWeekChange(currentWeekStart.toISOString().split('T')[0]);
  }, [selectedWeek, onWeekChange, getWeekStart]);

  // Handle date picker change
  const handleDatePickerChange = useCallback((event) => {
    const selectedDate = event.target.value;
    const weekStart = getWeekStart(selectedDate);
    onWeekChange(weekStart.toISOString().split('T')[0]);
    setShowDatePicker(false);
  }, [onWeekChange, getWeekStart]);

  // Check if we can go to next week (not future)
  const canGoNext = useMemo(() => {
    const today = new Date();
    const currentWeekStart = getWeekStart(today.toISOString().split('T')[0]);
    const selectedWeekStart = getWeekStart(selectedWeek);
    return selectedWeekStart.getTime() < currentWeekStart.getTime();
  }, [selectedWeek, getWeekStart]);

  // Get max date (today)
  const maxDate = useMemo(() => {
    return new Date().toISOString().split('T')[0];
  }, []);

  // Get current week start for "This Week" button
  const getCurrentWeek = useCallback(() => {
    const today = new Date();
    const weekStart = getWeekStart(today.toISOString().split('T')[0]);
    return weekStart.toISOString().split('T')[0];
  }, [getWeekStart]);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Previous Week Button */}
      <button
        onClick={goToPreviousWeek}
        className="p-1.5 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
        style={{ color: 'var(--text-secondary)' }}
        title="Previous week"
      >
        <ChevronLeft size={16} />
      </button>

      {/* Week Display / Picker */}
      <div className="relative">
        <button
          onClick={() => setShowDatePicker(!showDatePicker)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 w-[140px] justify-center"
          style={{ color: 'var(--text-primary)' }}
          title="Click to select week"
        >
          <Calendar size={14} />
          <span className="text-sm font-medium">
            {formatDisplayWeek(selectedWeek)}
          </span>
        </button>

        {/* Date Picker Dropdown */}
        {showDatePicker && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setShowDatePicker(false)}
            />
            
            {/* Date Picker */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-20">
              <div 
                className="rounded-lg shadow-lg border p-2"
                style={{ 
                  backgroundColor: 'var(--card-bg)',
                  borderColor: 'var(--border-color)'
                }}
              >
                <div className="text-xs text-center mb-2 px-2" style={{ color: 'var(--text-secondary)' }}>
                  Select any date to jump to that week
                </div>
                <input
                  type="date"
                  value={selectedWeek}
                  max={maxDate}
                  onChange={handleDatePickerChange}
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

      {/* Next Week Button */}
      <button
        onClick={goToNextWeek}
        disabled={!canGoNext}
        className={`p-1.5 rounded-lg transition-colors ${
          canGoNext 
            ? 'hover:bg-gray-100 dark:hover:bg-gray-800' 
            : 'opacity-50 cursor-not-allowed'
        }`}
        style={{ color: 'var(--text-secondary)' }}
        title={canGoNext ? "Next week" : "Cannot go to future weeks"}
      >
        <ChevronRight size={16} />
      </button>

      {/* Quick Navigation */}
      <div className="flex items-center gap-1 ml-2">
        <button
          onClick={() => onWeekChange(getCurrentWeek())}
          className="px-2 py-1 text-xs rounded transition-colors hover:bg-violet-100 dark:hover:bg-violet-900/20 text-violet-600 dark:text-violet-400"
          title="Go to this week"
        >
          This Week
        </button>
      </div>
    </div>
  );
};

export default WeekSlider;