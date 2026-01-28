
import React, { useState, useEffect } from 'react';
import { MATCH_LEVELS_CASUAL, MATCH_LEVELS_COMPETITIVE } from '../constants';
import { Booking } from '../types';
import { User } from './Auth';

export type CreateBookingFormData = Pick<Booking, 'level' | 'notes' | 'visibility' | 'type'> & { players: string[] };

interface CreateBookingFormProps {
  onSubmit: (formData: CreateBookingFormData) => void;
  isSubmitting: boolean;
  error: string | null;
  currentUser: User;
}

export const CreateBookingForm: React.FC<CreateBookingFormProps> = ({ onSubmit, isSubmitting, error, currentUser }) => {
  const [matchType, setMatchType] = useState<'casual' | 'competitive'>('casual');
  const [level, setLevel] = useState(MATCH_LEVELS_CASUAL[0]);
  const [notes, setNotes] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');
  const [invitedFriends, setInvitedFriends] = useState<string[]>([]);
  const [otherPlayers, setOtherPlayers] = useState(['', '']);
  
  useEffect(() => {
    // Reset level when match type changes
    setLevel(matchType === 'casual' ? MATCH_LEVELS_CASUAL[0] : MATCH_LEVELS_COMPETITIVE[0]);
  }, [matchType]);
  
  const handleFriendInvite = (friendEmail: string) => {
    setInvitedFriends(prev => 
      prev.includes(friendEmail) 
        ? prev.filter(f => f !== friendEmail) 
        : [...prev, friendEmail]
    );
  };

  const handleOtherPlayerChange = (index: number, name: string) => {
    const newPlayers = [...otherPlayers];
    newPlayers[index] = name;
    setOtherPlayers(newPlayers);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const allPlayers = [...invitedFriends, ...otherPlayers];
    onSubmit({ level, notes, visibility, players: allPlayers, type: matchType });
  };

  const levelOptions = matchType === 'casual' ? MATCH_LEVELS_CASUAL : MATCH_LEVELS_COMPETITIVE;

  const totalPlayers = 1 + invitedFriends.length + otherPlayers.filter(p => p.trim() !== '').length;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-600 mb-2">Tipo de Partido</label>
        <div className="flex rounded-lg border border-slate-300 p-1">
          <button type="button" onClick={() => setMatchType('casual')} className={`w-1/2 py-2 text-sm font-semibold rounded-md transition-colors ${matchType === 'casual' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>Amistoso</button>
          <button type="button" onClick={() => setMatchType('competitive')} className={`w-1/2 py-2 text-sm font-semibold rounded-md transition-colors ${matchType === 'competitive' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>Competitivo</button>
        </div>
      </div>
      
       <div>
        <label className="block text-sm font-medium text-slate-600 mb-2">Visibilidad de la reserva</label>
        <div className="flex rounded-lg border border-slate-300 p-1">
          <button type="button" onClick={() => setVisibility('public')} className={`w-1/2 py-2 text-sm font-semibold rounded-md transition-colors ${visibility === 'public' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>Público</button>
          <button type="button" onClick={() => setVisibility('private')} className={`w-1/2 py-2 text-sm font-semibold rounded-md transition-colors ${visibility === 'private' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>Privado</button>
        </div>
        <p className="text-xs text-slate-500 mt-2">
          {visibility === 'public' ? 'Otros jugadores podrán ver y unirse a tu reserva.' : 'Solo visible para ti. Invita a tus amigos.'}
        </p>
      </div>

      {visibility === 'private' && (
        <div className="space-y-4 p-4 bg-slate-100/70 rounded-lg animate-fade-in">
          <h3 className="font-semibold text-slate-700">Invitar jugadores ({totalPlayers}/4)</h3>
          {currentUser.friends && currentUser.friends.length > 0 && (
             <div className="space-y-2">
                <p className="text-sm font-medium text-slate-600">Amigos</p>
                {currentUser.friends.map(friend => (
                    <label key={friend} className="flex items-center space-x-3 p-2 rounded-md hover:bg-slate-200 cursor-pointer">
                        <input type="checkbox" checked={invitedFriends.includes(friend)} onChange={() => handleFriendInvite(friend)} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"/>
                        <span className="text-sm text-slate-800">{friend}</span>
                    </label>
                ))}
             </div>
          )}
          <div className="space-y-3">
              <p className="text-sm font-medium text-slate-600">Otros jugadores</p>
              {otherPlayers.map((player, index) => (
                <div key={index}>
                  <input type="text" value={player} onChange={(e) => handleOtherPlayerChange(index, e.target.value)} className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder={`Nombre del jugador ${index + 2 + (currentUser.friends?.length || 0)}`} />
                </div>
              ))}
          </div>
        </div>
      )}

      <div>
        <label htmlFor="level" className="block text-sm font-medium text-slate-600 mb-1">
          {matchType === 'casual' ? 'Nivel del partido' : 'Categoría'}
        </label>
        <select id="level" value={level} onChange={(e) => setLevel(e.target.value)} className="w-full bg-slate-100 border border-slate-300 rounded-md py-2.5 px-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500">
          {levelOptions.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-slate-600 mb-1">Notas (opcional)</label>
        <textarea id="notes" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full bg-slate-100 border border-slate-300 rounded-md py-2 px-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Ej: Partido amistoso, llevar bolas nuevas..." />
      </div>
      
      {error && <div className="bg-red-500/10 border border-red-500/30 text-red-600 text-sm rounded-md p-3 text-center animate-fade-in">{error}</div>}

      <button type="submit" disabled={isSubmitting || totalPlayers > 4} className="w-full bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center hover:shadow-lg hover:shadow-indigo-500/30 hover:scale-105 disabled:from-slate-500 disabled:to-slate-400 disabled:hover:scale-100 disabled:cursor-not-allowed">
        {isSubmitting ? 'Procesando reserva...' : (totalPlayers > 4 ? `Demasiados jugadores (${totalPlayers}/4)` : 'Confirmar y Reservar Cancha')}
      </button>
    </form>
  );
};
