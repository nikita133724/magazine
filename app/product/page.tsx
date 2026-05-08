'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useMemo, useState } from 'react';
import ProductImage from '@/components/site/ProductImage';
import QuantitySelector from '@/components/site/QuantitySelector';
import { useApp } from '@/lib/context';
import type { Product } from '@/lib/types';

function ProductPageContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const { addToCart, t } = useApp();
  const [products, setProducts] = useState<Product[]>([]);
  const [image, setImage] = useState('');
  const [size, setSize] = useState('OS');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => { fetch('/api/products').then(res => res.json()).then(data => Array.isArray(data) && setProducts(data)).catch(console.error); }, []);
  const product = useMemo(() => products.find(item => String(item.id) === String(id)), [products, id]);
  useEffect(() => { if (!product) return; setImage(product.images[0]?.image_url || product.main_image || product.image_url || ''); setSize(product.sizes[0]?.size || 'OS'); }, [product]);

  if (!product) return <div className="mx-auto max-w-screen-2xl px-4 py-24 md:px-8"><Link href="/products" className="text-xs font-black uppercase tracking-widest text-slate-400">Back to catalog</Link><h1 className="mt-8 text-5xl font-black uppercase italic tracking-tighter">Loading product</h1></div>;

  const images = product.images.length ? product.images.map(item => item.image_url) : [product.main_image || product.image_url || ''];
  const activeImage = image || images[0] || '';
  const sizes = product.sizes.length ? product.sizes : [{ id: 0, product_id: product.id, size: 'OS', stock: 1 }];
  const add = () => addToCart({ id: product.id, slug: product.slug, name: product.name, price: product.price, image: activeImage, size }, quantity);

  return (
    <div className="bg-white">
      <div className="mx-auto grid max-w-screen-2xl gap-8 px-4 py-8 md:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:py-14">
        <div className="grid gap-4 lg:grid-cols-[96px_1fr]">
          <div className="order-2 flex gap-3 overflow-x-auto lg:order-1 lg:flex-col">{images.map((src, index) => <button key={`${src}-${index}`} onClick={() => setImage(src)} className={`h-24 w-20 shrink-0 overflow-hidden rounded-2xl border ${src === activeImage ? 'border-black' : 'border-slate-100'}`}><ProductImage src={src} alt={product.name} /></button>)}</div>
          <div className="order-1 aspect-[4/5] overflow-hidden rounded-[2rem] bg-slate-100 lg:order-2"><ProductImage src={activeImage} alt={product.name} priority /></div>
        </div>
        <aside className="lg:sticky lg:top-28 lg:h-fit">
          <Link href="/products" className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-black">Back to catalog</Link>
          <p className="mt-8 text-[10px] font-black uppercase tracking-[0.35em] text-violet-500">{product.category_name} · {product.sub_category}</p>
          <h1 className="mt-3 text-5xl font-black uppercase italic leading-none tracking-tighter md:text-7xl">{product.name}</h1>
          <div className="mt-6 flex items-end gap-3"><span className="text-4xl font-black tracking-tighter">{product.price.toLocaleString()} ₸</span></div>
          <p className="mt-6 max-w-xl leading-7 text-slate-500">{product.description || 'Premium archive item for a modern streetwear wardrobe.'}</p>
          <div className="mt-8"><p className="mb-3 text-xs font-black uppercase tracking-widest text-slate-400">{t('size')}</p><div className="grid grid-cols-4 gap-2 sm:grid-cols-6">{sizes.map(item => <button key={item.size} onClick={() => setSize(item.size)} className={`rounded-2xl border px-3 py-3 text-xs font-black uppercase transition ${size === item.size ? 'border-black bg-black text-white' : 'border-slate-200 bg-white hover:bg-violet-50'}`}>{item.size}</button>)}</div></div>
          <div className="mt-6"><p className="mb-3 text-xs font-black uppercase tracking-widest text-slate-400">{t('quantity')}</p><QuantitySelector value={quantity} onChange={setQuantity} /></div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2"><button onClick={add} className="rounded-2xl bg-black py-5 text-sm font-black uppercase tracking-widest text-white transition hover:bg-violet-700">{t('add_to_cart')}</button><button onClick={add} className="rounded-2xl border border-slate-200 py-5 text-sm font-black uppercase tracking-widest transition hover:bg-violet-50">{t('buy_now')}</button></div>
        </aside>
      </div>
    </div>
  );
}

export default function ProductPage() {
  return <Suspense><ProductPageContent /></Suspense>;
}
