import { ReactNode } from 'react';
import Image from 'next/image';

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
    <div className="relative min-h-screen">
      {/* Persistent Background Image - Shared across all token pages */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/hotel_bg_test.jpeg"
          alt="Hotel Background"
          fill
          quality={60}
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
      </div>

      {/* Page Content */}
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  );
}