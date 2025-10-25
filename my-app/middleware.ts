import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 1. الدالة الأساسية: يجب أن يكون اسمها "middleware"
export function middleware(request: NextRequest) {
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
    path.includes('.') ||
    path.startsWith('/admin') || // Don't rewrite if already in admin path
    path.startsWith('/main')     // Don't rewrite if already in main path
  ) {
    return NextResponse.next();
  }

  // 1. توجيه لوحة التحكم (Admin subdomain)
  if (host === adminDomain || host === `admin.in-evan.com${port}`) {
    url.pathname = `/admin${path}`;
    return NextResponse.rewrite(url);
  }

  // 2. توجيه الموقع الرئيسي (Main domain or localhost)
  if (
    host === mainDomain ||
    host === `in-evan.com${port}` ||
    host.startsWith('localhost')
  ) {
    url.pathname = `/main${path}`;
    return NextResponse.rewrite(url);
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