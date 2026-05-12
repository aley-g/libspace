import { format } from 'date-fns';

/**
 * Validates if a booking time is in the future.
 * @param {string} bookingDate - Date string in YYYY-MM-DD format
 * @param {string} startTime - Time string in HH:mm format
 * @param {Date} [now] - Current date object (injectable for testing)
 * @returns {boolean} True if the time is valid (future or present), False if in the past.
 */
export const isBookingTimeValid = (bookingDate, startTime, now = new Date()) => {
  const currentDate = format(now, 'yyyy-MM-dd');
  const currentTime = format(now, 'HH:mm');

  // If booking is for today, ensure start time is >= current time
  if (bookingDate === currentDate) {
    return startTime >= currentTime;
  }
  
  // If booking is for a past date, it's invalid
  if (bookingDate < currentDate) {
    return false;
  }

  // Future dates are always valid
  return true;
};
