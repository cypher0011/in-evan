import { redirect } from 'next/navigation';

/**
 * Admin Root Page
 * Automatically redirects to login page
 * Route: /admin
 */

export default function AdminRootPage() {
  // TODO: Check if user is authenticated
  // If authenticated, redirect to /admin/dashboard
  // If not authenticated, redirect to /admin/login

  redirect('/admin/login');
}
