import EnhanceStayClient from './EnhanceStayClient';

/**
 * Enhance Stay Page - Fourth step in check-in flow
 * Now uses cached data from context
 * Route: /c/[token]/enhance-stay
 */

export default async function EnhanceStayPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  return <EnhanceStayClient token={token} />;
}
