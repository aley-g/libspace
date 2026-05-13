import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useNotificationStore } from '../../store/notificationStore';
import { BookOpen, LogOut, User, LayoutDashboard, Calendar, CalendarCheck, Settings, Bell, CheckCircle2, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const { notifications, markAsRead, markAllAsRead } = useNotificationStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const notificationRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter notifications for current user's role
  const userNotifications = notifications.filter(n => !n.targetRoles || n.targetRoles.includes(user?.role));
  const userUnreadCount = userNotifications.filter(n => !n.isRead).length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavLinks = () => {
    const links = [
      { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
    ];

    if (user?.role === 'student' || user?.role === 'librarian') {
      links.push({ name: 'Spaces & Seats', path: '/rooms', icon: <BookOpen size={18} /> });
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
              <Link to="/" className="flex items-center gap-2 text-primary font-bold text-xl" onClick={() => setIsMobileMenuOpen(false)}>
                <BookOpen className="text-primary" />
                <span>CampusDesk</span>
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
              {/* Notification Center */}
              <div className="relative" ref={notificationRef}>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 text-gray-400 hover:text-primary transition-colors relative"
                >
                  <Bell size={20} />
                  {userUnreadCount > 0 && (
                    <span className="absolute top-1 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                      <h3 className="font-bold text-gray-900">Notifications</h3>
                      {userUnreadCount > 0 && (
                        <button onClick={markAllAsRead} className="text-xs font-semibold text-primary hover:text-blue-700 flex items-center gap-1">
                          <CheckCircle2 size={14} /> Mark all read
                        </button>
                      )}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {userNotifications.length === 0 ? (
                        <div className="p-6 text-center text-gray-500 text-sm">
                          You have no notifications.
                        </div>
                      ) : (
                        <div className="divide-y divide-gray-100">
                          {userNotifications.map(notif => (
                            <div 
                              key={notif.id} 
                              className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${!notif.isRead ? 'bg-blue-50/30' : ''}`}
                              onClick={() => {
                                markAsRead(notif.id);
                                if (notif.link) navigate(notif.link);
                                setShowNotifications(false);
                              }}
                            >
                              <div className="flex justify-between items-start mb-1">
                                <span className={`text-xs font-bold uppercase tracking-wider ${notif.type === 'alert' ? 'text-orange-500' : 'text-primary'}`}>
                                  {notif.type}
                                </span>
                                {!notif.isRead && <span className="w-2 h-2 bg-primary rounded-full mt-1"></span>}
                              </div>
                              <p className="text-sm text-gray-800 font-medium">{notif.message}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

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

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden gap-2">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-gray-400 hover:text-primary relative transition-colors"
            >
              <Bell size={24} />
              {userUnreadCount > 0 && <span className="absolute top-1 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-400 hover:text-primary transition-colors"
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden border-t border-gray-200 bg-gray-50/90 backdrop-blur-md animate-in slide-in-from-top-2 shadow-xl absolute w-full left-0 z-40">
          <div className="pt-2 pb-3 space-y-1 px-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-bold transition-colors ${
                  location.pathname.startsWith(link.path)
                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                    : 'text-gray-700 hover:bg-white border border-transparent hover:border-gray-200'
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
          </div>
          <div className="pt-4 pb-6 border-t border-gray-200 px-4 bg-white">
            <div className="flex items-center gap-4 px-2 mb-5">
              <div className="bg-primary/10 p-3 rounded-2xl text-primary">
                <User size={24} />
              </div>
              <div>
                <div className="text-lg font-extrabold text-gray-900">{user?.name}</div>
                <div className="text-sm font-semibold text-gray-500 capitalize">{user?.role?.replace('_', ' ')}</div>
              </div>
            </div>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                handleLogout();
              }}
              className="flex items-center justify-center gap-3 w-full px-4 py-3.5 rounded-xl text-base font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-colors border border-red-100"
            >
              <LogOut size={20} />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
