'use client';

import { useEffect, useState } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import { orderStatusLabel, paymentStatusLabel } from '@/lib/orderLabels';

interface OrderRow { id: number; order_number: string; customer_name: string; phone?: string; total: number; payment_status: string; order_status: string; created_at: string; }

const orderStatuses = ['new', 'processing', 'shipped', 'delivered', 'canceled'];
const paymentStatuses = ['pending', 'paid', 'failed', 'refunded'];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [message, setMessage] = useState('');
  const [updatedAt, setUpdatedAt] = useState('');
  const load = () => fetch('/api/admin/orders', { cache: 'no-store' }).then(r => r.json()).then(d => { if (Array.isArray(d)) setOrders(d); setUpdatedAt(new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', second: '2-digit' })); }).catch(console.error);
  useEffect(() => { load(); const id = window.setInterval(load, 10000); return () => window.clearInterval(id); }, []);

  const update = async (id: number, patch: Partial<OrderRow>) => {
    const res = await fetch('/api/admin/orders', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, ...patch }) });
    const data = await res.json();
    if (!res.ok) setMessage(data.error || 'Не удалось обновить заказ');
    else { setMessage('Заказ обновлён'); load(); }
  };

  return (
    <AdminShell title="Заказы">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div><p className="text-sm font-bold text-slate-700">Новые заказы из checkout автоматически появляются здесь.</p>{updatedAt && <p className="mt-1 text-xs font-bold uppercase tracking-widest text-slate-500">Обновлено {updatedAt}</p>}</div><a href="/api/admin/orders/export" className="rounded-2xl bg-black px-5 py-3 text-xs font-black uppercase tracking-widest text-white">Экспорт CSV</a></div>
      {message && <p className="mb-4 rounded-2xl bg-violet-50 p-4 text-sm font-bold text-violet-800">{message}</p>}
      <div className="rounded-[2rem] bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-2xl font-black uppercase italic tracking-tighter">Список заказов</h2>
        <div className="overflow-x-auto"><table className="w-full min-w-[980px] text-left text-sm"><thead><tr className="text-slate-700"><th className="p-3">Заказ</th><th>Клиент</th><th>Телефон</th><th>Сумма</th><th>Оплата</th><th>Статус заказа</th><th>Дата</th></tr></thead><tbody>{orders.map(o => <tr key={o.id} className="border-t"><td className="p-3 font-black">#{o.order_number}</td><td>{o.customer_name}</td><td>{o.phone || '-'}</td><td>{Number(o.total).toLocaleString()} ₸</td><td><select aria-label="Статус оплаты" value={o.payment_status} onChange={e => update(o.id, { payment_status: e.target.value })} className="rounded-xl border border-slate-300 bg-white px-3 py-2 font-bold">{paymentStatuses.map(s => <option key={s} value={s}>{paymentStatusLabel(s, 'RU')}</option>)}</select></td><td><select aria-label="Статус заказа" value={o.order_status} onChange={e => update(o.id, { order_status: e.target.value })} className="rounded-xl border border-slate-300 bg-white px-3 py-2 font-bold">{orderStatuses.map(s => <option key={s} value={s}>{orderStatusLabel(s, 'RU')}</option>)}</select></td><td>{String(o.created_at).slice(0, 10)}</td></tr>)}</tbody></table></div>
      </div>
    </AdminShell>
  );
}
