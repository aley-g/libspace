import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { BookOpen, Mail, Lock, LogIn, UserPlus, Info, User as UserIcon, Clock, Users, CheckCircle, VolumeX, Star, Quote } from 'lucide-react';
import { toast } from 'sonner';

const Login = () => {
  const navigate = useNavigate();
  const { loginWithEmail, registerWithEmail, user, loading, error } = useAuthStore();
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isLogin) {
      if (!email || !password) {
        toast.error('Please enter email and password.');
        return;
      }
      try {
        await loginWithEmail(email, password);
        toast.success('Successfully signed in!');
        navigate('/dashboard');
      } catch (err) {
        console.error(err);
      }
    } else {
      if (!name || !email || !password) {
        toast.error('Please fill in all fields.');
        return;
      }
      try {
        await registerWithEmail(name, email, password, 'student');
        toast.success('Account created successfully!');
        navigate('/dashboard');
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="flex flex-col bg-white min-h-screen">
      
      {/* 1. Hero Section (Full Width, Vertical) */}
      <div className="relative bg-black pt-28 pb-48 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center">
        <img 
          src="https://images.unsplash.com/photo-1568667256549-094345857637?q=80&w=2000&auto=format&fit=crop" 
          alt="Modern Library" 
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-transparent" />
        
        <div className="relative z-10 w-full max-w-4xl mx-auto">
          <div className="mx-auto mb-8 bg-white/20 backdrop-blur-md w-20 h-20 rounded-3xl flex items-center justify-center shadow-2xl border border-white/10">
            <BookOpen size={40} className="text-white" />
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6 leading-tight">
            The Space to <br className="hidden md:block" /> Shape Your Future.
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Discover and reserve the perfect study room, meeting space, or computer lab. Everything you need for academic success, right at your fingertips.
          </p>
        </div>
      </div>

      {/* 2. Overlapping Login Form */}
      <div className="relative z-20 -mt-32 max-w-xl mx-auto px-4 sm:px-6 w-full mb-24">
        <div className="bg-white rounded-[2rem] shadow-2xl shadow-primary/10 p-8 sm:px-16 sm:py-10 border border-gray-100">
          
          <div className="text-center mb-6">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
              Welcome to CampusDesk
            </h2>
            <p className="text-sm text-gray-500">
              Enter your details to access your library account
            </p>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${
                isLogin ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${
                !isLogin ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Create Account
            </button>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-100 p-4 rounded-xl flex items-start gap-3">
              <Info className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 leading-relaxed font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full pl-12 pr-4 py-3 bg-slate-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all sm:text-sm font-medium"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-12 pr-4 py-3 bg-slate-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all sm:text-sm font-medium"
                  placeholder="name@university.edu"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-12 pr-4 py-3 bg-slate-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all sm:text-sm font-medium"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-xl shadow-lg shadow-primary/30 text-sm font-bold text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-4"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : isLogin ? (
                <>
                  <LogIn size={18} />
                  Sign In to Library
                </>
              ) : (
                <>
                  <UserPlus size={18} />
                  Create Library Account
                </>
              )}
            </button>
          </form>

          {isLogin && (
            <div className="mt-8 pt-6 border-t border-gray-100">
              <h3 className="text-xs uppercase tracking-wider font-extrabold text-gray-400 mb-3 text-center">
                Try Demo Accounts
              </h3>
              
              <div className="grid grid-cols-1 gap-3 text-sm text-gray-600 bg-slate-50 p-5 rounded-2xl border border-gray-100">
                <p className="font-bold text-gray-900 mb-2 border-b border-gray-200 pb-3 text-center">Password for all: <span className="font-mono bg-white px-2 py-1 rounded text-primary border border-gray-200">password123</span></p>
                <div className="flex justify-between items-center group pt-1">
                  <span className="font-bold">Student:</span> 
                  <button onClick={() => {setEmail('student@demo.com'); setPassword('password123')}} className="font-mono font-medium text-primary hover:bg-primary/10 bg-primary/5 px-2.5 py-1.5 rounded-lg transition-colors">student@demo.com</button>
                </div>
                <div className="flex justify-between items-center group mt-1">
                  <span className="font-bold">Librarian:</span> 
                  <button onClick={() => {setEmail('librarian@demo.com'); setPassword('password123')}} className="font-mono font-medium text-emerald-700 hover:bg-emerald-100 bg-emerald-50 px-2.5 py-1.5 rounded-lg transition-colors">librarian@demo.com</button>
                </div>
                <div className="flex justify-between items-center group mt-1">
                  <span className="font-bold">Manager:</span> 
                  <button onClick={() => {setEmail('manager@demo.com'); setPassword('password123')}} className="font-mono font-medium text-purple-700 hover:bg-purple-100 bg-purple-50 px-2.5 py-1.5 rounded-lg transition-colors">manager@demo.com</button>
                </div>
              </div>
            </div>
          )}
          
        </div>
      </div>

      {/* 3. Features Section (Library Specific) */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">Designed for Academic Success</h2>
            <p className="text-lg text-gray-500 font-medium">Everything you need to find focus, collaborate with peers, and make the most of your campus library.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm hover:shadow-lg transition-shadow group">
              <div className="w-16 h-16 rounded-2xl bg-primary/5 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Clock size={32} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-extrabold text-gray-900 mb-3">Real-Time Availability</h3>
              <p className="text-gray-500 leading-relaxed font-medium">Stop wandering the halls. See exactly which rooms and seats are available right now, instantly.</p>
            </div>

            <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm hover:shadow-lg transition-shadow group">
              <div className="w-16 h-16 rounded-2xl bg-primary/5 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <VolumeX size={32} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-extrabold text-gray-900 mb-3">Guaranteed Quiet Zones</h3>
              <p className="text-gray-500 leading-relaxed font-medium">Need deep focus? Filter and reserve individual pods in designated silent areas to prepare for exams.</p>
            </div>

            <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm hover:shadow-lg transition-shadow group">
              <div className="w-16 h-16 rounded-2xl bg-primary/5 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users size={32} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-extrabold text-gray-900 mb-3">Collaborative Spaces</h3>
              <p className="text-gray-500 leading-relaxed font-medium">Easily book group study rooms equipped with whiteboards and monitors for your team projects.</p>
            </div>

            <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm hover:shadow-lg transition-shadow group">
              <div className="w-16 h-16 rounded-2xl bg-primary/5 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <CheckCircle size={32} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-extrabold text-gray-900 mb-3">Instant Confirmation</h3>
              <p className="text-gray-500 leading-relaxed font-medium">Reserve your spot with one click. Our conflict-resolution engine guarantees no double-bookings.</p>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Testimonials Section (Library Specific) */}
      <section className="py-28 bg-slate-50 border-t border-gray-100 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <p className="text-sm font-extrabold tracking-widest text-primary uppercase mb-3">Student Stories</p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">Loved by the Campus</h2>
            <p className="text-lg text-gray-500 font-medium">See how CampusDesk is changing the way students study.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
            
            <div className="bg-white rounded-[2.5rem] p-10 md:p-12 border border-gray-100 shadow-xl shadow-slate-200/50 relative hover:-translate-y-1 transition-transform duration-300">
              <Quote size={100} className="absolute top-10 right-10 text-slate-50 -z-0" strokeWidth={2} />
              <div className="relative z-10">
                <div className="flex gap-1.5 text-primary mb-8">
                  <Star fill="currentColor" size={22} />
                  <Star fill="currentColor" size={22} />
                  <Star fill="currentColor" size={22} />
                  <Star fill="currentColor" size={22} />
                  <Star fill="currentColor" size={22} />
                </div>
                <p className="text-gray-700 italic text-xl leading-relaxed mb-10 font-medium">
                  "Before CampusDesk, finding a group room during finals week was impossible. Now I just check the app, book a room in seconds, and focus purely on studying. The UI is incredibly smooth."
                </p>
                <div className="flex items-center gap-5">
                  <img src="https://i.pravatar.cc/150?img=47" alt="Student" className="w-14 h-14 rounded-full shadow-sm" />
                  <div>
                    <h4 className="font-extrabold text-gray-900 text-lg">Sarah Jenkins</h4>
                    <p className="text-sm text-gray-500 font-semibold">Senior, Computer Science</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-10 md:p-12 border border-gray-100 shadow-xl shadow-slate-200/50 relative hover:-translate-y-1 transition-transform duration-300">
              <Quote size={100} className="absolute top-10 right-10 text-slate-50 -z-0" strokeWidth={2} />
              <div className="relative z-10">
                <div className="flex gap-1.5 text-primary mb-8">
                  <Star fill="currentColor" size={22} />
                  <Star fill="currentColor" size={22} />
                  <Star fill="currentColor" size={22} />
                  <Star fill="currentColor" size={22} />
                  <Star fill="currentColor" size={22} />
                </div>
                <p className="text-gray-700 italic text-xl leading-relaxed mb-10 font-medium">
                  "As a librarian, managing room schedules manually was a nightmare. This system completely automated the process. Double-bookings are a thing of the past. Highly recommended!"
                </p>
                <div className="flex items-center gap-5">
                  <img src="https://i.pravatar.cc/150?img=11" alt="Librarian" className="w-14 h-14 rounded-full shadow-sm" />
                  <div>
                    <h4 className="font-extrabold text-gray-900 text-lg">David Chen</h4>
                    <p className="text-sm text-gray-500 font-semibold">Head Librarian</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default Login;
