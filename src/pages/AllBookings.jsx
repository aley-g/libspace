import { useState } from 'react';
import { useBookingStore } from '../store/bookingStore';
import { useRoomStore } from '../store/roomStore';
import { format, parseISO } from 'date-fns';
import { Search, Calendar, Clock, MapPin, XCircle, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const AllBookings = () => {
  const { bookings, cancelBooking, markAsNoShow, markAsCompleted } = useBookingStore();
  const { rooms } = useRoomStore();
  const [searchTerm, setSearchTerm] = useState('');

  const getStatusColor = (status) => {
    switch(status) {
      case 'confirmed': return 'bg-blue-100 text-blue-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'no-show': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Sort bookings by newest date first
  const allBookings = [...bookings].sort((a, b) => 
    new Date(`${b.date}T${b.startTime}`) - new Date(`${a.date}T${a.startTime}`)
  );

  const filteredBookings = allBookings.filter(booking => {
    const room = rooms.find(r => r.id === booking.roomId);
    const searchString = `${room?.name} ${booking.userId}`.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  const handleCancel = (bookingId) => {
    if (window.confirm('As a librarian, you are about to cancel this booking. Proceed?')) {
      cancelBooking(bookingId);
      toast.success('Booking cancelled successfully');
    }
  };

  const handleNoShow = (bookingId) => {
    if (window.confirm('Mark this booking as No-Show?')) {
      markAsNoShow(bookingId);
      toast.success('Booking marked as No-Show');
    }
  };

  const handleCompleted = (bookingId) => {
    if (window.confirm('Mark this booking as Completed?')) {
      markAsCompleted(bookingId);
      toast.success('Booking marked as Completed');
    }
  };

  const getRoom = (roomId) => rooms.find(r => r.id === roomId);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Bookings</h1>
          <p className="text-gray-500 mt-1">Manage and oversee all library reservations.</p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by room name or user ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-700 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Room</th>
                <th className="px-6 py-4">User ID</th>
                <th className="px-6 py-4">Date & Time</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    No bookings found matching your search.
                  </td>
                </tr>
              ) : (
                filteredBookings.map(booking => {
                  const room = getRoom(booking.roomId);
                  const isUpcoming = new Date(`${booking.date}T${booking.startTime}`) > new Date();
                  const isActive = booking.status === 'confirmed';

                  return (
                    <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(booking.status)}`}>
                          {booking.status.replace('-', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {room ? room.name : 'Unknown Room'}
                      </td>
                      <td className="px-6 py-4">
                        {booking.userId}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-gray-400" />
                          <span>{format(parseISO(booking.date), 'MMM d, yyyy')}</span>
                          <span className="text-gray-300">|</span>
                          <Clock size={14} className="text-gray-400" />
                          <span>{booking.startTime} - {booking.endTime}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {isActive && isUpcoming && (
                          <button
                            onClick={() => handleCancel(booking.id)}
                            className="text-red-500 hover:text-red-700 transition-colors inline-flex items-center gap-1 text-xs font-medium bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg"
                          >
                            <Trash2 size={14} />
                            Cancel
                          </button>
                        )}
                        {isActive && !isUpcoming && (
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleCompleted(booking.id)}
                              className="text-green-600 hover:text-green-700 transition-colors inline-flex items-center gap-1 text-xs font-medium bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-lg"
                            >
                              Completed
                            </button>
                            <button
                              onClick={() => handleNoShow(booking.id)}
                              className="text-orange-600 hover:text-orange-700 transition-colors inline-flex items-center gap-1 text-xs font-medium bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-lg"
                            >
                              No-Show
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllBookings;
