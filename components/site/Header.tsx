'use client';

import { Menu, Search, ShoppingBag, UserRound, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useApp } from '@/lib/context';

const labels = {
  RU: {
    catalog: 'Каталог', new: 'Новинки', best: 'Хиты', apparel: 'Одежда', footwear: 'Обувь', accessories: 'Аксессуары', checkout: 'Оформление', support: 'Поддержка', supportText: 'Поможем подобрать размер и оформить заказ.', account: 'Профиль', menu: 'Открыть меню', close: 'Закрыть меню', cart: 'Открыть корзину', search: 'Поиск товаров', promo: 'Бесплатная доставка от 50 000 ₸', language: 'Язык',
  },
  KZ: {
    catalog: 'Каталог', new: 'Жаңалар', best: 'Хиттер', apparel: 'Киім', footwear: 'Аяқ киім', accessories: 'Аксессуарлар', checkout: 'Тапсырыс', support: 'Қолдау', supportText: 'Өлшем таңдауға және тапсырыс беруге көмектесеміз.', account: 'Профиль', menu: 'Мәзірді ашу', close: 'Мәзірді жабу', cart: 'Себетті ашу', search: 'Тауар іздеу', promo: '50 000 ₸ бастап тегін жеткізу', language: 'Тіл',
  },
};

export default function Header() {
  const pathname = usePathname();
  const { cartCount, setIsCartOpen, lang, setLang } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const l = labels[lang];
  const navLinks = [
    { href: '/products', label: l.catalog },
    { href: '/products?tag=new', label: l.new },
    { href: '/products?tag=bestseller', label: l.best },
    { href: '/products?category=apparel', label: l.apparel },
    { href: '/products?category=footwear', label: l.footwear },
    { href: '/products?category=accessories', label: l.accessories },
  ];

  const languageSwitch = <div className="rounded-full bg-slate-100 p-0.5 text-[9px] font-black"><button aria-label="Русский язык" onClick={() => setLang('RU')} className={`rounded-full px-2 py-1 ${lang === 'RU' ? 'bg-black text-white' : 'text-slate-700'}`}>RU</button><button aria-label="Қазақ тілі" onClick={() => setLang('KZ')} className={`rounded-full px-2 py-1 ${lang === 'KZ' ? 'bg-black text-white' : 'text-slate-700'}`}>KZ</button></div>;

  return (
    <>
      <div className="bg-black px-4 py-2 text-center text-[10px] font-black uppercase tracking-[0.18em] text-white">{l.promo}</div>
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-screen-2xl items-center justify-between gap-4 px-4 md:h-20 md:px-8">
          <div className="flex items-center gap-3 lg:gap-10">
            <button aria-label={l.menu} onClick={() => setMenuOpen(true)} className="rounded-full p-2 transition hover:bg-violet-50 lg:hidden"><Menu size={22} /></button>
            <Link href="/" className="flex items-baseline font-mono text-2xl font-black tracking-tighter md:text-3xl"><span className="text-zinc-500">thrtythr</span><span>.shop</span></Link>
            <nav className="hidden items-center gap-6 text-[12px] font-black uppercase tracking-[0.16em] lg:flex">{navLinks.map(link => <Link key={link.href} href={link.href} className={`transition hover:text-violet-700 ${pathname === link.href ? 'text-violet-700' : 'text-slate-800'}`}>{link.label}</Link>)}</nav>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <div className="hidden items-center gap-2 rounded-full bg-slate-100 px-4 py-2 xl:flex"><Search size={16} className="text-slate-600" aria-hidden="true" /><input aria-label={l.search} className="w-44 bg-transparent text-sm outline-none placeholder:text-slate-600" placeholder={l.search} /></div>
            <div className="hidden md:block">{languageSwitch}</div>
            <Link href="/account" aria-label={l.account} className="hidden rounded-full p-2 transition hover:bg-violet-50 md:block"><UserRound size={20} /></Link>
            <button aria-label={l.cart} onClick={() => setIsCartOpen(true)} className="relative rounded-full p-2 transition hover:bg-violet-50"><ShoppingBag size={21} />{cartCount > 0 && <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-black px-1 text-[10px] font-black text-white">{cartCount}</span>}</button>
          </div>
        </div>
      </header>
      <AnimatePresence>{menuOpen && <><motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMenuOpen(false)} className="fixed inset-0 z-[90] bg-black/40 backdrop-blur-sm lg:hidden" /><motion.aside initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', damping: 28, stiffness: 240 }} className="fixed inset-y-0 left-0 z-[91] flex w-[86vw] max-w-sm flex-col bg-white p-5 shadow-2xl lg:hidden"><div className="mb-6 flex items-center justify-between"><Link href="/" onClick={() => setMenuOpen(false)} className="font-mono text-2xl font-black tracking-tighter">thrtythr.shop</Link><button aria-label={l.close} onClick={() => setMenuOpen(false)} className="rounded-full p-2 hover:bg-slate-100"><X size={22} /></button></div><div className="mb-4 flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2"><span className="text-[10px] font-black uppercase tracking-widest text-slate-700">{l.language}</span>{languageSwitch}</div><nav className="flex flex-col gap-1.5">{navLinks.map(link => <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className="rounded-2xl px-4 py-3.5 text-sm font-black uppercase tracking-[0.16em] transition hover:bg-violet-50 hover:text-violet-700">{link.label}</Link>)}<Link href="/account" onClick={() => setMenuOpen(false)} className="rounded-2xl px-4 py-3.5 text-sm font-black uppercase tracking-[0.16em] transition hover:bg-violet-50 hover:text-violet-700">{l.account}</Link><Link href="/checkout" onClick={() => setMenuOpen(false)} className="rounded-2xl px-4 py-3.5 text-sm font-black uppercase tracking-[0.16em] transition hover:bg-violet-50 hover:text-violet-700">{l.checkout}</Link></nav><div className="mt-auto rounded-3xl bg-violet-50 p-5 text-sm text-slate-700"><p className="font-black uppercase tracking-widest text-black">{l.support}</p><p className="mt-2">{l.supportText}</p></div></motion.aside></>}</AnimatePresence>
    </>
  );
}
