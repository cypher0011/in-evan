import { getHotelContext } from '@/lib/utils/hotel-context';
import { validateHotel, validateToken } from '@/lib/utils/validation';
import { redirect } from 'next/navigation';
import BookingDetailsView from './BookingDetailsView';

/**
 * Booking Details Page - Third step in check-in flow
 * Shows room information and available upgrade plans
 * Route: /c/[token]/booking-details
 */

export const dynamic = 'force-dynamic';

export default async function BookingDetailsPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const context = await getHotelContext();

  if (!context) {
    redirect('/error?message=Invalid hotel context');
  }

  // Validate hotel exists in database
  const hotel = await validateHotel(context.subdomain);
  if (!hotel) {
    redirect(`/error?message=Hotel "${context.subdomain}" not found`);
  }

  // Validate token exists and is active
  const tokenData = await validateToken(token, hotel.id);
  if (!tokenData) {
    redirect(`/error`);
  }

  // Get booking data
  const booking = tokenData.booking;
  const guest = tokenData.guest;

  if (!booking) {
    redirect(`/error?message=No booking found for this token`);
  }

  // Format dates
  const checkInDate = booking.checkInDate
    ? new Date(booking.checkInDate).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    : 'N/A';

  const checkOutDate = booking.checkOutDate
    ? new Date(booking.checkOutDate).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    : 'N/A';

  // Calculate nights
  const nights = booking.checkInDate && booking.checkOutDate
    ? Math.ceil(
        (new Date(booking.checkOutDate).getTime() -
          new Date(booking.checkInDate).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : 0;

  // Prepare booking data for client component
  const bookingData = {
    bookingId: booking.bookingReference || booking.id.slice(0, 12).toUpperCase(),
    hotelName: hotel.name,
    checkIn: checkInDate,
    checkOut: checkOutDate,
    nights: nights,
    guests: `${booking.numberOfGuests || 1} guest${
      (booking.numberOfGuests || 1) > 1 ? 's' : ''
    }`,
    roomType: booking.roomType || 'Standard Room',
    roomImageUrl: undefined, // TODO: Add roomImageUrl to Booking model or fetch from room type
  };

  return <BookingDetailsView token={token} booking={bookingData} />;
}
