'use client';

import { useCheckInData } from '@/contexts/CheckInDataContext';
import ThanksView from './ThanksView';
import Loading from '../loading';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ThanksClient() {
  const { data, isLoading } = useCheckInData();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && data && !data.booking) {
      router.push(`/error?message=No booking found`);
    }
  }, [isLoading, data, router]);

  if (isLoading || !data) {
    return <Loading />;
  }

  const booking = data.booking;

  if (!booking) {
    return <Loading />;
  }

  // Format dates
  const checkIn = booking.checkInDate
    ? new Date(booking.checkInDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'N/A';

  const checkOut = booking.checkOutDate
    ? new Date(booking.checkOutDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'N/A';

  const bookingData = {
    confirmationNumber: booking.bookingReference || booking.id.slice(0, 8).toUpperCase(),
    roomNumber: booking.roomNumber,
    checkIn: checkIn,
    checkOut: checkOut,
    totalPaid: booking.totalAmount || 0,
    guestName: `${data.guest.firstName} ${data.guest.lastName}`,
  };

  // TODO: Mark token as used
  // TODO: Create guest session
  // TODO: Update booking status to confirmed

  return <ThanksView bookingData={bookingData} />;
}
