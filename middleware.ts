import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const host = request.headers.get('host') || '';

  const mainDomain = 'in-evan.com';
  const adminDomain = 'admin.in-evan.com';

  // Get port for local development
  const port = url.port ? `:${url.port}` : '';

  const path = url.pathname;

  // Skip rewriting for Next.js internal paths and static files
  if (
    path.startsWith('/_next') ||
    path.startsWith('/api') ||
    path.startsWith('/static') ||
    path.includes('.')
  ) {
    return NextResponse.next();
  }

  // Don't rewrite if already in admin or main path
  const isAlreadyRewritten = path.startsWith('/admin') || path.startsWith('/main');

  let response = NextResponse.next();

  // Handle admin subdomain routing
  if (host === adminDomain || host === `admin.in-evan.com${port}`) {
    // Create Supabase client for authentication check
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options)
            })
          },
        },
      }
    )

    // Check authentication
    const { data: { session } } = await supabase.auth.getSession()

    // If not authenticated and not on login page, redirect to login
    if (!session && !path.startsWith('/admin/login') && !isAlreadyRewritten) {
      const loginUrl = url.clone()
      loginUrl.pathname = '/admin/login'
      return NextResponse.redirect(loginUrl)
    }

    // If authenticated and on login page, redirect to dashboard
    if (session && path === '/admin/login') {
      const dashboardUrl = url.clone()
      dashboardUrl.pathname = '/admin/dashboard'
      return NextResponse.redirect(dashboardUrl)
    }

    // If authenticated and on root admin page, redirect to dashboard
    if (session && (path === '/' || path === '/admin')) {
      const dashboardUrl = url.clone()
      dashboardUrl.pathname = '/admin/dashboard'
      return NextResponse.redirect(dashboardUrl)
    }

    // If not authenticated and on root, redirect to login
    if (!session && (path === '/' || path === '/admin')) {
      const loginUrl = url.clone()
      loginUrl.pathname = '/admin/login'
      return NextResponse.redirect(loginUrl)
    }

    // Rewrite to /admin path if not already
    if (!isAlreadyRewritten) {
      url.pathname = `/admin${path}`;
      response = NextResponse.rewrite(url);
    }

    return response;
  }

  // Handle main domain routing
  if (
    host === mainDomain ||
    host === `in-evan.com${port}` ||
    host.startsWith('localhost')
  ) {
    if (!isAlreadyRewritten) {
      url.pathname = `/main${path}`;
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

// 2. إعدادات الـ matcher: لتحديد أين يعمل الـ middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};