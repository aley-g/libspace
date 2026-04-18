import { describe, it, expect, beforeEach } from 'vitest';
import { useBookingStore } from './bookingStore';

describe('Booking Store Logic', () => {
  // Reset store before each test
  beforeEach(() => {
    useBookingStore.setState({ bookings: [] });
  });

  it('should successfully add a valid booking', () => {
    const bookingStore = useBookingStore.getState();
    const newBooking = {
      roomId: 'r1',
      userId: 'u1',
      date: '2026-04-20',
      startTime: '09:00',
      endTime: '11:00'
    };

    const result = bookingStore.addBooking(newBooking);

    expect(result).toHaveProperty('id');
    expect(result.status).toBe('confirmed');
    expect(useBookingStore.getState().bookings).toHaveLength(1);
    expect(useBookingStore.getState().bookings[0].roomId).toBe('r1');
  });

  it('should throw an error when booking the same room at the exact same time (Conflict)', () => {
    const bookingStore = useBookingStore.getState();
    const newBooking = {
      roomId: 'r1',
      userId: 'u1',
      date: '2026-04-20',
      startTime: '09:00',
      endTime: '11:00'
    };

    bookingStore.addBooking(newBooking);

    // Attempt to book exactly same time
    const conflictBooking = {
      roomId: 'r1',
      userId: 'u2',
      date: '2026-04-20',
      startTime: '09:00',
      endTime: '11:00'
    };

    expect(() => bookingStore.addBooking(conflictBooking)).toThrowError(
      "This room is already booked for the selected time."
    );
  });

  it('should throw an error when booking times overlap (Conflict)', () => {
    const bookingStore = useBookingStore.getState();
    
    // First booking 09:00 - 11:00
    bookingStore.addBooking({
      roomId: 'r1',
      userId: 'u1',
      date: '2026-04-20',
      startTime: '09:00',
      endTime: '11:00'
    });

    // Overlapping booking 10:00 - 12:00
    const overlapBooking = {
      roomId: 'r1',
      userId: 'u2',
      date: '2026-04-20',
      startTime: '10:00',
      endTime: '12:00'
    };

    expect(() => bookingStore.addBooking(overlapBooking)).toThrowError(
      "This room is already booked for the selected time."
    );
  });

  it('should allow booking the same room if the times do not overlap', () => {
    const bookingStore = useBookingStore.getState();
    
    // First booking 09:00 - 11:00
    bookingStore.addBooking({
      roomId: 'r1',
      userId: 'u1',
      date: '2026-04-20',
      startTime: '09:00',
      endTime: '11:00'
    });

    // Valid booking 11:00 - 13:00
    const nextBooking = {
      roomId: 'r1',
      userId: 'u2',
      date: '2026-04-20',
      startTime: '11:00',
      endTime: '13:00'
    };

    expect(() => bookingStore.addBooking(nextBooking)).not.toThrow();
    expect(useBookingStore.getState().bookings).toHaveLength(2);
  });

  it('should allow booking a different room at the same time', () => {
    const bookingStore = useBookingStore.getState();
    
    // First booking Room 1
    bookingStore.addBooking({
      roomId: 'r1',
      userId: 'u1',
      date: '2026-04-20',
      startTime: '09:00',
      endTime: '11:00'
    });

    // Booking Room 2 at the same time
    const differentRoomBooking = {
      roomId: 'r2',
      userId: 'u2',
      date: '2026-04-20',
      startTime: '09:00',
      endTime: '11:00'
    };

    expect(() => bookingStore.addBooking(differentRoomBooking)).not.toThrow();
  });

  it('should allow cancelling a booking and update its status', () => {
    const bookingStore = useBookingStore.getState();
    
    const result = bookingStore.addBooking({
      roomId: 'r1',
      userId: 'u1',
      date: '2026-04-20',
      startTime: '09:00',
      endTime: '11:00'
    });

    bookingStore.cancelBooking(result.id);

    const cancelledBooking = useBookingStore.getState().bookings.find(b => b.id === result.id);
    expect(cancelledBooking.status).toBe('cancelled');
  });

  it('should allow booking an overlapping time if the previous booking is cancelled', () => {
    const bookingStore = useBookingStore.getState();
    
    const firstBooking = bookingStore.addBooking({
      roomId: 'r1',
      userId: 'u1',
      date: '2026-04-20',
      startTime: '09:00',
      endTime: '11:00'
    });

    bookingStore.cancelBooking(firstBooking.id);

    // Now booking the exact same time should work
    const newBooking = {
      roomId: 'r1',
      userId: 'u2',
      date: '2026-04-20',
      startTime: '09:00',
      endTime: '11:00'
    };

    expect(() => bookingStore.addBooking(newBooking)).not.toThrow();
  });
});
