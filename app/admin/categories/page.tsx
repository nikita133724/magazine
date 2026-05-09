'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import type { Product } from '@/lib/types';

const categories = [
  { title: 'Одежда', slug: 'apparel', text: 'Футболки, лонгсливы, худи, брюки' },
  { title: 'Обувь', slug: 'footwear', text: 'Кроссовки, кеды и обувь' },
  { title: 'Аксессуары', slug: 'accessories', text: 'Сумки, украшения и аксессуары' },
];

export default function AdminCategoriesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => { fetch('/api/admin/products').then(r => r.json()).then(d => Array.isArray(d) && setProducts(d)).catch(console.error); }, []);
  const counts = useMemo(() => products.reduce<Record<string, number>>((acc, product) => { acc[product.category_slug] = (acc[product.category_slug] || 0) + 1; return acc; }, {}), [products]);

  return (
    <AdminShell title="Категории">
      <div className="mb-6 rounded-[2rem] border border-violet-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-black uppercase italic tracking-tighter">Управление категориями</h2>
        <p className="mt-2 text-sm text-slate-700">Нажмите на категорию, чтобы открыть товары этого раздела в админке.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {categories.map(category => (
          <Link key={category.slug} href={`/admin/products?category=${category.slug}`} className="rounded-[2rem] border border-violet-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:bg-violet-50 hover:shadow-xl hover:shadow-violet-100">
            <p className="text-xs font-black uppercase tracking-widest text-violet-800">{counts[category.slug] || 0} товаров</p>
            <h2 className="mt-3 text-3xl font-black uppercase italic tracking-tighter">{category.title}</h2>
            <p className="mt-3 text-sm text-slate-700">{category.text}</p>
            <span className="mt-6 inline-flex rounded-full bg-black px-5 py-3 text-xs font-black uppercase tracking-widest text-white">Открыть</span>
          </Link>
        ))}
      </div>
    </AdminShell>
  );
}
