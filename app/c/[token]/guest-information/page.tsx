import { getHotelContext } from '@/lib/utils/hotel-context';
import { validateHotel, validateToken } from '@/lib/utils/validation';
import { redirect } from 'next/navigation';
import GuestInformationView from './GuestInformationView';

/**
 * Guest Information Page - Fifth step in check-in flow
 * Guest enters personal details
 * Route: /c/[token]/guest-information
 */

export const dynamic = 'force-dynamic';

export default async function GuestInformationPage({
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

  // Get guest data from token
  const guest = tokenData.guest;

  const guestData = {
    firstName: guest.firstName,
    lastName: guest.lastName,
    phone: guest.phone,
    roomNumber: guest.roomNumber,
  };

  return <GuestInformationView token={token} guestData={guestData} />;
}
