import { useState, useCallback, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'react-feather';

/**
 * YearSlider Component
 * Allows navigation through different years when period is set to 'yearly'
 */
const YearSlider = ({ selectedYear, onYearChange, className = '' }) => {
  const [showYearPicker, setShowYearPicker] = useState(false);

  // Format year for display
  const formatDisplayYear = useCallback((yearString) => {
    const year = parseInt(yearString);
    const currentYear = new Date().getFullYear();
    
    if (year === currentYear) {
      return 'This Year';
    } else if (year === currentYear - 1) {
      return 'Last Year';
    } else if (year === currentYear + 1) {
      return 'Next Year';
    }
    
    return yearString;
  }, []);

  // Navigate to previous year
  const goToPreviousYear = useCallback(() => {
    const prevYear = (parseInt(selectedYear) - 1).toString();
    onYearChange(prevYear);
  }, [selectedYear, onYearChange]);

  // Navigate to next year
  const goToNextYear = useCallback(() => {
    const nextYear = (parseInt(selectedYear) + 1).toString();
    onYearChange(nextYear);
  }, [selectedYear, onYearChange]);

  // Handle year picker change
  const handleYearPickerChange = useCallback((event) => {
    onYearChange(event.target.value);
    setShowYearPicker(false);
  }, [onYearChange]);

  // Check if we can go to next year (not future)
  const canGoNext = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return parseInt(selectedYear) < currentYear;
  }, [selectedYear]);

  // Get max year (current year)
  const maxYear = useMemo(() => {
    return new Date().getFullYear().toString();
  }, []);

  // Get current year for "This Year" button
  const getCurrentYear = useCallback(() => {
    return new Date().getFullYear().toString();
  }, []);

  // Generate year options for dropdown (current year ± 10 years)
  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear - 10; year <= currentYear; year++) {
      years.push(year);
    }
    return years;
  }, []);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Previous Year Button */}
      <button
        onClick={goToPreviousYear}
        className="p-1.5 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
        style={{ color: 'var(--text-secondary)' }}
        title="Previous year"
      >
        <ChevronLeft size={16} />
      </button>

      {/* Year Display / Picker */}
      <div className="relative">
        <button
          onClick={() => setShowYearPicker(!showYearPicker)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 w-[140px] justify-center"
          style={{ color: 'var(--text-primary)' }}
          title="Click to select year"
        >
          <Calendar size={14} />
          <span className="text-sm font-medium">
            {formatDisplayYear(selectedYear)}
          </span>
        </button>

        {/* Year Picker Dropdown */}
        {showYearPicker && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setShowYearPicker(false)}
            />
            
            {/* Year Picker */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-20">
              <div 
                className="rounded-lg shadow-lg border p-2 max-h-48 overflow-y-auto"
                style={{ 
                  backgroundColor: 'var(--card-bg)',
                  borderColor: 'var(--border-color)'
                }}
              >
                <div className="text-xs text-center mb-2 px-2" style={{ color: 'var(--text-secondary)' }}>
                  Select year
                </div>
                <div className="space-y-1">
                  {yearOptions.map(year => (
                    <button
                      key={year}
                      onClick={() => handleYearPickerChange({ target: { value: year.toString() } })}
                      className={`w-full px-3 py-2 text-sm rounded transition-colors text-left ${
                        year.toString() === selectedYear
                          ? 'bg-violet-100 text-violet-700 font-medium'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                      style={{
                        color: year.toString() === selectedYear ? undefined : 'var(--text-primary)'
                      }}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Next Year Button */}
      <button
        onClick={goToNextYear}
        disabled={!canGoNext}
        className={`p-1.5 rounded-lg transition-colors ${
          canGoNext 
            ? 'hover:bg-gray-100 dark:hover:bg-gray-800' 
            : 'opacity-50 cursor-not-allowed'
        }`}
        style={{ color: 'var(--text-secondary)' }}
        title={canGoNext ? "Next year" : "Cannot go to future years"}
      >
        <ChevronRight size={16} />
      </button>

      {/* Quick Navigation */}
      <div className="flex items-center gap-1 ml-2">
        <button
          onClick={() => onYearChange(getCurrentYear())}
          className="px-2 py-1 text-xs rounded transition-colors hover:bg-violet-100 dark:hover:bg-violet-900/20 text-violet-600 dark:text-violet-400"
          title="Go to this year"
        >
          This Year
        </button>
      </div>
    </div>
  );
};

export default YearSlider;