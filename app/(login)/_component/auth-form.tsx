import Link from 'next/link';
import { signInAction, signUpAction } from '@/utils/actions/index';
import { SubmitButton } from '@/components/submit-button';
import { FormMessage, type Message } from '@/components/form-message';
import GoogleSignInButton from '@/app/(login)/_component/google-form';
import { Input } from "@/components/ui/input";

interface FormProps {
  mode: 'signin' | 'signup';
  message: Message;
}

export default function AuthForm({ mode, message }: FormProps) {
  const action = mode === 'signin' ? signInAction : signUpAction;
  const title = mode === 'signin' ? 'Welcome back' : 'Create an account';
  const subtitle =
    mode === 'signin'
      ? 'Enter your email to sign in to your account'
      : 'Enter your email below to create your account';
  const buttonText = mode === 'signin' ? 'Sign In' : 'Sign Up';
  const alternateLink =
    mode === 'signin'
      ? {
          text: "Don't have an account?",
          href: '/sign-up',
          linkText: 'Sign up',
        }
      : {
          text: 'Already have an account?',
          href: '/sign-in',
          linkText: 'Sign in',
        };

  return (
    <div className='relative'>
  
      <div className='absolute -top-20 left-1/2 -translate-x-1/2'>
        <div className='relative flex items-center justify-center w-16 h-16 rounded-full'>
          <svg
            className='w-8 h-8 text-white/80'
            viewBox='0 0 24 24'
            fill='currentColor'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path d='M12 2L1 21h22L12 2zm0 3.99L19.53 19H4.47L12 5.99z' />
          </svg>
        </div>
      </div>


      <div className='relative overflow-hidden rounded-2xl border border-white/5 bg-black/30 backdrop-blur-sm'>
        <div className='p-6'>
          <div className='flex flex-col space-y-2 text-center'>
            <h1 className='text-2xl font-semibold tracking-tight text-white/90'>
              {title}
            </h1>
            <p className='text-sm text-zinc-500'>{subtitle}</p>
          </div>

          {message && (
            <div className='mt-4'>
              <FormMessage message={message} />
            </div>
          )}

          <form className='mt-8 space-y-4 relative'>
            <div className='space-y-4'>
              <div className="group relative">
                <label
                  htmlFor="email"
                  className="has-[+input:not(:placeholder-shown)):-translate-y-1/2 origin-start absolute top-1/2 block -translate-y-1/2 cursor-text px-1 text-sm text-zinc-500 transition-all group-focus-within:pointer-events-none group-focus-within:top-0 group-focus-within:-translate-y-1/2 group-focus-within:cursor-default group-focus-within:text-xs group-focus-within:font-medium group-focus-within:text-white/80 has-[+input:not(:placeholder-shown)]:pointer-events-none has-[+input:not(:placeholder-shown)]:top-0 has-[+input:not(:placeholder-shown)]:cursor-default has-[+input:not(:placeholder-shown)]:text-xs has-[+input:not(:placeholder-shown)]:font-medium has-[+input:not(:placeholder-shown)]:text-white/80"
                >
                  <span className="inline-flex bg-black/30 px-2">Email address</span>
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder=""
                  autoComplete="email"
                  required
                  className="block w-full rounded-md border-0 bg-white/5 px-4 py-2.5 text-white/80 shadow-sm ring-1 ring-inset ring-white/5 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
                />
              </div>

              <div className="group relative">
                <label
                  htmlFor="password"
                  className="has-[+input:not(:placeholder-shown)):-translate-y-1/2 origin-start absolute top-1/2 block -translate-y-1/2 cursor-text px-1 text-sm text-zinc-500 transition-all group-focus-within:pointer-events-none group-focus-within:top-0 group-focus-within:-translate-y-1/2 group-focus-within:cursor-default group-focus-within:text-xs group-focus-within:font-medium group-focus-within:text-white/80 has-[+input:not(:placeholder-shown)]:pointer-events-none has-[+input:not(:placeholder-shown)]:top-0 has-[+input:not(:placeholder-shown)]:cursor-default has-[+input:not(:placeholder-shown)]:text-xs has-[+input:not(:placeholder-shown)]:font-medium has-[+input:not(:placeholder-shown)]:text-white/80"
                >
                  <span className="inline-flex bg-black/30 px-2">Password</span>
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder=""
                  autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                  required
                  minLength={6}
                  className="block w-full rounded-md border-0 bg-white/5 px-4 py-2.5 text-white/80 shadow-sm ring-1 ring-inset ring-white/5 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <SubmitButton
                className='w-full bg-white/10 hover:bg-white/15 text-white/80'
                pendingText={mode === 'signin' ? 'Signing in...' : 'Signing up...'}
                formAction={action}
              >
                {buttonText}
              </SubmitButton>
              
            </div>
          </form>

          <div className='relative mt-8'>
            <div className='absolute inset-0 flex items-center'>
              <div className='w-full border-t border-white/5'></div>
            </div>
            <div className='relative flex justify-center text-sm'>
              <span className='px-2 text-zinc-500 bg-black/30'>
                Or continue with
              </span>
            </div>
          </div>

          <div className='mt-6'>
            <GoogleSignInButton />
          </div>

          <p className='mt-6 text-center text-sm text-zinc-500'>
            {alternateLink.text}{' '}
            <Link
              href={alternateLink.href}
              className='font-medium text-white/80 hover:text-white'
            >
              {alternateLink.linkText}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
