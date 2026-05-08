'use client';

import { Home, LayoutGrid, Search, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useApp } from '@/lib/context';

export default function MobileNav() {
  const { cartCount, setIsCartOpen } = useApp();
  return (
    <div className="fixed inset-x-3 bottom-3 z-50 rounded-[2rem] border border-white/70 bg-white/90 px-3 py-2 shadow-2xl shadow-slate-300/50 backdrop-blur-xl md:hidden">
      <div className="grid grid-cols-4 items-center text-[10px] font-black uppercase tracking-tight text-slate-500">
        <Link href="/" className="flex flex-col items-center gap-1 rounded-2xl p-2 hover:bg-violet-50 hover:text-black"><Home size={19} />Home</Link>
        <Link href="/products" className="flex flex-col items-center gap-1 rounded-2xl p-2 hover:bg-violet-50 hover:text-black"><LayoutGrid size={19} />Shop</Link>
        <Link href="/products" className="flex flex-col items-center gap-1 rounded-2xl p-2 hover:bg-violet-50 hover:text-black"><Search size={19} />Search</Link>
        <button onClick={() => setIsCartOpen(true)} className="relative flex flex-col items-center gap-1 rounded-2xl p-2 hover:bg-violet-50 hover:text-black"><ShoppingBag size={19} />Cart{cartCount > 0 && <span className="absolute right-3 top-1 rounded-full bg-black px-1.5 text-[9px] text-white">{cartCount}</span>}</button>
      </div>
    </div>
  );
}
