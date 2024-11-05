'use client'

import Link from 'next/link'
import { signOutAction } from '@/utils/actions'
import { 
  CreditCard, 
  LogOut, 
  User,
  ImageIcon,
  MoreVertical
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from './ui/button';

export function Sidebar() {
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
            <span className='text-lg font-bold'>Savor Moments</span>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className='flex-1 space-y-2 py-4'>
          <Link 
            href='/dashboard'
            className='flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-white/5 transition-colors'
          >
            <ImageIcon className="w-4 h-4" />
            <span>Images</span>
          </Link>
        </nav>

        {/* User Profile & Dropdown */}
        <div className='border-t border-white/10 pt-4'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="w-full justify-start px-2 hover:bg-white/5"
              >
                <div className='flex items-center gap-2'>
                  <div className='h-8 w-8 rounded-full bg-white/10 flex items-center justify-center'>
                    <User className="h-4 w-4" />
                  </div>
                  <div className='flex-1 text-left'>
                    <p className='text-sm font-medium'>shadcn</p>
                    <p className='text-xs text-zinc-400'>m@example.com</p>
                  </div>
                  <MoreVertical className="h-4 w-4 text-zinc-400" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link href="/dashboard/account" className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  <span>Account</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/billing" className="flex items-center">
                  <CreditCard className="mr-2 h-4 w-4" />
                  <span>Billing</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-red-600 focus:text-red-600"
                asChild
              >
                <form action={signOutAction} className="w-full">
                  <button type="submit" className="flex items-center w-full">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </form>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </aside>
  )
}