import { ReactNode } from 'react';
import Image from 'next/image';
import { getValidatedData } from './data';
import { CheckInDataProvider } from '@/contexts/CheckInDataContext';

export const dynamic = 'force-dynamic';

export default async function CTokenLayout({
  params,
  children,
}: {
  params: Promise<{ token: string }>;
  children: ReactNode;
}) {
  const { token } = await params;

  // Fetch data once at layout level
  const { hotel, tokenData } = await getValidatedData(token);

  // Transform data for context
  const initialData = {
    hotel: {
      id: hotel.id,
      name: hotel.name,
      subdomain: hotel.subdomain,
    },
    guest: {
      firstName: tokenData.guest?.firstName || '',
      lastName: tokenData.guest?.lastName || '',
      phone: tokenData.guest?.phone || '',
      roomNumber: tokenData.guest?.roomNumber || '',
    },
    booking: tokenData.booking ? {
      id: tokenData.booking.id,
      roomType: tokenData.booking.roomType,
      roomNumber: tokenData.booking.roomNumber,
      checkInDate: tokenData.booking.checkInDate,
      checkOutDate: tokenData.booking.checkOutDate,
      numberOfGuests: tokenData.booking.numberOfGuests,
      bookingReference: tokenData.booking.bookingReference,
      totalAmount: tokenData.booking.totalAmount ? Number(tokenData.booking.totalAmount) : null,
    } : null,
    token,
  };

  return (
    <CheckInDataProvider token={token} initialData={initialData}>
      <div className="relative min-h-screen">
        {/* Persistent Background Image - Shared across all token pages */}
        <div className="fixed inset-0 z-0">
          <Image
            src="/hotel_bg_test.jpeg"
            alt="Hotel Background"
            fill
            quality={60}
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
        </div>

        {/* Page Content */}
        <div className="relative z-10 h-full">
          {children}
        </div>
      </div>
    </CheckInDataProvider>
  );
}