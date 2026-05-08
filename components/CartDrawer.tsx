'use client';

import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, ShoppingBag } from 'lucide-react';
import { useApp } from '@/lib/context';
import Image from 'next/image';

export default function CartDrawer() {
  const { cart, removeFromCart, isCartOpen, setIsCartOpen, t } = useApp();

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/50 z-[100] backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[101] shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b flex justify-between items-center bg-black text-white">
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} />
                <h2 className="font-black uppercase tracking-tighter italic text-xl">{t('cart')}</h2>
              </div>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-4">
                  <ShoppingBag size={48} strokeWidth={1} />
                  <p className="font-bold uppercase text-xs tracking-widest">{t('empty_cart')}</p>
                </div>
              ) : (
                cart.map((item) => (
                  <motion.div 
                    layout
                    key={item.id} 
                    className="flex gap-4 group"
                  >
                    <div className="relative w-24 h-32 bg-slate-100 overflow-hidden">
                      <Image 
                        src={item.image} 
                        alt={item.name} 
                        fill 
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-black uppercase italic tracking-tighter text-sm line-clamp-1">{item.name}</h3>
                        <p className="text-xs font-bold text-slate-400 mt-1">{item.quantity} x {item.price.toLocaleString()} ₸</p>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-black text-sm">{(item.price * item.quantity).toLocaleString()} ₸</span>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-slate-300 hover:text-black transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t bg-slate-50">
                <div className="flex justify-between items-end mb-6">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('subtotal')}</span>
                  <span className="text-2xl font-black">{total.toLocaleString()} ₸</span>
                </div>
                <button className="w-full bg-black text-white py-5 font-black uppercase text-sm tracking-widest hover:bg-zinc-800 transition-all">
                  {t('checkout')}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
