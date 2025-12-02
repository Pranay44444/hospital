import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Calendar.css';

function Calendar({ selectedDate, onDateSelect, minDate, maxDate }) {
    const currentDate = selectedDate || new Date();
    const [displayMonth, setDisplayMonth] = useState(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1));

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];

    const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];

        // Add empty cells for days before the first day of month
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }

        // Add actual days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(new Date(year, month, day));
        }

        return days;
    };

    const handlePrevMonth = () => {
        setDisplayMonth(new Date(displayMonth.getFullYear(), displayMonth.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setDisplayMonth(new Date(displayMonth.getFullYear(), displayMonth.getMonth() + 1, 1));
    };

    const handleDateClick = (date) => {
        if (!date) return;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const clickedDate = new Date(date);
        clickedDate.setHours(0, 0, 0, 0);

        // Check if date is disabled
        if (clickedDate < today) return;
        if (minDate && clickedDate < minDate) return;
        if (maxDate && clickedDate > maxDate) return;

        onDateSelect(date);
    };

    const isDateSelected = (date) => {
        if (!date || !selectedDate) return false;
        return date.toDateString() === selectedDate.toDateString();
    };

    const isDateDisabled = (date) => {
        if (!date) return true;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const checkDate = new Date(date);
        checkDate.setHours(0, 0, 0, 0);

        if (checkDate < today) return true;
        if (minDate && checkDate < minDate) return true;
        if (maxDate && checkDate > maxDate) return true;

        return false;
    };

    const days = getDaysInMonth(displayMonth);

    return (
        <div className="calendar-widget">
            <div className="calendar-header">
                <button
                    type="button"
                    className="calendar-nav-btn"
                    onClick={handlePrevMonth}
                    aria-label="Previous month"
                >
                    <ChevronLeft size={20} />
                </button>
                <h3 className="calendar-month-year">
                    {monthNames[displayMonth.getMonth()]} {displayMonth.getFullYear()}
                </h3>
                <button
                    type="button"
                    className="calendar-nav-btn"
                    onClick={handleNextMonth}
                    aria-label="Next month"
                >
                    <ChevronRight size={20} />
                </button>
            </div>

            <div className="calendar-days-header">
                {daysOfWeek.map(day => (
                    <div key={day} className="calendar-day-name">{day}</div>
                ))}
            </div>

            <div className="calendar-grid">
                {days.map((date, index) => (
                    <button
                        key={index}
                        type="button"
                        className={`calendar-day ${!date ? 'empty' : ''} ${isDateSelected(date) ? 'selected' : ''} ${isDateDisabled(date) ? 'disabled' : ''}`}
                        onClick={() => handleDateClick(date)}
                        disabled={isDateDisabled(date)}
                    >
                        {date ? date.getDate() : ''}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default Calendar;
