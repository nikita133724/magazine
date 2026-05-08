'use client';

import { useEffect, useState } from 'react';
import AdminShell from '@/components/admin/AdminShell';

interface CustomerRow { id: number; name: string; phone: string; email?: string | null; created_at: string; }

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerRow[]>([]);
  useEffect(() => { fetch('/api/admin/customers').then(r => r.json()).then(d => Array.isArray(d) && setCustomers(d)).catch(console.error); }, []);
  return (
    <AdminShell title="Customers">
      <div className="rounded-[2rem] bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-2xl font-black uppercase italic tracking-tighter">Customers</h2>
        <div className="overflow-x-auto"><table className="w-full min-w-[680px] text-left text-sm"><thead><tr className="text-slate-400"><th className="p-3">Name</th><th>Phone</th><th>Email</th><th>Date</th></tr></thead><tbody>{customers.map(c => <tr key={c.id} className="border-t"><td className="p-3 font-black">{c.name}</td><td>{c.phone}</td><td>{c.email || '-'}</td><td>{c.created_at}</td></tr>)}</tbody></table></div>
      </div>
    </AdminShell>
  );
}
