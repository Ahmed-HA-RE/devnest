import type { Metadata } from 'next';
import { Inter, Geist } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import Providers from '@/components/providers/providers';
import { APP_DESCRIPTION, APP_NAME } from '@/lib/constants/app';
import { Toaster } from '@/components/ui/sonner';

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: {
    template: '%s | DevNest',
    default: 'DevNest – Centralized Developer Knowledge Hub',
  },
  description: APP_DESCRIPTION,
  applicationName: APP_NAME,
  keywords: [
    'developer tools',
    'code snippets',
    'developer knowledge base',
    'command reference',
    'prompt library',
    'notes app',
    'bookmarks manager',
    'DevNest',
  ],
  creator: 'DevNest',
  openGraph: {
    title: APP_NAME,
    description: APP_DESCRIPTION,
    siteName: APP_NAME,
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: APP_NAME,
    description: APP_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='en'
      className={cn(inter.className, 'font-sans', geist.variable)}
      suppressHydrationWarning
    >
      <body className='min-h-full flex flex-col'>
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
