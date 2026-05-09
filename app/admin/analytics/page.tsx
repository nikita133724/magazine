'use client';

import { useEffect, useMemo, useState } from 'react';
import AdminShell from '@/components/admin/AdminShell';

type Stats = { cards?: { totalRevenue?: number; ordersCount?: number; avgOrder?: number; productsCount?: number }; revenueByDay?: Array<{ day: string; revenue: number; orders?: number }>; topProducts?: Array<{ product_name: string; quantity: number; revenue: number }> };

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState<Stats>({});
  useEffect(() => { fetch('/api/admin/stats').then(r => r.json()).then(setStats).catch(console.error); }, []);
  const days = stats.revenueByDay || [];
  const maxRevenue = useMemo(() => Math.max(...days.map(x => Number(x.revenue || 0)), 1), [days]);
  const cards = [
    ['Доход', `${Math.round(stats.cards?.totalRevenue || 0).toLocaleString()} ₸`],
    ['Заказы', String(stats.cards?.ordersCount || 0)],
    ['Средний чек', `${Math.round(stats.cards?.avgOrder || 0).toLocaleString()} ₸`],
  ];

  return (
    <AdminShell title="Аналитика">
      <div className="grid gap-4 md:grid-cols-3">{cards.map(([label, value]) => <div key={label} className="rounded-[2rem] border border-violet-200 bg-white p-6 shadow-sm"><p className="text-xs font-black uppercase tracking-widest text-slate-700">{label}</p><p className="mt-3 text-3xl font-black">{value}</p></div>)}</div>
      <div className="mt-6 rounded-[2rem] border border-violet-200 bg-white p-6 shadow-sm"><h2 className="text-2xl font-black uppercase italic tracking-tighter">Доход за 7 дней</h2><div className="mt-6 flex h-64 items-end gap-3 border-b border-slate-200 pb-2">{days.length ? days.map((x, i) => { const value = Number(x.revenue || 0); return <div key={`${x.day}-${i}`} className="flex flex-1 flex-col items-center gap-2"><div title={`${value.toLocaleString()} ₸`} className={`w-full rounded-t-2xl ${value > 0 ? 'bg-violet-700' : 'bg-violet-100'}`} style={{ height: `${value > 0 ? Math.max(12, (value / maxRevenue) * 100) : 6}%` }} /><span className="text-[10px] font-bold text-slate-700">{x.day.slice(5)}</span></div>; }) : <p className="text-sm text-slate-700">После первого заказа здесь появится график.</p>}</div></div>
      <div className="mt-6 rounded-[2rem] border border-violet-200 bg-white p-6 shadow-sm"><h2 className="text-2xl font-black uppercase italic tracking-tighter">Топ товаров</h2><div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">{(stats.topProducts || []).length ? stats.topProducts!.map(item => <div key={item.product_name} className="rounded-2xl bg-slate-50 p-4"><p className="font-black">{item.product_name}</p><p className="mt-1 text-sm text-slate-700">{item.quantity} продаж · {Number(item.revenue).toLocaleString()} ₸</p></div>) : <p className="text-sm text-slate-700">Пока нет продаж.</p>}</div></div>
    </AdminShell>
  );
}
