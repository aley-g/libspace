import { useBookingStore } from '../store/bookingStore';
import { useAuthStore } from '../store/authStore';
import { useRoomStore } from '../store/roomStore';
import { format, parseISO } from 'date-fns';
import { Calendar, Clock, MapPin, XCircle } from 'lucide-react';
import { toast } from 'sonner';

const MyBookings = () => {
  const { user } = useAuthStore();
  const { getBookingsByUser, cancelBooking } = useBookingStore();
  const { rooms } = useRoomStore();

  const userBookings = getBookingsByUser(user.id).sort((a, b) => 
    new Date(`${b.date}T${b.startTime}`) - new Date(`${a.date}T${a.startTime}`)
  );

  const handleCancel = (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      cancelBooking(bookingId);
      toast.success('Booking cancelled successfully');
    }
  };

  const getRoom = (roomId) => rooms.find(r => r.id === roomId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
        <p className="text-gray-500 mt-1">Manage your upcoming and past library reservations.</p>
      </div>

      {userBookings.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-gray-100 shadow-sm">
          <Calendar className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No bookings found</h3>
          <p className="text-gray-500 mt-2">You haven't made any room reservations yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userBookings.map(booking => {
            const room = getRoom(booking.roomId);
            const isUpcoming = new Date(`${booking.date}T${booking.endTime}`) > new Date();
            const isActive = booking.status === 'confirmed';

            return (
              <div 
                key={booking.id} 
                className={`bg-white rounded-2xl p-6 shadow-sm border transition-all ${
                  isActive ? 'border-gray-200' : 'border-red-100 opacity-75'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                    booking.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {booking.status === 'confirmed' ? 'Confirmed' : 'Cancelled'}
                  </span>
                  {isActive && isUpcoming && (
                    <button
                      onClick={() => handleCancel(booking.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      title="Cancel Booking"
                    >
                      <XCircle size={20} />
                    </button>
                  )}
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {room ? room.name : 'Unknown Room'}
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar size={16} className="mr-3 text-gray-400" />
                    {format(parseISO(booking.date), 'EEEE, MMMM d, yyyy')}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock size={16} className="mr-3 text-gray-400" />
                    {booking.startTime} - {booking.endTime}
                  </div>
                  {room && (
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin size={16} className="mr-3 text-gray-400" />
                      <span className="capitalize">{room.type} Room</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
