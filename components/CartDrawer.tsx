'use client';

import { AnimatePresence, motion } from 'motion/react';
import { ShoppingBag, Trash2, X } from 'lucide-react';
import Link from 'next/link';
import { useApp } from '@/lib/context';
import ProductImage from '@/components/site/ProductImage';

export default function CartDrawer() {
  const { cart, cartTotal, removeFromCart, updateCartQuantity, isCartOpen, setIsCartOpen, t } = useApp();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCartOpen(false)} className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm" />
          <motion.aside initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 28, stiffness: 220 }} className="fixed right-0 top-0 z-[101] flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b bg-black p-5 text-white">
              <div className="flex items-center gap-3"><ShoppingBag size={20} /><h2 className="text-xl font-black uppercase italic tracking-tighter">{t('cart')}</h2></div>
              <button onClick={() => setIsCartOpen(false)} className="rounded-full p-2 transition hover:bg-white/10"><X size={24} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              {cart.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-4 text-center text-slate-400"><ShoppingBag size={52} strokeWidth={1} /><p className="text-xs font-black uppercase tracking-widest">{t('empty_cart')}</p><Link onClick={() => setIsCartOpen(false)} href="/products" className="rounded-full bg-black px-6 py-3 text-xs font-black uppercase tracking-widest text-white transition hover:scale-105 hover:bg-violet-700">{t('catalog')}</Link></div>
              ) : (
                <div className="space-y-5">
                  {cart.map(item => (
                    <motion.div layout key={item.cartKey} className="flex gap-4 rounded-3xl border border-slate-100 bg-white p-3 shadow-sm">
                      <Link onClick={() => setIsCartOpen(false)} href={`/products/${item.id}`} className="relative h-28 w-24 shrink-0 overflow-hidden rounded-2xl bg-slate-100"><ProductImage src={item.image} alt={item.name} /></Link>
                      <div className="flex min-w-0 flex-1 flex-col justify-between">
                        <div><Link onClick={() => setIsCartOpen(false)} href={`/products/${item.id}`} className="line-clamp-2 text-sm font-black uppercase italic tracking-tighter hover:text-violet-700">{item.name}</Link><p className="mt-1 text-[11px] font-bold uppercase tracking-widest text-slate-400">{item.size || 'OS'} · {item.price.toLocaleString()} ₸</p></div>
                        <div className="flex items-center justify-between gap-3"><div className="flex items-center rounded-full border border-slate-200"><button onClick={() => updateCartQuantity(item.cartKey, item.quantity - 1)} className="px-3 py-2 hover:bg-violet-50">-</button><span className="min-w-7 text-center text-xs font-black">{item.quantity}</span><button onClick={() => updateCartQuantity(item.cartKey, item.quantity + 1)} className="px-3 py-2 hover:bg-violet-50">+</button></div><button onClick={() => removeFromCart(item.cartKey)} className="rounded-full p-2 text-slate-300 transition hover:bg-red-50 hover:text-red-500"><Trash2 size={16} /></button></div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
            {cart.length > 0 && <div className="border-t bg-slate-50 p-5"><div className="mb-5 flex items-end justify-between"><span className="text-xs font-black uppercase tracking-widest text-slate-400">{t('subtotal')}</span><span className="text-3xl font-black tracking-tighter">{cartTotal.toLocaleString()} ₸</span></div><Link onClick={() => setIsCartOpen(false)} href="/checkout" className="block w-full rounded-2xl bg-black py-4 text-center text-sm font-black uppercase tracking-widest text-white transition hover:scale-[1.01] hover:bg-violet-700">{t('checkout')}</Link></div>}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
