import { getValidatedData } from '../data';
import EnhanceStayView from './EnhanceStayView';

/**
 * Enhance Stay Page - Fourth step in check-in flow
 * Guest selects add-ons (flowers, spa, dining, etc.)
 * Route: /c/[token]/enhance-stay
 */

export const dynamic = 'force-dynamic';

export default async function EnhanceStayPage({
  params,
}: {
  params: { token: string };
}) {
  const { token } = params;
  await getValidatedData(token);

  // TODO: Fetch enhance_stay_options from database for this hotel
  // TODO: Filter by is_visible = true and order by display_order

  return <EnhanceStayView token={token} />;
}
