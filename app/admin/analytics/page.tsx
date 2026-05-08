'use client';

import AdminShell from '@/components/admin/AdminShell';

export default function AdminAnalyticsPage() {
  return (
    <AdminShell title="Аналитика">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[2rem] border border-violet-200 bg-white p-6 shadow-sm"><p className="text-xs font-black uppercase tracking-widest text-slate-700">Доход</p><p className="mt-3 text-3xl font-black">1 490 000 ₸</p></div>
        <div className="rounded-[2rem] border border-violet-200 bg-white p-6 shadow-sm"><p className="text-xs font-black uppercase tracking-widest text-slate-700">Заказы</p><p className="mt-3 text-3xl font-black">32</p></div>
        <div className="rounded-[2rem] border border-violet-200 bg-white p-6 shadow-sm"><p className="text-xs font-black uppercase tracking-widest text-slate-700">Средний чек</p><p className="mt-3 text-3xl font-black">46 500 ₸</p></div>
      </div>
      <div className="mt-6 rounded-[2rem] border border-violet-200 bg-white p-6 shadow-sm"><h2 className="text-2xl font-black uppercase italic tracking-tighter">Продажи за неделю</h2><div className="mt-6 flex h-60 items-end gap-3">{[42, 64, 38, 80, 58, 92, 70].map((h, i) => <div key={i} className="flex flex-1 flex-col items-center gap-2"><div className="w-full rounded-t-2xl bg-violet-600" style={{ height: `${h}%` }} /><span className="text-xs font-bold text-slate-700">{i + 1}</span></div>)}</div></div>
    </AdminShell>
  );
}
