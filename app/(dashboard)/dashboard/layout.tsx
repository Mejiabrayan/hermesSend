import { ThemeProvider } from '@/components/theme-provider';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body>
        <main>
          <ThemeProvider
            attribute='class'
            defaultTheme='dark'
            disableTransitionOnChange
            enableSystem
          >
            {children}
          </ThemeProvider>
        </main>
      </body>
    </html>
  );
}
