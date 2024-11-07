import { createServer } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { ImageIcon } from 'lucide-react';

export default async function Page() {
  const supabase = await createServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/sign-in');
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold italic'>Campaigns</h1>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
        <div className='col-span-full flex flex-col items-center justify-center p-12 text-center'>
          <div className='rounded-full bg-zinc-900 p-4 mb-4'>
            <ImageIcon className='w-8 h-8 text-zinc-400' />
          </div>
          <h3 className='text-xl font-semibold mb-2'>No campaigns yet</h3>
          <p className='text-zinc-400 mb-4'>Create your first campaign to get started</p>
        </div>
      </div>
    </div>
  );
}
