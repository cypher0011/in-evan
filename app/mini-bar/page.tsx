import { headers } from 'next/headers';
import prisma from '@/lib/prisma';
import MinibarManager from './MinibarManager';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function MiniBarPage() {
  const headersList = await headers();
  let subdomain = headersList.get('x-hotel-subdomain');

  // Development fallback: if no subdomain detected, use the first hotel in database
  if (!subdomain && process.env.NODE_ENV === 'development') {
    const firstHotel = await prisma.hotel.findFirst({
      select: { subdomain: true },
    });
    subdomain = firstHotel?.subdomain || null;
  }

  if (!subdomain) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Hotel Not Found</h1>
          <p className="text-gray-400">
            Please access this page via a hotel subdomain (e.g., movenpick.in-evan.site/mini-bar)
          </p>
          <p className="text-gray-500 text-sm mt-4">
            For local development, make sure you have at least one hotel in the database.
          </p>
        </div>
      </div>
    );
  }

  // Fetch hotel by subdomain
  const hotel = await prisma.hotel.findUnique({
    where: { subdomain },
    select: {
      id: true,
      name: true,
      logoUrl: true,
      subdomain: true,
      settings: true,
    },
  });

  if (!hotel) {
    notFound();
  }

  // Fetch minibar items for this hotel
  const items = await prisma.minibarItem.findMany({
    where: {
      hotelId: hotel.id,
      isVisible: true,
      stockQuantity: {
        gt: 0,
      },
    },
    orderBy: [
      { category: 'asc' },
      { name: 'asc' },
    ],
  });

  // Transform items to plain objects with serializable types
  const serializedItems = items.map((item) => ({
    id: item.id,
    name: item.name,
    category: item.category as 'Beverage' | 'Snack' | 'Dessert' | 'Water' | 'Alcohol' | 'Main Course' | 'Breakfast' | 'Other',
    customCategory: item.customCategory ?? undefined,
    price: Number(item.price),
    imageUrl: item.imageUrl ?? undefined,
    allergicDetails: item.allergicDetails ?? undefined,
    calories: item.calories ?? undefined,
    stockQuantity: item.stockQuantity,
    description: item.description ?? undefined,
  }));

  return (
    <MinibarManager
      items={serializedItems}
      hotel={{
        id: hotel.id,
        name: hotel.name,
        logoUrl: hotel.logoUrl ?? undefined,
        subdomain: hotel.subdomain,
      }}
    />
  );
}
