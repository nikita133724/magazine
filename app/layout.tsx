import './globals.css';
import { AppProvider } from '@/lib/context';
import SiteShell from '@/components/site/SiteShell';

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
