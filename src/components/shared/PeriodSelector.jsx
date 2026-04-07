import { useCallback, useMemo } from 'react';
import DateSlider from './DateSlider';
import WeekSlider from './WeekSlider';
import MonthSlider from './MonthSlider';
import YearSlider from './YearSlider';

/**
 * Shared PeriodSelector Component
 * Provides period selection with date/week/month/year navigation
 * Can be used across Dashboard, Analytics, and other screens
 */
const PeriodSelector = ({
  period,
  onPeriodChange,
  selectedDate,
  onDateChange,
  selectedWeek,
  onWeekChange,
  selectedMonth,
  onMonthChange,
  selectedYear,
  onYearChange,
  className = '',
  showLabels = true,
  size = 'default' // 'small', 'default', 'large'
}) => {
  // Handle period change without loading state
  const handlePeriodChange = useCallback((newPeriod) => {
    onPeriodChange(newPeriod);
  }, [onPeriodChange]);

  // Size-based styling
  const sizeClasses = useMemo(() => {
    switch (size) {
      case 'small':
        return {
          button: 'px-2 py-1 text-xs',
          container: 'gap-1',
          text: 'text-xs'
        };
      case 'large':
        return {
          button: 'px-4 py-2 text-base',
          container: 'gap-3',
          text: 'text-base'
        };
      default:
        return {
          button: 'px-3 py-1.5 text-sm',
          container: 'gap-2',
          text: 'text-sm'
        };
    }
  }, [size]);

  return (
    <div className={`flex items-center ${sizeClasses.container} ${className}`}>
      {/* Period Buttons */}
      <div className="flex items-center gap-1 rounded-lg p-1" style={{ backgroundColor: 'var(--input-bg)' }}>
        {['daily', 'weekly', 'monthly', 'yearly'].map((periodOption) => (
          <button
            key={periodOption}
            onClick={() => handlePeriodChange(periodOption)}
            className={`${sizeClasses.button} rounded-md font-medium transition-all duration-200 ${
              period === periodOption
                ? 'bg-violet-600 text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            {periodOption.charAt(0).toUpperCase() + periodOption.slice(1)}
          </button>
        ))}
      </div>

      {/* Separator */}
      <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>

      {/* Date/Week/Month/Year Navigation */}
      <div className="min-w-[200px] flex items-center justify-center">
        {period === 'daily' && (
          <DateSlider
            selectedDate={selectedDate}
            onDateChange={onDateChange}
            className={sizeClasses.text}
          />
        )}
        {period === 'weekly' && (
          <WeekSlider
            selectedWeek={selectedWeek}
            onWeekChange={onWeekChange}
            className={sizeClasses.text}
          />
        )}
        {period === 'monthly' && (
          <MonthSlider
            selectedMonth={selectedMonth}
            onMonthChange={onMonthChange}
            className={sizeClasses.text}
          />
        )}
        {period === 'yearly' && (
          <YearSlider
            selectedYear={selectedYear}
            onYearChange={onYearChange}
            className={sizeClasses.text}
          />
        )}
      </div>

      {/* Optional Labels */}
      {showLabels && (
        <div className={`${sizeClasses.text} text-gray-500 dark:text-gray-400 ml-2`}>
          {period === 'daily' && selectedDate && (
            <span>Date: {new Date(selectedDate).toLocaleDateString()}</span>
          )}
          {period === 'weekly' && selectedWeek && (
            <span>Week of {new Date(selectedWeek).toLocaleDateString()}</span>
          )}
          {period === 'monthly' && selectedMonth && (
            <span>Month: {new Date(selectedMonth + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</span>
          )}
          {period === 'yearly' && selectedYear && (
            <span>Year: {selectedYear}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default PeriodSelector;