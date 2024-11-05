

import Link from 'next/link';
import { signInAction, signUpAction } from '@/utils/actions/index';
import { SubmitButton } from '@/components/submit-button';
import { FormMessage, type Message } from '@/components/form-message';
import {
  inputContainerStyles,
  labelStyles,
  labelSpanStyles,
  inputStyles,
  dividerStyles,
} from '@/utils/constant';
import GoogleSignInButton from '@/app/auth/_component/google-form';

interface FormProps {
  mode: 'signin' | 'signup';
  message: Message;
}

export default function AuthForm({ mode, message }: FormProps) {
  const action = mode === 'signin' ? signInAction : signUpAction;
  const title = mode === 'signin' ? 'Sign in to your account' : 'Create an account';
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
        className='relative w-full max-w-md p-8 space-y-6 border border-white/10 rounded-xl'
        style={{
          background: 'linear-gradient(145deg, oklch(15% 0 0), oklch(25% 0 0), oklch(30% 0 0), oklch(25% 0 0), oklch(15% 0 0))'
        }}
      >
        <div className='flex justify-center'>
       
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
        <form className='space-y-4'>
          <div className='space-y-2'>
            <div className={`group ${inputContainerStyles}`}>
              <label htmlFor='email' className={labelStyles}>
                <span className={labelSpanStyles}>Email</span>
              </label>
              <input
                id='email'
                name='email'
                type='email'
                placeholder=''
                autoComplete='email'
                required
                className={inputStyles}
              />
            </div>
          </div>
          <div>
            <div className={`group ${inputContainerStyles}`}>
              <div className='flex justify-between items-center'>
                <label htmlFor='password' className={labelStyles}>
                  <span className={labelSpanStyles}>Password</span>
                </label>
              </div>
              <input
                id='password'
                name='password'
                type='password'
                placeholder=''
                autoComplete={
                  mode === 'signin' ? 'current-password' : 'new-password'
                }
                required
                minLength={6}
                className={inputStyles}
              />
            </div>
          </div>
        
          <div className='space-y-2 relative'>
            <SubmitButton
              pendingText={
                mode === 'signin' ? 'Signing in...' : 'Signing up...'
              }
              formAction={action}
            >
              {buttonText}
            </SubmitButton>
          </div>
          <FormMessage message={message} />
        </form>
        <div className={dividerStyles}>
          <span className='px-2 text-zinc-400'>Or continue with</span>
        </div>
        <GoogleSignInButton />
        <p className='text-sm text-center text-zinc-400'>
          {alternateLink.text}{' '}
          <Link href={alternateLink.href} className='text-blue-400 hover:underline'>
            {alternateLink.linkText}
          </Link>
        </p>
      </div>
    </div>
  );
}
