import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function Home() {
  return (
    <div className='min-h-screen bg-[#050505]'>
      <nav className='fixed w-full z-50 border-b border-white/10 bg-black/20 backdrop-blur-xl'>
        <div className='container mx-auto px-6 h-16 flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <svg
              className='w-8 h-8 text-white'
              viewBox='0 0 24 24'
              fill='currentColor'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path d='M12 2L1 21h22L12 2zm0 3.99L19.53 19H4.47L12 5.99z' />
            </svg>
            <span className='text-white font-bold'>Momentus</span>
          </div>
          <div className='flex items-center gap-4'>
            <Button asChild>
              <Link href='/sign-up'>Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>
      {/* <div className='bg-gradient-to-r from-primary to-secondary-foreground text-transparent bg-clip-text relative'>
          <h1 className='text-9xl font-bold text-center md:text-[300px]'>
            The Setup
          </h1>
        </div>
        <div className='flex justify-center items-center relative md:mt-[-70px]'>
          <Image
            src={'/assets/preview.png'}
            alt='banner image'
            height={1200}
            width={1200}
            className='rounded-tl-2xl rounded-tr-2xl border-2 border-muted -z-10'
          />
          <div className='bottom-0 top-[50%] bg-gradient-to-t dark:from-background left-0 right-0 absolute z-10'></div>
        </div> */}

      <div className='relative isolate px-6 pt-14 lg:px-8'>
        <div className='mx-auto max-w-3xl py-32 sm:py-48 lg:py-56'>
          <div className='text-center'>
            <h1 className='text-4xl font-bold tracking-tight text-white sm:text-6xl  bg-clip-text'>
              Supercharge Your Marketing Campaigns
            </h1>
            <p className='mt-6 text-lg leading-8 text-zinc-400'>
              Create stunning email campaigns and marketing materials that
              convert. Streamline your workflow and boost engagement.
            </p>
            <div className='mt-10 flex items-center justify-center gap-x-6'>
              <Button asChild size='lg'>
                <Link href='/dashboard'>Go to Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>

        <div className='absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]'>
          <div
            className='relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]'
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
      </div>
    </div>
  );
}
