import { create } from 'zustand';
import { collection, onSnapshot, doc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useNotificationStore } from './notificationStore';

export const useBookingStore = create((set, get) => ({
  bookings: [],
  listenToBookings: () => {
    const bookingsRef = collection(db, 'bookings');

    const unsubscribe = onSnapshot(bookingsRef, (snapshot) => {
      const bookingsData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      set({ bookings: bookingsData });
    });

    return unsubscribe;
  },
  
  addBooking: async (booking) => {
    const state = get();
    // Conflict resolution
    const newStart = new Date(`${booking.date}T${booking.startTime}`);
    const newEnd = new Date(`${booking.date}T${booking.endTime}`);
    
    const hasConflict = state.bookings.some(b => {
      if (b.roomId !== booking.roomId || b.status === 'cancelled') return false;
      if (b.date !== booking.date) return false;
      
      const existingStart = new Date(`${b.date}T${b.startTime}`);
      const existingEnd = new Date(`${b.date}T${b.endTime}`);
      
      return (newStart < existingEnd && newEnd > existingStart);
    });

    if (hasConflict) {
      throw new Error("This room is already booked for the selected time.");
    }

    // User time overlap conflict
    const hasUserTimeConflict = state.bookings.some(b => {
      if (b.userId !== booking.userId || b.status === 'cancelled') return false;
      if (b.date !== booking.date) return false;
      
      const existingStart = new Date(`${b.date}T${b.startTime}`);
      const existingEnd = new Date(`${b.date}T${b.endTime}`);
      
      return (newStart < existingEnd && newEnd > existingStart);
    });

    if (hasUserTimeConflict) {
      throw new Error("You already have a reservation at this time in another room.");
    }

    // Daily limit
    const userBookingsThatDay = state.bookings.filter(b => 
      b.userId === booking.userId && 
      b.date === booking.date && 
      b.status !== 'cancelled'
    );

    if (userBookingsThatDay.length >= 2) {
      throw new Error("Daily booking limit reached. You can only make 2 reservations per day.");
    }

    const id = Date.now().toString();
    const newBooking = {
      ...booking,
      id,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };

    // Firebase set
    await setDoc(doc(db, 'bookings', id), newBooking);

    // Notify librarians
    useNotificationStore.getState().addNotification({
      type: 'booking',
      message: `New booking created for room ${booking.roomId} on ${booking.date}`,
      targetRoles: ['librarian'],
      link: '/all-bookings'
    });

    return newBooking;
  },
  
  cancelBooking: async (id) => {
    await updateDoc(doc(db, 'bookings', id), { status: 'cancelled' });
  },

  markAsNoShow: async (id) => {
    await updateDoc(doc(db, 'bookings', id), { status: 'no-show' });
  },

  markAsCompleted: async (id) => {
    await updateDoc(doc(db, 'bookings', id), { status: 'completed' });
  },

  getBookingsByUser: (userId) => {
    return get().bookings.filter(b => b.userId === userId);
  },
  
  getBookingsByRoom: (roomId) => {
    return get().bookings.filter(b => b.roomId === roomId);
  }
}));
