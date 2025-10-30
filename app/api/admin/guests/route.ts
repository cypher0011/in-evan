import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const guests = await prisma.guest.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        roomNumber: true,
        phone: true,
        email: true,
        status: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Transform to match the expected format (snake_case)
    const transformedGuests = guests.map((guest) => ({
      id: guest.id,
      first_name: guest.firstName,
      last_name: guest.lastName,
      room_number: guest.roomNumber,
      phone: guest.phone,
      email: guest.email,
      status: guest.status,
      created_at: guest.createdAt?.toISOString(),
    }));

    return NextResponse.json(transformedGuests);
  } catch (error) {
    console.error('Error fetching guests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch guests' },
      { status: 500 }
    );
  }
}
