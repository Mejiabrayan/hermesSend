import { redirect } from 'next/navigation';
import { checkAuthStatus } from '@/utils/actions';

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = await checkAuthStatus();
  
  if (isAuthenticated) {
    redirect('/dashboard');
  }

  return (
    <div className='h-full flex items-center justify-center'>
      <div className='w-screen'>{children}</div>
    </div>
  );
}
