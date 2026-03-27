import { useState, useCallback, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'react-feather';

/**
 * DateSlider Component
 * Allows navigation through different dates when period is set to 'daily'
 */
const DateSlider = ({ selectedDate, onDateChange, className = '' }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Format date for display
  const formatDisplayDate = useCallback((date) => {
    const today = new Date();
    const selected = new Date(date);
    
    // Reset time to compare dates only
    today.setHours(0, 0, 0, 0);
    selected.setHours(0, 0, 0, 0);
    
    const diffTime = selected.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === -1) return 'Yesterday';
    if (diffDays === 1) return 'Tomorrow';
    
    // Format as "Mon, Jan 15"
    return selected.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  }, []);

  // Navigate to previous day
  const goToPreviousDay = useCallback(() => {
    const currentDate = new Date(selectedDate);
    currentDate.setDate(currentDate.getDate() - 1);
    onDateChange(currentDate.toISOString().split('T')[0]);
  }, [selectedDate, onDateChange]);

  // Navigate to next day
  const goToNextDay = useCallback(() => {
    const currentDate = new Date(selectedDate);
    currentDate.setDate(currentDate.getDate() + 1);
    onDateChange(currentDate.toISOString().split('T')[0]);
  }, [selectedDate, onDateChange]);

  // Handle date picker change
  const handleDatePickerChange = useCallback((event) => {
    onDateChange(event.target.value);
    setShowDatePicker(false);
  }, [onDateChange]);

  // Check if we can go to next day (not future)
  const canGoNext = useMemo(() => {
    const today = new Date();
    const selected = new Date(selectedDate);
    today.setHours(0, 0, 0, 0);
    selected.setHours(0, 0, 0, 0);
    return selected.getTime() < today.getTime();
  }, [selectedDate]);

  // Get max date (today)
  const maxDate = useMemo(() => {
    return new Date().toISOString().split('T')[0];
  }, []);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Previous Day Button */}
      <button
        onClick={goToPreviousDay}
        className="p-1.5 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
        style={{ color: 'var(--text-secondary)' }}
        title="Previous day"
      >
        <ChevronLeft size={16} />
      </button>

      {/* Date Display / Picker */}
      <div className="relative">
        <button
          onClick={() => setShowDatePicker(!showDatePicker)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 w-[140px] justify-center"
          style={{ color: 'var(--text-primary)' }}
          title="Click to select date"
        >
          <Calendar size={14} />
          <span className="text-sm font-medium">
            {formatDisplayDate(selectedDate)}
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
                <input
                  type="date"
                  value={selectedDate}
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

      {/* Next Day Button */}
      <button
        onClick={goToNextDay}
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
          onClick={() => onDateChange(new Date().toISOString().split('T')[0])}
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