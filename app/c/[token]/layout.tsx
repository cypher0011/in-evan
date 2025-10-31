
import { getValidatedData } from './data';
import { ReactNode } from 'react';

export const dynamic = 'force-dynamic';

export default async function CTokenLayout({
  params,
  children,
}: {
  params: { token: string };
  children: ReactNode;
}) {
  const { token } = params;
  await getValidatedData(token);

  return (
    <div className="h-full">
      {children}
    </div>
  );
}
