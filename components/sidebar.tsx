'use client';

import Link from 'next/link';
import { signOutAction, getUserProfile } from '@/utils/actions';
import {
  LogOut,
  User,
  ImageIcon,
  MoreVertical,
  Settings,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from './ui/button';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';

// Memoize static menu items
const menuItems = [
  {
    label: 'Dashboard',
    icon: ImageIcon,
    href: '/dashboard',
  },
  {
    label: 'Images',
    icon: ImageIcon,
    href: '/dashboard/images',
  },
] as const;

// Extract ProfileSkeleton to avoid re-renders
const ProfileSkeleton = () => (
  <div className='flex items-center gap-2 overflow-hidden'>
    <div className='h-8 w-8 rounded-full bg-white/10' />
    <div className='flex-1'>
      <div className='h-4 w-20 bg-white/10 rounded animate-pulse' />
      <div className='h-3 w-24 bg-white/10 rounded mt-1 animate-pulse' />
    </div>
    <MoreVertical className='h-4 w-4 text-zinc-400' />
  </div>
);

// Extract UserInfo component to isolate re-renders
const UserInfo = ({ 
  profile 
}: { 
  profile: Awaited<ReturnType<typeof getUserProfile>> | undefined 
}) => (
  <div className='flex items-center gap-2 overflow-hidden'>
    <div className='h-8 w-8 rounded-full bg-white/10 flex items-center justify-center overflow-hidden'>
      {profile?.data?.photo_url ? (
        <Image
          src={profile.data.photo_url}
          alt="Profile"
          width={32}
          height={32}
          className="h-full w-full object-cover"
          unoptimized
        />
      ) : (
        <User className='h-4 w-4' />
      )}
    </div>
    <div className='flex-1 text-left'>
      <p className='text-sm font-medium'>
        {profile?.data?.username || ''}
      </p>
      <p className='text-xs text-zinc-400'>
        {profile?.data?.email}
      </p>
    </div>
    <MoreVertical className='h-4 w-4 text-zinc-400' />
  </div>
);

// Extract NavItem to memoize menu items
const NavItem = ({ item }: { item: typeof menuItems[number] }) => (
  <Link
    href={item.href}
    className='flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-white/5 transition-colors'
  >
    <item.icon className='w-4 h-4' />
    <span>{item.label}</span>
  </Link>
);

export function Sidebar() {
  const { data: profile, isLoading } = useQuery({
    queryKey: ['userProfile'],
    queryFn: () => getUserProfile(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  return (
    <aside className='w-64 border-r border-white/10 h-screen p-4 hidden md:block'>
      <div className='flex flex-col h-full'>
        <div className='flex items-center px-2 py-4'>
          <div className='flex items-center gap-2'>
            <svg
              className='w-8 h-8 text-white'
              viewBox='0 0 24 24'
              fill='currentColor'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path d='M12 2L1 21h22L12 2zm0 3.99L19.53 19H4.47L12 5.99z' />
            </svg>
            <span className='text-lg font-bold'>Momentus</span>
          </div>
        </div>

        <nav className='flex-1 space-y-2 py-4'>
          {menuItems.map((item) => (
            <NavItem key={item.href} item={item} />
          ))}
        </nav>

        <div className='border-t border-white/10 pt-4'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='ghost'
                className='w-full justify-start px-2 hover:bg-white/5'
              >
                {isLoading || !profile ? (
                  <ProfileSkeleton />
                ) : (
                  <UserInfo profile={profile} />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-48'>
              <DropdownMenuItem asChild>
                <Link href='/dashboard/settings' className='flex items-center'>
                  <Settings className='mr-2 h-4 w-4' />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className='text-red-600 focus:text-red-600'
                asChild
              >
                <form action={signOutAction} className='w-full'>
                  <button type='submit' className='flex items-center w-full'>
                    <LogOut className='mr-2 h-4 w-4' />
                    <span>Logout</span>
                  </button>
                </form>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </aside>
  );
}
