import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * POST /api/save-signature
 * Save guest signature from terms page
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, signatureDataUrl } = body;

    if (!token || !signatureDataUrl) {
      return NextResponse.json(
        { error: 'Token and signature are required' },
        { status: 400 }
      );
    }

    // Find the guest token and associated booking
    const guestToken = await prisma.guestToken.findUnique({
      where: { token },
      include: {
        bookings: {
          where: {
            status: 'pending',
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
    });

    if (!guestToken || !guestToken.bookings[0]) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Update booking with signature
    const updatedBooking = await prisma.booking.update({
      where: { id: guestToken.bookings[0].id },
      data: {
        signatureDataUrl,
      },
    });

    return NextResponse.json({
      success: true,
      bookingId: updatedBooking.id,
    });
  } catch (error) {
    console.error('[API] Error saving signature:', error);
    return NextResponse.json(
      { error: 'Failed to save signature' },
      { status: 500 }
    );
  }
}
