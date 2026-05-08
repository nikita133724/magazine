'use client';

import Link from 'next/link';
import { ShoppingBag, Star } from 'lucide-react';
import { useApp } from '@/lib/context';
import type { Product } from '@/lib/types';
import ProductImage from './ProductImage';

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart, t } = useApp();
  const image = product.main_image || product.image_url || product.images[0]?.image_url || '';
  const firstSize = product.sizes.find(size => size.stock > 0)?.size || product.sizes[0]?.size || 'OS';

  return (
    <article className="group min-w-0">
      <div className="relative overflow-hidden rounded-[1.75rem] border border-slate-100 bg-slate-50 shadow-sm transition group-hover:-translate-y-1 group-hover:shadow-2xl group-hover:shadow-violet-100">
        <Link href={`/products/${product.id}`} className="block aspect-[3/4] overflow-hidden"><ProductImage src={image} alt={product.name} className="transition duration-700 group-hover:scale-105" /></Link>
        <button onClick={() => addToCart({ id: product.id, slug: product.slug, name: product.name, price: product.price, image, size: firstSize })} className="absolute inset-x-3 bottom-3 rounded-2xl bg-black px-4 py-3 text-[10px] font-black uppercase tracking-widest text-white opacity-0 transition hover:bg-violet-700 group-hover:opacity-100"><ShoppingBag className="mr-2 inline" size={14} />{t('add_to_cart')}</button>
      </div>
      <div className="pt-4">
        <div className="mb-2 flex items-start justify-between gap-3"><Link href={`/products/${product.id}`} className="min-w-0"><h3 className="line-clamp-2 text-base font-black uppercase italic tracking-tighter group-hover:text-violet-700">{product.name}</h3></Link><div className="flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-[10px] font-black"><Star size={10} fill="black" />{product.rating.toFixed(1)}</div></div>
        <p className="mb-2 truncate text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">{product.sub_category || product.category_name}</p>
        <div className="flex items-end gap-2"><span className="text-xl font-black tracking-tighter">{product.price.toLocaleString()} ₸</span>{product.compare_at_price && product.compare_at_price > product.price && <span className="pb-0.5 text-xs font-bold text-slate-400 line-through">{product.compare_at_price.toLocaleString()} ₸</span>}</div>
      </div>
    </article>
  );
}
