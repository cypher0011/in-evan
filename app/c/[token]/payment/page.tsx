import PaymentClient from './PaymentClient';

/**
 * Payment Page - Process payment for booking + enhancements
 * Now uses cached data from context
 * Route: /c/[token]/payment
 */

export default async function PaymentPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  return <PaymentClient token={token} />;
}
