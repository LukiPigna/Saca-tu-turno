
import React from 'react';
import { Notification } from '../types';

interface NotificationsProps {
  notifications: Notification[];
  onClose: () => void;
}

export const Notifications: React.FC<NotificationsProps> = ({ notifications, onClose }) => {
  return (
    <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 z-30 animate-fade-in-up">
        <div className="p-4 border-b border-slate-200">
            <h4 className="font-bold text-slate-800">Notificaciones</h4>
        </div>
        <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
                <p className="text-slate-500 text-sm text-center p-6">No tienes notificaciones nuevas.</p>
            ) : (
                notifications.map(notification => (
                    <div key={notification.id} className="p-4 border-b border-slate-100 hover:bg-slate-50">
                        <p className="text-sm text-slate-700">{notification.message}</p>
                        <p className="text-xs text-slate-400 mt-1">
                            {notification.timestamp.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>
                ))
            )}
        </div>
        <div className="p-2 bg-slate-50 rounded-b-xl">
             <button onClick={onClose} className="w-full text-center text-sm font-semibold text-indigo-600 hover:text-indigo-800 py-1">Cerrar</button>
        </div>
    </div>
  );
};
