'use client';

import { Menu, Search, ShoppingBag, UserRound, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useApp } from '@/lib/context';

const navLinks = [
  { href: '/products', label: 'Каталог' },
  { href: '/products?tag=new', label: 'Новинки' },
  { href: '/products?tag=bestseller', label: 'Хиты' },
  { href: '/products?category=apparel', label: 'Одежда' },
  { href: '/products?category=footwear', label: 'Обувь' },
  { href: '/products?category=accessories', label: 'Аксессуары' },
];

export default function Header() {
  const pathname = usePathname();
  const { cartCount, setIsCartOpen, lang, setLang, t } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <>
      <div className="bg-black px-4 py-2 text-center text-[10px] font-black uppercase tracking-[0.24em] text-white">{t('new_arrivals')}</div>
      <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-screen-2xl items-center justify-between gap-4 px-4 md:h-20 md:px-8">
          <div className="flex items-center gap-3 lg:gap-10">
            <button onClick={() => setMenuOpen(true)} className="rounded-full p-2 transition hover:bg-violet-50 lg:hidden"><Menu size={22} /></button>
            <Link href="/" className="flex items-baseline font-mono text-2xl font-black tracking-tighter md:text-3xl"><span className="text-zinc-300">thrtythr</span><span>.shop</span></Link>
            <nav className="hidden items-center gap-6 text-[12px] font-black uppercase tracking-[0.18em] lg:flex">{navLinks.map(link => <Link key={link.href} href={link.href} className={`transition hover:text-violet-600 ${pathname === link.href ? 'text-violet-600' : 'text-slate-700'}`}>{link.label}</Link>)}</nav>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <div className="hidden items-center gap-2 rounded-full bg-slate-100 px-4 py-2 xl:flex"><Search size={16} className="text-slate-400" /><input className="w-44 bg-transparent text-sm outline-none placeholder:text-slate-400" placeholder={t('search')} /></div>
            <div className="hidden rounded-full bg-slate-100 p-1 text-[10px] font-black md:flex"><button onClick={() => setLang('RU')} className={`rounded-full px-3 py-1.5 ${lang === 'RU' ? 'bg-black text-white' : 'text-slate-400'}`}>RU</button><button onClick={() => setLang('KZ')} className={`rounded-full px-3 py-1.5 ${lang === 'KZ' ? 'bg-black text-white' : 'text-slate-400'}`}>KZ</button></div>
            <Link href="/admin" className="hidden rounded-full border border-slate-200 px-4 py-2 text-[10px] font-black uppercase tracking-widest transition hover:border-violet-200 hover:bg-violet-50 xl:block">Admin</Link>
            <button className="hidden rounded-full p-2 transition hover:bg-violet-50 md:block"><UserRound size={20} /></button>
            <button onClick={() => setIsCartOpen(true)} className="relative rounded-full p-2 transition hover:bg-violet-50"><ShoppingBag size={21} />{cartCount > 0 && <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-black px-1 text-[10px] font-black text-white">{cartCount}</span>}</button>
          </div>
        </div>
      </header>
      <AnimatePresence>{menuOpen && <><motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMenuOpen(false)} className="fixed inset-0 z-[90] bg-black/40 backdrop-blur-sm lg:hidden" /><motion.aside initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', damping: 28, stiffness: 240 }} className="fixed inset-y-0 left-0 z-[91] flex w-[86vw] max-w-sm flex-col bg-white p-6 shadow-2xl lg:hidden"><div className="mb-8 flex items-center justify-between"><Link href="/" onClick={() => setMenuOpen(false)} className="font-mono text-2xl font-black tracking-tighter">thrtythr.shop</Link><button onClick={() => setMenuOpen(false)} className="rounded-full p-2 hover:bg-slate-100"><X size={22} /></button></div><nav className="flex flex-col gap-2">{navLinks.map(link => <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className="rounded-2xl px-4 py-4 text-sm font-black uppercase tracking-[0.18em] transition hover:bg-violet-50 hover:text-violet-700">{link.label}</Link>)}<Link href="/checkout" onClick={() => setMenuOpen(false)} className="rounded-2xl px-4 py-4 text-sm font-black uppercase tracking-[0.18em] transition hover:bg-violet-50 hover:text-violet-700">Checkout</Link><Link href="/admin" onClick={() => setMenuOpen(false)} className="rounded-2xl px-4 py-4 text-sm font-black uppercase tracking-[0.18em] transition hover:bg-violet-50 hover:text-violet-700">Admin</Link></nav><div className="mt-auto rounded-3xl bg-violet-50 p-5 text-sm text-slate-600"><p className="font-black uppercase tracking-widest text-black">Support</p><p className="mt-2">Поможем подобрать размер и оформить заказ.</p></div></motion.aside></>}</AnimatePresence>
    </>
  );
}
