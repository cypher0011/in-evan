/**
 * Database validation utilities for proxy and pages
 * Uses Prisma for type-safe database access
 */

import { cache } from 'react';
import prisma from '@/lib/prisma';

/**
 * Validate hotel subdomain exists in database
 * Cached via React.cache() to avoid duplicate queries in the same request
 * Redis removed - adds latency (10-50ms) with no benefit for low-traffic guest check-in
 */
export const validateHotel = cache(async (subdomain: string) => {
  try {
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
    console.error('[validateHotel] Database query error:', error);
    return null;
  }
});

/**
 * Validate guest token exists, is active, and belongs to the hotel
 * Cached via React.cache() to avoid duplicate queries in the same request
 * Redis removed - adds latency with no benefit for this use case
 */
export const validateToken = cache(async (token: string, hotelId: string) => {
  try {
    const tokenData = await prisma.guestToken.findFirst({
      where: {
        token,
        hotelId,
        status: 'active',
      },
      select: {
        id: true,
        expiresAt: true,
        guest: {
          select: {
            firstName: true,
            lastName: true,
            phone: true,
            roomNumber: true,
          },
        },
        bookings: {
          select: {
            id: true,
            roomType: true,
            roomNumber: true,
            checkInDate: true,
            checkOutDate: true,
            numberOfGuests: true,
            bookingReference: true,
            totalAmount: true,
          },
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

    const result = {
      ...tokenData,
      booking: tokenData.bookings[0] || null,
    };

    return result;
  } catch (error) {
    console.error('[validateToken] Database query error:', error);
    return null;
  }
});

/**
 * Validate session token
 * Cached to avoid duplicate database queries in the same request
 */
export const validateSession = cache(async (sessionToken: string, hotelId: string) => {
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
});
