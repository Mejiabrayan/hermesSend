'use client';

import { useActionState, useState } from 'react';
import { Button } from '@/components/ui/button';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import Link from 'next/link';
import { signIn, signUp } from '@/utils/actions/auth';
import GoogleSignInButton from './GoogleSignInButton';

interface FormProps {
  mode: 'signin' | 'signup';
}

const initialState = {
  message: null,
};

const inputContainerStyles = `relative
  before:pointer-events-none focus-within:before:opacity-100 before:opacity-0 before:absolute before:-inset-1 before:rounded-[11px] before:border before:border-blue-500 before:ring-2 before:ring-blue-500/20 before:transition
  after:pointer-events-none after:absolute after:inset-px after:rounded-[7px] after:shadow-highlight after:shadow-white/5 focus-within:after:shadow-blue-500/100 dark:focus-within:after:shadow-blue-500/20 after:transition`;

const labelStyles = `has-[+input:not(:placeholder-shown)]:top-0
  has-[+input:not(:placeholder-shown)]:-translate-y-1/2 
  has-[+input:not(:placeholder-shown)]:text-base 
  has-[+input:not(:placeholder-shown)]:text-white/70 
  origin-start 
  absolute 
  top-1/2 
  z-20
  block 
  -translate-y-1/2 
  cursor-text 
  text-sm 
  text-white/70 
  transition-all 
  group-focus-within:top-0 
  group-focus-within:-translate-y-1/2 
  group-focus-within:text-xs 
  group-focus-within:text-white/70`;

  // fix clipping
const labelSpanStyles = `relative px-2
  after:content-[''] after:block after:absolute after:left-0 after:right-0
  after:top-[calc(50%-1px)] after:h-[2px] after:-z-10
  after:bg-transparent`;

const inputStyles = `relative text-sm w-full dark:text-neutral-200 bg-white dark:bg-zinc-900 placeholder:text-white text- px-3.5 py-2 rounded-lg border border-black/5 shadow-input shadow-black/5 dark:shadow-black/10 !outline-none`;

const dividerStyles = `relative flex items-center py-5 text-xs uppercase before:flex-1 before:border-t before:border-zinc-700 after:flex-1 after:border-t after:border-zinc-700`;

const buttonStyles = `relative text-sm w-full dark:text-neutral-200 bg-white dark:bg-gradient-to-b dark:from-zinc-950 dark:to-black px-3.5 py-2 rounded-lg border border-black/5 shadow-input shadow-black/5 dark:shadow-black/10 
  before:pointer-events-none focus-visible:before:opacity-100 before:opacity-0 before:absolute before:-inset-1 before:rounded-[11px] before:border before:border-blue-500 before:ring-2 before:ring-blue-500/20 before:transition
  after:pointer-events-none after:absolute after:inset-px after:rounded-[7px] after:shadow-highlight after:shadow-white/5 focus-visible:after:shadow-blue-500/100 dark:focus-visible:after:shadow-blue-500/20 after:transition
  disabled:opacity-50 disabled:cursor-not-allowed
  active:scale-[0.98] active:before:opacity-100 active:transition-transform
  transform duration-100 hover:brightness-110
  disabled:active:scale-100 disabled:hover:brightness-100
`;

const noiseBackground = {
  backgroundImage: `
    linear-gradient(to top left, rgba(85, 85, 85, 0.1), rgb(63,63,70)),
    url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.5' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noiseFilter)' opacity='0.10'/%3E%3C/svg%3E")
  `,
  backgroundSize: '100% 100%, 100px 100px',
  backgroundRepeat: 'no-repeat, repeat',
};

