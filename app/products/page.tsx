'use client';

import { motion } from 'motion/react';
import { ArrowLeft, Heart, Search, Star, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useApp } from '@/lib/context';

type CategoryFilter = 'All' | 'Apparel' | 'Footwear' | 'Accessories';

interface CatalogProduct {
  id: number;
  name: string;
  price: number;
  category: Exclude<CategoryFilter, 'All'>;
  sub: string;
  rating: number;
  image: string;
}

interface ApiProduct {
  id: number;
  name: string;
  price: number | string;
  category_name?: string | null;
  sub_category?: string | null;
  rating?: number | string | null;
  image_url?: string | null;
}

const fallbackImage = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600';

const FALLBACK_PRODUCTS: CatalogProduct[] = [
  { id: 1, name: 'Nexus Tech Hoodie', price: 129000, category: 'Apparel', sub: 'Hoodies', rating: 4.8, image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=600' },
  { id: 2, name: 'Cloud Runner 2.0', price: 180000, category: 'Footwear', sub: 'Running', rating: 4.9, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600' },
  { id: 3, name: 'Essential Oversized Tee', price: 45000, category: 'Apparel', sub: 'Shirts', rating: 4.5, image: 'https://images.unsplash.com/photo-1576566582419-43c329864205?auto=format&fit=crop&q=80&w=600' },
  { id: 4, name: 'Retro Court Low', price: 110000, category: 'Footwear', sub: 'Lifestyle', rating: 4.7, image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&q=80&w=600' },
  { id: 5, name: 'Performance Track Pants', price: 95000, category: 'Apparel', sub: 'Pants', rating: 4.6, image: 'https://images.unsplash.com/photo-1552664688-cf412ec27db2?auto=format&fit=crop&q=80&w=600' },
  { id: 6, name: 'Stealth Duffel Bag', price: 75000, category: 'Accessories', sub: 'Bags', rating: 4.4, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=600' },
  { id: 7, name: 'Apex Windbreaker', price: 155000, category: 'Apparel', sub: 'Outerwear', rating: 4.8, image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=600' },
  { id: 8, name: 'Prime Knit One', price: 210000, category: 'Footwear', sub: 'Performance', rating: 5.0, image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&q=80&w=600' },
];

function normalizeCategory(category: string | null | undefined): CatalogProduct['category'] {
  if (category === 'Footwear' || category === 'Accessories') return category;
  return 'Apparel';
}

function normalizeProduct(product: ApiProduct): CatalogProduct {
  const price = Number(product.price);
  const rating = Number(product.rating ?? 4.5);

  return {
    id: product.id,
    name: product.name,
    price: Number.isFinite(price) ? price : 0,
    category: normalizeCategory(product.category_name),
    sub: product.sub_category ?? '',
    rating: Number.isFinite(rating) ? rating : 4.5,
    image: product.image_url || fallbackImage,
  };
}

function getFilterLabel(filter: CategoryFilter, t: ReturnType<typeof useApp>['t']) {
  if (filter === 'All') return t('all_items');
  if (filter === 'Apparel') return t('hoodies');
  if (filter === 'Footwear') return t('sneakers');
  return t('accessories');
}

export default function CatalogPage() {
  const { addToCart, t } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>('All');
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function fetchProducts() {
      setIsLoading(true);

      try {
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error(`Products API failed with ${response.status}`);

        const data: unknown = await response.json();
        const nextProducts = Array.isArray(data) && data.length > 0
          ? data.map(product => normalizeProduct(product as ApiProduct))
          : FALLBACK_PRODUCTS;

        if (!ignore) setProducts(nextProducts);
      } catch (error) {
        console.log('Using local mock data', error);
        if (!ignore) setProducts(FALLBACK_PRODUCTS);
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    fetchProducts();

    return () => {
      ignore = true;
    };
  }, []);

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredProducts = products.filter(product => {
    const matchesSearch =
      product.name.toLowerCase().includes(normalizedSearch) ||
      product.sub.toLowerCase().includes(normalizedSearch) ||
      product.category.toLowerCase().includes(normalizedSearch);
    const matchesFilter = activeFilter === 'All' || product.category === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-screen-2xl mx-auto px-4 md:px-8 py-12">
          <div className="flex flex-col gap-8">
            <Link href="/" className="flex items-center gap-2 group text-slate-400 hover:text-black transition-colors">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              <span className="font-black uppercase text-[10px] tracking-widest pt-0.5">{t('exit')}</span>
            </Link>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-rose-600 mb-2 block">{t('new')}</span>
                <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic leading-none mb-4">
                  {t('featured_products').split(' ').map((word, index) => <span key={`${word}-${index}`}>{word} <br /></span>)}
                </h1>
                <p className="text-slate-400 font-bold uppercase text-xs tracking-[0.2em]">{filteredProducts.length} {t('items')}</p>
              </div>

              <div className="w-full md:w-[400px] relative group">
                <input
                  type="text"
                  placeholder={`${t('search').toUpperCase()}...`}
                  className="w-full bg-white border-2 border-black rounded-none py-4 px-6 pr-12 text-sm font-black uppercase tracking-widest focus:ring-0 transition-all outline-none"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
                <Search className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 flex overflow-x-auto whitespace-nowrap scrollbar-hide py-4 px-4 md:px-8 max-w-screen-2xl mx-auto">
        {(['All', 'Apparel', 'Footwear', 'Accessories'] as const).map((category) => (
          <button
            key={category}
            onClick={() => setActiveFilter(category)}
            className={`px-8 py-2 text-[11px] font-black uppercase tracking-tighter transition-all ${activeFilter === category ? 'bg-black text-white' : 'hover:bg-slate-100 text-slate-400'}`}
          >
            {getFilterLabel(category, t)}
          </button>
        ))}
      </div>

      <section className="max-w-screen-2xl mx-auto px-4 md:px-8 py-16">
        {isLoading ? (
          <div className="py-32 flex flex-col items-center justify-center text-center">
            <div className="h-8 w-8 animate-spin border-2 border-black border-t-transparent rounded-full mb-6" />
            <p className="font-black uppercase text-xs tracking-widest">{t('loading')}</p>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-12 gap-x-6">
            {filteredProducts.map((product, index) => (
              <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="group cursor-pointer">
                <div className="relative aspect-[3/4] overflow-hidden bg-slate-100 border border-slate-50 group">
                  <Image src={product.image} alt={product.name} fill className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 grayscale hover:grayscale-0" referrerPolicy="no-referrer" />
                  <button className="absolute top-4 right-4 p-3 bg-white hover:bg-black hover:text-white border border-slate-200 rounded-none transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 shadow-lg">
                    <Heart size={18} />
                  </button>
                  <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        addToCart({ id: product.id, name: product.name, price: product.price, image: product.image });
                      }}
                      className="w-full bg-black text-white py-4 font-black uppercase text-[10px] tracking-widest hover:bg-zinc-800 transition-colors shadow-2xl"
                    >
                      {t('add_to_cart')}
                    </button>
                  </div>
                  <div className="absolute top-4 left-4">
                    <div className="bg-black text-white text-[9px] font-black uppercase px-2 py-1 tracking-widest">{product.sub}</div>
                  </div>
                </div>

                <div className="pt-6 pb-2">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-black italic uppercase tracking-tighter text-lg leading-tight block underline decoration-transparent group-hover:decoration-black transition-all">{product.name}</h3>
                    <div className="flex items-center gap-1">
                      <Star size={10} fill="black" />
                      <span className="text-[10px] font-black">{product.rating}</span>
                    </div>
                  </div>
                  <div className="text-xl font-black text-slate-900 tracking-tighter">{product.price.toLocaleString()} ₸</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {!isLoading && filteredProducts.length === 0 && (
          <div className="py-32 flex flex-col items-center justify-center text-center">
            <X size={48} className="text-slate-200 mb-6" />
            <h3 className="text-2xl font-black uppercase tracking-tighter italic">{t('no_styles')}</h3>
            <p className="text-slate-400 max-w-xs mt-2">{t('try_adjusting')}</p>
            <button onClick={() => { setSearchTerm(''); setActiveFilter('All'); }} className="mt-8 underline font-black uppercase text-xs decoration-2">
              {t('clear_filters')}
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
