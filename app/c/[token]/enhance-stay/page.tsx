import { Suspense } from 'react';
import { getValidatedData } from '../data';
import EnhanceStayView from './EnhanceStayView';
import Loading from '../loading';

/**
 * Enhance Stay Page - Fourth step in check-in flow
 * Guest selects add-ons (flowers, spa, dining, etc.)
 * Route: /c/[token]/enhance-stay
 */

export const dynamic = 'force-dynamic';

async function EnhanceStayContent({ token }: { token: string }) {
  await getValidatedData(token);

  // TODO: Fetch enhance_stay_options from database for this hotel
  // TODO: Filter by is_visible = true and order by display_order

  return <EnhanceStayView token={token} />;
}

export default async function EnhanceStayPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  return (
    <Suspense fallback={<Loading />}>
      <EnhanceStayContent token={token} />
    </Suspense>
  );
}