export default function AuthForm({ mode }: FormProps) {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [state, formAction] = useActionState(
    mode === 'signin' ? signIn : signUp,
    initialState
  );

  const isLoading = state.message === 'pending';
  const isError = state.message && !state.message.includes('successful');
  const isSuccess = state.message?.includes('successful');

  const title =
    mode === 'signin' ? 'Sign in to your account' : 'Create an account';
  const subtitle =
    mode === 'signin'
      ? 'Welcome back! Please enter your details'
      : "Let's start your journey with us today";
  const buttonText = mode === 'signin' ? 'Sign In' : 'Sign Up';
  const alternateLink =
    mode === 'signin'
      ? {
          text: "Don't have an account?",
          href: '/auth/sign-up',
          linkText: 'Sign up',
        }
      : {
          text: 'Already have an account?',
          href: '/auth/sign-in',
          linkText: 'Sign in',
        };

  return (
    <div className='flex items-center justify-center min-h-screen bg-[#050505]'>
      <div
        className='relative w-full max-w-md p-8 space-y-10 bg-gradient-to-tr from-black/10 to-zinc-700 border border-white/10 rounded-xl'
        style={noiseBackground}
      >
        <div className='flex justify-center'>
          <div className='absolute right-5 top-0 h-px w-80 bg-gradient-to-l from-transparent via-white/30 via-10% to-transparent' />
          <svg
            className='w-12 h-12 text-white'
            viewBox='0 0 24 24'
            fill='currentColor'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path d='M12 2L1 21h22L12 2zm0 3.99L19.53 19H4.47L12 5.99z' />
          </svg>
        </div>
        <div className='flex flex-col items-start space-y-1'>
          <h1 className='text-2xl text-white'>{title}</h1>
          <p className='text-sm text-gray-400'>{subtitle}</p>
        </div>
        <form className='space-y-4' action={formAction}>
          <div className='space-y-2'>
            <div className={`group ${inputContainerStyles}`}>
              <label htmlFor='email' className={labelStyles}>
                <span className={labelSpanStyles}>Email</span>
              </label>
              <input
                id='email'
                name='email'
                type='email'
                placeholder=' '
                autoComplete='email'
                required
                disabled={isLoading}
                aria-describedby={isError ? 'form-error' : undefined}
                className={inputStyles}
              />
            </div>
          </div>
          <div className='space-y-2'>
            <div className={`group ${inputContainerStyles}`}>
              <label htmlFor='password' className={labelStyles}>
                <span className={labelSpanStyles}>Password</span>
              </label>
              <input
                id='password'
                name='password'
                type={showPassword ? 'text' : 'password'}
                placeholder=' '
                autoComplete={
                  mode === 'signin' ? 'current-password' : 'new-password'
                }
                required
                disabled={isLoading}
                aria-describedby={isError ? 'form-error' : undefined}
                minLength={6}
                className={inputStyles}
              />
              <Button
                type='button'
                variant={'ghost'}
                className='absolute inset-y-0 right-0 flex items-center px-3 text-zinc-400'
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeIcon className='w-5 h-5' />
                ) : (
                  <EyeOffIcon className='w-5 h-5' />
                )}
              </Button>
            </div>
          </div>
          <div className='space-y-2 relative'>
            <button type='submit' disabled={isLoading} className={buttonStyles}>
              {isLoading ? 'Processing...' : buttonText}
            </button>
          </div>
          {state.message && (
            <p
              id='form-error'
              className={`text-sm text-center p-2 rounded-md ${
                isSuccess
                  ? 'text-emerald-400 border border-emerald-400 bg-emerald-900/20'
                  : 'text-rose-400 border border-rose-400 bg-rose-900/20'
              }`}
              role='alert'
            >
              {state.message}
            </p>
          )}
        </form>
        <div className={dividerStyles}>
          <span className='px-2 text-zinc-400'>Or continue with</span>
        </div>
        <GoogleSignInButton />
        <p className='text-sm text-center text-zinc-400'>
          {alternateLink.text}{' '}
          <Link
            href={alternateLink.href}
            className='text-blue-400 hover:underline'
          >
            {alternateLink.linkText}
          </Link>
        </p>
      </div>
    </div>
  );
}
