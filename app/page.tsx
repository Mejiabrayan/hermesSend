'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface GradientHeadingProps {
  children: ReactNode;
  className?: string;
}

interface FeatureProps {
  icon: ReactNode;
  title: string;
  description: string;
}

interface PricingTierProps {
  title: string;
  price: string;
  description: string;
  features: string[];
  buttonText: string;
  buttonHref: string;
  buttonVariant?:
    | 'default'
    | 'secondary'
    | 'link'
    | 'destructive'
    | 'outline'
    | 'ghost';
}

const MotionDiv = motion.div;

const Navbar = () => (
  <nav className='fixed w-full z-50 border-b border-white/10 bg-black/20 backdrop-blur-xl'>
    <div className='container mx-auto px-6 h-16 flex items-center justify-between'>
      <div className='flex items-center gap-2'>
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
);

const GradientHeading = ({
  children,
  className = '',
}: GradientHeadingProps) => (
  <h2
    className={`bg-clip-text text-transparent bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white font-bold tracking-tight ${className}`}
  >
    {children}
  </h2>
);

const Feature = ({ icon, title, description }: FeatureProps) => (
  <div className='flex flex-col'>
    <div className='mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-primary'>
      {icon}
    </div>
    <div className='flex flex-auto flex-col'>
      <GradientHeading className='text-xl font-semibold leading-8'>
        {title}
      </GradientHeading>
      <p className='mt-2 flex flex-auto text-base leading-7 text-zinc-400'>
        {description}
      </p>
    </div>
  </div>
);

const PricingTier = ({
  title,
  price,
  description,
  features,
  buttonText,
  buttonHref,
  buttonVariant = 'default',
}: PricingTierProps) => (
  <div className='flex flex-col justify-between rounded-3xl bg-white/5 p-8 ring-1 ring-white/10 xl:p-10'>
    <div>
      <GradientHeading className='text-lg font-semibold leading-8'>
        {title}
      </GradientHeading>
      <p className='mt-4 text-sm leading-6 text-zinc-400'>{description}</p>
      <p className='mt-6 flex items-baseline gap-x-1'>
        <span className='text-4xl font-bold tracking-tight text-white'>
          {price}
        </span>
        {price !== 'Custom' && (
          <span className='text-sm font-semibold leading-6 text-zinc-400'>
            /month
          </span>
        )}
      </p>
      <ul
        role='list'
        className='mt-8 space-y-3 text-sm leading-6 text-zinc-400'
      >
        {features.map((feature, index) => (
          <li key={index} className='flex gap-x-3'>
            <Check className='h-6 w-5 flex-none text-white' />
            {feature}
          </li>
        ))}
      </ul>
    </div>
    <Button className='mt-8' variant={buttonVariant} asChild>
      <Link href={buttonHref}>{buttonText}</Link>
    </Button>
  </div>
);

