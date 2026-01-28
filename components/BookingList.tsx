
import React, { useState, useMemo } from 'react';
import { Booking } from '../types';
import { BookingCard } from './BookingCard';
import { User } from './Auth';
import { BookingFilter, Filters } from './BookingFilter';

interface BookingListProps {
  title: string;
  bookings: Booking[];
  onJoinBooking: (bookingId: string) => void;
  onLeaveBooking: (bookingId: string) => void;
  onKickPlayer: (bookingId: string, playerName: string) => void;
  onInvitePlayer: (bookingId: string) => void;
  currentUser: User;
  addNotification: (message: string) => void;
}

export const BookingList: React.FC<BookingListProps> = ({ title, bookings, onJoinBooking, onLeaveBooking, onKickPlayer, onInvitePlayer, currentUser, addNotification }) => {
  const [filters, setFilters] = useState<Filters>({
    date: 'all',
    type: 'all',
    level: 'all',
  });

  const filteredBookings = useMemo(() => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    const endOfWeek = new Date();
    endOfWeek.setDate(today.getDate() + (7 - today.getDay()));

    const todayStr = today.toISOString().split('T')[0];
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    return bookings
      .filter(booking => {
        // Date filter
        if (filters.date === 'today' && booking.date !== todayStr) return false;
        if (filters.date === 'tomorrow' && booking.date !== tomorrowStr) return false;
        if (filters.date === 'week') {
            const bookingDate = new Date(booking.date + 'T00:00:00');
            if (bookingDate < today || bookingDate > endOfWeek) return false;
        }
        // Type filter
        if (filters.type !== 'all' && booking.type !== filters.type) return false;
        // Level filter
        if (filters.level !== 'all' && booking.level !== filters.level) return false;
        
        return true;
      })
      .sort((a, b) => {
        const dateA = new Date(a.date + 'T' + a.time).getTime();
        const dateB = new Date(b.date + 'T' + b.time).getTime();
        return dateA - dateB;
      });
  }, [bookings, filters]);

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
        {title === "Reservas Abiertas a Jugadores" && <BookingFilter filters={filters} onFilterChange={setFilters} />}
      </div>
      {filteredBookings.length === 0 ? (
        <div className="text-center bg-white p-8 rounded-xl shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <h3 className="mt-2 text-lg font-medium text-slate-800">No se encontraron reservas</h3>
          <p className="mt-1 text-sm text-slate-500">
            Intenta ajustar los filtros o revisa más tarde. ¡También puedes crear tu propia reserva!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map(booking => (
            <BookingCard 
              key={booking.id} 
              booking={booking} 
              onJoin={onJoinBooking} 
              onLeave={onLeaveBooking}
              onKick={onKickPlayer}
              onInvite={onInvitePlayer}
              currentUser={currentUser} 
            />
          ))}
        </div>
      )}
    </div>
  );
};
