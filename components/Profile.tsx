
import React, { useState } from 'react';
import { User } from './Auth';

interface ProfileProps {
  user: User;
  onUpdateUser: (updatedUser: User) => void;
  onAddFriend: (friendEmail: string) => void;
  onRemoveFriend: (friendEmail: string) => void;
  onBack: () => void;
}

export const Profile: React.FC<ProfileProps> = ({ user, onUpdateUser, onAddFriend, onRemoveFriend, onBack }) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [avatar, setAvatar] = useState(user.avatar);
  const [newFriendEmail, setNewFriendEmail] = useState('');

  const handleAvatarChange = () => {
    // Simulate file upload and get a new URL
    const newAvatar = `https://i.pravatar.cc/150?u=${Date.now()}`;
    setAvatar(newAvatar);
  };

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({ ...user, name, email, avatar });
  };
  
  const handleAddFriendSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFriendEmail.trim()) {
      onAddFriend(newFriendEmail.trim());
      setNewFriendEmail('');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
         <h2 className="text-3xl font-bold text-slate-800">Mi Perfil</h2>
         <button onClick={onBack} className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver a Reservas
         </button>
      </div>

      {/* Profile Details Card */}
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg">
        <form onSubmit={handleSaveChanges} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 flex flex-col items-center">
            <div className="relative group">
              <img src={avatar || `https://i.pravatar.cc/150?u=${user.email}`} alt={name} className="w-32 h-32 rounded-full object-cover shadow-md mb-4" />
              <button
                type="button"
                onClick={handleAvatarChange}
                className="absolute inset-0 w-full h-full bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                Cambiar
              </button>
            </div>
             <p className="text-lg font-bold text-slate-800">{user.name}</p>
             <p className="text-sm text-slate-500">{user.email}</p>
          </div>
          <div className="md:col-span-2 space-y-4">
             <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-600 mb-1">Nombre completo</label>
              <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className="w-full bg-slate-100 border border-slate-300 rounded-md py-2 px-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
             <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-600 mb-1">Email</label>
              <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-slate-100 border border-slate-300 rounded-md py-2 px-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div className="pt-2">
                <button type="submit" className="w-full md:w-auto bg-indigo-600 text-white font-semibold py-2 px-6 rounded-lg transition hover:bg-indigo-700">Guardar Cambios</button>
            </div>
          </div>
        </form>
      </div>
      
      {/* Friends Card */}
       <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold text-slate-800 mb-4">Mis Amigos</h3>
          <form onSubmit={handleAddFriendSubmit} className="flex items-center space-x-3 mb-6">
            <input type="email" value={newFriendEmail} onChange={e => setNewFriendEmail(e.target.value)} placeholder="Email del amigo" className="flex-grow bg-slate-100 border border-slate-300 rounded-md py-2 px-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            <button type="submit" className="bg-green-500 text-white font-semibold py-2 px-4 rounded-lg transition hover:bg-green-600 flex-shrink-0">Añadir</button>
          </form>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {user.friends && user.friends.length > 0 ? (
                user.friends.map(friendEmail => (
                    <div key={friendEmail} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="flex items-center space-x-3">
                            <img src={`https://i.pravatar.cc/150?u=${friendEmail}`} alt={friendEmail} className="w-10 h-10 rounded-full"/>
                            <span className="text-slate-700 font-medium text-sm">{friendEmail}</span>
                        </div>
                        <button onClick={() => onRemoveFriend(friendEmail)} title="Eliminar amigo" className="text-slate-400 hover:text-red-500 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                        </button>
                    </div>
                ))
            ) : (
                <p className="text-slate-500 text-center py-4 col-span-full">Aún no has añadido a ningún amigo.</p>
            )}
          </div>
       </div>

    </div>
  );
};
