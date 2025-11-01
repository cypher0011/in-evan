'use client';

import { useCheckInData } from '@/contexts/CheckInDataContext';
import GuestInformationView from './GuestInformationView';
import Loading from '../loading';

export default function GuestInformationClient({ token }: { token: string }) {
  const { data, isLoading } = useCheckInData();

  if (isLoading || !data) {
    return <Loading />;
  }

  const guestData = {
    firstName: data.guest.firstName,
    lastName: data.guest.lastName,
    phone: data.guest.phone,
    roomNumber: data.guest.roomNumber,
  };

  return <GuestInformationView token={token} guestData={guestData} />;
}
