import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * GET /api/admin/enhance-stay-options
 * Fetch all enhance-stay options for a hotel
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const hotelId = searchParams.get('hotelId');

    if (!hotelId) {
      return NextResponse.json(
        { error: 'Hotel ID is required' },
        { status: 400 }
      );
    }

    const options = await prisma.enhanceStayOption.findMany({
      where: {
        hotelId,
        isVisible: true,
      },
      select: {
        id: true,
        name: true,
        description: true,
        category: true,
        price: true,
        imageUrl: true,
      },
      orderBy: {
        displayOrder: 'asc',
      },
    });

    return NextResponse.json({ options });
  } catch (error) {
    console.error('[API] Error fetching enhance-stay options:', error);
    return NextResponse.json(
      { error: 'Failed to fetch enhance-stay options' },
      { status: 500 }
    );
  }
}
