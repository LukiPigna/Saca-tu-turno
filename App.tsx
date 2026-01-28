
import React, { useState, useCallback, useMemo } from 'react';
import { Header } from './components/Header';
import { Calendar } from './components/Calendar';
import { TimeSlotGrid } from './components/TimeSlotGrid';
import { CreateBookingForm, CreateBookingFormData } from './components/CreateBookingForm';
import { ConfirmationModal } from './components/ConfirmationModal';
import { BookingList } from './components/BookingList';
import { AdminDashboard } from './components/AdminDashboard';
import { Auth, User } from './components/Auth';
import { Profile } from './components/Profile';
import { Booking, BookedSlots, Notification } from './types';
import { createBooking } from './services/bookingService';
import { PRICING_OPTIONS, DEFAULT_DURATION } from './constants';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [view, setView] = useState<'list' | 'my-bookings' | 'create' | 'profile'>('list');
  const [bookings, setBookings] = useState<Booking[]>([
    // Dummy data for demonstration
    { id: '1', date: new Date().toISOString().split('T')[0], time: '18:00', duration: 60, organizer: 'Ana Torres', players: ['Ana Torres', 'Jugador 2'], level: 'Intermedio', notes: 'Partido amistoso para pasar el rato.', visibility: 'public', type: 'casual', price: 20 },
    { id: '2', date: new Date().toISOString().split('T')[0], time: '19:00', duration: 90, organizer: 'Luis Fer', players: ['Luis Fer', 'Jugador 2', 'Carlos Ríos'], level: '3ra', notes: '', visibility: 'public', type: 'competitive', price: 28 },
    { id: '3', date: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0], time: '20:00', duration: 60, organizer: 'Marta G.', players: ['Marta G.'], level: 'Iniciación', notes: 'Buscamos gente para empezar!', visibility: 'public', type: 'casual', price: 20 },
    { id: '4', date: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0], time: '18:00', duration: 60, organizer: 'Carlos Ríos', players: ['Carlos Ríos', 'Juan', 'Pedro', 'Santi'], level: 'Intermedio', notes: 'Partido de amigos', visibility: 'private', type: 'casual', price: 25 },
  ]);

  const [pricing, setPricing] = useState(PRICING_OPTIONS);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [lastBooking, setLastBooking] = useState<Booking | null>(null);
  const [creationError, setCreationError] = useState<string | null>(null);

  const addNotification = useCallback((message: string) => {
    const newNotification: Notification = {
      id: Date.now().toString(),
      message,
      timestamp: new Date(),
      read: false,
    };
    setNotifications(prev => [newNotification, ...prev]);
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setView('list');
    addNotification(`¡Bienvenido de nuevo, ${user.name}!`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setView('list');
  };
  
  const handleUpdateUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    alert('¡Perfil actualizado con éxito!');
  };

  const handleAddFriend = (friendEmail: string) => {
    if (!currentUser) return;
    if (currentUser.friends?.includes(friendEmail)) {
        alert('Este usuario ya está en tu lista de amigos.');
        return;
    }
    setCurrentUser(prev => prev ? ({...prev, friends: [...(prev.friends || []), friendEmail] }) : null);
  };

  const handleRemoveFriend = (friendEmail: string) => {
    if (!currentUser) return;
    setCurrentUser(prev => prev ? ({...prev, friends: prev.friends?.filter(f => f !== friendEmail) }) : null);
  };

  const handleDateChange = useCallback((date: Date) => {
    setSelectedDate(date);
    setSelectedTime(null);
  }, []);

  const handleTimeSelect = useCallback((time: string) => {
    setSelectedTime(time);
    setCreationError(null);
  }, []);

  const handleCreateBooking = async (formData: CreateBookingFormData | Booking) => {
    setIsSubmitting(true);
    setCreationError(null);
    
    let newBookingData;
    if ('players' in formData && !('organizer' in formData)) { // Player form
        if (!selectedTime || !currentUser) return;
        const players = formData.visibility === 'private'
            ? [currentUser.name, ...formData.players.filter(p => p.trim() !== '')]
            : [currentUser.name];
        newBookingData = {
            date: selectedDate.toISOString().split('T')[0],
            time: selectedTime,
            duration: DEFAULT_DURATION,
            price: pricing[DEFAULT_DURATION].price,
            level: formData.level,
            notes: formData.notes,
            organizer: currentUser.name,
            players: players,
            visibility: formData.visibility,
            type: formData.type,
        };
    } else { // Admin form
        newBookingData = formData as Omit<Booking, 'id'>;
    }

    const result = await createBooking(newBookingData);

    if (result.success && result.booking) {
      setBookings(prev => [...prev, result.booking!]);
      setLastBooking(result.booking);
      if (currentUser?.role === 'player') {
        setShowConfirmation(true);
        setView('my-bookings');
        addNotification(`Reservaste una cancha para el ${result.booking.date} a las ${result.booking.time}hs.`);
      } else {
        alert('Reserva creada con éxito');
      }
      setSelectedTime(null);
    } else {
      setCreationError(result.error || 'No se pudo crear la reserva.');
    }
    setIsSubmitting(false);
  };
  
  const handleUpdateBooking = (updatedBooking: Booking) => {
    setBookings(prev => prev.map(m => m.id === updatedBooking.id ? updatedBooking : m));
  };
  
  const handleDeleteBooking = (bookingId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta reserva?')) {
        setBookings(prev => prev.filter(m => m.id !== bookingId));
    }
  };

  const handleJoinBooking = (bookingId: string) => {
    if (!currentUser) return;
    const bookingToJoin = bookings.find(m => m.id === bookingId);
    if (!bookingToJoin) return;
    
    setBookings(prevBookings => prevBookings.map(booking => {
      if (booking.id === bookingId && booking.players.length < 4 && !booking.players.includes(currentUser.name)) {
        return { ...booking, players: [...booking.players, currentUser.name] };
      }
      return booking;
    }));
    addNotification(`Te uniste a la reserva de ${bookingToJoin.organizer} a las ${bookingToJoin.time}hs.`);
  };

  const handleLeaveBooking = (bookingId: string) => {
    if (!currentUser) return;
    setBookings(prevBookings => prevBookings.map(booking => {
      if (booking.id === bookingId) {
        return { ...booking, players: booking.players.filter(p => p !== currentUser.name) };
      }
      return booking;
    }));
  };

  const handleKickPlayer = (bookingId: string, playerName: string) => {
     setBookings(prevBookings => prevBookings.map(booking => {
      if (booking.id === bookingId) {
        return { ...booking, players: booking.players.filter(p => p !== playerName) };
      }
      return booking;
    }));
  };
  
  const handleInvitePlayer = (bookingId: string) => {
    const friendName = window.prompt('¿A quién quieres invitar?');
    if (friendName && friendName.trim() !== '') {
       setBookings(prevBookings => prevBookings.map(booking => {
        if (booking.id === bookingId && booking.players.length < 4) {
          return { ...booking, players: [...booking.players, friendName.trim()] };
        }
        return booking;
      }));
    }
  };

  const closeConfirmation = () => {
    setShowConfirmation(false);
    setLastBooking(null);
  };
  
  const handlePricingUpdate = (newPricing: typeof PRICING_OPTIONS) => {
    setPricing(newPricing);
    alert('¡Tarifas actualizadas con éxito!');
  };

  const { publicBookings, myBookings, bookedSlots } = useMemo(() => {
    const bookedSlots: BookedSlots = {};
    const publicBookings: Booking[] = [];
    const myBookings: Booking[] = [];

    for (const booking of bookings) {
      if (!bookedSlots[booking.date]) bookedSlots[booking.date] = [];
      bookedSlots[booking.date].push(booking.time);

      if (currentUser && booking.players.includes(currentUser.name)) {
        myBookings.push(booking);
      }
      if (booking.visibility === 'public') {
        publicBookings.push(booking);
      }
    }
    return { publicBookings, myBookings, bookedSlots };
  }, [bookings, currentUser]);

  if (!currentUser) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header user={currentUser} onLogout={handleLogout} onProfileClick={() => setView('profile')} notifications={notifications} />
      <main className="container mx-auto p-4 md:p-8">
        {currentUser.role === 'owner' ? (
          <AdminDashboard 
            bookings={bookings}
            pricing={pricing}
            onUpdateBooking={handleUpdateBooking}
            onDeleteBooking={handleDeleteBooking}
            onCreateBooking={handleCreateBooking}
            onUpdatePricing={handlePricingUpdate}
          />
        ) : (
          <div className="max-w-4xl mx-auto">
            {view === 'profile' ? (
              <Profile 
                user={currentUser} 
                onUpdateUser={handleUpdateUser} 
                onAddFriend={handleAddFriend}
                onRemoveFriend={handleRemoveFriend}
                onBack={() => setView('list')}
              />
            ) : (
              <>
                <div className="mb-6">
                  <div className="flex border-b border-slate-200 overflow-x-auto">
                    <button onClick={() => setView('list')} className={`px-4 py-3 font-semibold whitespace-nowrap transition-colors duration-200 ${view === 'list' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}>Buscar Reservas</button>
                    <button onClick={() => setView('my-bookings')} className={`px-4 py-3 font-semibold whitespace-nowrap transition-colors duration-200 ${view === 'my-bookings' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}>Mis Reservas</button>
                    <button onClick={() => setView('create')} className={`px-4 py-3 font-semibold whitespace-nowrap transition-colors duration-200 ${view === 'create' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}>Reservar Cancha</button>
                  </div>
                </div>

                {view === 'list' && (
                  <BookingList title="Reservas Abiertas a Jugadores" bookings={publicBookings} onJoinBooking={handleJoinBooking} onLeaveBooking={handleLeaveBooking} onKickPlayer={handleKickPlayer} onInvitePlayer={handleInvitePlayer} currentUser={currentUser} addNotification={addNotification} />
                )}
                
                {view === 'my-bookings' && (
                  <BookingList title="Mis Reservas" bookings={myBookings} onJoinBooking={handleJoinBooking} onLeaveBooking={handleLeaveBooking} onKickPlayer={handleKickPlayer} onInvitePlayer={handleInvitePlayer} currentUser={currentUser} addNotification={addNotification} />
                )}

                {view === 'create' && (
                  <div className="space-y-8 animate-fade-in">
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                      <h2 className="text-xl font-bold text-slate-800 mb-4">1. Elige fecha y hora</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Calendar selectedDate={selectedDate} onDateChange={handleDateChange} />
                        <TimeSlotGrid key={selectedDate.toISOString()} selectedTime={selectedTime} onTimeSelect={handleTimeSelect} bookedSlots={bookedSlots[selectedDate.toISOString().split('T')[0]] || []} />
                      </div>
                    </div>
                    
                    {selectedTime && (
                      <div className="bg-white p-6 rounded-xl shadow-lg animate-fade-in-up">
                        <h2 className="text-xl font-bold text-slate-800 mb-2">2. Completa los detalles</h2>
                         <p className="text-slate-500 mb-6">
                          Reservando para el <span className="font-semibold text-indigo-600">{selectedDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}</span> a las <span className="font-semibold text-indigo-600">{selectedTime} hs</span>.
                        </p>
                        <CreateBookingForm onSubmit={handleCreateBooking} isSubmitting={isSubmitting} error={creationError} currentUser={currentUser} />
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </main>
      {showConfirmation && lastBooking && (
        <ConfirmationModal booking={lastBooking} onClose={closeConfirmation} />
      )}
    </div>
  );
};

export default App;
