'use client';

import { Search, SlidersHorizontal, X } from 'lucide-react';
import { motion } from 'motion/react';
import { Suspense, useEffect, useMemo, useState } from 'react';
import ProductCard from '@/components/site/ProductCard';
import { useApp } from '@/lib/context';
import type { Product } from '@/lib/types';

type SortMode = 'popular' | 'new' | 'price_asc' | 'price_desc';

const labels = {
  RU: { title: 'Каталог', found: 'товаров', search: 'Поиск товаров', filters: 'Фильтры', all: 'Все', apparel: 'Одежда', footwear: 'Обувь', accessories: 'Аксессуары', new: 'Новинки', best: 'Хиты', sale: 'Скидки', sort: 'Сортировка', popular: 'Популярные', newest: 'Новые', low: 'Дешевле', high: 'Дороже', price: 'Цена до', empty: 'Ничего не найдено', emptyText: 'Попробуйте изменить поиск или фильтры.', reset: 'Сбросить' },
  KZ: { title: 'Каталог', found: 'тауар', search: 'Тауар іздеу', filters: 'Фильтрлер', all: 'Барлығы', apparel: 'Киім', footwear: 'Аяқ киім', accessories: 'Аксессуарлар', new: 'Жаңалар', best: 'Хиттер', sale: 'Жеңілдік', sort: 'Сұрыптау', popular: 'Танымал', newest: 'Жаңа', low: 'Арзанырақ', high: 'Қымбатырақ', price: 'Баға дейін', empty: 'Ештеңе табылмады', emptyText: 'Іздеу немесе фильтрлерді өзгертіп көріңіз.', reset: 'Тазалау' },
};

function ProductsContent() {
  const { lang } = useApp();
  const l = labels[lang];
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [tag, setTag] = useState('all');
  const [sort, setSort] = useState<SortMode>('popular');
  const [maxPrice, setMaxPrice] = useState(600000);

  useEffect(() => {
    let ignore = false;
    fetch('/api/products').then(r => r.json()).then(d => { if (!ignore && Array.isArray(d)) setProducts(d); }).catch(console.error).finally(() => { if (!ignore) setLoading(false); });
    return () => { ignore = true; };
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter(p => {
      const text = [p.name, p.sub_category, p.category_name].filter(Boolean).join(' ').toLowerCase();
      const okSearch = !q || text.includes(q);
      const okCategory = category === 'all' || p.category_slug === category;
      const okTag = tag === 'all' || (tag === 'new' && p.is_new) || (tag === 'bestseller' && p.is_bestseller) || (tag === 'sale' && p.discount_percent > 0);
      return okSearch && okCategory && okTag && p.price <= maxPrice;
    }).sort((a, b) => {
      if (sort === 'new') return Number(b.is_new) - Number(a.is_new) || b.id - a.id;
      if (sort === 'price_asc') return a.price - b.price;
      if (sort === 'price_desc') return b.price - a.price;
      return Number(b.is_bestseller) - Number(a.is_bestseller) || Number(b.is_featured) - Number(a.is_featured);
    });
  }, [products, search, category, tag, sort, maxPrice]);

  const categories = [[ 'all', l.all ], [ 'apparel', l.apparel ], [ 'footwear', l.footwear ], [ 'accessories', l.accessories ]];
  const tags = [[ 'all', l.all ], [ 'new', l.new ], [ 'bestseller', l.best ], [ 'sale', l.sale ]];

  return (
    <div className="min-h-screen bg-white">
      <section className="border-b border-slate-200 bg-slate-50"><div className="mx-auto max-w-screen-2xl px-4 py-12 md:px-8"><p className="mb-3 text-[10px] font-black uppercase tracking-[0.22em] text-violet-800">{l.filters}</p><div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"><div><h1 className="text-5xl font-black uppercase italic tracking-tighter md:text-7xl">{l.title}</h1><p className="mt-3 text-sm font-bold uppercase tracking-[0.16em] text-slate-700">{filtered.length} {l.found}</p></div><div className="relative w-full lg:w-[420px]"><Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-700" size={18} aria-hidden="true" /><input aria-label={l.search} value={search} onChange={e => setSearch(e.target.value)} placeholder={l.search} className="w-full rounded-full border border-slate-300 bg-white py-4 pl-12 pr-5 text-sm font-bold outline-none focus:border-violet-500" /></div></div></div></section>
      <section className="mx-auto grid max-w-screen-2xl gap-8 px-4 py-8 md:px-8 lg:grid-cols-[280px_1fr]">
        <aside className="h-fit rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-28"><div className="mb-6 flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-900"><SlidersHorizontal size={17} aria-hidden="true" /> {l.filters}</div><div className="space-y-6"><div className="flex flex-wrap gap-2">{categories.map(([value, text]) => <button key={value} onClick={() => setCategory(value)} className={`rounded-full px-4 py-2 text-xs font-black uppercase ${category === value ? 'bg-black text-white' : 'bg-slate-100 text-slate-700 hover:bg-violet-50'}`}>{text}</button>)}</div><div className="flex flex-wrap gap-2">{tags.map(([value, text]) => <button key={value} onClick={() => setTag(value)} className={`rounded-full px-4 py-2 text-xs font-black uppercase ${tag === value ? 'bg-violet-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-violet-50'}`}>{text}</button>)}</div><label className="block text-[10px] font-black uppercase tracking-widest text-slate-700">{l.price} {maxPrice.toLocaleString()} ₸<input aria-label={l.price} type="range" min="20000" max="600000" step="10000" value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))} className="mt-3 w-full accent-violet-700" /></label><label className="block text-[10px] font-black uppercase tracking-widest text-slate-700">{l.sort}<select value={sort} onChange={e => setSort(e.target.value as SortMode)} className="mt-3 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-bold"><option value="popular">{l.popular}</option><option value="new">{l.newest}</option><option value="price_asc">{l.low}</option><option value="price_desc">{l.high}</option></select></label></div></aside>
        <div>{loading ? <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-[430px] animate-pulse rounded-[2rem] bg-slate-100" />)}</div> : filtered.length ? <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid gap-x-5 gap-y-10 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">{filtered.map(p => <ProductCard key={p.id} product={p} />)}</motion.div> : <div className="flex min-h-[420px] flex-col items-center justify-center rounded-[2rem] border border-dashed border-slate-300 text-center"><X className="mb-4 text-slate-500" size={46} aria-hidden="true" /><h2 className="text-2xl font-black uppercase italic tracking-tighter">{l.empty}</h2><p className="mt-2 text-sm text-slate-700">{l.emptyText}</p><button onClick={() => { setSearch(''); setCategory('all'); setTag('all'); setMaxPrice(600000); }} className="mt-6 rounded-full bg-black px-6 py-3 text-xs font-black uppercase tracking-widest text-white hover:bg-violet-800">{l.reset}</button></div>}</div>
      </section>
    </div>
  );
}

export default function CatalogPage() {
  return <Suspense><ProductsContent /></Suspense>;
}
