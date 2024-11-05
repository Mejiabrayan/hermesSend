import { ThemeProvider } from '@/components/theme-provider';
import { ReactNode } from 'react';
import { Sidebar } from '@/components/sidebar';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute='class'
      defaultTheme='dark'
      disableTransitionOnChange
      enableSystem
    >
      <div className='flex h-screen'>
        <Sidebar />
        <main className='flex-1 overflow-y-auto'>
          <div className='container mx-auto p-6'>
            {children}
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
}
