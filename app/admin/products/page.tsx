'use client';

import { useEffect, useState } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import type { Product } from '@/lib/types';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => { fetch('/api/products').then(r => r.json()).then(d => Array.isArray(d) && setProducts(d)).catch(console.error); }, []);
  return (
    <AdminShell title="Products">
      <div className="rounded-[2rem] bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-2xl font-black uppercase italic tracking-tighter">Products</h2>
        <div className="overflow-x-auto"><table className="w-full min-w-[720px] text-left text-sm"><thead><tr className="text-slate-400"><th className="p-3">Name</th><th>Category</th><th>Stock</th><th>Price</th><th>Status</th></tr></thead><tbody>{products.map(p => <tr key={p.id} className="border-t"><td className="p-3 font-black">{p.name}</td><td>{p.category_name}</td><td>{p.stock}</td><td>{p.price.toLocaleString()} ₸</td><td>{p.status}</td></tr>)}</tbody></table></div>
      </div>
    </AdminShell>
  );
}
