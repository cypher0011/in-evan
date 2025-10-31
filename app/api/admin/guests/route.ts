import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Helper function to generate a random token
function generateToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let token = '';
  for (let i = 0; i < 8; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

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
        tokens: {
          select: {
            token: true,
            status: true,
            checkInDate: true,
            checkOutDate: true,
          },
          where: {
            status: 'active',
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
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
      token: guest.tokens[0]?.token || null,
      check_in_date: guest.tokens[0]?.checkInDate?.toISOString() || null,
      check_out_date: guest.tokens[0]?.checkOutDate?.toISOString() || null,
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

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    const {
      firstName,
      lastName,
      phone,
      email,
      roomNumber,
      dateOfBirth,
      nationality,
      idType,
      idNumber,
      status,
      checkInDate,
      checkOutDate,
      hotelId,
    } = body;

    if (!firstName || !lastName || !phone || !roomNumber || !dateOfBirth || !nationality || !idType || !idNumber || !checkInDate || !checkOutDate || !hotelId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate unique token
    let token = generateToken();
    let isUnique = false;
    let attempts = 0;

    while (!isUnique && attempts < 10) {
      const existing = await prisma.guestToken.findUnique({
        where: { token },
      });
      if (!existing) {
        isUnique = true;
      } else {
        token = generateToken();
        attempts++;
      }
    }

    if (!isUnique) {
      return NextResponse.json(
        { error: 'Failed to generate unique token' },
        { status: 500 }
      );
    }

    // Calculate expiration date (checkout + 7 days)
    const expiresAt = new Date(checkOutDate);
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Create guest and token in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create guest
      const guest = await tx.guest.create({
        data: {
          firstName,
          lastName,
          phone,
          email: email || null,
          roomNumber,
          dateOfBirth: new Date(dateOfBirth),
          nationality,
          iqama: idType === 'iqama' ? idNumber : null,
          passport: idType === 'passport' ? idNumber : null,
          nationalId: idType === 'national_id' ? idNumber : null,
          status: status || 'Confirmed',
          hotelId,
        },
      });

      // Create guest token
      const guestToken = await tx.guestToken.create({
        data: {
          token,
          guestId: guest.id,
          hotelId,
          checkInDate: new Date(checkInDate),
          checkOutDate: new Date(checkOutDate),
          expiresAt,
          status: 'active',
        },
      });

      return { guest, guestToken };
    });

    return NextResponse.json({
      success: true,
      guest: {
        id: result.guest.id,
        firstName: result.guest.firstName,
        lastName: result.guest.lastName,
      },
      token: result.guestToken.token,
    });
  } catch (error) {
    console.error('Error creating guest:', error);

    // Provide more specific error messages
    let errorMessage = 'Failed to create guest';

    if (error instanceof Error) {
      // Check for Prisma specific errors
      if (error.message.includes('DATABASE_URL')) {
        errorMessage = 'Database connection error. Please check configuration.';
      } else if (error.message.includes('Unique constraint')) {
        errorMessage = 'A guest with this information already exists.';
      } else if (error.message.includes('Foreign key constraint')) {
        errorMessage = 'Invalid hotel ID or related data.';
      } else {
        errorMessage = error.message;
      }
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
