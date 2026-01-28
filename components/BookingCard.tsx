
import React from 'react';
import { Booking } from '../types';
import { User } from './Auth';
import { PRICING_OPTIONS } from '../constants';

interface BookingCardProps {
  booking: Booking;
  currentUser: User;
  onJoin: (bookingId: string) => void;
  onLeave: (bookingId: string) => void;
  onKick: (bookingId: string, playerName: string) => void;
  onInvite: (bookingId:string) => void;
}

const PlayerAvatar: React.FC<{ name?: string, onKick?: () => void }> = ({ name, onKick }) => (
  <div className="relative group flex flex-col items-center">
    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${name ? 'bg-slate-200 text-slate-600' : 'bg-slate-100 border-2 border-dashed border-slate-300'}`}>
      {name ? name.charAt(0) : ''}
    </div>
    {onKick && name && (
      <button onClick={onKick} className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
        &times;
      </button>
    )}
    <div className="absolute top-10 w-max bg-slate-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20">
      {name || 'Lugar disponible'}
    </div>
  </div>
);

export const BookingCard: React.FC<BookingCardProps> = ({ booking, currentUser, onJoin, onLeave, onKick, onInvite }) => {
  const bookingDate = new Date(booking.date + 'T00:00:00');
  const day = bookingDate.toLocaleDateString('es-ES', { day: '2-digit' });
  const month = bookingDate.toLocaleDateString('es-ES', { month: 'short' }).replace('.', '').toUpperCase();

  const isFull = booking.players.length >= 4;
  const isJoined = booking.players.includes(currentUser.name);
  const isOrganizer = booking.organizer === currentUser.name;
  
  const canJoin = !isFull && !isJoined && booking.visibility === 'public';

  const levelColor = booking.type === 'competitive' 
    ? 'bg-red-100 text-red-800'
    : 'bg-green-100 text-green-800';

  const pricePerPlayer = (booking.price / (booking.players.length || 1)).toFixed(2);
  const durationLabel = PRICING_OPTIONS[booking.duration]?.label || `${booking.duration} min`;

  const ActionButton: React.FC = () => {
    if (isJoined && !isOrganizer) {
      return <button onClick={() => onLeave(booking.id)} className="w-full bg-red-500 text-white font-semibold py-2 px-3 rounded-lg text-sm transition hover:bg-red-600">Cancelar mi lugar</button>;
    }
    if (canJoin) {
      return <button onClick={() => onJoin(booking.id)} className="w-full bg-indigo-600 text-white font-semibold py-2 px-3 rounded-lg text-sm transition hover:bg-indigo-700">Unirme</button>;
    }
    if (isOrganizer && !isFull) {
        return <button onClick={() => onInvite(booking.id)} className="w-full bg-blue-500 text-white font-semibold py-2 px-3 rounded-lg text-sm transition hover:bg-blue-600">Invitar Jugador</button>;
    }
     if (isJoined) {
      return <div className="w-full bg-green-100 text-green-800 font-semibold py-2 px-3 rounded-lg text-sm text-center">Inscrito</div>;
    }
    if (isFull) {
      return <div className="w-full bg-slate-200 text-slate-500 font-semibold py-2 px-3 rounded-lg text-sm text-center">Completo</div>;
    }
    return null;
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-lg transition-shadow hover:shadow-xl flex flex-col sm:flex-row sm:items-center sm:space-x-4">
      {/* Left side: Booking Info */}
      <div className="flex-grow flex items-center space-x-4">
        <div className="flex-shrink-0 flex flex-col items-center justify-center w-16 h-16 bg-slate-100 rounded-lg text-center">
          <span className="text-xs font-bold text-indigo-600">{month}</span>
          <span className="text-2xl font-extrabold text-slate-800">{day}</span>
        </div>
        <div className="flex-grow">
          <div className="flex items-center space-x-2">
            <p className="font-bold text-slate-800">{booking.time} hs <span className="text-sm font-normal text-slate-500">({durationLabel})</span></p>
            {booking.visibility === 'private' && (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" /></svg>
            )}
          </div>
          <p className="text-sm text-slate-500">A nombre de: {booking.organizer}</p>
          <div className="flex items-baseline mt-1">
             <span className="font-bold text-lg text-indigo-600">{booking.price}€</span>
             <span className="text-xs text-slate-500 ml-1"> / {pricePerPlayer}€ x jugador</span>
          </div>
        </div>
        <div className="flex-shrink-0">
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${levelColor}`}>{booking.level}</span>
        </div>
      </div>
      
      <div className="border-t sm:border-t-0 sm:border-l border-slate-200 my-3 sm:my-0 sm:mx-4 sm:h-16"></div>

      {/* Right side: Players & Actions */}
      <div className="flex-shrink-0 sm:w-64 flex flex-col justify-center">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center space-x-2">
            {Array.from({ length: 4 }).map((_, i) => {
              const playerName = booking.players[i];
              const canKick = isOrganizer && playerName && playerName !== currentUser.name;
              return <PlayerAvatar key={i} name={playerName} onKick={canKick ? () => onKick(booking.id, playerName) : undefined} />;
            })}
          </div>
          <span className="text-sm font-semibold text-slate-500">{booking.players.length} / 4</span>
        </div>
        <div className="h-9"><ActionButton /></div>
      </div>
    </div>
  );
};
