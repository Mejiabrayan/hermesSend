import AuthForm from '../_component/auth-form';
import type { Message } from '@/components/form-message';

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string; type?: 'error' | 'success' }>;
}) {
  const params = await searchParams;
  
  const message: Message = params.message
    ? {
        type: params.type ?? 'error',
        message: params.message,
      }
    : null;

  return <AuthForm mode="signin" message={message} />;
}
