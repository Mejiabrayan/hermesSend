import { ThemeProvider } from '@/components/theme-provider';
import { ReactNode } from 'react';
import { Sidebar } from '@/components/sidebar';
import { ReactQueryClientProvider } from '@/components/react-query-provider';
import { Toaster } from "@/components/ui/toaster"


export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute='class'
      defaultTheme='dark'
      disableTransitionOnChange
      enableSystem
    >
      <ReactQueryClientProvider>
        <div className='flex h-screen'>
          <Sidebar />
          <main className='flex-1 overflow-y-auto'>
            <div className='container mx-auto p-6'>
              {children}
              
            </div>
            <Toaster />

          </main>
        </div>
      </ReactQueryClientProvider>
    </ThemeProvider>
  );
}
