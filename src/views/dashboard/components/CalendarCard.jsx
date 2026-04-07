import { useState } from 'react';

export default function CalendarCard() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [calendarData, setCalendarData] = useState({
        year: new Date().getFullYear(),
        month: new Date().getMonth(),
        today: new Date().getDate()
    });

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const dayLabels = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    const changeMonth = (direction) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(currentDate.getMonth() + direction);
        setCurrentDate(newDate);
        setCalendarData({
            year: newDate.getFullYear(),
            month: newDate.getMonth(),
            today: new Date().getDate()
        });
    };

    const renderCalendar = () => {
        const { year, month, today } = calendarData;
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        const days = [];
        
        // Add day labels
        dayLabels.forEach(label => {
            days.push(
                <div key={`label-${label}`} className="cal-label">
                    {label}
                </div>
            );
        });
        
        // Add empty cells for days before the first day of the month
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`}></div>);
        }
        
        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const isToday = day === today && month === currentMonth && year === currentYear;
            days.push(
                <div 
                    key={`day-${day}`} 
                    className={`cal-day${isToday ? ' today' : ''}`}
                >
                    {day}
                </div>
            );
        }
        
        return days;
    };

    const upcomingEvents = [
        {
            title: 'Team Sync',
            date: 'Apr 1',
            time: '10:00 AM',
            color: 'var(--purple-mid)'
        },
        {
            title: 'QA Review',
            date: 'Apr 3',
            time: '2:00 PM',
            color: 'var(--cyan-mid)'
        }
    ];

    return (
        <div className="card">
            <div className="card-title">
                <span className="card-title-dot"></span>
                Calendar
            </div>
            <div className="cal-nav">
                <button className="cal-btn" onClick={() => changeMonth(-1)}>
                    ‹
                </button>
                <span className="cal-month">
                    {months[calendarData.month]} {calendarData.year}
                </span>
                <button className="cal-btn" onClick={() => changeMonth(1)}>
                    ›
                </button>
            </div>
            <div className="cal-grid">
                {renderCalendar()}
            </div>
            <div style={{ 
                marginTop: 'auto', 
                paddingTop: '10px', /* Reduced from 14px */
                borderTop: '1px solid rgba(109,40,217,.08)' 
            }}>
                <div style={{ 
                    fontSize: '9px', /* Reduced from 10px */
                    fontWeight: '700', 
                    letterSpacing: '.1em', 
                    textTransform: 'uppercase', 
                    color: 'var(--muted)', 
                    marginBottom: '8px' /* Reduced from 10px */
                }}>
                    Upcoming
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}> {/* Reduced gap */}
                    {upcomingEvents.slice(0, 2).map((event, index) => ( // Limit to 2 events
                        <div key={index} className="upcoming-event">
                            <div 
                                className="event-bar" 
                                style={{ background: event.color }}
                            ></div>
                            <div>
                                <div style={{ 
                                    fontSize: '11px', /* Reduced from 12px */
                                    fontWeight: '600', 
                                    color: 'var(--text)' 
                                }}>
                                    {event.title}
                                </div>
                                <div style={{ 
                                    fontSize: '9.5px', /* Reduced from 10.5px */
                                    color: 'var(--muted)' 
                                }}>
                                    {event.date} · {event.time}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}