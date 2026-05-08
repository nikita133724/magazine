'use client';

import { ArrowRight, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import ProductCarousel from '@/components/site/ProductCarousel';
import ProductImage from '@/components/site/ProductImage';
import SectionHeader from '@/components/site/SectionHeader';
import { useApp } from '@/lib/context';
import type { Product } from '@/lib/types';

const homeText = {
  RU: {
    eyebrow: 'STREETWEAR STILE',
    title: 'СОБЕРИ СВОЙ СТИЛЬ',
    description: 'КРОССОВКИ, ОДЕЖДА И АКСЕССУАРЫ С ТЁМНОЙ ЭСТЕТИКОЙ.',
    catalog: 'В каталог',
    best: 'Хиты продаж',
    new: 'Новинки',
    featured: 'Рекомендуем',
    categories: 'Категории',
    clothes: 'Одежда',
    shoes: 'Обувь',
    accessories: 'Аксессуары',
    store: 'Магазин',
    delivery: 'Быстрая доставка',
    deliveryText: 'Доставка по городу и регионам удобным способом.',
    returns: 'Возврат и обмен',
    returnsText: 'Поможем с обменом размера и консультацией по товару.',
    payment: 'Оплата при получении',
    paymentText: 'Оформление заказа без онлайн-оплаты на сайте.',
    viewAll: 'Смотреть все',
  },
  KZ: {
    eyebrow: 'STREETWEAR STILE',
    title: 'ӨЗ СТИЛІҢДІ ЖИНА',
    description: 'КРОССОВКАЛАР, КИІМ ЖӘНЕ ҚАРА ЭСТЕТИКАДАҒЫ АКСЕССУАРЛАР.',
    catalog: 'Каталогқа',
    best: 'Хиттер',
    new: 'Жаңалар',
    featured: 'Ұсынамыз',
    categories: 'Санаттар',
    clothes: 'Киім',
    shoes: 'Аяқ киім',
    accessories: 'Аксессуарлар',
    store: 'Дүкен',
    delivery: 'Жылдам жеткізу',
    deliveryText: 'Қала және өңірлер бойынша ыңғайлы жеткізу.',
    returns: 'Қайтару және айырбастау',
    returnsText: 'Өлшем ауыстыруға және тауар таңдауға көмектесеміз.',
    payment: 'Алған кезде төлеу',
    paymentText: 'Сайтта онлайн төлемсіз тапсырыс рәсімдеу.',
    viewAll: 'Барлығын көру',
  },
};

export default function HomePage() {
  const { lang } = useApp();
  const t = homeText[lang];
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
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/20" />
        <div className="relative z-10 mx-auto flex min-h-[78vh] max-w-screen-2xl flex-col justify-center px-4 py-20 md:px-8">
          <p className="mb-4 text-[10px] font-black uppercase tracking-[0.35em] text-violet-100">{t.eyebrow}</p>
          <h1 className="max-w-5xl text-6xl font-black uppercase italic leading-[0.82] tracking-tighter sm:text-8xl lg:text-[10rem]">{t.title}</h1>
          <p className="mt-8 max-w-lg text-sm font-black uppercase leading-7 tracking-[0.12em] text-white">{t.description}</p>
          <div className="mt-10 flex flex-wrap gap-3"><Link href="/products" className="inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-xs font-black uppercase tracking-widest text-black transition hover:scale-105 hover:bg-violet-100">{t.catalog} <ArrowRight size={16} /></Link></div>
        </div>
      </section>

      <ProductCarousel eyebrow="TOP" title={t.best} products={bestsellers.length ? bestsellers : products.slice(0, 8)} href="/products?tag=bestseller" />
      <ProductCarousel eyebrow="NEW" title={t.new} products={newest.length ? newest : products.slice(4, 12)} href="/products?tag=new" />
      <ProductCarousel eyebrow="SELECTED" title={t.featured} products={featured.length ? featured : products.slice(8, 16)} />

      <section className="mx-auto max-w-screen-2xl px-4 py-16 md:px-8">
        <SectionHeader eyebrow={t.store} title={t.categories} action={t.viewAll} />
        <div className="grid gap-4 md:grid-cols-3">
          {[
            [t.clothes, 'Apparel', '/products?category=apparel'],
            [t.shoes, 'Footwear', '/products?category=footwear'],
            [t.accessories, 'Accessories', '/products?category=accessories'],
          ].map(([title, subtitle, href]) => <Link key={title} href={href} className="rounded-[2rem] border border-slate-200 bg-slate-50 p-8 transition hover:-translate-y-1 hover:bg-violet-50"><p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-700">{subtitle}</p><h3 className="mt-3 text-4xl font-black uppercase italic tracking-tighter">{title}</h3></Link>)}
        </div>
      </section>

      <section className="mx-auto grid max-w-screen-2xl gap-4 px-4 pb-20 md:grid-cols-3 md:px-8">
        {[[t.delivery, t.deliveryText, Truck], [t.returns, t.returnsText, RotateCcw], [t.payment, t.paymentText, ShieldCheck]].map(([title, text, Icon]) => <div key={String(title)} className="rounded-[2rem] border border-violet-200 bg-white p-6 shadow-sm"><Icon className="mb-5 text-violet-700" size={26} /><h3 className="text-xl font-black uppercase italic tracking-tighter">{String(title)}</h3><p className="mt-2 text-sm text-slate-700">{String(text)}</p></div>)}
      </section>
    </div>
  );
}
