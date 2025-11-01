import { Suspense } from 'react';
import { getValidatedData } from '../data';
import WelcomeView from './WelcomeView';
import Loading from '../loading';

/**
 * Welcome Page - First step in check-in flow
 * Server component that fetches data and passes to client component
 * Route: /c/[token]/welcome
 */

export const dynamic = 'force-dynamic';

async function WelcomeContent({ token }: { token: string }) {
  const { tokenData } = await getValidatedData(token);

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

  return <WelcomeView token={token} guestName={guestName} booking={bookingData} />;
}

export default async function WelcomePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  return (
    <Suspense fallback={<Loading />}>
      <WelcomeContent token={token} />
    </Suspense>
  );
}
