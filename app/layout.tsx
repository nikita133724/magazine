import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/lib/context';
import SiteShell from '@/components/site/SiteShell';

export const metadata: Metadata = {
  title: 'thrtythr.shop — интернет-магазин одежды и обуви',
  description: 'Каталог одежды, обуви и аксессуаров thrtythr.shop.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <AppProvider>
          <SiteShell>{children}</SiteShell>
        </AppProvider>
      </body>
    </html>
  );
}
