'use client';

import { usePathname } from 'next/navigation';
import CartDrawer from '@/components/CartDrawer';
import Footer from './Footer';
import Header from './Header';
import MobileNav from './MobileNav';

export default function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const admin = pathname.startsWith('/admin');

  if (admin) return <>{children}</>;

  return (
    <>
      <Header />
      <main className="pb-28 md:pb-0">{children}</main>
      <Footer />
      <MobileNav />
      <CartDrawer />
    </>
  );
}
