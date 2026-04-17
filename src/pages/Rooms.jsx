import { useState } from 'react';
import { useRoomStore } from '../store/roomStore';
import { useAuthStore } from '../store/authStore';
import { useBookingStore } from '../store/bookingStore';
import { Search, Filter, Users, Monitor, Calendar as CalendarIcon, Clock, ChevronRight } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { toast } from 'sonner';

// Fallback images based on room type
const roomImages = {
  study: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
  meeting: 'https://images.unsplash.com/photo-1505409859467-3a796fd5798e?auto=format&fit=crop&w=800&q=80',
  lab: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=800&q=80',
  default: 'https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&w=800&q=80'
};

const Rooms = () => {
  const { rooms } = useRoomStore();
  const { user } = useAuthStore();
  const { addBooking } = useBookingStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookingDate, setBookingDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('11:00');

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || room.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleBook = async (e) => {
    e.preventDefault();
    try {
      addBooking({
        userId: user.id,
        roomId: selectedRoom.id,
        date: bookingDate,
        startTime,
        endTime
      });
      toast.success(`${selectedRoom.name} booked successfully.`);
      setSelectedRoom(null);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="space-y-10">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Library Rooms</h1>
          <p className="text-gray-500 mt-2 text-lg">Find the perfect space for studying or meetings.</p>
        </div>
        
        <div className="flex w-full sm:w-auto gap-3">
          <div className="relative flex-1 sm:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/50" size={20} />
            <input
              type="text"
              placeholder="Search rooms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-gray-700 font-medium placeholder:font-normal"
            />
          </div>
          <div className="relative">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="appearance-none pl-12 pr-10 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-gray-700 font-medium cursor-pointer"
            >
              <option value="all">All Types</option>
              <option value="study">Study Room</option>
              <option value="meeting">Meeting Room</option>
              <option value="lab">Computer Lab</option>
            </select>
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/50" size={20} />
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredRooms.map(room => {
          const image = room.imageUrl || roomImages[room.type] || roomImages.default;
          
          return (
            <div 
              key={room.id} 
              className="group bg-white rounded-[2rem] p-3 shadow-lg shadow-blue-900/5 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300 border border-white"
            >
              <div className="relative h-56 rounded-[1.5rem] overflow-hidden mb-5">
                <img 
                  src={image} 
                  alt={room.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
                
                {/* Badges on Image */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className={`px-3 py-1.5 text-xs font-semibold rounded-full backdrop-blur-md shadow-sm flex items-center ${
                    room.status === 'active' 
                      ? 'bg-white/90 text-primary' 
                      : 'bg-red-500/90 text-white'
                  }`}>
                    {room.status === 'active' ? 'Available' : 'Maintenance'}
                  </span>
                </div>
                
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1.5 text-xs font-semibold rounded-full bg-black/30 backdrop-blur-md text-white capitalize shadow-sm">
                    {room.type}
                  </span>
                </div>
              </div>

              <div className="px-3 pb-3">
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-primary transition-colors">{room.name}</h3>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm font-medium text-gray-600 bg-gray-50 px-3 py-2 rounded-xl">
                    <Users size={18} className="mr-3 text-primary/60" />
                    Capacity: <span className="ml-1 text-gray-900">{room.capacity} Persons</span>
                  </div>
                  <div className="flex items-start text-sm font-medium text-gray-600 bg-gray-50 px-3 py-2 rounded-xl">
                    <Monitor size={18} className="mr-3 mt-0.5 text-primary/60 shrink-0" />
                    <span className="line-clamp-2 leading-relaxed">{room.equipment.join(' • ')}</span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedRoom(room)}
                  disabled={room.status !== 'active'}
                  className="w-full py-3.5 bg-primary text-white rounded-[1.25rem] font-semibold hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center gap-2 group/btn"
                >
                  {room.status === 'active' ? (
                    <>
                      Book Room
                      <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                    </>
                  ) : 'Temporarily Closed'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Booking Modal (Modernized) */}
      {selectedRoom && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] max-w-md w-full p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedRoom.name}</h2>
            <p className="text-base text-gray-500 mb-8">Select a date and time for your reservation.</p>
            
            <form onSubmit={handleBook} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
                <div className="relative">
                  <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={20} />
                  <input
                    type="date"
                    required
                    min={format(new Date(), 'yyyy-MM-dd')}
                    max={format(addDays(new Date(), 14), 'yyyy-MM-dd')}
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none font-medium text-gray-700"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Start Time</label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={20} />
                    <input
                      type="time"
                      required
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none font-medium text-gray-700"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">End Time</label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={20} />
                    <input
                      type="time"
                      required
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none font-medium text-gray-700"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-6 mt-2">
                <button
                  type="button"
                  onClick={() => setSelectedRoom(null)}
                  className="flex-1 py-3.5 bg-gray-100 text-gray-700 rounded-2xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-[2] py-3.5 bg-primary text-white rounded-2xl font-semibold hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 transition-all"
                >
                  Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rooms;
