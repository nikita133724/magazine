'use client';

import { Home, LayoutGrid, Search, UserRound } from 'lucide-react';
import Link from 'next/link';
import { useApp } from '@/lib/context';

const labels = {
  RU: { home: 'Главная', shop: 'Каталог', search: 'Поиск', account: 'Профиль' },
  KZ: { home: 'Басты', shop: 'Каталог', search: 'Іздеу', account: 'Профиль' },
};

export default function MobileNav() {
  const { lang } = useApp();
  const l = labels[lang];
  return (
    <div className="fixed inset-x-3 bottom-3 z-50 rounded-[2rem] border border-slate-200 bg-white/95 px-3 py-2 shadow-2xl shadow-slate-300/50 backdrop-blur-xl md:hidden">
      <div className="grid grid-cols-4 items-center text-[10px] font-black uppercase tracking-tight text-slate-700">
        <Link href="/" className="flex flex-col items-center gap-1 rounded-2xl p-2 hover:bg-violet-50 hover:text-black"><Home size={18} aria-hidden="true" />{l.home}</Link>
        <Link href="/products" className="flex flex-col items-center gap-1 rounded-2xl p-2 hover:bg-violet-50 hover:text-black"><LayoutGrid size={18} aria-hidden="true" />{l.shop}</Link>
        <Link href="/products" className="flex flex-col items-center gap-1 rounded-2xl p-2 hover:bg-violet-50 hover:text-black"><Search size={18} aria-hidden="true" />{l.search}</Link>
        <Link href="/account" className="flex flex-col items-center gap-1 rounded-2xl p-2 hover:bg-violet-50 hover:text-black"><UserRound size={18} aria-hidden="true" />{l.account}</Link>
      </div>
    </div>
  );
}
