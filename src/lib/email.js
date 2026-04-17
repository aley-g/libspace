import emailjs from '@emailjs/browser';

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export const sendBookingConfirmation = async (userEmail, userName, roomName, date, time) => {
  if (!PUBLIC_KEY || PUBLIC_KEY === 'your_public_key') {
    console.log("EmailJS mock: Sending confirmation to", userEmail);
    return true;
  }

  try {
    const templateParams = {
      to_email: userEmail,
      to_name: userName,
      room_name: roomName,
      booking_date: date,
      booking_time: time,
      message: `Your booking for ${roomName} on ${date} at ${time} has been confirmed.`,
    };

    await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
    return true;
  } catch (error) {
    console.error("EmailJS Error:", error);
    return false;
  }
};
