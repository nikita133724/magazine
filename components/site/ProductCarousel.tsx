'use client';

import { useRef } from 'react';
import type { Product } from '@/lib/types';
import ProductCard from './ProductCard';
import SectionHeader from './SectionHeader';

interface ProductCarouselProps {
  eyebrow?: string;
  title: string;
  products: Product[];
  href?: string;
}

export default function ProductCarousel({ eyebrow, title, products, href = '/products' }: ProductCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = (direction: 'left' | 'right') => {
    const node = scrollRef.current;
    if (!node) return;
    node.scrollBy({ left: direction === 'left' ? -420 : 420, behavior: 'smooth' });
  };
  if (products.length === 0) return null;
  return (
    <section className="py-14 sm:py-20">
      <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
        <div className="flex items-end justify-between gap-4"><SectionHeader eyebrow={eyebrow} title={title} href={href} /><div className="mb-10 hidden items-center gap-2 lg:flex"><button onClick={() => scroll('left')} className="rounded-full border border-slate-200 px-4 py-3 transition hover:bg-violet-50">‹</button><button onClick={() => scroll('right')} className="rounded-full border border-slate-200 px-4 py-3 transition hover:bg-violet-50">›</button></div></div>
        <div ref={scrollRef} className="scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 sm:gap-6">{products.map(product => <div key={product.id} className="w-[76vw] flex-none snap-start sm:w-[330px] lg:w-[300px] xl:w-[330px]"><ProductCard product={product} /></div>)}</div>
      </div>
    </section>
  );
}
