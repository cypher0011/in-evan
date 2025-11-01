'use client';

import { useCheckInData } from '@/contexts/CheckInDataContext';
import TermsView from './TermsView';
import Loading from '../loading';

export default function TermsClient({ token }: { token: string }) {
  const { data, isLoading } = useCheckInData();

  if (isLoading || !data) {
    return <Loading />;
  }

  // Static terms text - can be moved to database later if needed
  const termsText = `hello_world`;

  return (
    <TermsView
      token={token}
      hotelName={data.hotel.name}
      termsText={termsText}
    />
  );
}
