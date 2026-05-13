import { describe, it, expect } from 'vitest';
import { hasTimeOverlap } from './validation';

describe('Booking Time Overlap Validation', () => {
  const existingBookings = [
    { date: '2026-06-15', startTime: '09:00', endTime: '11:00', status: 'confirmed' },
    { date: '2026-06-15', startTime: '13:00', endTime: '15:00', status: 'confirmed' }
  ];

  it('should detect an overlap when new booking falls inside an existing booking', () => {
    const newBooking = { date: '2026-06-15', startTime: '10:00', endTime: '10:30' };
    expect(hasTimeOverlap(existingBookings, newBooking)).toBe(true);
  });

  it('should detect an overlap when new booking encompasses an existing booking', () => {
    const newBooking = { date: '2026-06-15', startTime: '08:00', endTime: '12:00' };
    expect(hasTimeOverlap(existingBookings, newBooking)).toBe(true);
  });

  it('should not detect an overlap for completely different times', () => {
    const newBooking = { date: '2026-06-15', startTime: '11:00', endTime: '12:00' };
    expect(hasTimeOverlap(existingBookings, newBooking)).toBe(false);
  });

  it('should not detect an overlap on different dates', () => {
    const newBooking = { date: '2026-06-16', startTime: '09:00', endTime: '11:00' };
    expect(hasTimeOverlap(existingBookings, newBooking)).toBe(false);
  });
  
  it('should ignore cancelled bookings', () => {
    const cancelledBookings = [
      { date: '2026-06-15', startTime: '09:00', endTime: '11:00', status: 'cancelled' }
    ];
    const newBooking = { date: '2026-06-15', startTime: '09:30', endTime: '10:30' };
    expect(hasTimeOverlap(cancelledBookings, newBooking)).toBe(false);
  });
});
