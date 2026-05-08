'use client';

import { BarChart3, Boxes, LayoutDashboard, LogOut, Menu, ShoppingCart, Tags, Users, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';

const links = [
  { href: '/admin', label: 'Панель', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Товары', icon: Boxes },
  { href: '/admin/orders', label: 'Заказы', icon: ShoppingCart },
  { href: '/admin/customers', label: 'Клиенты', icon: Users },
  { href: '/admin/categories', label: 'Категории', icon: Tags },
  { href: '/admin/analytics', label: 'Аналитика', icon: BarChart3 },
];

export default function AdminShell({ children, title = 'Админка' }: { children: ReactNode; title?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('admin_session') !== 'ok') router.push('/admin/login');
    setReady(true);
  }, [router]);

  const logout = () => {
    localStorage.removeItem('admin_session');
    router.push('/admin/login');
  };

  const sidebar = <aside className="flex h-full w-72 flex-col border-r border-violet-100 bg-white p-5"><div className="mb-8 flex items-center justify-between"><Link href="/admin" className="font-mono text-2xl font-black tracking-tighter">thrtythr.admin</Link><button aria-label="Закрыть меню" onClick={() => setOpen(false)} className="rounded-full p-2 hover:bg-violet-50 lg:hidden"><X size={20} /></button></div><nav className="flex flex-col gap-2">{links.map(link => { const active = pathname === link.href; return <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-black transition ${active ? 'bg-violet-100 text-violet-900' : 'text-slate-700 hover:bg-violet-50 hover:text-black'}`}><link.icon size={18} aria-hidden="true" /> {link.label}</Link>; })}</nav><div className="mt-auto rounded-3xl bg-violet-50 p-4 text-sm text-slate-700"><p className="font-black uppercase tracking-widest text-black">Управление</p><p className="mt-2">Раздел для товаров, заказов, клиентов и аналитики.</p></div></aside>;

  if (!ready) return null;

  return <div className="min-h-screen bg-slate-50 text-black"><div className="fixed inset-y-0 left-0 z-40 hidden lg:block">{sidebar}</div>{open && <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm lg:hidden" onClick={() => setOpen(false)}><div onClick={event => event.stopPropagation()} className="h-full">{sidebar}</div></div>}<div className="lg:pl-72"><header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-xl"><div className="flex h-16 items-center justify-between px-4 md:px-8"><div className="flex items-center gap-3"><button aria-label="Открыть меню" onClick={() => setOpen(true)} className="rounded-full p-2 hover:bg-violet-50 lg:hidden"><Menu size={22} /></button><h1 className="text-xl font-black uppercase italic tracking-tighter md:text-2xl">{title}</h1></div><div className="flex items-center gap-3"><Link href="/" className="hidden rounded-full border border-slate-300 px-4 py-2 text-xs font-black uppercase tracking-widest text-black transition hover:bg-violet-50 md:block">На сайт</Link><button onClick={logout} className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-xs font-black uppercase tracking-widest text-white transition hover:scale-105 hover:bg-violet-800"><LogOut size={14} aria-hidden="true" /> Выйти</button></div></div></header><main className="px-4 py-6 md:px-8 md:py-8">{children}</main></div></div>;
}
