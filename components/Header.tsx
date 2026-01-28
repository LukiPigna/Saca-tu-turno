
import React, { useState } from 'react';
import { User } from './Auth';
import { Notification } from '../types';
import { Notifications } from './Notifications';

interface HeaderProps {
  user: User;
  onLogout: () => void;
  onProfileClick: () => void;
  notifications: Notification[];
}

export const Header: React.FC<HeaderProps> = ({ user, onLogout, onProfileClick, notifications }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-20 border-b border-slate-200">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.28 12.72a5.83 5.83 0 0 0-8.26-8.26l-3.02 3.02a1 1 0 0 0 0 1.42l1.58 1.58a1 1 0 0 0 1.42 0l1.6-1.6a2.92 2.92 0 1 1 4.12 4.12l-1.6 1.6a1 1 0 0 0 0 1.42l1.58 1.58a1 1 0 0 0 1.42 0z"/><path d="M12 22a4.07 4.07 0 0 0 3-1.28l4-4a4.07 4.07 0 0 0-5.64-5.64l-1.6 1.6a1 1 0 0 0 0 1.42l1.58 1.58a1 1 0 0 0 1.42 0l1.6-1.6a2 2 0 0 1 2.84 2.82l-4.02 4.02A4.07 4.07 0 0 1 12 22z"/></svg>
          <h1 className="text-xl md:text-2xl font-extrabold tracking-tighter text-slate-900">
            <span className="text-indigo-600">P</span>adel <span className="text-indigo-600">I</span>ndoor <span className="text-indigo-600">C</span>lub
          </h1>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="relative">
            <button onClick={() => setShowNotifications(s => !s)} title="Notificaciones" className="p-2 rounded-full hover:bg-slate-200 transition-colors relative">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                )}
            </button>
            {showNotifications && <Notifications notifications={notifications} onClose={() => setShowNotifications(false)} />}
          </div>

          <button onClick={onProfileClick} className="flex items-center space-x-3 p-1 rounded-full hover:bg-slate-200 transition-colors">
            <span className="text-sm font-semibold text-slate-700 hidden sm:block">{user.name}</span>
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full object-cover" />
            ) : (
              <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center font-bold text-indigo-600">
                {user.name.charAt(0)}
              </div>
            )}
          </button>
           <button onClick={onLogout} title="Cerrar sesión" className="p-2 rounded-full hover:bg-slate-200 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};
