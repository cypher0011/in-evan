'use client';

import { useCheckInData } from '@/contexts/CheckInDataContext';
import BookingDetailsView from './BookingDetailsView';
import Loading from '../loading';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function BookingDetailsClient({ token }: { token: string }) {
  const { data, isLoading } = useCheckInData();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && data && !data.booking) {
      router.push(`/error?message=No booking found for this token`);
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
  const checkInDate = booking.checkInDate
    ? new Date(booking.checkInDate).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    : 'N/A';

  const checkOutDate = booking.checkOutDate
    ? new Date(booking.checkOutDate).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    : 'N/A';

  // Calculate nights
  const nights = booking.checkInDate && booking.checkOutDate
    ? Math.ceil(
        (new Date(booking.checkOutDate).getTime() -
          new Date(booking.checkInDate).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : 0;

  // Prepare booking data for client component
  const bookingData = {
    bookingId: booking.bookingReference || booking.id.slice(0, 12).toUpperCase(),
    hotelName: data.hotel.name,
    checkIn: checkInDate,
    checkOut: checkOutDate,
    nights: nights,
    guests: `${booking.numberOfGuests || 1} guest${
      (booking.numberOfGuests || 1) > 1 ? 's' : ''
    }`,
    roomType: booking.roomType || 'Standard Room',
    roomImageUrl: undefined,
  };

  return <BookingDetailsView token={token} booking={bookingData} />;
}
