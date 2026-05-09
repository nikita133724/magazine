'use client';

import { FormEvent, useEffect, useState } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import type { Product } from '@/lib/types';

const blank = { name_ru: '', name_kz: '', price: '', stock: '10', category_slug: 'apparel', sub_category_ru: '', sub_category_kz: '', sizes: 'S,M,L,XL', main_image: '', is_featured: false, is_bestseller: false, is_new: true, status: 'active' };

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState(blank);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const load = () => fetch('/api/admin/products').then(r => r.json()).then(d => Array.isArray(d) && setProducts(d)).catch(console.error);
  useEffect(() => { load(); }, []);

  const set = (key: string, value: string | boolean) => setForm(prev => ({ ...prev, [key]: value }));

  const upload = async (file: File) => {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('slug', form.name_ru || 'product');
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Ошибка загрузки');
    set('main_image', data.url);
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/admin/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, price: Number(form.price), stock: Number(form.stock) }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Не удалось добавить товар');
      setForm(blank);
      setMessage('Товар добавлен');
      load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Ошибка');
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: number) => {
    await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' });
    load();
  };

  return (
    <AdminShell title="Товары">
      <form onSubmit={submit} className="mb-6 rounded-[2rem] border border-violet-200 bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-2xl font-black uppercase italic tracking-tighter">Добавить товар</h2>
        <div className="grid gap-3 md:grid-cols-3">
          <input required placeholder="Название RU" value={form.name_ru} onChange={e => set('name_ru', e.target.value)} className="rounded-2xl border border-slate-300 px-4 py-3" />
          <input required placeholder="Название KZ" value={form.name_kz} onChange={e => set('name_kz', e.target.value)} className="rounded-2xl border border-slate-300 px-4 py-3" />
          <input required placeholder="Цена" value={form.price} onChange={e => set('price', e.target.value)} className="rounded-2xl border border-slate-300 px-4 py-3" />
          <select value={form.category_slug} onChange={e => set('category_slug', e.target.value)} className="rounded-2xl border border-slate-300 px-4 py-3"><option value="apparel">Одежда</option><option value="footwear">Обувь</option><option value="accessories">Аксессуары</option></select>
          <input placeholder="Подкатегория RU" value={form.sub_category_ru} onChange={e => set('sub_category_ru', e.target.value)} className="rounded-2xl border border-slate-300 px-4 py-3" />
          <input placeholder="Подкатегория KZ" value={form.sub_category_kz} onChange={e => set('sub_category_kz', e.target.value)} className="rounded-2xl border border-slate-300 px-4 py-3" />
          <input placeholder="Остаток" value={form.stock} onChange={e => set('stock', e.target.value)} className="rounded-2xl border border-slate-300 px-4 py-3" />
          <input placeholder="Размеры через запятую" value={form.sizes} onChange={e => set('sizes', e.target.value)} className="rounded-2xl border border-slate-300 px-4 py-3" />
          <input type="file" accept="image/*" onChange={e => e.target.files?.[0] && upload(e.target.files[0]).catch(err => setMessage(err.message))} className="rounded-2xl border border-slate-300 px-4 py-3" />
          <input placeholder="URL картинки" value={form.main_image} onChange={e => set('main_image', e.target.value)} className="rounded-2xl border border-slate-300 px-4 py-3 md:col-span-3" />
        </div>
        <div className="mt-4 flex flex-wrap gap-4 text-sm font-bold"><label><input type="checkbox" checked={form.is_new} onChange={e => set('is_new', e.target.checked)} /> Новинка</label><label><input type="checkbox" checked={form.is_bestseller} onChange={e => set('is_bestseller', e.target.checked)} /> Хит</label><label><input type="checkbox" checked={form.is_featured} onChange={e => set('is_featured', e.target.checked)} /> Рекомендуем</label></div>
        {message && <p className="mt-4 text-sm font-bold text-violet-800">{message}</p>}
        <button disabled={loading} className="mt-5 rounded-2xl bg-black px-6 py-4 text-xs font-black uppercase tracking-widest text-white hover:bg-violet-800 disabled:bg-slate-400">{loading ? 'Сохраняем...' : 'Добавить товар'}</button>
      </form>
      <div className="rounded-[2rem] bg-white p-6 shadow-sm"><h2 className="mb-5 text-2xl font-black uppercase italic tracking-tighter">Список товаров</h2><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead><tr className="text-slate-700"><th className="p-3">Название</th><th>Категория</th><th>Остаток</th><th>Цена</th><th>Статус</th><th></th></tr></thead><tbody>{products.map(p => <tr key={p.id} className="border-t"><td className="p-3 font-black">{p.name_ru || p.name}</td><td>{p.category_name}</td><td>{p.stock}</td><td>{p.price.toLocaleString()} ₸</td><td>{p.status}</td><td><button onClick={() => remove(p.id)} className="rounded-full bg-red-50 px-4 py-2 text-xs font-black text-red-700">Удалить</button></td></tr>)}</tbody></table></div></div>
    </AdminShell>
  );
}
