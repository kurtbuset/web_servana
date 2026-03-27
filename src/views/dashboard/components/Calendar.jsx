import { useState, useEffect, useMemo, memo } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from 'react-feather';

/**
 * Calendar Component - Mini calendar for dashboard
 */
const Calendar = memo(function Calendar({ className }) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentTime, setCurrentTime] = useState(new Date());

    // Update current time every 5 minutes (reduced frequency)
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 300000); // Update every 5 minutes

        return () => clearInterval(timer);
    }, []);

    // Memoize sample events to prevent recalculation
    const sampleEvents = useMemo(() => {
        const today = new Date().getDate();
        return {
            [today]: { type: 'meeting', title: 'Team Meeting' },
            [today + 2]: { type: 'deadline', title: 'Report Due' },
            [today + 5]: { type: 'event', title: 'Training' }
        };
    }, []); // Only calculate once

    // Check if date has events
    const hasEvent = (day) => {
        return sampleEvents[day];
    };

    // Get event for date
    const getEvent = (day) => {
        return sampleEvents[day];
    };
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    // Month names
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Get first day of month and number of days
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    // Navigation functions
    const goToPreviousMonth = () => {
        setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
    };

    const goToNextMonth = () => {
        setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
    };

    // Check if date is today
    const isToday = (day) => {
        const today = new Date();
        return today.getDate() === day && 
               today.getMonth() === currentMonth && 
               today.getFullYear() === currentYear;
    };

    // Check if date is selected
    const isSelected = (day) => {
        return selectedDate.getDate() === day && 
               selectedDate.getMonth() === currentMonth && 
               selectedDate.getFullYear() === currentYear;
    };

    // Handle date selection
    const selectDate = (day) => {
        setSelectedDate(new Date(currentYear, currentMonth, day));
    };

    // Generate calendar days
    const renderCalendarDays = () => {
        const days = [];
        
        // Previous month's trailing days
        for (let i = firstDayOfMonth - 1; i >= 0; i--) {
            const day = daysInPrevMonth - i;
            days.push(
                <button
                    key={`prev-${day}`}
                    className="w-8 h-8 text-xs rounded-full flex items-center justify-center transition-colors"
                    style={{ color: 'var(--text-tertiary)' }}
                    disabled
                >
                    {day}
                </button>
            );
        }

        // Current month days
        for (let day = 1; day <= daysInMonth; day++) {
            const today = isToday(day);
            const selected = isSelected(day);
            const event = hasEvent(day);
            
            days.push(
                <button
                    key={day}
                    onClick={() => selectDate(day)}
                    className={`w-8 h-8 text-xs rounded-full flex items-center justify-center transition-all duration-200 hover:bg-purple-100 relative ${
                        today ? 'bg-[#6237A0] text-white font-semibold shadow-md' : 
                        selected ? 'bg-purple-100 text-[#6237A0] font-semibold' : 
                        'hover:text-[#6237A0]'
                    }`}
                    style={{ 
                        color: today || selected ? undefined : 'var(--text-primary)',
                        backgroundColor: today ? '#6237A0' : selected ? '#f3f4f6' : undefined
                    }}
                    title={event ? event.title : undefined}
                >
                    {day}
                    {event && (
                        <div className={`absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full ${
                            event.type === 'meeting' ? 'bg-blue-500' :
                            event.type === 'deadline' ? 'bg-red-500' :
                            'bg-green-500'
                        }`} />
                    )}
                </button>
            );
        }

        // Next month's leading days to fill the grid
        const totalCells = Math.ceil((firstDayOfMonth + daysInMonth) / 7) * 7;
        const remainingCells = totalCells - (firstDayOfMonth + daysInMonth);
        
        for (let day = 1; day <= remainingCells; day++) {
            days.push(
                <button
                    key={`next-${day}`}
                    className="w-8 h-8 text-xs rounded-full flex items-center justify-center transition-colors"
                    style={{ color: 'var(--text-tertiary)' }}
                    disabled
                >
                    {day}
                </button>
            );
        }

        return days;
    };

    return (
        <div 
            className={`${className || ''} rounded-lg p-4 shadow-sm border flex flex-col`}
            style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                    <CalendarIcon size={16} className="text-[#6237A0]" />
                    Calendar
                </h2>
            </div>

            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-4">
                <button
                    onClick={goToPreviousMonth}
                    className="p-1 rounded-full hover:bg-purple-100 transition-colors"
                >
                    <ChevronLeft size={16} className="text-[#6237A0]" />
                </button>
                
                <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {monthNames[currentMonth]} {currentYear}
                </h3>
                
                <button
                    onClick={goToNextMonth}
                    className="p-1 rounded-full hover:bg-purple-100 transition-colors"
                >
                    <ChevronRight size={16} className="text-[#6237A0]" />
                </button>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                    <div 
                        key={day} 
                        className="w-8 h-6 text-xs font-medium flex items-center justify-center"
                        style={{ color: 'var(--text-secondary)' }}
                    >
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 flex-1">
                {renderCalendarDays()}
            </div>

            {/* Selected Date Info */}
            <div className="mt-4 pt-3 border-t space-y-2" style={{ borderColor: 'var(--border-color)' }}>
                <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    Selected: {selectedDate.toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                    })}
                </div>
                
                {/* Show event for selected date */}
                {getEvent(selectedDate.getDate()) && (
                    <div className="text-xs p-2 rounded-md bg-purple-50 border border-purple-200">
                        <div className="font-medium text-purple-800">
                            {getEvent(selectedDate.getDate()).title}
                        </div>
                    </div>
                )}
                
                <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                    <Clock size={12} />
                    {currentTime.toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit',
                        hour12: true
                    })}
                </div>
            </div>
        </div>
    );
});

export default Calendar;