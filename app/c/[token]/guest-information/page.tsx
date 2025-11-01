import { getValidatedData } from '../data';
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
  const { tokenData } = await getValidatedData(token);

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
