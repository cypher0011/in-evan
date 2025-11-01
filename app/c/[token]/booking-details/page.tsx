import BookingDetailsClient from './BookingDetailsClient';

/**
 * Booking Details Page - Third step in check-in flow
 * Now uses cached data from context
 * Route: /c/[token]/booking-details
 */

export default async function BookingDetailsPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  return <BookingDetailsClient token={token} />;
}
