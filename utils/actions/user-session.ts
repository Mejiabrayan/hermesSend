import { redirect } from 'next/navigation';
import { createServer } from '@/utils/supabase/server';

export async function getUserSession() {
  const supabase = createServer();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect('/sign-in');
  }

  return data.user;
}
