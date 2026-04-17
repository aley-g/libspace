import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { BookOpen, LogOut, User, LayoutDashboard, Calendar, CalendarCheck, Settings } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavLinks = () => {
    const links = [
      { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
    ];

    if (user?.role === 'student' || user?.role === 'librarian') {
      links.push({ name: 'Rooms', path: '/rooms', icon: <BookOpen size={18} /> });
    }

    if (user?.role === 'student') {
      links.push({ name: 'My Bookings', path: '/my-bookings', icon: <Calendar size={18} /> });
    }

    if (user?.role === 'librarian') {
      links.push({ name: 'All Bookings', path: '/all-bookings', icon: <CalendarCheck size={18} /> });
    }

    if (user?.role === 'facility_manager') {
      links.push({ name: 'Manage Rooms', path: '/manage-rooms', icon: <Settings size={18} /> });
    }

    return links;
  };

  const navLinks = getNavLinks();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center gap-2 text-primary font-bold text-xl">
                <BookOpen className="text-primary" />
                <span>LibSpace</span>
              </Link>
            </div>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                    location.pathname.startsWith(link.path)
                      ? 'border-primary text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  <span className="mr-2">{link.icon}</span>
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-700 bg-gray-100 px-3 py-1.5 rounded-full">
                <User size={16} />
                <span className="font-medium">{user?.name}</span>
                <span className="text-xs text-gray-500 capitalize">({user?.role?.replace('_', ' ')})</span>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
