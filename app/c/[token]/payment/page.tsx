import { getValidatedData } from '../data';
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
  await getValidatedData(token);

  // TODO: Fetch selected enhancements from session/database
  // For now, show empty services (no payment required)
  const services: any[] = [];

  return <PaymentView token={token} services={services} />;
}
