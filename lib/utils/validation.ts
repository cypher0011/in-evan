/**
 * Database validation utilities for proxy and pages
 * Uses Prisma for type-safe database access
 */

import prisma from '@/lib/prisma';

/**
 * Validate hotel subdomain exists in database
 */
export async function validateHotel(subdomain: string) {
  try {
    // Use findFirst instead of findUnique because we filter by multiple fields
    // (subdomain + status), and only subdomain has a unique constraint
    const hotel = await prisma.hotel.findFirst({
      where: {
        subdomain,
        status: 'active',
      },
      select: {
        id: true,
        name: true,
        status: true,
        subdomain: true,
      },
    });

    return hotel;
  } catch (error) {
    console.error('[validateHotel] Error:', error);
    return null;
  }
}

/**
 * Validate guest token exists, is active, and belongs to the hotel
 */
export async function validateToken(token: string, hotelId: string) {
  try {
    const tokenData = await prisma.guestToken.findFirst({
      where: {
        token,
        hotelId,
        status: 'active',
      },
      include: {
        guest: true,
        bookings: {
          where: {
            hotelId,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
    });

    if (!tokenData) {
      return null;
    }

    // Check if token is expired
    const now = new Date();
    const expiresAt = new Date(tokenData.expiresAt);

    if (expiresAt < now) {
      // Update token status to expired
      await prisma.guestToken.update({
        where: { id: tokenData.id },
        data: { status: 'expired' },
      });

      return null;
    }

    // Return with the first booking (most recent)
    return {
      ...tokenData,
      booking: tokenData.bookings[0] || null,
    };
  } catch (error) {
    console.error('[validateToken] Error:', error);
    return null;
  }
}

/**
 * Validate session token
 */
export async function validateSession(sessionToken: string, hotelId: string) {
  try {
    const session = await prisma.guestSession.findUnique({
      where: {
        sessionToken,
      },
      include: {
        guest: true,
        booking: true,
      },
    });

    if (!session || session.hotelId !== hotelId) {
      return null;
    }

    // Check if session is expired
    const now = new Date();
    const expiresAt = new Date(session.expiresAt);

    if (expiresAt < now) {
      return null;
    }

    // Update last activity
    await prisma.guestSession.update({
      where: { id: session.id },
      data: { lastActivityAt: now },
    });

    return session;
  } catch (error) {
    console.error('[validateSession] Error:', error);
    return null;
  }
}
