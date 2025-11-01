'use client';

import { useCheckInData } from '@/contexts/CheckInDataContext';
import WelcomeView from './WelcomeView';
import Loading from '../loading';

export default function WelcomeClient({ token }: { token: string }) {
  const { data, isLoading } = useCheckInData();

  if (isLoading || !data) {
    return <Loading />;
  }

  const guestName = data.guest.firstName?.toUpperCase() || 'GUEST';

  const bookingData = data.booking
    ? {
        roomImageUrl: undefined,
        roomType: data.booking.roomType || undefined,
        roomNumber: data.booking.roomNumber || undefined,
      }
    : null;

  return <WelcomeView token={token} guestName={guestName} booking={bookingData} />;
}
