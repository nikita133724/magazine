'use client';

import { motion } from 'motion/react';
import { useApp } from '@/lib/context';
import { ArrowRight, MessageCircle, Search, ShoppingBag, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface ApiProduct {
  id: number;
  name: string;
  price: number | string;
  sub_category?: string | null;
  image_url?: string | null;
}

interface FeaturedProduct {
  id: number;
  name: string;
  price: number;
  subCategory: string;
  imageUrl: string;
}

const fallbackImage = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600';

function normalizeProduct(product: ApiProduct): FeaturedProduct {
  const price = Number(product.price);

  return {
    id: product.id,
    name: product.name,
    price: Number.isFinite(price) ? price : 0,
    subCategory: product.sub_category ?? '',
    imageUrl: product.image_url || fallbackImage,
  };
}

export default function HomePage() {
  const { lang, setLang, t, cart, setIsCartOpen, addToCart } = useApp();
  const [featuredProducts, setFeaturedProducts] = useState<FeaturedProduct[]>([]);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const categories = [
    { name: t('sneakers'), img: 'https://images.unsplash.com/photo-1628149422079-0efc0683a311?auto=format&fit=crop&q=80&w=800', size: 'col-span-12 md:col-span-8' },
    { name: t('hoodies'), img: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=800', size: 'col-span-12 md:col-span-4' },
    { name: t('tshirts'), img: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&q=80&w=800', size: 'col-span-12 md:col-span-4' },
    { name: t('accessories'), img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800', size: 'col-span-12 md:col-span-8' },
  ];

  useEffect(() => {
    let ignore = false;

    async function loadProducts() {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error(`Products API failed with ${response.status}`);

        const data: unknown = await response.json();
        if (!ignore && Array.isArray(data)) {
          setFeaturedProducts(data.map(product => normalizeProduct(product as ApiProduct)).slice(0, 8));
        }
      } catch (error) {
        console.error('Error fetching featured products:', error);
      }
    }

    loadProducts();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className="bg-white text-black min-h-screen selection:bg-black selection:text-white font-sans overflow-x-hidden">
      <div className="bg-black text-white text-[10px] py-2 flex justify-center items-center gap-6 font-black uppercase tracking-widest px-4 text-center">
        <span>{t('new_arrivals')}</span>
        <div className="flex gap-2 border-l border-zinc-800 pl-4 h-4 items-center">
          <button onClick={() => setLang('RU')} className={`transition-colors ${lang === 'RU' ? 'text-white' : 'text-zinc-500'}`}>RU</button>
          <button onClick={() => setLang('KZ')} className={`transition-colors ${lang === 'KZ' ? 'text-white' : 'text-zinc-500'}`}>KZ</button>
        </div>
      </div>

      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-screen-2xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <Link href="/" className="text-3xl font-black tracking-tighter flex items-center group font-mono">
              <span className="text-zinc-300">thrtythr</span><span className="text-black">.shop</span>
            </Link>
            <nav className="hidden lg:flex items-center gap-8 text-[13px] font-bold uppercase tracking-tight">
              <Link href="/products" className="decoration-2 hover:underline underline-offset-8 decoration-black">{t('men')}</Link>
              <Link href="/products" className="decoration-2 hover:underline underline-offset-8 decoration-black">{t('women')}</Link>
              <Link href="/products" className="text-rose-600">{t('new_featured')}</Link>
            </nav>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex relative group">
              <input type="text" placeholder={t('search')} className="bg-slate-100/50 border-none rounded-none py-2 px-4 pr-10 text-sm focus:ring-0 focus:bg-slate-100 w-48 transition-all" />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-slate-100 rounded-full transition-colors"><User size={20} /></button>
              <button onClick={() => setIsCartOpen(true)} className="p-2 hover:bg-slate-100 rounded-full transition-colors relative">
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <motion.span key={cartCount} initial={{ scale: 0, y: -5 }} animate={{ scale: 1, y: 0 }} className="absolute -top-1 -right-1 w-5 h-5 bg-black text-white text-[10px] flex items-center justify-center font-black rounded-full border-2 border-white">
                    {cartCount}
                  </motion.span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <section className="relative h-[90vh] overflow-hidden bg-white">
        <motion.div initial={{ scale: 1.1, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1.5, ease: 'easeOut' }} className="absolute inset-0">
          <Image src="https://images.unsplash.com/photo-1620121692029-d088224ddc74?auto=format&fit=crop&q=80&w=2000" alt="Hero Visual" fill className="w-full h-full object-cover grayscale brightness-50 contrast-125" priority referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/10" />
        </motion.div>

        <div className="relative z-10 h-full max-w-screen-2xl mx-auto px-4 md:px-8 flex flex-col justify-center">
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5, duration: 0.8 }}>
            <div className="flex items-center gap-4 mb-4">
              <span className="h-0.5 w-12 bg-white" />
              <span className="text-white text-[10px] font-black uppercase tracking-[0.4em]">Opium Collection v1</span>
            </div>
            <h2 className="text-white text-7xl md:text-[10rem] font-black italic uppercase tracking-tighter leading-[0.8] mb-12 mix-blend-difference">
              {t('hero').split(' ').map((word, index) => (
                <motion.span key={`${word}-${index}`} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 + index * 0.1 }} className="block">
                  {word}
                </motion.span>
              ))}
            </h2>
            <div className="flex items-center gap-8">
              <Link href="/products" className="group flex items-center gap-4 bg-white text-black px-12 py-5 font-black uppercase text-xs tracking-widest hover:bg-black hover:text-white transition-all">
                {t('shop')} <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
              </Link>
              <p className="hidden md:block text-white/50 text-[10px] font-bold uppercase tracking-widest max-w-[200px] leading-relaxed">
                Underground archive and niche luxury footwear for the modern collector.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <button className="fixed bottom-8 right-8 z-[60] bg-black text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform group">
        <MessageCircle size={24} />
        <span className="absolute right-full mr-4 bg-black text-white text-[10px] py-1 px-3 rounded uppercase font-black tracking-widest opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap">
          {t('support')}
        </span>
      </button>

      <section className="py-24 border-t border-slate-100">
        <div className="max-w-screen-2xl mx-auto px-4 md:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2 block">{t('top_picks')}</span>
              <h2 className="text-4xl font-black uppercase tracking-tighter italic">{t('featured')}</h2>
            </div>
            <Link href="/products" className="text-xs font-black uppercase tracking-widest border-b-2 border-black pb-1 hover:text-slate-500 hover:border-slate-300 transition-all">{t('view_all')}</Link>
          </div>

          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-8 snap-x snap-mandatory">
            {featuredProducts.map((product, index) => (
              <motion.div key={product.id} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="min-w-[280px] md:min-w-[320px] snap-start group cursor-pointer">
                <div className="relative aspect-[3/4] bg-slate-100 overflow-hidden mb-4 group">
                  <Image src={product.imageUrl} alt={product.name} fill className="object-cover grayscale hover:grayscale-0 transition-all duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
                  <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <button onClick={() => addToCart({ id: product.id, name: product.name, price: product.price, image: product.imageUrl })} className="w-full bg-black text-white py-4 font-black uppercase text-[10px] tracking-widest hover:bg-zinc-800 transition-colors shadow-2xl">
                      {t('add_to_cart')}
                    </button>
                  </div>
                </div>
                <h3 className="font-black uppercase italic tracking-tighter text-sm line-clamp-1">{product.name}</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{product.subCategory}</p>
                <div className="mt-2 text-lg font-black">{product.price.toLocaleString()} ₸</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 max-w-screen-2xl mx-auto px-4 md:px-8">
        <div className="mb-12 flex justify-between items-end">
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic leading-none">{t('catalog')}</h2>
          <Link href="/products" className="text-xs font-black uppercase tracking-widest mb-2 border-b-2 border-black pb-1">{t('view_all')}</Link>
        </div>
        <div className="grid grid-cols-12 gap-4">
          {categories.map(category => (
            <motion.div key={category.name} whileHover={{ y: -5 }} className={`${category.size} group relative h-[400px] overflow-hidden bg-slate-100`}>
              <Image src={category.img} alt={category.name} fill className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-10 left-10 flex flex-col items-start gap-4">
                <h4 className="text-white text-2xl font-black italic tracking-tighter drop-shadow-xl">{category.name}</h4>
                <div className="bg-white text-black font-black text-[10px] uppercase px-4 py-2 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">{t('explore')}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="bg-slate-50 border-t border-slate-200 py-16">
        <div className="max-w-screen-2xl mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-black uppercase tracking-widest text-slate-400">
          <div className="flex gap-8">
            <Link href="/products" className="hover:text-black transition-colors">{t('products')}</Link>
            <Link href="/" className="hover:text-black transition-colors">{t('privacy')}</Link>
            <Link href="/" className="hover:text-black transition-colors">{t('terms')}</Link>
          </div>
          <div>© 2024 thrtythr.shop - {t('rights')}</div>
        </div>
      </footer>
    </div>
  );
}
