'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import AdminShell from '@/components/admin/AdminShell';

type Stats = { cards?: { totalRevenue?: number; ordersCount?: number; customersCount?: number; productsCount?: number }; revenueByDay?: Array<{ day: string; revenue: number; orders?: number }>; lowStock?: Array<{ id: number; name_ru?: string; name?: string; stock: number }>; missingImages?: Array<{ id: number; name_ru?: string; name?: string }>; topProducts?: Array<{ product_name: string; quantity: number; revenue: number }> };

export default function AdminPage() {
  const [stats, setStats] = useState<Stats>({});
  useEffect(() => { fetch('/api/admin/stats').then(r => r.json()).then(setStats).catch(console.error); }, []);
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
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{cards.map(([label, value]) => <div key={label} className="rounded-[2rem] border border-violet-200 bg-white p-6 shadow-sm"><p className="text-xs font-black uppercase tracking-widest text-slate-700">{label}</p><p className="mt-3 text-4xl font-black">{value}</p></div>)}</div>
      <div className="mt-6 rounded-[2rem] border border-violet-200 bg-white p-6 shadow-sm"><h2 className="text-2xl font-black uppercase italic tracking-tighter">График дохода</h2><div className="mt-6 flex h-64 items-end gap-3 border-b border-slate-200 pb-2">{days.length ? days.map((x, i) => { const value = Number(x.revenue || 0); return <div key={`${x.day}-${i}`} className="flex flex-1 flex-col items-center gap-2"><div title={`${value.toLocaleString()} ₸`} className={`w-full rounded-t-2xl ${value > 0 ? 'bg-violet-700' : 'bg-violet-100'}`} style={{ height: `${value > 0 ? Math.max(12, (value / maxRevenue) * 100) : 6}%` }} /><span className="text-[10px] font-bold text-slate-700">{x.day.slice(5)}</span></div>; }) : <p className="text-sm text-slate-700">После первого заказа здесь появится график.</p>}</div></div>
      <div className="mt-6 grid gap-6 xl:grid-cols-3"><div className="rounded-[2rem] border border-violet-200 bg-white p-6 shadow-sm"><h2 className="text-2xl font-black uppercase italic tracking-tighter">Низкий остаток</h2><div className="mt-4 space-y-2">{(stats.lowStock || []).length ? stats.lowStock!.map(p => <div key={p.id} className="flex justify-between rounded-2xl bg-violet-50 p-3"><span className="font-bold">{p.name_ru || p.name}</span><span>{p.stock}</span></div>) : <p className="text-sm text-slate-700">Критичных остатков нет.</p>}</div></div><div className="rounded-[2rem] border border-violet-200 bg-white p-6 shadow-sm"><h2 className="text-2xl font-black uppercase italic tracking-tighter">Без фото</h2><div className="mt-4 space-y-2">{(stats.missingImages || []).length ? stats.missingImages!.map(p => <Link key={p.id} href={`/admin/products?edit=${p.id}`} className="block rounded-2xl bg-red-50 p-3 text-sm font-bold text-red-700">{p.name_ru || p.name}</Link>) : <p className="text-sm text-slate-700">Все товары с фото.</p>}</div></div><div className="rounded-[2rem] border border-violet-200 bg-white p-6 shadow-sm"><h2 className="text-2xl font-black uppercase italic tracking-tighter">Топ товаров</h2><div className="mt-4 space-y-2">{(stats.topProducts || []).length ? stats.topProducts!.map(p => <div key={p.product_name} className="rounded-2xl bg-slate-50 p-3"><p className="font-bold">{p.product_name}</p><p className="text-sm text-slate-700">{p.quantity} продаж</p></div>) : <p className="text-sm text-slate-700">Пока нет продаж.</p>}</div></div></div>
      <div className="mt-6 flex flex-wrap gap-3"><Link className="rounded-2xl bg-black px-5 py-4 text-xs font-black uppercase tracking-widest text-white" href="/admin/products">Товары</Link><Link className="rounded-2xl bg-violet-100 px-5 py-4 text-xs font-black uppercase tracking-widest text-violet-900" href="/admin/orders">Заказы</Link></div>
    </AdminShell>
  );
}
