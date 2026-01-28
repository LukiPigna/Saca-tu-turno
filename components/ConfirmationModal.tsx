
import React, { useState } from 'react';
import { Booking } from '../types';
import { PRICING_OPTIONS } from '../constants';

interface ConfirmationModalProps {
  booking: Booking;
  onClose: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ booking, onClose }) => {
  const bookingDate = new Date(booking.date + 'T00:00:00');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    // This is a simulation. In a real app, you'd generate a unique URL.
    const fakeUrl = `https://pic.example.com/booking/${booking.id}`;
    navigator.clipboard.writeText(fakeUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
  };

  const durationLabel = PRICING_OPTIONS[booking.duration]?.label || `${booking.duration} min`;

  return (
    <div className="fixed inset-0 bg-slate-900 bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full text-center p-6 md:p-8 transform animate-fade-in-up">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-500 mb-5 shadow-lg shadow-green-500/30">
          <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-2">¡Reserva Confirmada!</h3>
        <p className="text-slate-500 mb-6">
          {booking.visibility === 'public' 
            ? 'Tu reserva ya está visible para otros jugadores.'
            : 'Tu reserva privada se ha creado con éxito.'}
        </p>
        
        <div className="text-left bg-slate-100 rounded-lg p-4 space-y-3 mb-8 border border-slate-200">
          <p className="text-slate-700 flex justify-between"><strong className="text-indigo-600 font-semibold">Día:</strong> {bookingDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}</p>
          <p className="text-slate-700 flex justify-between"><strong className="text-indigo-600 font-semibold">Hora:</strong> {booking.time} hs</p>
          <p className="text-slate-700 flex justify-between"><strong className="text-indigo-600 font-semibold">Duración:</strong> {durationLabel}</p>
          <p className="text-slate-700 flex justify-between"><strong className="text-indigo-600 font-semibold">Nivel:</strong> {booking.level}</p>
          <p className="text-slate-700 flex justify-between"><strong className="text-indigo-600 font-semibold">Precio Total:</strong> {booking.price}€</p>
          <p className="text-slate-700"><strong className="text-indigo-600 font-semibold">Jugadores:</strong> {booking.players.join(', ')}</p>
        </div>
        
        {booking.visibility === 'private' && (
          <button
            onClick={handleCopy}
            className="w-full mb-3 bg-slate-200 text-slate-800 font-bold py-3 px-4 rounded-lg transition-colors duration-300 hover:bg-slate-300 focus:outline-none"
          >
            {copied ? '¡Enlace Copiado!' : 'Copiar enlace de invitación'}
          </button>
        )}
        
        <button
          onClick={onClose}
          className="w-full bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/30 hover:scale-105 focus:outline-none"
        >
          ¡Perfecto!
        </button>
      </div>
    </div>
  );
};
