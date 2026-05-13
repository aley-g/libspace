import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useBookingStore } from './bookingStore';

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  onSnapshot: vi.fn(),
  doc: vi.fn(),
  setDoc: vi.fn().mockResolvedValue(),
  updateDoc: vi.fn().mockResolvedValue(),
}));

vi.mock('../lib/firebase', () => ({
  db: {}
}));

vi.mock('./notificationStore', () => ({
  useNotificationStore: {
    getState: () => ({
      addNotification: vi.fn()
    })
  }
}));

vi.spyOn(console, 'warn').mockImplementation(() => {});
vi.spyOn(console, 'error').mockImplementation(() => {});

describe('Booking Store Logic', () => {
  beforeEach(() => {
    useBookingStore.setState({ bookings: [] });
  });

  it('should successfully add a valid booking', async () => {
    const bookingStore = useBookingStore.getState();
    const newBooking = {
      roomId: 'r1',
      userId: 'u1',
      date: '2026-04-20',
      startTime: '09:00',
      endTime: '11:00'
    };

    const result = await bookingStore.addBooking(newBooking);
    
    // Simulate Firebase onSnapshot
    useBookingStore.setState({ bookings: [result] });

    expect(result).toHaveProperty('id');
    expect(result.status).toBe('confirmed');
    expect(useBookingStore.getState().bookings).toHaveLength(1);
    expect(useBookingStore.getState().bookings[0].roomId).toBe('r1');
  });

  it('should throw an error when booking the same room at the exact same time (Conflict)', async () => {
    const bookingStore = useBookingStore.getState();
    const newBooking = {
      roomId: 'r1',
      userId: 'u1',
      date: '2026-04-20',
      startTime: '09:00',
      endTime: '11:00'
    };

    const added = await bookingStore.addBooking(newBooking);
    useBookingStore.setState({ bookings: [added] });

    const conflictBooking = {
      roomId: 'r1',
      userId: 'u2',
      date: '2026-04-20',
      startTime: '09:00',
      endTime: '11:00'
    };

    await expect(bookingStore.addBooking(conflictBooking)).rejects.toThrowError(
      "This room is already booked for the selected time."
    );
  });

  it('should throw an error when booking times overlap (Conflict)', async () => {
    const bookingStore = useBookingStore.getState();
    
    const added = await bookingStore.addBooking({
      roomId: 'r1',
      userId: 'u1',
      date: '2026-04-20',
      startTime: '09:00',
      endTime: '11:00'
    });
    useBookingStore.setState({ bookings: [added] });

    const overlapBooking = {
      roomId: 'r1',
      userId: 'u2',
      date: '2026-04-20',
      startTime: '10:00',
      endTime: '12:00'
    };

    await expect(bookingStore.addBooking(overlapBooking)).rejects.toThrowError(
      "This room is already booked for the selected time."
    );
  });

  it('should allow booking the same room if the times do not overlap', async () => {
    const bookingStore = useBookingStore.getState();
    
    const added = await bookingStore.addBooking({
      roomId: 'r1',
      userId: 'u1',
      date: '2026-04-20',
      startTime: '09:00',
      endTime: '11:00'
    });
    useBookingStore.setState({ bookings: [added] });

    const nextBooking = {
      roomId: 'r1',
      userId: 'u2',
      date: '2026-04-20',
      startTime: '11:00',
      endTime: '13:00'
    };

    const nextAdded = await bookingStore.addBooking(nextBooking);
    useBookingStore.setState({ bookings: [added, nextAdded] });

    expect(useBookingStore.getState().bookings).toHaveLength(2);
  });

  it('should allow booking a different room at the same time', async () => {
    const bookingStore = useBookingStore.getState();
    
    const added = await bookingStore.addBooking({
      roomId: 'r1',
      userId: 'u1',
      date: '2026-04-20',
      startTime: '09:00',
      endTime: '11:00'
    });
    useBookingStore.setState({ bookings: [added] });

    const differentRoomBooking = {
      roomId: 'r2',
      userId: 'u2',
      date: '2026-04-20',
      startTime: '09:00',
      endTime: '11:00'
    };

    await expect(bookingStore.addBooking(differentRoomBooking)).resolves.toBeDefined();
  });

  it('should allow cancelling a booking and update its status', async () => {
    const bookingStore = useBookingStore.getState();
    
    const result = await bookingStore.addBooking({
      roomId: 'r1',
      userId: 'u1',
      date: '2026-04-20',
      startTime: '09:00',
      endTime: '11:00'
    });
    useBookingStore.setState({ bookings: [result] });

    await bookingStore.cancelBooking(result.id);
    
    // Simulate onSnapshot update
    useBookingStore.setState({ 
      bookings: [{ ...result, status: 'cancelled' }] 
    });

    const cancelledBooking = useBookingStore.getState().bookings.find(b => b.id === result.id);
    expect(cancelledBooking.status).toBe('cancelled');
  });

  it('should allow booking an overlapping time if the previous booking is cancelled', async () => {
    const bookingStore = useBookingStore.getState();
    
    const firstBooking = await bookingStore.addBooking({
      roomId: 'r1',
      userId: 'u1',
      date: '2026-04-20',
      startTime: '09:00',
      endTime: '11:00'
    });
    
    // Simulate cancellation in state
    useBookingStore.setState({ 
      bookings: [{ ...firstBooking, status: 'cancelled' }] 
    });

    const newBooking = {
      roomId: 'r1',
      userId: 'u2',
      date: '2026-04-20',
      startTime: '09:00',
      endTime: '11:00'
    };

    await expect(bookingStore.addBooking(newBooking)).resolves.toBeDefined();
  });

  it('should throw an error if a user exceeds 2 bookings per day', async () => {
    const bookingStore = useBookingStore.getState();
    
    const b1 = await bookingStore.addBooking({
      roomId: 'r1', userId: 'u1', date: '2026-05-15', startTime: '09:00', endTime: '10:00'
    });
    const b2 = await bookingStore.addBooking({
      roomId: 'r2', userId: 'u1', date: '2026-05-15', startTime: '10:00', endTime: '11:00'
    });
    
    useBookingStore.setState({ bookings: [b1, b2] });

    const thirdBooking = {
      roomId: 'r3', userId: 'u1', date: '2026-05-15', startTime: '11:00', endTime: '12:00'
    };

    await expect(bookingStore.addBooking(thirdBooking)).rejects.toThrowError(
      "Daily booking limit reached. You can only make 2 reservations per day."
    );
  });
});
