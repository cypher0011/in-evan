/**
 * Hotel Context Utilities
 * Extract hotel subdomain and token from request headers (set by middleware)
 */

import { headers } from 'next/headers';

export interface HotelContext {
  subdomain: string;
  token?: string;
  sessionToken?: string;
}

/**
 * Get hotel context from middleware headers (server components)
 */
export async function getHotelContext(): Promise<HotelContext | null> {
  const headersList = await headers();
  const subdomain = headersList.get('x-hotel-subdomain');

  if (!subdomain) {
    return null;
  }

  return {
    subdomain,
    token: headersList.get('x-guest-token') || undefined,
    sessionToken: headersList.get('x-session-token') || undefined,
  };
}

/**
 * Get hotel subdomain only
 */
export async function getHotelSubdomain(): Promise<string | null> {
  const context = await getHotelContext();
  return context?.subdomain || null;
}

/**
 * Get guest token from context
 */
export async function getGuestToken(): Promise<string | null> {
  const context = await getHotelContext();
  return context?.token || null;
}

/**
 * Get session token from context
 */
export async function getSessionToken(): Promise<string | null> {
  const context = await getHotelContext();
  return context?.sessionToken || null;
}
