import ThanksClient from './ThanksClient';

/**
 * Thank You Page - Final step after successful payment/check-in
 * Now uses cached data from context
 * Route: /c/[token]/thanks
 */

export default async function ThanksPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  return <ThanksClient />;
}
