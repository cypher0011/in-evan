import WelcomeClient from './WelcomeClient';

/**
 * Welcome Page - First step in check-in flow
 * Now a lightweight wrapper that uses cached data from context
 * Route: /c/[token]/welcome
 */

export default async function WelcomePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  return <WelcomeClient token={token} />;
}
