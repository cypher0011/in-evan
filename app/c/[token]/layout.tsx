import { ReactNode } from 'react';

export const dynamic = 'force-dynamic';

export default async function CTokenLayout({
  params,
  children,
}: {
  params: Promise<{ token: string }>;
  children: ReactNode;
}) {
  // Validation moved to individual pages for better performance
  // Each page validates the token when needed using getValidatedData()
  // which is cached via React.cache() to prevent duplicate queries

  return (
    <div className="h-full">
      {children}
    </div>
  );
}