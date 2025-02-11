import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/utils/database.types';

export function getSupabaseBrowserClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export default getSupabaseBrowserClient;