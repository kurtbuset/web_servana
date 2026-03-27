import { memo } from 'react';
import DateSlider from './DateSlider';
import WeekSlider from './WeekSlider';
import MonthSlider from './MonthSlider';
import YearSlider from './YearSlider';

const PeriodSelector = memo(function PeriodSelector({ 
  period, 
  onChange, 
  selectedDate, 
  onDateChange,
  selectedWeek,
  onWeekChange,
  selectedMonth,
  onMonthChange,
  selectedYear,
  onYearChange
}) {
  const periods = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' }
  ];

  return (
    <div className="flex items-center gap-3">
      {/* Period Buttons */}
      <div className="flex gap-1">
        {periods.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => onChange(value)}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
              period === value
                ? 'bg-gradient-to-r from-[#6237A0] to-[#7A4ED9] text-white shadow-sm'
                : 'bg-white/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-gray-800/70'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Slider Container with Fixed Width */}
      <div className="flex items-center gap-2 min-w-[200px]">
        {/* Separator */}
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600" />
        
        {/* Date Slider for Daily Period */}
        {period === 'daily' && selectedDate && onDateChange && (
          <DateSlider 
            selectedDate={selectedDate}
            onDateChange={onDateChange}
          />
        )}

        {/* Week Slider for Weekly Period */}
        {period === 'weekly' && selectedWeek && onWeekChange && (
          <WeekSlider 
            selectedWeek={selectedWeek}
            onWeekChange={onWeekChange}
          />
        )}

        {/* Month Slider for Monthly Period */}
        {period === 'monthly' && selectedMonth && onMonthChange && (
          <MonthSlider 
            selectedMonth={selectedMonth}
            onMonthChange={onMonthChange}
          />
        )}

        {/* Year Slider for Yearly Period */}
        {period === 'yearly' && selectedYear && onYearChange && (
          <YearSlider 
            selectedYear={selectedYear}
            onYearChange={onYearChange}
          />
        )}
      </div>
    </div>
  );
});

export default PeriodSelector;
