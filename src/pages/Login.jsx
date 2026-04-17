import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { BookOpen, Mail, Lock, LogIn, UserPlus, Info, User as UserIcon } from 'lucide-react';
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
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Image/Branding (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-black overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1568667256549-094345857637?q=80&w=2000&auto=format&fit=crop" 
          alt="Modern Library" 
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
        
        <div className="relative z-10 flex flex-col justify-end p-16 h-full text-white">
          <div className="mb-8 bg-white/20 backdrop-blur-md w-16 h-16 rounded-2xl flex items-center justify-center">
            <BookOpen size={32} className="text-white" />
          </div>
          <h1 className="text-5xl font-bold tracking-tight mb-4 leading-tight">
            The Space to <br/> Shape Your Future.
          </h1>
          <p className="text-lg text-gray-300 max-w-md leading-relaxed">
            Discover and reserve the perfect study room, meeting space, or computer lab. Everything you need for academic success, right at your fingertips.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24 bg-background">
        <div className="mx-auto w-full max-w-sm lg:max-w-md">
          
          <div className="mb-10 lg:hidden flex justify-center text-primary">
            <BookOpen size={48} strokeWidth={1.5} />
          </div>
          
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
            Welcome to LibSpace
          </h2>
          <p className="text-sm text-gray-500 mb-8">
            Enter your details to access your library account
          </p>

          <div className="flex bg-gray-100 p-1 rounded-xl mb-8">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                isLogin ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                !isLogin ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Create Account
            </button>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-100 p-4 rounded-xl flex items-start gap-3">
              <Info className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 leading-relaxed">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
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
                    className="block w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all sm:text-sm font-medium"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
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
                  className="block w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all sm:text-sm font-medium"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
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
                  className="block w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all sm:text-sm font-medium"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-xl shadow-lg shadow-primary/20 text-sm font-bold text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-4"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : isLogin ? (
                <>
                  <LogIn size={18} />
                  Sign In
                </>
              ) : (
                <>
                  <UserPlus size={18} />
                  Create Account
                </>
              )}
            </button>
          </form>

          {isLogin && (
            <div className="mt-10 pt-8 border-t border-gray-100">
              <h3 className="text-xs uppercase tracking-wider font-bold text-gray-400 mb-4 text-center">
                Demo Accounts
              </h3>
              
              <div className="grid grid-cols-1 gap-3 text-sm text-gray-600 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                <p className="font-medium text-gray-900 mb-1 border-b border-gray-100 pb-2">Password: <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-primary">password123</span></p>
                <div className="flex justify-between items-center group">
                  <span className="font-medium">Student:</span> 
                  <button onClick={() => {setEmail('student@demo.com'); setPassword('password123')}} className="font-mono text-primary group-hover:underline bg-blue-50 px-2 py-1 rounded-md">student@demo.com</button>
                </div>
                <div className="flex justify-between items-center group">
                  <span className="font-medium">Librarian:</span> 
                  <button onClick={() => {setEmail('librarian@demo.com'); setPassword('password123')}} className="font-mono text-emerald-600 group-hover:underline bg-emerald-50 px-2 py-1 rounded-md">librarian@demo.com</button>
                </div>
                <div className="flex justify-between items-center group">
                  <span className="font-medium">Manager:</span> 
                  <button onClick={() => {setEmail('manager@demo.com'); setPassword('password123')}} className="font-mono text-purple-600 group-hover:underline bg-purple-50 px-2 py-1 rounded-md">manager@demo.com</button>
                </div>
              </div>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
};

export default Login;
