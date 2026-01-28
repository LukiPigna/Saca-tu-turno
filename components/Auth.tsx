
import React, { useState } from 'react';

export interface User {
  name: string;
  email: string;
  password?: string;
  role: 'player' | 'owner';
  avatar?: string;
  friends?: string[];
}

// Simulate a database of users
const usersDB: { [email: string]: User } = {
  'carlos@rios.com': { 
    name: 'Carlos Ríos', 
    email: 'carlos@rios.com', 
    password: 'password123',
    role: 'owner',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    friends: ['ana@torres.com', 'luis@fer.com']
  },
  'ana@torres.com': { 
      name: 'Ana Torres', email: 'ana@torres.com', password: 'password123', role: 'player', 
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      friends: ['carlos@rios.com'] 
    },
  'luis@fer.com': { 
      name: 'Luis Fer', email: 'luis@fer.com', password: 'password123', role: 'player', 
      avatar: 'https://randomuser.me/api/portraits/men/46.jpg',
      friends: []
    },
  'marta@g.com': { 
      name: 'Marta G.', email: 'marta@g.com', password: 'password123', role: 'player', 
      avatar: 'https://randomuser.me/api/portraits/women/47.jpg',
      friends: [] 
    },
   'juan@p.com': { 
      name: 'Juan Pérez', email: 'juan@p.com', password: 'password123', role: 'player', 
      avatar: 'https://randomuser.me/api/portraits/men/50.jpg',
      friends: [] 
    },
};


interface AuthProps {
  onLogin: (user: User) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    setTimeout(() => {
      if (isLogin) {
        const user = usersDB[email];
        if (user && user.password === password) {
          onLogin(user);
        } else {
          setError('Email o contraseña incorrectos.');
        }
      } else { // Register
        if (usersDB[email]) {
          setError('Este email ya está registrado.');
        } else if (!name || !email || !password) {
          setError('Por favor, completa todos los campos.');
        } else {
          const newUser: User = { 
            name, 
            email, 
            password,
            role: 'player', // New users are always players
            friends: [],
            avatar: `https://i.pravatar.cc/150?u=${email}` // Generate a random avatar
          };
          usersDB[email] = newUser;
          onLogin(newUser);
        }
      }
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl flex flex-col md:flex-row bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
        {/* Left Side - Image */}
        <div className="hidden md:block md:w-1/2 relative">
           <img src="https://images.unsplash.com/photo-1614008583226-358838059187?q=80&w=1887&auto=format&fit=crop" alt="Padel court" className="absolute h-full w-full object-cover" />
           <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
           <div className="absolute bottom-8 left-8 text-white">
                <h2 className="text-3xl font-bold">Bienvenido a</h2>
                <h1 className="text-4xl font-extrabold tracking-tighter text-white">
                    <span className="text-indigo-400">P</span>adel <span className="text-indigo-400">I</span>ndoor <span className="text-indigo-400">C</span>lub
                </h1>
                <p className="mt-2 max-w-sm">Tu lugar para conectar, competir y disfrutar del pádel.</p>
           </div>
        </div>
        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
            <div className="w-full max-w-sm mx-auto">
                 <div className="flex items-center mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mr-3 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.28 12.72a5.83 5.83 0 0 0-8.26-8.26l-3.02 3.02a1 1 0 0 0 0 1.42l1.58 1.58a1 1 0 0 0 1.42 0l1.6-1.6a2.92 2.92 0 1 1 4.12 4.12l-1.6 1.6a1 1 0 0 0 0 1.42l1.58 1.58a1 1 0 0 0 1.42 0z"/><path d="M12 22a4.07 4.07 0 0 0 3-1.28l4-4a4.07 4.07 0 0 0-5.64-5.64l-1.6 1.6a1 1 0 0 0 0 1.42l1.58 1.58a1 1 0 0 0 1.42 0l1.6-1.6a2 2 0 0 1 2.84 2.82l-4.02 4.02A4.07 4.07 0 0 1 12 22z"/></svg>
                    <h2 className="text-2xl font-bold text-slate-800">{isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}</h2>
                 </div>

                <div className="flex rounded-lg border border-slate-300 p-1 mb-6">
                    <button type="button" onClick={() => setIsLogin(true)} className={`w-1/2 py-2 text-sm font-semibold rounded-md transition-colors ${isLogin ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>Ingresar</button>
                    <button type="button" onClick={() => setIsLogin(false)} className={`w-1/2 py-2 text-sm font-semibold rounded-md transition-colors ${!isLogin ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>Registrarse</button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                         <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg></span>
                            <input type="text" placeholder="Nombre completo" value={name} onChange={e => setName(e.target.value)} className="w-full pl-10 pr-3 py-2 bg-slate-800 text-white border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-400" />
                        </div>
                    )}
                    <div className="relative">
                         <span className="absolute inset-y-0 left-0 flex items-center pl-3"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" viewBox="0 0 20 20" fill="currentColor"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg></span>
                        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full pl-10 pr-3 py-2 bg-slate-800 text-white border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-400" />
                    </div>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg></span>
                        <input type={showPassword ? 'text' : 'password'} placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} className="w-full pl-10 pr-10 py-2 bg-slate-800 text-white border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-400" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-white">
                            {showPassword ? 
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074L3.707 2.293zM10 12a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /><path d="M2 10s3.923-6 8-6 8 6 8 6-3.923 6-8 6-8-6-8-6zm4.828-2.172A4 4 0 0110 6a4 4 0 013.172 1.828l-1.558 1.558a2 2 0 00-2.828 0L6.828 7.828z" /></svg> :
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
                            }
                        </button>
                    </div>
                    
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                    <button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center hover:shadow-lg hover:shadow-indigo-500/30 disabled:from-slate-500 disabled:to-slate-400 disabled:cursor-not-allowed">
                        {isSubmitting ? 'Procesando...' : (isLogin ? 'Ingresar' : 'Crear Cuenta')}
                    </button>
                    {isLogin && <a href="#" className="block text-center text-sm text-indigo-600 hover:underline mt-2">¿Olvidaste tu contraseña?</a>}
                </form>
                
                <div className="flex items-center my-6">
                    <hr className="flex-grow border-t border-slate-300" />
                    <span className="mx-4 text-slate-500 text-sm">o continuar con</span>
                    <hr className="flex-grow border-t border-slate-300" />
                </div>
                
                <button className="w-full flex items-center justify-center py-2 px-4 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors">
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path><path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"></path><path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.222 0-9.618-3.226-11.283-7.662l-6.522 5.025C9.505 39.556 16.227 44 24 44z"></path><path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.012 36.49 44 30.65 44 24c0-1.341-.138-2.65-.389-3.917z"></path></svg>
                    Google
                </button>

            </div>
        </div>
      </div>
    </div>
  );
};
