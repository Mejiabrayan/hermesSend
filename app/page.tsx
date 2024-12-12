import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

export default async function Home() {
  return (
    <div className='min-h-screen bg-[#050505]'>
      {/* Navigation */}
      <nav className='fixed w-full z-50 border-b border-white/10 bg-black/20 backdrop-blur-xl'>
        <div className='container mx-auto px-6 h-16 flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <svg
              className='w-8 h-8 text-white'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M12 3L12 21M8 6C8 6 12 9 16 6M8 18C8 18 12 15 16 18'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
            <span className='text-white font-bold'>HermesSend</span>
          </div>
          <div className='flex items-center gap-4'>
            <Button variant='ghost' asChild>
              <Link href='/sign-in'>Sign In</Link>
            </Button>
            <Button asChild>
              <Link href='/sign-up'>Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className='relative isolate px-6 pt-14 lg:px-8'>
        <div className='mx-auto max-w-3xl py-32 sm:py-48 lg:py-56'>
          <div className='text-center'>
            <h1 className='text-4xl font-bold tracking-tight text-white sm:text-6xl bg-clip-text'>
              Email Marketing Made Simple and Powerful
            </h1>
            <p className='mt-6 text-lg leading-8 text-zinc-400'>
              Create, send, and track beautiful email campaigns in minutes. Get
              better engagement, higher conversions, and real-time analytics.
            </p>
            <div className='mt-10 flex items-center justify-center gap-x-6'>
              <Button asChild size='lg'>
                <Link href='/sign-up'>Start for Free</Link>
              </Button>
              <Button variant='ghost' asChild>
                <Link href='#features'>Learn More</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div id='features' className='py-24 sm:py-32'>
          <div className='mx-auto max-w-7xl px-6 lg:px-8'>
            <div className='mx-auto max-w-2xl text-center'>
              <h2 className='text-3xl font-bold tracking-tight text-white sm:text-4xl'>
                Everything You Need to Succeed
              </h2>
              <p className='mt-6 text-lg leading-8 text-zinc-400'>
                Powerful features that help you create impactful email campaigns
              </p>
            </div>
            <div className='mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none'>
              <div className='grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3'>
                {/* Feature 1 */}
                <div className='flex flex-col'>
                  <div className='mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-primary'>
                    <svg
                      className='h-6 w-6 text-white'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M4 6h16M4 12h16m-7 6h7'
                      />
                    </svg>
                  </div>
                  <div className='flex flex-auto flex-col'>
                    <h3 className='text-xl font-semibold leading-8 text-white'>
                      Smart Campaign Builder
                    </h3>
                    <p className='mt-2 flex flex-auto text-base leading-7 text-zinc-400'>
                      Create beautiful, responsive emails with our drag-and-drop
                      editor. No coding required.
                    </p>
                  </div>
                </div>

                {/* Feature 2 */}
                <div className='flex flex-col'>
                  <div className='mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-primary'>
                    <svg
                      className='h-6 w-6 text-white'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
                      />
                    </svg>
                  </div>
                  <div className='flex flex-auto flex-col'>
                    <h3 className='text-xl font-semibold leading-8 text-white'>
                      Real-time Analytics
                    </h3>
                    <p className='mt-2 flex flex-auto text-base leading-7 text-zinc-400'>
                      Track opens, clicks, and conversions in real-time. Make
                      data-driven decisions.
                    </p>
                  </div>
                </div>

                {/* Feature 3 */}
                <div className='flex flex-col'>
                  <div className='mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-primary'>
                    <svg
                      className='h-6 w-6 text-white'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                      />
                    </svg>
                  </div>
                  <div className='flex flex-auto flex-col'>
                    <h3 className='text-xl font-semibold leading-8 text-white'>
                      Automation & Scheduling
                    </h3>
                    <p className='mt-2 flex flex-auto text-base leading-7 text-zinc-400'>
                      Set it and forget it. Schedule campaigns and create
                      automated email sequences.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div id='pricing' className='py-24 sm:py-32'>
          <div className='mx-auto max-w-7xl px-6 lg:px-8'>
            <div className='mx-auto max-w-2xl text-center'>
              <h2 className='text-3xl font-bold tracking-tight text-white sm:text-4xl'>
                Simple, Transparent Pricing
              </h2>
              <p className='mt-6 text-lg leading-8 text-zinc-400'>
                Choose the plan that&apos;s right for you
              </p>
            </div>

            <div className='mx-auto mt-16 grid max-w-lg grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3'>
              {/* Starter Plan */}
              <div className='flex flex-col justify-between rounded-3xl bg-white/5 p-8 ring-1 ring-white/10 xl:p-10'>
                <div>
                  <h3 className='text-lg font-semibold leading-8 text-white'>
                    Starter
                  </h3>
                  <p className='mt-4 text-sm leading-6 text-zinc-400'>
                    Perfect for small businesses just getting started
                  </p>
                  <p className='mt-6 flex items-baseline gap-x-1'>
                    <span className='text-4xl font-bold tracking-tight text-white'>
                      $29
                    </span>
                    <span className='text-sm font-semibold leading-6 text-zinc-400'>
                      /month
                    </span>
                  </p>
                  <ul
                    role='list'
                    className='mt-8 space-y-3 text-sm leading-6 text-zinc-400'
                  >
                    <li className='flex gap-x-3'>
                      <Check className='h-6 w-5 flex-none text-white' />
                      Up to 5,000 subscribers
                    </li>
                    <li className='flex gap-x-3'>
                      <Check className='h-6 w-5 flex-none text-white' />
                      Unlimited campaigns
                    </li>
                    <li className='flex gap-x-3'>
                      <Check className='h-6 w-5 flex-none text-white' />
                      Basic analytics
                    </li>
                  </ul>
                </div>
                <Button className='mt-8' asChild>
                  <Link href='/sign-up?plan=starter'>Get Started</Link>
                </Button>
              </div>

              {/* Professional Plan */}
              <div className='flex flex-col justify-between rounded-3xl bg-white/5 p-8 ring-1 ring-white/10 xl:p-10'>
                <div>
                  <h3 className='text-lg font-semibold leading-8 text-white'>
                    Professional
                  </h3>
                  <p className='mt-4 text-sm leading-6 text-zinc-400'>
                    For growing businesses that need more features
                  </p>
                  <p className='mt-6 flex items-baseline gap-x-1'>
                    <span className='text-4xl font-bold tracking-tight text-white'>
                      $79
                    </span>
                    <span className='text-sm font-semibold leading-6 text-zinc-400'>
                      /month
                    </span>
                  </p>
                  <ul
                    role='list'
                    className='mt-8 space-y-3 text-sm leading-6 text-zinc-400'
                  >
                    <li className='flex gap-x-3'>
                      <Check className='h-6 w-5 flex-none text-white' />
                      Up to 25,000 subscribers
                    </li>
                    <li className='flex gap-x-3'>
                      <Check className='h-6 w-5 flex-none text-white' />
                      Advanced analytics
                    </li>
                    <li className='flex gap-x-3'>
                      <Check className='h-6 w-5 flex-none text-white' />
                      A/B testing
                    </li>
                  </ul>
                </div>
                <Button className='mt-8' asChild>
                  <Link href='/sign-up?plan=professional'>Get Started</Link>
                </Button>
              </div>

              {/* Enterprise Plan */}
              <div className='flex flex-col justify-between rounded-3xl bg-white/5 p-8 ring-1 ring-white/10 xl:p-10'>
                <div>
                  <h3 className='text-lg font-semibold leading-8 text-white'>
                    Enterprise
                  </h3>
                  <p className='mt-4 text-sm leading-6 text-zinc-400'>
                    Custom solutions for large organizations
                  </p>
                  <p className='mt-6 flex items-baseline gap-x-1'>
                    <span className='text-4xl font-bold tracking-tight text-white'>
                      Custom
                    </span>
                  </p>
                  <ul
                    role='list'
                    className='mt-8 space-y-3 text-sm leading-6 text-zinc-400'
                  >
                    <li className='flex gap-x-3'>
                      <Check className='h-6 w-5 flex-none text-white' />
                      Unlimited subscribers
                    </li>
                    <li className='flex gap-x-3'>
                      <Check className='h-6 w-5 flex-none text-white' />
                      Dedicated support
                    </li>
                    <li className='flex gap-x-3'>
                      <Check className='h-6 w-5 flex-none text-white' />
                      Custom integrations
                    </li>
                  </ul>
                </div>
                <Button className='mt-8' variant='secondary' asChild>
                  <Link href='/contact-sales'>Contact Sales</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