export default function Home() {
  const features = [
    {
      icon: (
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
      ),
      title: 'Email Builder That Actually Makes Sense',
      description:
        "Yeah, we're built on AWS SES - but with an interface you'll actually want to use. Drag, drop, and ship beautiful emails without the AWS console headaches.",
    },
    {
      icon: (
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
      ),
      title: 'Analytics That Tell It Like It Is',
      description:
        'Real-time data on opens, clicks, and bounces - without the corporate buzzwords. Just straight-up numbers that help you send better emails.',
    },
    {
      icon: (
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
      ),
      title: 'Set It & Forget It Automation',
      description:
        "Because you've got better things to do than babysit email campaigns. Schedule once, then go grab that coffee you deserve.",
    },
  ];

  const pricingTiers = [
    {
      title: 'Starter',
      price: '$29',
      description:
        'For those just dipping their toes into email marketing (and loving it)',
      features: [
        'Up to 5,000 subscribers',
        'Unlimited campaigns',
        'Basic analytics',
        'AWS SES reliability without the complexity',
      ],
      buttonText: 'Get Started',
      buttonHref: '/sign-up?plan=starter',
      buttonVariant: 'default' as const,
    },
    {
      title: 'Professional',
      price: '$79',
      description: 'When your email game is getting serious',
      features: [
        'Up to 25,000 subscribers',
        'Advanced analytics',
        'A/B testing',
        'Priority support',
      ],
      buttonText: 'Get Started',
      buttonHref: '/sign-up?plan=professional',
      buttonVariant: 'default' as const,
    },
    {
      title: 'Enterprise',
      price: 'Custom',
      description: 'For the email power players who need it all',
      features: [
        'Unlimited subscribers',
        '24/7 dedicated support',
        'Custom integrations',
        'Advanced AWS SES configuration',
      ],
      buttonText: 'Contact Sales',
      buttonHref: '/contact-sales',
      buttonVariant: 'secondary' as const,
    },
  ];

  return (
    <div className='relative min-h-screen bg-[#050505]'>
      <div className='absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]'></div>

      <Navbar />

      <main className='relative isolate'>
        {/* Hero Section */}
        <section className='px-6 pt-14 lg:px-8'>
          <div className='mx-auto max-w-3xl py-32 sm:py-48 lg:py-56'>
            <div className='text-center'>
              <div className="w-full">
                <MotionDiv
                  initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
                  animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  <GradientHeading className='text-4xl md:text-6xl lg:text-7xl font-sans py-2 md:py-10 relative z-20'>
                    AWS SES, But Make It Beautiful
                  </GradientHeading>
                </MotionDiv>
              </div>
              <div className="w-full">
                <MotionDiv 
                  initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
                  animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                >
                  <p className='mt-6 text-lg leading-8 text-zinc-400'>
                    All the reliability of Amazon SES with an interface you&apos;ll
                    actually enjoy using. Create, send, and track emails without
                    touching the AWS console. Because life&apos;s too short for
                    complicated email infrastructure.
                  </p>
                </MotionDiv>
              </div>
              <div className='mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-x-6'>
                <div className="w-full sm:w-auto">
                  <MotionDiv
                    initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
                    animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                  >
                    <Button className='w-full' asChild size='lg'>
                      <Link href='/sign-up'>Start Sending Better Emails</Link>
                    </Button>
                  </MotionDiv>
                </div>
                <div className="w-full sm:w-auto">
                  <MotionDiv
                    initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
                    animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                  >
                    <Button className='w-full' variant='ghost' asChild>
                      <Link href='#features'>See How It Works</Link>
                    </Button>
                  </MotionDiv>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id='features' className='py-24 sm:py-32'>
          <div className='mx-auto max-w-7xl px-6 lg:px-8'>
            <div className='mx-auto max-w-2xl text-center'>
              <GradientHeading className='text-3xl sm:text-4xl'>
                Email Infrastructure, Minus The Headaches
              </GradientHeading>
              <p className='mt-6 text-lg leading-8 text-zinc-400'>
                All the power of AWS SES with none of the complexity. Yes,
                really.
              </p>
            </div>
            <div className='mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none'>
              <div className='grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3'>
                {features.map((feature, index) => (
                  <Feature key={index} {...feature} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id='pricing' className='py-24 sm:py-32'>
          <div className='mx-auto max-w-7xl px-6 lg:px-8'>
            <div className='mx-auto max-w-2xl text-center'>
              <GradientHeading className='text-3xl sm:text-4xl'>
                Pricing That Makes Sense
              </GradientHeading>
              <p className='mt-6 text-lg leading-8 text-zinc-400'>
                No hidden fees, no surprises. Just straightforward pricing for
                powerful email delivery.
              </p>
            </div>
            <div className='mx-auto mt-16 grid max-w-lg grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3'>
              {pricingTiers.map((tier, index) => (
                <PricingTier key={index} {...tier} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
