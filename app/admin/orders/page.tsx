'use client';

import { useEffect, useState } from 'react';
import AdminShell from '@/components/admin/AdminShell';

interface OrderRow { id: number; order_number: string; customer_name: string; total: number; payment_status: string; order_status: string; created_at: string; }

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  useEffect(() => { fetch('/api/admin/orders').then(r => r.json()).then(d => Array.isArray(d) && setOrders(d)).catch(console.error); }, []);
  return (
    <AdminShell title="Orders">
      <div className="rounded-[2rem] bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-2xl font-black uppercase italic tracking-tighter">Orders</h2>
        <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead><tr className="text-slate-400"><th className="p-3">Order</th><th>Customer</th><th>Total</th><th>Payment</th><th>Status</th><th>Date</th></tr></thead><tbody>{orders.map(o => <tr key={o.id} className="border-t"><td className="p-3 font-black">#{o.order_number}</td><td>{o.customer_name}</td><td>{Number(o.total).toLocaleString()} ₸</td><td>{o.payment_status}</td><td>{o.order_status}</td><td>{o.created_at}</td></tr>)}</tbody></table></div>
      </div>
    </AdminShell>
  );
}
