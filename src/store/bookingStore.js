import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { isBefore, isAfter, isEqual, parseISO } from 'date-fns';

export const useBookingStore = create(
  persist(
    (set, get) => ({
      bookings: [],
      
      addBooking: (booking) => {
        const state = get();
        // Conflict resolution: Check if room is already booked for this time
        const newStart = new Date(`${booking.date}T${booking.startTime}`);
        const newEnd = new Date(`${booking.date}T${booking.endTime}`);
        
        const hasConflict = state.bookings.some(b => {
          if (b.roomId !== booking.roomId || b.status === 'cancelled') return false;
          if (b.date !== booking.date) return false;
          
          const existingStart = new Date(`${b.date}T${b.startTime}`);
          const existingEnd = new Date(`${b.date}T${b.endTime}`);
          
          // Check overlap
          return (newStart < existingEnd && newEnd > existingStart);
        });

        if (hasConflict) {
          throw new Error("This room is already booked for the selected time.");
        }

        // Daily limit logic could be added here (e.g., checking user's bookings for the day)

        const newBooking = {
          ...booking,
          id: Date.now().toString(),
          status: 'confirmed',
          createdAt: new Date().toISOString()
        };

        set({ bookings: [...state.bookings, newBooking] });
        return newBooking;
      },
      
      cancelBooking: (id) => set((state) => ({
        bookings: state.bookings.map(b => b.id === id ? { ...b, status: 'cancelled' } : b)
      })),

      getBookingsByUser: (userId) => {
        return get().bookings.filter(b => b.userId === userId);
      },
      
      getBookingsByRoom: (roomId) => {
        return get().bookings.filter(b => b.roomId === roomId);
      }
    }),
    {
      name: 'booking-storage',
    }
  )
);
