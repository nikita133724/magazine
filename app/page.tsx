'use client';

import { ArrowRight, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import ProductCarousel from '@/components/site/ProductCarousel';
import ProductImage from '@/components/site/ProductImage';
import SectionHeader from '@/components/site/SectionHeader';
import type { Product } from '@/lib/types';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch('/api/products').then(res => res.json()).then(data => Array.isArray(data) && setProducts(data)).catch(console.error);
  }, []);

  const bestsellers = useMemo(() => products.filter(product => product.is_bestseller).slice(0, 8), [products]);
  const newest = useMemo(() => products.filter(product => product.is_new).slice(0, 8), [products]);
  const featured = useMemo(() => products.filter(product => product.is_featured).slice(0, 8), [products]);

  const heroImage = products[0]?.main_image || products[0]?.image_url || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1600';

  return (
    <div className="overflow-hidden bg-white text-black">
      <section className="relative min-h-[78vh] bg-black text-white">
        <ProductImage src={heroImage} alt="thrtythr hero" priority className="absolute inset-0 opacity-55 grayscale" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/10" />
        <div className="relative z-10 mx-auto flex min-h-[78vh] max-w-screen-2xl flex-col justify-center px-4 py-20 md:px-8">
          <p className="mb-4 text-[10px] font-black uppercase tracking-[0.45em] text-violet-200">Streetwear archive</p>
          <h1 className="max-w-5xl text-6xl font-black uppercase italic leading-[0.82] tracking-tighter sm:text-8xl lg:text-[10rem]">Собери свой архив</h1>
          <p className="mt-8 max-w-md text-sm font-bold uppercase leading-7 tracking-[0.16em] text-white/60">Кроссовки, одежда и аксессуары с тёмной эстетикой. Теперь с полноценным каталогом, корзиной и админкой.</p>
          <div className="mt-10 flex flex-wrap gap-3"><Link href="/products" className="inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-xs font-black uppercase tracking-widest text-black transition hover:scale-105 hover:bg-violet-100">В каталог <ArrowRight size={16} /></Link><Link href="/admin" className="inline-flex items-center gap-3 rounded-full border border-white/20 px-8 py-4 text-xs font-black uppercase tracking-widest text-white transition hover:scale-105 hover:bg-white/10">Admin</Link></div>
        </div>
      </section>

      <ProductCarousel eyebrow="Best choice" title="Хиты продаж" products={bestsellers.length ? bestsellers : products.slice(0, 8)} />
      <ProductCarousel eyebrow="New drop" title="Новинки" products={newest.length ? newest : products.slice(4, 12)} />
      <ProductCarousel eyebrow="Curated" title="Рекомендуем" products={featured.length ? featured : products.slice(8, 16)} />

      <section className="mx-auto max-w-screen-2xl px-4 py-16 md:px-8">
        <SectionHeader eyebrow="Catalog" title="Категории" />
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ['Одежда', 'Apparel', '/products?category=apparel'],
            ['Обувь', 'Footwear', '/products?category=footwear'],
            ['Аксессуары', 'Accessories', '/products?category=accessories'],
          ].map(([title, subtitle, href]) => <Link key={title} href={href} className="rounded-[2rem] border border-slate-100 bg-slate-50 p-8 transition hover:-translate-y-1 hover:bg-violet-50"><p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">{subtitle}</p><h3 className="mt-3 text-4xl font-black uppercase italic tracking-tighter">{title}</h3></Link>)}
        </div>
      </section>

      <section className="mx-auto grid max-w-screen-2xl gap-4 px-4 pb-20 md:grid-cols-3 md:px-8">
        {[['Быстрая доставка', Truck], ['Возврат и обмен', RotateCcw], ['Checkout без оплаты', ShieldCheck]].map(([text, Icon]) => <div key={String(text)} className="rounded-[2rem] border border-violet-100 bg-white p-6 shadow-sm"><Icon className="mb-5 text-violet-600" size={26} /><h3 className="text-xl font-black uppercase italic tracking-tighter">{String(text)}</h3><p className="mt-2 text-sm text-slate-500">Production-style UX для дипломного проекта.</p></div>)}
      </section>
    </div>
  );
}
