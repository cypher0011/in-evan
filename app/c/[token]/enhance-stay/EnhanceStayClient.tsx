'use client';

import { useCheckInData } from '@/contexts/CheckInDataContext';
import EnhanceStayView from './EnhanceStayView';
import Loading from '../loading';

export default function EnhanceStayClient({ token }: { token: string }) {
  const { data, isLoading } = useCheckInData();

  if (isLoading || !data) {
    return <Loading />;
  }

  // TODO: Fetch enhance_stay_options from database for this hotel
  // TODO: Filter by is_visible = true and order by display_order

  return <EnhanceStayView token={token} />;
}
