'use client';

import { FormEvent, Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import AdminShell from '@/components/admin/AdminShell';
import type { Product } from '@/lib/types';

const blank = { name_ru: '', name_kz: '', price: '', stock: '10', category_slug: 'apparel', sub_category_ru: '', sub_category_kz: '', sizes: 'S,M,L,XL', main_image: '', is_featured: false, is_bestseller: false, is_new: true, status: 'active' };
type ProductForm = typeof blank;

function AdminProductsContent() {
  const searchParams = useSearchParams();
  const categoryFilter = searchParams.get('category') || 'all';
  const editParam = searchParams.get('edit');
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<ProductForm>({ ...blank, category_slug: categoryFilter === 'all' ? 'apparel' : categoryFilter });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const filteredProducts = useMemo(() => categoryFilter === 'all' ? products : products.filter(p => p.category_slug === categoryFilter), [products, categoryFilter]);

  const load = () => fetch('/api/admin/products').then(r => r.json()).then(d => Array.isArray(d) && setProducts(d)).catch(console.error);
  useEffect(() => { load(); }, []);
  const set = (key: keyof ProductForm, value: string | boolean) => setForm(prev => ({ ...prev, [key]: value }));

  const edit = (p: Product) => {
    setEditingId(p.id);
    setForm({
      name_ru: p.name_ru || p.name || '',
      name_kz: p.name_kz || p.name_ru || p.name || '',
      price: String(p.price || ''),
      stock: String(p.stock || 0),
      category_slug: p.category_slug || 'apparel',
      sub_category_ru: p.sub_category_ru || p.sub_category || '',
      sub_category_kz: p.sub_category_kz || p.sub_category_ru || p.sub_category || '',
      sizes: p.sizes?.length ? p.sizes.map(s => s.size).join(',') : 'OS',
      main_image: p.main_image || p.image_url || '',
      is_featured: Boolean(p.is_featured),
      is_bestseller: Boolean(p.is_bestseller),
      is_new: Boolean(p.is_new),
      status: p.status || 'active',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    if (!editParam || products.length === 0) return;
    const target = products.find(p => String(p.id) === editParam);
    if (target && editingId !== target.id) edit(target);
  }, [editParam, products, editingId]);

  const upload = async (file: File) => {
    setUploading(true);
    setMessage('Загружаем картинку...');
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('slug', form.name_ru || 'product');
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ошибка загрузки');
      set('main_image', data.url);
      setMessage('Картинка загружена. Теперь нажмите «Сохранить товар».');
    } finally {
      setUploading(false);
    }
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (uploading) { setMessage('Дождитесь окончания загрузки картинки.'); return; }
    setLoading(true);
    setMessage('');
    const method = editingId ? 'PATCH' : 'POST';
    try {
      const res = await fetch('/api/admin/products', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, id: editingId, price: Number(form.price), stock: Number(form.stock) }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Не удалось сохранить товар');
      setForm({ ...blank, category_slug: categoryFilter === 'all' ? 'apparel' : categoryFilter });
      setEditingId(null);
      setMessage(editingId ? 'Товар обновлен' : 'Товар добавлен');
      load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Ошибка');
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: number) => { await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' }); load(); };

  return (
    <AdminShell title="Товары">
      <form onSubmit={submit} className="mb-6 rounded-[2rem] border border-violet-200 bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-2xl font-black uppercase italic tracking-tighter">{editingId ? 'Редактировать товар' : 'Добавить товар'}</h2>
        <div className="grid gap-3 md:grid-cols-3">
          <input required placeholder="Название RU" value={form.name_ru} onChange={e => set('name_ru', e.target.value)} className="rounded-2xl border border-slate-300 px-4 py-3" />
          <input required placeholder="Название KZ" value={form.name_kz} onChange={e => set('name_kz', e.target.value)} className="rounded-2xl border border-slate-300 px-4 py-3" />
          <input required placeholder="Цена" value={form.price} onChange={e => set('price', e.target.value)} className="rounded-2xl border border-slate-300 px-4 py-3" />
          <select value={form.category_slug} onChange={e => set('category_slug', e.target.value)} className="rounded-2xl border border-slate-300 px-4 py-3"><option value="apparel">Одежда</option><option value="footwear">Обувь</option><option value="accessories">Аксессуары</option></select>
          <input placeholder="Подкатегория RU" value={form.sub_category_ru} onChange={e => set('sub_category_ru', e.target.value)} className="rounded-2xl border border-slate-300 px-4 py-3" />
          <input placeholder="Подкатегория KZ" value={form.sub_category_kz} onChange={e => set('sub_category_kz', e.target.value)} className="rounded-2xl border border-slate-300 px-4 py-3" />
          <input placeholder="Остаток" value={form.stock} onChange={e => set('stock', e.target.value)} className="rounded-2xl border border-slate-300 px-4 py-3" />
          <input placeholder="Размеры через запятую" value={form.sizes} onChange={e => set('sizes', e.target.value)} className="rounded-2xl border border-slate-300 px-4 py-3" />
          <select value={form.status} onChange={e => set('status', e.target.value)} className="rounded-2xl border border-slate-300 px-4 py-3"><option value="active">active</option><option value="draft">draft</option><option value="archived">archived</option></select>
          <input type="file" accept="image/*" disabled={uploading} onChange={e => e.target.files?.[0] && upload(e.target.files[0]).catch(err => setMessage(err.message))} className="rounded-2xl border border-slate-300 px-4 py-3 disabled:opacity-50" />
          <input placeholder="URL картинки" value={form.main_image} onChange={e => set('main_image', e.target.value)} className="rounded-2xl border border-slate-300 px-4 py-3 md:col-span-2" />
        </div>
        {form.main_image && <p className="mt-3 break-all rounded-2xl bg-violet-50 p-3 text-xs font-bold text-violet-900">Фото: {form.main_image}</p>}
        <div className="mt-4 flex flex-wrap gap-4 text-sm font-bold"><label><input type="checkbox" checked={form.is_new} onChange={e => set('is_new', e.target.checked)} /> Новинка</label><label><input type="checkbox" checked={form.is_bestseller} onChange={e => set('is_bestseller', e.target.checked)} /> Хит</label><label><input type="checkbox" checked={form.is_featured} onChange={e => set('is_featured', e.target.checked)} /> Рекомендуем</label></div>
        {message && <p className="mt-4 text-sm font-bold text-violet-800">{message}</p>}
        <div className="mt-5 flex flex-wrap gap-3"><button disabled={loading || uploading} className="rounded-2xl bg-black px-6 py-4 text-xs font-black uppercase tracking-widest text-white hover:bg-violet-800 disabled:bg-slate-400">{uploading ? 'Загружаем фото...' : loading ? 'Сохраняем...' : editingId ? 'Сохранить изменения' : 'Добавить товар'}</button>{editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ ...blank, category_slug: categoryFilter === 'all' ? 'apparel' : categoryFilter }); }} className="rounded-2xl bg-slate-100 px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-800">Отмена</button>}</div>
      </form>
      <div className="rounded-[2rem] bg-white p-6 shadow-sm"><div className="mb-5 flex flex-wrap items-center justify-between gap-3"><h2 className="text-2xl font-black uppercase italic tracking-tighter">Список товаров</h2><p className="text-sm font-bold text-slate-700">Показано: {filteredProducts.length}</p></div><div className="overflow-x-auto"><table className="w-full min-w-[920px] text-left text-sm"><thead><tr className="text-slate-700"><th className="p-3">Фото</th><th>Название</th><th>Категория</th><th>Остаток</th><th>Цена</th><th>Статус</th><th></th></tr></thead><tbody>{filteredProducts.map(p => <tr key={p.id} className="border-t"><td className="p-3"><div className="h-14 w-12 overflow-hidden rounded-xl bg-slate-100">{p.main_image ? <img src={p.main_image} alt="" className="h-full w-full object-cover" /> : <span className="flex h-full items-center justify-center text-[10px] font-black text-red-600">нет</span>}</div></td><td className="p-3 font-black">{p.name_ru || p.name}</td><td>{p.category_name}</td><td>{p.stock}</td><td>{p.price.toLocaleString()} ₸</td><td>{p.status}</td><td className="flex gap-2 py-2"><button onClick={() => edit(p)} className="rounded-full bg-violet-50 px-4 py-2 text-xs font-black text-violet-800">Редактировать</button><button onClick={() => remove(p.id)} className="rounded-full bg-red-50 px-4 py-2 text-xs font-black text-red-700">Удалить</button></td></tr>)}</tbody></table></div></div>
    </AdminShell>
  );
}

export default function AdminProductsPage() {
  return (
    <Suspense fallback={<AdminShell title="Товары"><div className="rounded-[2rem] bg-white p-6 shadow-sm">Загрузка товаров...</div></AdminShell>}>
      <AdminProductsContent />
    </Suspense>
  );
}
