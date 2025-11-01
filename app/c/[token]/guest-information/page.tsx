import GuestInformationClient from './GuestInformationClient';

/**
 * Guest Information Page - Fifth step in check-in flow
 * Now uses cached data from context
 * Route: /c/[token]/guest-information
 */

export default async function GuestInformationPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  return <GuestInformationClient token={token} />;
}
