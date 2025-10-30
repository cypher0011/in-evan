import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Multi-Tenant Proxy (Next.js 16+)
 * Handles:
 * 1. Subdomain routing (hotel-specific pages)
 * 2. Token validation for guest check-in flow
 * 3. Session validation for guest-app access
 * 4. Admin portal routing (admin.in-evan.site)
 */

export default async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const hostname = request.headers.get('host') || '';

  // Get subdomain from hostname
  const subdomain = getSubdomain(hostname);

  console.log('[Proxy]', { hostname, subdomain, pathname });

  // ============================================================================
  // 1. ADMIN PORTAL ROUTING (admin.in-evan.site)
  // ============================================================================
  if (subdomain === 'admin') {
    // Redirect root to /admin which will redirect to /admin/login
    if (pathname === '/') {
      const url = request.nextUrl.clone();
      url.pathname = '/admin';
      return NextResponse.redirect(url);
    }

    // All hotel admins access admin portal here
    // Add authentication check if needed
    return NextResponse.next();
  }

  // ============================================================================
  // 2. MAIN SITE (in-evan.com without subdomain)
  // ============================================================================
  if (!subdomain || subdomain === 'www') {
    // Main marketing site or redirect to admin
    return NextResponse.next();
  }

  // ============================================================================
  // 3. HOTEL SUBDOMAIN (e.g., movenpick.in-evan.com)
  // ============================================================================

  // Check if hotel subdomain is valid (you might want to cache this)
  // For now, we'll allow all subdomains and validate in the app
  // TODO: Add hotel validation from database or cache

  // Token-based check-in flow: /c/[token]/*
  if (pathname.startsWith('/c/')) {
    const token = extractTokenFromPath(pathname);

    if (!token) {
      // Invalid token format in URL
      return redirectToError(request, 'Invalid token format');
    }

    // Validate token format (8-10 alphanumeric characters)
    if (!isValidTokenFormat(token)) {
      return redirectToError(request, 'Invalid token');
    }

    // TODO: Validate token with database (add caching with Upstash Redis)
    // For now, allow through to page which will handle validation
    // const tokenData = await validateToken(token, subdomain);
    // if (!tokenData || tokenData.status !== 'active') {
    //   return redirectToError(request, 'Token expired or invalid');
    // }

    // Store hotel context in headers for the app to use
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-hotel-subdomain', subdomain);
    requestHeaders.set('x-guest-token', token);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // Session-based guest-app access: /guest-app/*
  if (pathname.startsWith('/guest-app')) {
    const sessionToken = request.cookies.get('guest_session')?.value;

    if (!sessionToken) {
      // No session - redirect to login or error
      return redirectToError(request, 'Session required');
    }

    // TODO: Validate session token with database/cache
    // const session = await validateSession(sessionToken, subdomain);
    // if (!session || isExpired(session.expires_at)) {
    //   return redirectToError(request, 'Session expired');
    // }

    // Store session context
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-hotel-subdomain', subdomain);
    requestHeaders.set('x-session-token', sessionToken);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // Minibar access: /minibar/* (allows lastName + roomNumber OR session)
  if (pathname.startsWith('/minibar')) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-hotel-subdomain', subdomain);

    // Check for session token (if guest is checked in)
    const sessionToken = request.cookies.get('guest_session')?.value;
    if (sessionToken) {
      requestHeaders.set('x-session-token', sessionToken);
    }

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // All other hotel subdomain pages
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-hotel-subdomain', subdomain);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Extract subdomain from hostname
 * Examples:
 * - movenpick.in-evan.com -> 'movenpick'
 * - admin.in-evan.site -> 'admin'
 * - in-evan.com -> null
 * - localhost:3000 -> null (development)
 */
function getSubdomain(hostname: string): string | null {
  // Handle localhost and development
  if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
    // For local development, you can use:
    // movenpick.localhost:3000 or set subdomain in query param
    const parts = hostname.split('.');
    if (parts.length > 1 && parts[0] !== 'localhost') {
      return parts[0];
    }
    return null;
  }

  // Production: extract subdomain from hostname
  // in-evan.com or in-evan.site
  const parts = hostname.split('.');

  // If hostname is exactly 'in-evan.com' or 'in-evan.site', no subdomain
  if (parts.length === 2 || (parts.length === 3 && parts[0] === 'www')) {
    return null;
  }

  // Extract subdomain (first part before .in-evan.com or .in-evan.site)
  if (parts.length >= 3) {
    return parts[0];
  }

  return null;
}

/**
 * Extract token from pathname
 * /c/A13FB9K2M/welcome -> A13FB9K2M
 * /c/A13FB9K2M -> A13FB9K2M
 */
function extractTokenFromPath(pathname: string): string | null {
  const match = pathname.match(/^\/c\/([A-Za-z0-9]+)/);
  return match ? match[1] : null;
}

/**
 * Validate token format (8-10 alphanumeric characters)
 */
function isValidTokenFormat(token: string): boolean {
  if (!token || typeof token !== 'string') return false;
  const length = token.length;
  if (length < 8 || length > 10) return false;
  return /^[A-Za-z0-9]+$/.test(token);
}

/**
 * Redirect to error page with message
 */
function redirectToError(request: NextRequest, message: string): NextResponse {
  const url = request.nextUrl.clone();
  url.pathname = '/error';
  url.searchParams.set('message', message);
  return NextResponse.redirect(url);
}

// ============================================================================
// PROXY CONFIG
// ============================================================================

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon)
     * - public folder files
     * - API routes that don't need proxy
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
