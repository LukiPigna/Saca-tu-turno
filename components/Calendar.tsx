
import React, { useState } from 'react';

interface CalendarProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export const Calendar: React.FC<CalendarProps> = ({ selectedDate, onDateChange }) => {
  const [displayDate, setDisplayDate] = useState(new Date(selectedDate));

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startOfMonth = new Date(displayDate.getFullYear(), displayDate.getMonth(), 1);
  const endOfMonth = new Date(displayDate.getFullYear(), displayDate.getMonth() + 1, 0);

  const startDay = (startOfMonth.getDay() + 6) % 7; // Lunes = 0
  const daysInMonth = endOfMonth.getDate();

  const handlePrevMonth = () => {
    setDisplayDate(new Date(displayDate.getFullYear(), displayDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setDisplayDate(new Date(displayDate.getFullYear(), displayDate.getMonth() + 1, 1));
  };

  const days = Array.from({ length: startDay }).map(() => null)
    .concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));

  const isSameDay = (d1: Date, d2: Date) => d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h3 className="text-lg font-semibold">
          {displayDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }).replace(/^\w/, c => c.toUpperCase())}
        </h3>
        <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-sm text-slate-500">
        {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(day => <div key={day} className="font-semibold">{day}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1 mt-2">
        {days.map((day, index) => {
          if (!day) return <div key={`empty-${index}`}></div>;
          const date = new Date(displayDate.getFullYear(), displayDate.getMonth(), day);
          const isSelected = isSameDay(date, selectedDate);
          const isToday = isSameDay(date, today);
          const isPast = date < today;

          let classes = "w-10 h-10 flex items-center justify-center rounded-full transition-colors duration-200";
          if (isPast) {
            classes += " text-slate-400 cursor-not-allowed";
          } else {
            classes += " cursor-pointer";
            if (isSelected) {
              classes += " bg-indigo-600 text-white font-bold shadow-md";
            } else if (isToday) {
              classes += " ring-2 ring-indigo-500 text-indigo-600";
            } else {
              classes += " hover:bg-slate-200";
            }
          }

          return (
            <div
              key={day}
              onClick={() => !isPast && onDateChange(date)}
              className={classes}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
};
