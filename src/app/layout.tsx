import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import Image from 'next/image';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'SRC FFL',
  description: 'A decade of fantasy football data and analytics.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <body className={`${inter.variable} font-sans bg-slate-950 text-slate-50 antialiased overflow-x-hidden w-full`}>
        <nav className="border-b border-slate-800 bg-slate-900 sticky top-0 z-10 overflow-x-auto no-scrollbar w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 min-w-max">
              <div className="flex items-center shrink-0">
                <Link href="/" className="font-bold text-xl flex items-center gap-2 mr-6 sm:mr-10">
                  <span className="text-2xl">🏈</span>
                  <span style={{ color: '#C8102E' }}>SRC</span>
                  <span style={{ color: '#F1B82D' }}>FFL</span>
                </Link>
                <div className="flex items-baseline space-x-1 sm:space-x-4">
                  <Link href="/" className="hover:text-emerald-400 px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap">Dashboard</Link>
                  <Link href="/managers" className="hover:text-emerald-400 px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap">Managers</Link>
                  <Link href="/seasons" className="hover:text-emerald-400 px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap">Seasons</Link>
                  <Link href="/rivalries" className="hover:text-emerald-400 px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap">Rivalries</Link>
                  <Link href="/analytics" className="hover:text-emerald-400 px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap">Deep Analytics</Link>
                </div>
              </div>
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}