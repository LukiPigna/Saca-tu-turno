
import React, { useState, useMemo, useEffect } from 'react';
import { Booking } from '../types';
import { TIME_SLOTS, MATCH_LEVELS_CASUAL, MATCH_LEVELS_COMPETITIVE, PRICING_OPTIONS, DEFAULT_DURATION } from '../constants';
import { EditBookingModal } from './EditBookingModal';

interface AdminDashboardProps {
  bookings: Booking[];
  pricing: typeof PRICING_OPTIONS;
  onUpdateBooking: (booking: Booking) => void;
  onDeleteBooking: (bookingId: string) => void;
  onCreateBooking: (bookingData: Omit<Booking, 'id'>) => void;
  onUpdatePricing: (newPricing: typeof PRICING_OPTIONS) => void;
}

const StatCard: React.FC<{ title: string, value: string | number, icon: React.ReactElement }> = ({ title, value, icon }) => (
    <div className="bg-slate-100 p-4 rounded-lg flex items-center space-x-4">
        <div className="bg-indigo-200 text-indigo-600 p-3 rounded-full">{icon}</div>
        <div>
            <p className="text-sm text-slate-500 font-medium">{title}</p>
            <p className="text-2xl font-bold text-slate-800">{value}</p>
        </div>
    </div>
);

const PricingSettings: React.FC<{ currentPricing: typeof PRICING_OPTIONS, onSave: (newPricing: typeof PRICING_OPTIONS) => void }> = ({ currentPricing, onSave }) => {
    const [prices, setPrices] = useState({
        '60': currentPricing['60'].price,
        '90': currentPricing['90'].price,
    });

    const handlePriceChange = (duration: '60' | '90', value: number) => {
        setPrices(prev => ({...prev, [duration]: value}));
    };

    const handleSave = () => {
        onSave({
            '60': { ...currentPricing['60'], price: prices['60'] },
            '90': { ...currentPricing['90'], price: prices['90'] },
        });
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Configuración de Precios</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div>
                    <label className="block text-sm font-medium text-slate-600">Precio por 1 hora (€)</label>
                    <input type="number" value={prices['60']} onChange={e => handlePriceChange('60', Number(e.target.value))} className="w-full bg-slate-100 border border-slate-300 rounded-md py-2 px-3"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-600">Precio por 1 hora 30 min (€)</label>
                    <input type="number" value={prices['90']} onChange={e => handlePriceChange('90', Number(e.target.value))} className="w-full bg-slate-100 border border-slate-300 rounded-md py-2 px-3"/>
                </div>
                <button onClick={handleSave} className="w-full bg-indigo-600 text-white font-bold py-2.5 px-4 rounded-lg transition hover:bg-indigo-700">Guardar Precios</button>
            </div>
        </div>
    );
};


