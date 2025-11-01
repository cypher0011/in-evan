import { Suspense } from 'react';
import { getValidatedData } from '../data';
import BookingDetailsView from './BookingDetailsView';
import { redirect } from 'next/navigation';
import Loading from '../loading';

/**
 * Booking Details Page - Third step in check-in flow
 * Shows room information and available upgrade plans
 * Route: /c/[token]/booking-details
 */

export const dynamic = 'force-dynamic';

async function BookingDetailsContent({ token }: { token: string }) {
  const { hotel, tokenData } = await getValidatedData(token);

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

export default async function BookingDetailsPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  return (
    <Suspense fallback={<Loading />}>
      <BookingDetailsContent token={token} />
    </Suspense>
  );
}
