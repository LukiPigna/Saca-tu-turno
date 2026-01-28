
import { Booking } from '../types';

type BookingData = Omit<Booking, 'id'>;

/**
 * Simulates creating a booking by sending data to a backend.
 *
 * @param bookingDetails - The details of the booking to create.
 * @returns A promise that resolves to an object with success status and the created booking.
 */
export const createBooking = (bookingDetails: BookingData): Promise<{ success: boolean; booking?: Booking; error?: string }> => {
  console.log('Simulating booking creation with data:', bookingDetails);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      if (Math.random() > 0.1) { // 90% success rate
        const newBooking: Booking = {
          ...bookingDetails,
          id: Date.now().toString(), // Simulate unique ID
        };
        console.log('Booking created successfully (simulation).');
        resolve({ success: true, booking: newBooking });
      } else {
        console.error('Booking creation failed (simulation).');
        resolve({ success: false, error: 'La cancha ya fue reservada en este horario. Intenta otro.' });
      }
    }, 1000);
  });
};
