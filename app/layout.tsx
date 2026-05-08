import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/lib/context';
import CartDrawer from '@/components/CartDrawer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'NexusStore | Smart E-Commerce',
  description: 'Full-stack thesis project with Next.js and Django',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} dark`}>
      <body className="bg-white text-black font-sans antialiased" suppressHydrationWarning>
        <AppProvider>
          {children}
          <CartDrawer />
        </AppProvider>
      </body>
    </html>
  );
}
