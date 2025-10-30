import { getHotelContext } from '@/lib/utils/hotel-context';
import { validateHotel, validateToken } from '@/lib/utils/validation';
import { redirect } from 'next/navigation';
import WelcomeView from './WelcomeView';

/**
 * Welcome Page - First step in check-in flow
 * Server component that fetches data and passes to client component
 * Route: /c/[token]/welcome
 */

export const dynamic = 'force-dynamic';

export default async function WelcomePage({
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

  // Get guest and booking data
  const guest = tokenData.guest;
  const booking = tokenData.booking;

  // Get guest first name (uppercase for design)
  const guestName = guest?.firstName?.toUpperCase() || 'GUEST';

  // Prepare booking data for client component
  const bookingData = booking
    ? {
        roomImageUrl: undefined, // TODO: Add roomImageUrl to Booking model or fetch from room type
        roomType: booking.roomType || undefined,
        roomNumber: booking.roomNumber || undefined,
      }
    : null;

  return (
    <WelcomeView token={token} guestName={guestName} booking={bookingData} />
  );
}