export const AdminDashboard: React.FC<AdminDashboardProps> = ({ bookings, pricing, onUpdateBooking, onDeleteBooking, onCreateBooking, onUpdatePricing }) => {
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);

  // State for the new booking form
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(TIME_SLOTS[0]);
  const [duration, setDuration] = useState(DEFAULT_DURATION);
  const [organizer, setOrganizer] = useState('');
  const [players, setPlayers] = useState('');
  const [level, setLevel] = useState(MATCH_LEVELS_CASUAL[0]);
  const [type, setType] = useState<'casual' | 'competitive'>('casual');
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');
  const [price, setPrice] = useState(pricing[DEFAULT_DURATION].price);

  useEffect(() => {
    setPrice(pricing[duration]?.price || 0);
  }, [duration, pricing]);

  const { groupedBookings, totalBookings, todayOccupancy, mostActivePlayer } = useMemo(() => {
    const sorted = [...bookings].sort((a, b) => new Date(a.date + 'T' + b.time).getTime() - new Date(b.date + 'T' + a.time).getTime());
    
    const grouped = sorted.reduce((acc, booking) => {
      const dateKey = booking.date;
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(booking);
      return acc;
    }, {} as Record<string, Booking[]>);

    const todayStr = new Date().toISOString().split('T')[0];
    const todayBookings = bookings.filter(m => m.date === todayStr).length;
    const occupancy = `${((todayBookings / TIME_SLOTS.length) * 100).toFixed(0)}%`;

    const playerCounts = bookings.flatMap(m => m.players).reduce((acc, player) => {
        acc[player] = (acc[player] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const activePlayer = Object.keys(playerCounts).sort((a, b) => playerCounts[b] - playerCounts[a])[0] || 'N/A';
    
    return { groupedBookings: grouped, totalBookings: bookings.length, todayOccupancy: occupancy, mostActivePlayer: activePlayer };
  }, [bookings]);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateBooking({
      date, time, organizer, duration,
      players: players.split(',').map(p => p.trim()).filter(Boolean),
      level, type, visibility, price, notes: ''
    });
    // Reset form
    setOrganizer('');
    setPlayers('');
    setDuration(DEFAULT_DURATION);
    setPrice(pricing[DEFAULT_DURATION].price);
  };

  const formatDate = (dateString: string) => new Date(dateString + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="space-y-10 animate-fade-in">
        <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Panel de Control</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard title="Total de Reservas" value={totalBookings} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>} />
                <StatCard title="Ocupación de Hoy" value={todayOccupancy} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>} />
                <StatCard title="Jugador Más Activo" value={mostActivePlayer} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.124-1.282-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.124-1.282.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} />
            </div>
        </div>
        
        <PricingSettings currentPricing={pricing} onSave={onUpdatePricing} />

      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Crear Nueva Reserva</h2>
        <form onSubmit={handleCreateSubmit} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-slate-600">Fecha</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full bg-slate-100 border border-slate-300 rounded-md py-2 px-3"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600">Hora</label>
            <select value={time} onChange={e => setTime(e.target.value)} className="w-full bg-slate-100 border border-slate-300 rounded-md py-2 px-3">
              {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
           <div>
            <label className="block text-sm font-medium text-slate-600">Duración</label>
            <select value={duration} onChange={e => setDuration(Number(e.target.value))} className="w-full bg-slate-100 border border-slate-300 rounded-md py-2 px-3">
                {/* FIX: Use Object.keys to avoid type inference issues with Object.entries where the value was inferred as 'unknown'. */}
                {Object.keys(pricing).map(d => <option key={d} value={d}>{pricing[d].label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600">A nombre de</label>
            <input type="text" value={organizer} onChange={e => setOrganizer(e.target.value)} className="w-full bg-slate-100 border border-slate-300 rounded-md py-2 px-3" required/>
          </div>
          <div className="md:col-span-full lg:col-span-2">
            <label className="block text-sm font-medium text-slate-600">Otros Jugadores (separados por coma)</label>
            <input type="text" value={players} onChange={e => setPlayers(e.target.value)} className="w-full bg-slate-100 border border-slate-300 rounded-md py-2 px-3"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600">Tipo</label>
            <select value={type} onChange={e => setType(e.target.value as 'casual' | 'competitive')} className="w-full bg-slate-100 border border-slate-300 rounded-md py-2 px-3">
              <option value="casual">Amistoso</option>
              <option value="competitive">Competitivo</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600">Nivel</label>
            <select value={level} onChange={e => setLevel(e.target.value)} className="w-full bg-slate-100 border border-slate-300 rounded-md py-2 px-3">
              {(type === 'casual' ? MATCH_LEVELS_CASUAL : MATCH_LEVELS_COMPETITIVE).map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600">Visibilidad</label>
            <select value={visibility} onChange={e => setVisibility(e.target.value as 'public' | 'private')} className="w-full bg-slate-100 border border-slate-300 rounded-md py-2 px-3">
              <option value="public">Público</option>
              <option value="private">Privado</option>
            </select>
          </div>
           <div>
            <label className="block text-sm font-medium text-slate-600">Precio (€)</label>
            <input type="number" value={price} onChange={e => setPrice(Number(e.target.value))} className="w-full bg-slate-100 border border-slate-300 rounded-md py-2 px-3"/>
          </div>
          <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-2.5 px-4 rounded-lg transition hover:bg-indigo-700">Crear Reserva</button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Todas las Reservas Programadas</h2>
        <div className="space-y-8">
          {Object.keys(groupedBookings).length === 0 ? (
            <p className="text-slate-500 text-center py-8">No hay reservas programadas.</p>
          ) : (
            Object.keys(groupedBookings).map(dateKey => (
              <div key={dateKey}>
                <h3 className="text-lg font-semibold text-indigo-600 mb-3">{formatDate(dateKey)}</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-slate-500">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-100">
                      <tr>
                        <th scope="col" className="px-4 py-3">Hora</th>
                        <th scope="col" className="px-4 py-3">Duración</th>
                        <th scope="col" className="px-4 py-3">Organizador</th>
                        <th scope="col" className="px-4 py-3">Jugadores</th>
                        <th scope="col" className="px-4 py-3">Nivel</th>
                        <th scope="col" className="px-4 py-3">Precio</th>
                        <th scope="col" className="px-4 py-3 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {groupedBookings[dateKey].map(booking => (
                        <tr key={booking.id} className="bg-white border-b hover:bg-slate-50">
                          <th scope="row" className="px-4 py-4 font-medium text-slate-900">{booking.time}</th>
                          <td className="px-4 py-4">{pricing[booking.duration]?.label}</td>
                          <td className="px-4 py-4">{booking.organizer}</td>
                          <td className="px-4 py-4">{booking.players.join(', ')} ({booking.players.length}/4)</td>
                          <td className="px-4 py-4">{booking.level}</td>
                          <td className="px-4 py-4 font-medium">{booking.price}€</td>
                          <td className="px-4 py-4 text-right space-x-2">
                            <button onClick={() => setEditingBooking(booking)} className="font-medium text-blue-600 hover:underline">Editar</button>
                            <button onClick={() => onDeleteBooking(booking.id)} className="font-medium text-red-600 hover:underline">Eliminar</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {editingBooking && (
        <EditBookingModal
          booking={editingBooking}
          pricing={pricing}
          onClose={() => setEditingBooking(null)}
          onSave={(updatedBooking) => {
            onUpdateBooking(updatedBooking);
            setEditingBooking(null);
          }}
        />
      )}
    </div>
  );
};
