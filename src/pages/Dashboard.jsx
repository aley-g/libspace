import { useAuthStore } from '../store/authStore';
import { useBookingStore } from '../store/bookingStore';
import { useRoomStore } from '../store/roomStore';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, BookOpen, Clock, CalendarCheck, MapPin, ArrowRight, Zap, Coffee } from 'lucide-react';
import { isAfter, parseISO } from 'date-fns';

const Dashboard = () => {
  const { user } = useAuthStore();
  const { bookings } = useBookingStore();
  const { rooms } = useRoomStore();
  const navigate = useNavigate();

  // Statistics calculations
  const totalBookings = bookings.length;
  const activeRooms = rooms.filter(r => r.status === 'active').length;
  
  // Student Specific Calculations
  const myBookings = bookings.filter(b => b.userId === user?.id);
  const upcomingBookings = myBookings
    .filter(b => isAfter(parseISO(`${b.date}T${b.startTime}`), new Date()))
    .sort((a, b) => new Date(`${a.date}T${a.startTime}`) - new Date(`${b.date}T${b.startTime}`));
  
  const nextBooking = upcomingBookings[0];
  
  // Available Rooms (Randomly pick some active ones for the widget)
  const availableNow = rooms.filter(r => r.status === 'active').slice(0, 3);

  // Chart Data: Bookings by Room Type
  const bookingsByType = rooms.reduce((acc, room) => {
    const count = bookings.filter(b => b.roomId === room.id).length;
    if (count > 0) {
      acc.push({ name: room.type, value: count });
    }
    return acc;
  }, []);

  const COLORS = ['#1e3a8a', '#3b82f6', '#93c5fd', '#bfdbfe'];

  // Chart Data: Most booked rooms
  const topRooms = rooms.map(room => {
    return {
      name: room.name,
      bookings: bookings.filter(b => b.roomId === room.id).length
    };
  }).sort((a, b) => b.bookings - a.bookings).slice(0, 5);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Header Banner */}
      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{getGreeting()}, {user?.name?.split(' ')[0]}! 👋</h1>
          <p className="text-gray-500 mt-2 text-lg">Here's your library overview for today.</p>
        </div>
        <div className="bg-primary/10 text-primary px-5 py-2.5 rounded-xl font-bold capitalize shadow-sm border border-primary/10 relative z-10">
          Role: {user?.role?.replace('_', ' ')}
        </div>
      </div>

      {user?.role === 'student' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Column - Next Booking & Quick Actions */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Next Booking Ticket */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CalendarCheck className="text-primary" /> Your Next Reservation
              </h2>
              {nextBooking ? (
                <div className="bg-gradient-to-br from-primary to-blue-800 rounded-[2rem] p-1 shadow-lg shadow-blue-900/10">
                  <div className="bg-white rounded-[1.8rem] p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-center gap-6">
                    <div className="flex-1">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50 text-primary text-sm font-bold mb-4">
                        <Clock size={16} /> Upcoming Soon
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">{rooms.find(r => r.id === nextBooking.roomId)?.name || 'Study Room'}</h3>
                      <p className="text-gray-500 mt-1 flex items-center gap-2">
                        <CalendarCheck size={18} /> {nextBooking.date}
                      </p>
                    </div>
                    <div className="w-full sm:w-auto bg-gray-50 rounded-2xl p-5 border border-gray-100 text-center sm:text-right flex flex-row sm:flex-col justify-between items-center sm:items-end">
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Time</p>
                        <p className="text-xl font-extrabold text-gray-900">{nextBooking.startTime}</p>
                      </div>
                      <div className="h-px w-8 bg-gray-200 my-2 hidden sm:block" />
                      <div className="w-px h-8 bg-gray-200 mx-4 sm:hidden block" />
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Until</p>
                        <p className="text-xl font-extrabold text-gray-500">{nextBooking.endTime}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-[2rem] p-10 border border-gray-100 shadow-sm text-center flex flex-col items-center justify-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-400">
                    <Coffee size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No upcoming bookings</h3>
                  <p className="text-gray-500 mb-6">You don't have any reservations scheduled.</p>
                  <button 
                    onClick={() => navigate('/rooms')}
                    className="px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors flex items-center gap-2"
                  >
                    Find a Room <ArrowRight size={18} />
                  </button>
                </div>
              )}
            </div>

            {/* Quick Available Rooms */}
            <div>
              <div className="flex justify-between items-end mb-4">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Zap className="text-amber-500" /> Available Right Now
                </h2>
                <button onClick={() => navigate('/rooms')} className="text-sm font-semibold text-primary hover:underline flex items-center gap-1">
                  View All <ArrowRight size={16} />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableNow.map(room => (
                  <div key={room.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/rooms')}>
                    <div className="flex justify-between items-start mb-3">
                      <div className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">Free</div>
                      <Users size={16} className="text-gray-400" />
                    </div>
                    <h4 className="font-bold text-gray-900">{room.name}</h4>
                    <p className="text-sm text-gray-500 mt-1 capitalize">{room.type} • {room.capacity} Seats</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Stats & Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-6">Library Status</h3>
              
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-primary flex items-center justify-center">
                    <BookOpen size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-500">Active Rooms</p>
                    <p className="text-xl font-extrabold text-gray-900">{activeRooms} <span className="text-sm font-medium text-gray-400">/ {rooms.length}</span></p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-500">Your Total Bookings</p>
                    <p className="text-xl font-extrabold text-gray-900">{myBookings.length}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-900 to-slate-800 rounded-[2rem] p-8 text-white relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 opacity-10">
                <BookOpen size={120} />
              </div>
              <h3 className="text-lg font-bold mb-2 relative z-10">Need a quiet space?</h3>
              <p className="text-sm text-gray-300 mb-6 relative z-10 leading-relaxed">
                Study rooms are highly requested during exam weeks. Make sure to book up to 14 days in advance!
              </p>
              <button onClick={() => navigate('/rooms')} className="w-full py-3 bg-white text-gray-900 font-bold rounded-xl hover:bg-gray-100 transition-colors relative z-10">
                Book Now
              </button>
            </div>
          </div>

        </div>
      )}

      {(user?.role === 'librarian' || user?.role === 'facility_manager') && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="bg-blue-50 p-4 rounded-2xl text-primary">
                <CalendarCheck size={28} />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-semibold mb-1">Total Bookings</p>
                <p className="text-3xl font-extrabold text-gray-900">{totalBookings}</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="bg-green-50 p-4 rounded-2xl text-green-600">
                <BookOpen size={28} />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-semibold mb-1">Active Rooms</p>
                <p className="text-3xl font-extrabold text-gray-900">{activeRooms} <span className="text-lg text-gray-400">/ {rooms.length}</span></p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Bar Chart */}
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
              <h3 className="font-bold text-xl text-gray-900 mb-8">Most Booked Rooms</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topRooms} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: '#64748b' }} tickLine={false} axisLine={false} />
                    <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="bookings" fill="#1e3a8a" radius={[6, 6, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pie Chart */}
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
              <h3 className="font-bold text-xl text-gray-900 mb-8">Bookings by Room Type</h3>
              <div className="h-80 flex flex-col justify-center">
                <ResponsiveContainer width="100%" height="70%">
                  <PieChart>
                    <Pie
                      data={bookingsByType}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {bookingsByType.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-6 mt-8">
                  {bookingsByType.map((entry, index) => (
                    <div key={entry.name} className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                      <span className="capitalize">{entry.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
