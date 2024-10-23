import AuthForm from '@/app/auth/_component/auth-form';

export default async function SignInPage() {
  return (
    <>
      <AuthForm mode='signin' />
    </>
  );
}
