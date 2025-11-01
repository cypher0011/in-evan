import { NextRequest, NextResponse } from 'next/server';
import { getValidatedData } from '@/app/c/[token]/data';

/**
 * API Route to fetch check-in data
 * Used by CheckInDataContext to cache data client-side
 * GET /api/check-in-data/[token]
 */

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    // Use the existing validated data function (which is cached)
    const { hotel, tokenData } = await getValidatedData(token);

    // Transform data to match context type
    const response = {
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

    return NextResponse.json(response);
  } catch (error) {
    console.error('[API] Error fetching check-in data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch check-in data' },
      { status: 500 }
    );
  }
}
