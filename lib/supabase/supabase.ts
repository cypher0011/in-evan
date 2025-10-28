import { createBrowserClient } from '@supabase/ssr';

export const supabase = createBrowserClient(
  process.env.SUPABASE_DATABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);
