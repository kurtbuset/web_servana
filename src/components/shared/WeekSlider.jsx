import { useCallback, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'react-feather';

/**
 * WeekSlider Component
 * Allows navigation through different weeks when period is set to 'weekly'
 */
const WeekSlider = ({ selectedWeek, onWeekChange, className = '' }) => {
  // Format week for display
  const formatDisplayWeek = useCallback((weekString) => {
    const weekStart = new Date(weekString);
    const today = new Date();
    
    // Get current week start (Monday)
    const currentWeekStart = new Date(today);
    const day = currentWeekStart.getDay();
    const diff = currentWeekStart.getDate() - day + (day === 0 ? -6 : 1);
    currentWeekStart.setDate(diff);
    currentWeekStart.setHours(0, 0, 0, 0);
    
    // Get last week start
    const lastWeekStart = new Date(currentWeekStart);
    lastWeekStart.setDate(currentWeekStart.getDate() - 7);
    
    // Get next week start
    const nextWeekStart = new Date(currentWeekStart);
    nextWeekStart.setDate(currentWeekStart.getDate() + 7);
    
    // Compare weeks
    const selectedWeekStart = new Date(weekStart);
    selectedWeekStart.setHours(0, 0, 0, 0);
    
    if (selectedWeekStart.getTime() === currentWeekStart.getTime()) {
      return 'This Week';
    } else if (selectedWeekStart.getTime() === lastWeekStart.getTime()) {
      return 'Last Week';
    } else if (selectedWeekStart.getTime() === nextWeekStart.getTime()) {
      return 'Next Week';
    }
    
    // Format as date range
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    
    return `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  }, []);

  // Navigate to previous week
  const goToPreviousWeek = useCallback(() => {
    const prevWeek = new Date(selectedWeek);
    prevWeek.setDate(prevWeek.getDate() - 7);
    onWeekChange(prevWeek.toISOString().split('T')[0]);
  }, [selectedWeek, onWeekChange]);

  // Navigate to next week
  const goToNextWeek = useCallback(() => {
    const nextWeek = new Date(selectedWeek);
    nextWeek.setDate(nextWeek.getDate() + 7);
    onWeekChange(nextWeek.toISOString().split('T')[0]);
  }, [selectedWeek, onWeekChange]);

  // Handle week picker change
  const handleWeekPickerChange = useCallback((event) => {
    onWeekChange(event.target.value);
  }, [onWeekChange]);

  // Check if we can go to next week (not future)
  const canGoNext = useMemo(() => {
    const today = new Date();
    const currentWeekStart = new Date(today);
    const day = currentWeekStart.getDay();
    const diff = currentWeekStart.getDate() - day + (day === 0 ? -6 : 1);
    currentWeekStart.setDate(diff);
    currentWeekStart.setHours(0, 0, 0, 0);
    
    const selectedWeekStart = new Date(selectedWeek);
    selectedWeekStart.setHours(0, 0, 0, 0);
    
    return selectedWeekStart < currentWeekStart;
  }, [selectedWeek]);

  // Get current week for "This Week" button
  const getCurrentWeek = useCallback(() => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    const weekStart = new Date(today.setDate(diff));
    return weekStart.toISOString().split('T')[0];
  }, []);

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
        <input
          type="week"
          value={selectedWeek}
          onChange={handleWeekPickerChange}
          max={getCurrentWeek()} // Prevent future weeks
          className="absolute inset-0 opacity-0 cursor-pointer"
          title="Click to select week"
        />
        <button
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 w-[140px] justify-center"
          style={{ color: 'var(--text-primary)' }}
          title="Click to select week"
        >
          <Calendar size={14} />
          <span className="text-sm font-medium">
            {formatDisplayWeek(selectedWeek)}
          </span>
        </button>
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