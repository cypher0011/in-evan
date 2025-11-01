import { getValidatedData } from '../data';
import ThanksView from './ThanksView';
import { redirect } from 'next/navigation';

/**
 * Thank You Page - Final step after successful payment/check-in
 * Route: /c/[token]/thanks
 */

export const dynamic = 'force-dynamic';

export default async function ThanksPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const { tokenData } = await getValidatedData(token);

  // Get guest and booking data
  const guest = tokenData.guest;
  const booking = tokenData.booking;

  if (!booking) {
    redirect(`/error?message=No booking found`);
  }

  // Format dates
  const checkIn = booking.checkInDate
    ? new Date(booking.checkInDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'N/A';

  const checkOut = booking.checkOutDate
    ? new Date(booking.checkOutDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'N/A';

  const bookingData = {
    confirmationNumber: booking.bookingReference || booking.id.slice(0, 8).toUpperCase(),
    roomNumber: booking.roomNumber,
    checkIn: checkIn,
    checkOut: checkOut,
    totalPaid: booking.totalAmount ? Number(booking.totalAmount) : 0,
    guestName: `${guest.firstName} ${guest.lastName}`,
  };

  // TODO: Mark token as used
  // TODO: Create guest session
  // TODO: Update booking status to confirmed

  return <ThanksView bookingData={bookingData} />;
}
