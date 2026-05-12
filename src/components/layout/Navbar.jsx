import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useNotificationStore } from '../../store/notificationStore';
import { BookOpen, LogOut, User, LayoutDashboard, Calendar, CalendarCheck, Settings, Bell, CheckCircle2 } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotificationStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
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
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
