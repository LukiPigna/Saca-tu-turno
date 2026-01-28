
import React, { useState, useEffect } from 'react';
import { Booking } from '../types';
import { TIME_SLOTS, MATCH_LEVELS_CASUAL, MATCH_LEVELS_COMPETITIVE, PRICING_OPTIONS } from '../constants';

interface EditBookingModalProps {
  booking: Booking;
  pricing: typeof PRICING_OPTIONS;
  onClose: () => void;
  onSave: (booking: Booking) => void;
}

export const EditBookingModal: React.FC<EditBookingModalProps> = ({ booking, pricing, onClose, onSave }) => {
  const [formData, setFormData] = useState<Booking>(booking);

  useEffect(() => {
    // Automatically update price when duration changes, but only if it matches the default
    const defaultPrice = pricing[formData.duration]?.price;
    const oldDefaultPrice = pricing[booking.duration]?.price;

    // Update the price only if the previous price was the "default" for that duration.
    // This preserves manually overridden prices.
    if (defaultPrice !== undefined && formData.price === oldDefaultPrice) {
       setFormData(prev => ({...prev, price: defaultPrice}));
    }
  }, [formData.duration, booking.duration, formData.price, pricing]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isNumber = type === 'number' || name === 'duration';
    setFormData(prev => ({ 
        ...prev, 
        [name]: isNumber ? Number(value) : value 
    }));
  };
  
  const handlePlayersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     setFormData(prev => ({ ...prev, players: e.target.value.split(',').map(p => p.trim()) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };
  
  const levelOptions = formData.type === 'casual' ? MATCH_LEVELS_CASUAL : MATCH_LEVELS_COMPETITIVE;

  return (
    <div className="fixed inset-0 bg-slate-900 bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 md:p-8 transform animate-fade-in-up">
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-slate-900">Editar Reserva</h3>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-600">Fecha</label>
                <input type="date" name="date" value={formData.date} onChange={handleInputChange} className="w-full bg-slate-100 border border-slate-300 rounded-md py-2 px-3"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600">Hora</label>
                <select name="time" value={formData.time} onChange={handleInputChange} className="w-full bg-slate-100 border border-slate-300 rounded-md py-2 px-3">
                  {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600">A nombre de</label>
            <input type="text" name="organizer" value={formData.organizer} onChange={handleInputChange} className="w-full bg-slate-100 border border-slate-300 rounded-md py-2 px-3"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600">Jugadores (separados por coma)</label>
            <input type="text" name="players" value={formData.players.join(', ')} onChange={handlePlayersChange} className="w-full bg-slate-100 border border-slate-300 rounded-md py-2 px-3"/>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-medium text-slate-600">Tipo</label>
                <select name="type" value={formData.type} onChange={handleInputChange} className="w-full bg-slate-100 border border-slate-300 rounded-md py-2 px-3">
                  <option value="casual">Amistoso</option>
                  <option value="competitive">Competitivo</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600">Nivel</label>
                <select name="level" value={formData.level} onChange={handleInputChange} className="w-full bg-slate-100 border border-slate-300 rounded-md py-2 px-3">
                  {levelOptions.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-600">Duración</label>
              <select name="duration" value={formData.duration} onChange={handleInputChange} className="w-full bg-slate-100 border border-slate-300 rounded-md py-2 px-3">
                  {/* FIX: Use Object.keys to avoid type inference issues with Object.entries where the value was inferred as 'unknown'. */}
                  {Object.keys(pricing).map(d => <option key={d} value={d}>{pricing[d].label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600">Precio (€)</label>
              <input type="number" name="price" value={formData.price} onChange={handleInputChange} className="w-full bg-slate-100 border border-slate-300 rounded-md py-2 px-3"/>
            </div>
          </div>
           <div className="pt-4 flex justify-end space-x-3">
             <button type="button" onClick={onClose} className="bg-slate-200 text-slate-800 font-bold py-2 px-4 rounded-lg transition hover:bg-slate-300">Cancelar</button>
             <button type="submit" className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg transition hover:bg-indigo-700">Guardar Cambios</button>
           </div>
        </form>
      </div>
    </div>
  );
};
