import '@/app/globals.css';
import type { Metadata } from 'next';
import localFont from 'next/font/local';

import { ReactQueryClientProvider } from '@/components/react-query-provider';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
}); 
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: {
    default: 'HermesSend - AWS SES Made Beautiful',
    template: '%s | HermesSend'
  },
  description: 'All the reliability of Amazon SES with an interface you\'ll actually enjoy using. Create, send, and track emails without touching the AWS console.',
  keywords: ['email marketing', 'AWS SES', 'email automation', 'email analytics', 'email campaigns', 'email infrastructure'],
  authors: [{ name: 'HermesSend Team' }],
  creator: 'HermesSend',
  publisher: 'HermesSend',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://hermessend.xyz',
    siteName: 'HermesSend',
    title: 'HermesSend - AWS SES Made Beautiful',
    description: 'All the reliability of Amazon SES with an interface you\'ll actually enjoy using. Create, send, and track emails without touching the AWS console.',
    images: [
      {
        url: '/og-image.jpg', // You'll need to add this image
        width: 1200,
        height: 630,
        alt: 'HermesSend - AWS SES Made Beautiful',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HermesSend - AWS SES Made Beautiful',
    description: 'All the reliability of Amazon SES with an interface you\'ll actually enjoy using. Create, send, and track emails without touching the AWS console.',
    images: ['/og-image.jpg'], // You'll need to add this image
    creator: '@hermessend', // Update with your Twitter handle
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png', // You'll need to add this image
  },
  manifest: '/site.webmanifest', // You'll need to create this file
  themeColor: '#050505',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark`}
      >
        <ReactQueryClientProvider>
          <NuqsAdapter>{children}</NuqsAdapter>
        </ReactQueryClientProvider>
      </body>
    </html>
  );
}
