import { getHotelContext } from '@/lib/utils/hotel-context';
import { validateHotel, validateToken } from '@/lib/utils/validation';
import { redirect } from 'next/navigation';
import PaymentView from './PaymentView';

/**
 * Payment Page - Process payment for booking + enhancements
 * Route: /c/[token]/payment
 */

export const dynamic = 'force-dynamic';

export default async function PaymentPage({
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

  // TODO: Fetch selected enhancements from session/database
  // For now, show empty services (no payment required)
  const services: any[] = [];

  return <PaymentView token={token} services={services} />;
}
