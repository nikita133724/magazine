'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import AdminShell from '@/components/admin/AdminShell';

type Stats = { cards?: { totalRevenue?: number; ordersCount?: number; customersCount?: number; productsCount?: number }; revenueByDay?: Array<{ day: string; revenue: number; orders?: number }>; lowStock?: Array<{ id: number; name_ru?: string; name?: string; stock: number }>; missingImages?: Array<{ id: number; name_ru?: string; name?: string }>; topProducts?: Array<{ product_name: string; quantity: number; revenue: number }> };

export default function AdminPage() {
  const [stats, setStats] = useState<Stats>({});
  const [updatedAt, setUpdatedAt] = useState('');
  const loadStats = useCallback(() => fetch('/api/admin/stats', { cache: 'no-store' }).then(r => r.json()).then(data => { setStats(data); setUpdatedAt(new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', second: '2-digit' })); }).catch(console.error), []);
  useEffect(() => { loadStats(); const id = window.setInterval(loadStats, 10000); return () => window.clearInterval(id); }, [loadStats]);
  const days = stats.revenueByDay || [];
  const maxRevenue = useMemo(() => Math.max(...days.map(x => Number(x.revenue || 0)), 1), [days]);
  const cards = [
    ['Доход', `${Math.round(stats.cards?.totalRevenue || 0).toLocaleString()} ₸`],
    ['Заказы', String(stats.cards?.ordersCount || 0)],
    ['Клиенты', String(stats.cards?.customersCount || 0)],
    ['Товары', String(stats.cards?.productsCount || 0)],
  ];
  return (
    <AdminShell title="Панель управления">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><p className="text-sm font-bold text-slate-700">Графики строятся по реальным заказам и обновляются каждые 10 секунд.</p><button onClick={loadStats} className="rounded-full bg-black px-5 py-3 text-xs font-black uppercase tracking-widest text-white">Обновить</button></div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{cards.map(([label, value]) => <div key={label} className="rounded-[2rem] border border-violet-200 bg-white p-6 shadow-sm"><p className="text-xs font-black uppercase tracking-widest text-slate-700">{label}</p><p className="mt-3 text-4xl font-black">{value}</p></div>)}</div>
      <div className="mt-6 rounded-[2rem] border border-violet-200 bg-white p-6 shadow-sm"><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-2xl font-black uppercase italic tracking-tighter">График дохода</h2>{updatedAt && <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Обновлено {updatedAt}</p>}</div><div className="mt-6 flex h-72 items-end gap-3 border-b border-slate-200 pb-2">{days.length ? days.map((x, i) => { const value = Number(x.revenue || 0); const height = value > 0 ? Math.max(18, (value / maxRevenue) * 100) : 6; return <div key={`${x.day}-${i}`} className="flex h-full flex-1 flex-col items-center justify-end gap-2"><div className="min-h-[36px] text-center"><p className="text-[10px] font-black text-slate-900">{value > 0 ? `${Math.round(value).toLocaleString()} ₸` : '0 ₸'}</p><p className="text-[9px] font-bold text-slate-500">{x.orders || 0} заказ.</p></div><div title={`${value.toLocaleString()} ₸`} className={`w-full rounded-t-2xl transition ${value > 0 ? 'bg-violet-700 hover:bg-violet-900' : 'bg-violet-100'}`} style={{ height: `${height}%` }} /><span className="text-[10px] font-bold text-slate-700">{x.day.slice(5)}</span></div>; }) : <p className="text-sm text-slate-700">После первого заказа здесь появится график.</p>}</div></div>
      <div className="mt-6 grid gap-6 xl:grid-cols-3"><div className="rounded-[2rem] border border-violet-200 bg-white p-6 shadow-sm"><h2 className="text-2xl font-black uppercase italic tracking-tighter">Низкий остаток</h2><div className="mt-4 space-y-2">{(stats.lowStock || []).length ? stats.lowStock!.map(p => <div key={p.id} className="flex justify-between rounded-2xl bg-violet-50 p-3"><span className="font-bold">{p.name_ru || p.name}</span><span>{p.stock}</span></div>) : <p className="text-sm text-slate-700">Критичных остатков нет.</p>}</div></div><div className="rounded-[2rem] border border-violet-200 bg-white p-6 shadow-sm"><h2 className="text-2xl font-black uppercase italic tracking-tighter">Без фото</h2><div className="mt-4 space-y-2">{(stats.missingImages || []).length ? stats.missingImages!.map(p => <Link key={p.id} href={`/admin/products?edit=${p.id}`} className="block rounded-2xl bg-red-50 p-3 text-sm font-bold text-red-700">{p.name_ru || p.name}</Link>) : <p className="text-sm text-slate-700">Все товары с фото.</p>}</div></div><div className="rounded-[2rem] border border-violet-200 bg-white p-6 shadow-sm"><h2 className="text-2xl font-black uppercase italic tracking-tighter">Топ товаров</h2><div className="mt-4 space-y-2">{(stats.topProducts || []).length ? stats.topProducts!.map(p => <div key={p.product_name} className="rounded-2xl bg-slate-50 p-3"><p className="font-bold">{p.product_name}</p><p className="text-sm text-slate-700">{p.quantity} продаж</p></div>) : <p className="text-sm text-slate-700">Пока нет продаж.</p>}</div></div></div>
      <div className="mt-6 flex flex-wrap gap-3"><Link className="rounded-2xl bg-black px-5 py-4 text-xs font-black uppercase tracking-widest text-white" href="/admin/products">Товары</Link><Link className="rounded-2xl bg-violet-100 px-5 py-4 text-xs font-black uppercase tracking-widest text-violet-900" href="/admin/orders">Заказы</Link></div>
    </AdminShell>
  );
}
