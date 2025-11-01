import TermsClient from './TermsClient';

/**
 * Terms Page - Now uses cached data from context
 * No more database queries on navigation
 * Route: /c/[token]/terms
 */

type TermsPageProps = {
  params: Promise<{
    token: string;
  }>;
};

export default async function TermsPage({ params }: TermsPageProps) {
  const { token } = await params;

  return <TermsClient token={token} />;
}
