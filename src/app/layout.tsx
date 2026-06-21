import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const geist = Geist({ variable: '--font-geist', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Lyfe — AI Life Agent',
  description: 'Your personal AI life agent. Plan your day, find ideas, and live your best lyfe.',
  manifest: '/manifest.json',
  themeColor: '#0f0f1a',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'Lyfe' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={geist.variable}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className="min-h-screen bg-[#0f0f1a] antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
