import React from 'react';

export default function PeriodSelector({ period, onChange }) {
  const periods = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' }
  ];

  return (
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
  );
}
