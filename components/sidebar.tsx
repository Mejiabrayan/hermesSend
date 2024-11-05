'use client'

import Link from 'next/link'

export function Sidebar() {
  return (
    <aside className='w-64 border-r border-white/10 h-screen p-4 hidden md:block'>
      <div className='flex flex-col h-full'>
        <div className='space-y-4'>
          <h2 className='text-xl font-bold'>Dashboard</h2>
          <nav className='space-y-2'>
            <Link 
              href='/dashboard'
              className='flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-white/5'
            >
              <span>Images</span>
            </Link>
            {/* Add more nav items as needed */}
          </nav>
        </div>
      </div>
    </aside>
  )
}