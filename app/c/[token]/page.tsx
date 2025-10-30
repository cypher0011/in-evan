import { redirect } from 'next/navigation';

/**
 * Token Root Redirect
 * Automatically redirects /c/[token] to /c/[token]/welcome
 */

export const dynamic = 'force-dynamic';

export default async function TokenRootPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  // Redirect to welcome page
  redirect(`/c/${token}/welcome`);
}
