'use client';

import Link from 'next/link';
import AdminShell from '@/components/admin/AdminShell';

export default function AdminPage() {
  const cards = [
    ['Доход', '1 490 000 ₸'],
    ['Заказы', '32'],
    ['Клиенты', '18'],
    ['Товары', '20+'],
  ];

  return (
    <AdminShell title="Панель управления">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map(([label, value]) => (
          <div key={label} className="rounded-[2rem] border border-violet-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:bg-violet-50">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-700">{label}</p>
            <p className="mt-3 text-4xl font-black tracking-tighter text-black">{value}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="rounded-[2rem] border border-violet-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-700">Аналитика</p>
          <h2 className="mt-2 text-3xl font-black uppercase italic tracking-tighter">График дохода</h2>
          <div className="mt-6 flex h-64 items-end gap-3">
            {[42, 64, 38, 80, 58, 92, 70].map((height, index) => (
              <div key={index} className="flex flex-1 flex-col items-center gap-2">
                <div className="w-full rounded-t-2xl bg-violet-600 transition hover:bg-violet-800" style={{ height: `${height}%` }} />
                <span className="text-xs font-bold text-slate-700">{index + 1}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-[2rem] border border-violet-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-700">Быстрые действия</p>
          <div className="mt-5 flex flex-col gap-3">
            <Link className="rounded-2xl bg-black px-5 py-4 text-center text-xs font-black uppercase tracking-widest text-white transition hover:scale-[1.02] hover:bg-violet-800" href="/admin/products">Товары</Link>
            <Link className="rounded-2xl bg-violet-100 px-5 py-4 text-center text-xs font-black uppercase tracking-widest text-violet-900 transition hover:scale-[1.02] hover:bg-violet-200" href="/admin/orders">Заказы</Link>
            <Link className="rounded-2xl bg-violet-100 px-5 py-4 text-center text-xs font-black uppercase tracking-widest text-violet-900 transition hover:scale-[1.02] hover:bg-violet-200" href="/admin/customers">Клиенты</Link>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
