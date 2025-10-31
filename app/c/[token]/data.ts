
import { getHotelContext } from '@/lib/utils/hotel-context';
import { validateHotel, validateToken } from '@/lib/utils/validation';
import { redirect, notFound } from 'next/navigation';
import { cache } from 'react';

// This function is wrapped in `cache` to ensure it only runs once per request.
// It can be safely called from both the layout and the pages.
export const getValidatedData = cache(async (token: string) => {
  const context = await getHotelContext();
  if (!context) {
    redirect('/error?message=Invalid hotel context');
  }

  const hotel = await validateHotel(context.subdomain);
  if (!hotel) {
    notFound();
  }

  const tokenData = await validateToken(token, hotel.id);
  if (!tokenData) {
    notFound();
  }

  return { hotel, tokenData };
});
