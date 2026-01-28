
import React from 'react';
import { TIME_SLOTS } from '../constants';

interface TimeSlotGridProps {
  selectedTime: string | null;
  onTimeSelect: (time: string) => void;
  bookedSlots: string[];
}

export const TimeSlotGrid: React.FC<TimeSlotGridProps> = ({ selectedTime, onTimeSelect, bookedSlots }) => {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
      {TIME_SLOTS.map((time) => {
        const isBooked = bookedSlots.includes(time);
        const isSelected = time === selectedTime;

        let buttonClass = 'bg-white text-slate-700 border border-slate-300 hover:bg-indigo-600 hover:text-white hover:border-indigo-600';
        if (isBooked) {
          buttonClass = 'bg-slate-100 text-slate-400 cursor-not-allowed line-through';
        }
        if (isSelected) {
          buttonClass = 'bg-indigo-600 text-white border-indigo-600 ring-2 ring-offset-2 ring-indigo-500';
        }

        return (
          <button
            key={time}
            disabled={isBooked}
            onClick={() => onTimeSelect(time)}
            className={`p-3 rounded-lg text-center font-semibold text-md transition-all duration-200 focus:outline-none ${buttonClass}`}
          >
            {time}
          </button>
        );
      })}
    </div>
  );
};
