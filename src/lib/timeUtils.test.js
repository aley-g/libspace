import { describe, it, expect } from 'vitest';
import { isBookingTimeValid } from './timeUtils';

describe('isBookingTimeValid Utility', () => {
  it('should allow booking for a future date', () => {
    // Current date is 2026-05-10 12:00
    const now = new Date('2026-05-10T12:00:00');
    expect(isBookingTimeValid('2026-05-11', '09:00', now)).toBe(true);
  });

  it('should allow booking for today but a future time', () => {
    const now = new Date('2026-05-10T12:00:00');
    expect(isBookingTimeValid('2026-05-10', '13:00', now)).toBe(true);
  });

  it('should REJECT booking for today but a past time', () => {
    const now = new Date('2026-05-10T12:00:00');
    expect(isBookingTimeValid('2026-05-10', '11:00', now)).toBe(false);
  });

  it('should REJECT booking for a past date', () => {
    const now = new Date('2026-05-10T12:00:00');
    expect(isBookingTimeValid('2026-05-09', '15:00', now)).toBe(false);
  });
});
