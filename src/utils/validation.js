export const hasTimeOverlap = (existingBookings, newBooking) => {
  const newStart = new Date(`${newBooking.date}T${newBooking.startTime}`);
  const newEnd = new Date(`${newBooking.date}T${newBooking.endTime}`);
  
  return existingBookings.some(b => {
    if (b.status === 'cancelled') return false;
    if (b.date !== newBooking.date) return false;
    
    const existingStart = new Date(`${b.date}T${b.startTime}`);
    const existingEnd = new Date(`${b.date}T${b.endTime}`);
    
    return (newStart < existingEnd && newEnd > existingStart);
  });
};
