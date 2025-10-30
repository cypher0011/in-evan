import { getHotelContext } from '@/lib/utils/hotel-context';
import { validateHotel, validateToken } from '@/lib/utils/validation';
import { redirect } from 'next/navigation';
import EnhanceStayView from './EnhanceStayView';

/**
 * Enhance Stay Page - Fourth step in check-in flow
 * Guest selects add-ons (flowers, spa, dining, etc.)
 * Route: /c/[token]/enhance-stay
 */

export const dynamic = 'force-dynamic';

export default async function EnhanceStayPage({
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

  // TODO: Fetch enhance_stay_options from database for this hotel
  // TODO: Filter by is_visible = true and order by display_order

  return <EnhanceStayView token={token} />;
}
