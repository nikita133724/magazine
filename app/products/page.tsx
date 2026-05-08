'use client';

import { Search, SlidersHorizontal, X } from 'lucide-react';
import { motion } from 'motion/react';
import { Suspense, useEffect, useMemo, useState } from 'react';
import ProductCard from '@/components/site/ProductCard';
import type { Product } from '@/lib/types';

type SortMode = 'popular' | 'new' | 'price_asc' | 'price_desc';

function ProductsContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [tag, setTag] = useState('all');
  const [sort, setSort] = useState<SortMode>('popular');
  const [maxPrice, setMaxPrice] = useState(600000);

  useEffect(() => {
    let ignore = false;
    fetch('/api/products')
      .then(response => response.json())
      .then(data => { if (!ignore && Array.isArray(data)) setProducts(data); })
      .catch(console.error)
      .finally(() => { if (!ignore) setLoading(false); });
    return () => { ignore = true; };
  }, []);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    const next = products.filter(product => {
      const text = [product.name, product.sub_category, product.category_name].filter(Boolean).join(' ').toLowerCase();
      const matchesSearch = !query || text.includes(query);
      const matchesCategory = category === 'all' || product.category_slug === category;
      const matchesTag = tag === 'all' || (tag === 'new' && product.is_new) || (tag === 'bestseller' && product.is_bestseller) || (tag === 'sale' && product.discount_percent > 0);
      return matchesSearch && matchesCategory && matchesTag && product.price <= maxPrice;
    });
    return next.sort((a, b) => {
      if (sort === 'new') return Number(b.is_new) - Number(a.is_new) || b.id - a.id;
      if (sort === 'price_asc') return a.price - b.price;
      if (sort === 'price_desc') return b.price - a.price;
      return Number(b.is_bestseller) - Number(a.is_bestseller) || Number(b.is_featured) - Number(a.is_featured);
    });
  }, [products, search, category, tag, sort, maxPrice]);

  const categories = [
    { value: 'all', label: 'All' },
    { value: 'apparel', label: 'Apparel' },
    { value: 'footwear', label: 'Footwear' },
    { value: 'accessories', label: 'Accessories' },
  ];

  const tags = [
    { value: 'all', label: 'All' },
    { value: 'new', label: 'New' },
    { value: 'bestseller', label: 'Bestsellers' },
    { value: 'sale', label: 'Sale' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <section className="border-b border-slate-100 bg-slate-50">
        <div className="mx-auto max-w-screen-2xl px-4 py-10 md:px-8 md:py-16">
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.4em] text-violet-500">Storefront</p>
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div><h1 className="text-5xl font-black uppercase italic tracking-tighter md:text-7xl">Catalog</h1><p className="mt-3 text-sm font-bold uppercase tracking-[0.25em] text-slate-400">{filtered.length} products</p></div>
            <div className="relative w-full lg:w-[420px]"><Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} /><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search products" className="w-full rounded-full border border-slate-200 bg-white py-4 pl-12 pr-5 text-sm font-bold outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-100" /></div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-screen-2xl gap-8 px-4 py-8 md:px-8 lg:grid-cols-[280px_1fr]">
        <aside className="h-fit rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm lg:sticky lg:top-28">
          <div className="mb-6 flex items-center gap-2 text-sm font-black uppercase tracking-widest"><SlidersHorizontal size={17} /> Filters</div>
          <div className="space-y-6">
            <div><p className="mb-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Category</p><div className="flex flex-wrap gap-2 lg:flex-col">{categories.map(item => <button key={item.value} onClick={() => setCategory(item.value)} className={`rounded-full px-4 py-2 text-xs font-black uppercase transition ${category === item.value ? 'bg-black text-white' : 'bg-slate-100 text-slate-500 hover:bg-violet-50 hover:text-violet-700'}`}>{item.label}</button>)}</div></div>
            <div><p className="mb-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Collection</p><div className="flex flex-wrap gap-2 lg:flex-col">{tags.map(item => <button key={item.value} onClick={() => setTag(item.value)} className={`rounded-full px-4 py-2 text-xs font-black uppercase transition ${tag === item.value ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-violet-50 hover:text-violet-700'}`}>{item.label}</button>)}</div></div>
            <div><p className="mb-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Price up to {maxPrice.toLocaleString()} ₸</p><input type="range" min="20000" max="600000" step="10000" value={maxPrice} onChange={event => setMaxPrice(Number(event.target.value))} className="w-full accent-violet-600" /></div>
            <div><p className="mb-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Sort</p><select value={sort} onChange={event => setSort(event.target.value as SortMode)} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-violet-300"><option value="popular">Popular first</option><option value="new">Newest first</option><option value="price_asc">Price low to high</option><option value="price_desc">Price high to low</option></select></div>
          </div>
        </aside>

        <div>
          {loading ? <div className="grid gap-x-5 gap-y-10 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">{Array.from({ length: 8 }).map((_, index) => <div key={index} className="h-[430px] animate-pulse rounded-[2rem] bg-slate-100" />)}</div> : filtered.length > 0 ? <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid gap-x-5 gap-y-10 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">{filtered.map(product => <ProductCard key={product.id} product={product} />)}</motion.div> : <div className="flex min-h-[420px] flex-col items-center justify-center rounded-[2rem] border border-dashed border-slate-200 text-center"><X className="mb-4 text-slate-300" size={46} /><h2 className="text-2xl font-black uppercase italic tracking-tighter">Nothing found</h2><p className="mt-2 text-sm text-slate-500">Try changing filters or search.</p><button onClick={() => { setSearch(''); setCategory('all'); setTag('all'); setMaxPrice(600000); }} className="mt-6 rounded-full bg-black px-6 py-3 text-xs font-black uppercase tracking-widest text-white transition hover:scale-105 hover:bg-violet-700">Reset</button></div>}
        </div>
      </section>
    </div>
  );
}

export default function CatalogPage() {
  return <Suspense><ProductsContent /></Suspense>;
}
