import ErrorView from './ErrorView';

/**
 * Error Page
 * Displays error messages for invalid tokens, expired sessions, etc.
 * Route: /error?message=...
 */

export const dynamic = 'force-dynamic';

export default async function ErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  const { message } = await searchParams;

  const errorMessage = message || 'An unexpected error occurred. Please try again or contact support.';

  return <ErrorView message={errorMessage} />;
}
