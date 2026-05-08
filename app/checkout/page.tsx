'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import ProductImage from '@/components/site/ProductImage';
import { useApp } from '@/lib/context';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartTotal, clearCart } = useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ customerName: '', phone: '', email: '', city: 'Almaty', address: '', comment: '', deliveryMethod: 'courier', paymentMethod: 'cash_on_delivery' });

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    if (cart.length === 0) { setError('Cart is empty'); return; }
    setLoading(true);
    try {
      const response = await fetch('/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, items: cart }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Order failed');
      clearCart();
      router.push(`/checkout/success?order=${encodeURIComponent(data.orderNumber)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Order failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-screen-2xl px-4 py-8 md:px-8 md:py-12">
        <Link href="/products" className="mb-8 inline-flex text-xs font-black uppercase tracking-widest text-slate-400 hover:text-black">Back to shop</Link>
        <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
          <form onSubmit={handleSubmit} className="rounded-[2rem] bg-white p-5 shadow-sm md:p-8">
            <p className="mb-2 text-[10px] font-black uppercase tracking-[0.4em] text-violet-500">Checkout</p>
            <h1 className="mb-8 text-4xl font-black uppercase italic tracking-tighter md:text-6xl">Order details</h1>
            <div className="grid gap-4 md:grid-cols-2">
              <input required placeholder="Name" value={form.customerName} onChange={e => setForm(p => ({ ...p, customerName: e.target.value }))} className="rounded-2xl border border-slate-200 px-4 py-4 outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-100" />
              <input required placeholder="Phone" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className="rounded-2xl border border-slate-200 px-4 py-4 outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-100" />
              <input placeholder="Email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className="rounded-2xl border border-slate-200 px-4 py-4 outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-100" />
              <input required placeholder="City" value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))} className="rounded-2xl border border-slate-200 px-4 py-4 outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-100" />
              <input required placeholder="Address" value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} className="rounded-2xl border border-slate-200 px-4 py-4 outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-100 md:col-span-2" />
              <textarea placeholder="Comment" value={form.comment} onChange={e => setForm(p => ({ ...p, comment: e.target.value }))} className="min-h-28 rounded-2xl border border-slate-200 px-4 py-4 outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-100 md:col-span-2" />
            </div>
            <div className="mt-6 rounded-3xl border border-violet-100 bg-violet-50/60 p-5"><p className="font-black uppercase tracking-widest">Payment</p><p className="mt-2 text-sm text-slate-600">Cash on delivery. Card/Kaspi is a placeholder for demo.</p></div>
            {error && <p className="mt-4 rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-600">{error}</p>}
            <button disabled={loading || cart.length === 0} className="mt-8 w-full rounded-2xl bg-black py-5 text-sm font-black uppercase tracking-widest text-white transition hover:bg-violet-700 disabled:bg-slate-300">{loading ? 'Creating order...' : 'Place order'}</button>
          </form>
          <aside className="h-fit rounded-[2rem] bg-white p-5 shadow-sm md:p-6 lg:sticky lg:top-28">
            <h2 className="mb-5 text-xl font-black uppercase italic tracking-tighter">Your order</h2>
            <div className="space-y-4">{cart.map(item => <div key={item.cartKey} className="flex gap-3"><div className="h-20 w-16 overflow-hidden rounded-2xl bg-slate-100"><ProductImage src={item.image} alt={item.name} /></div><div className="min-w-0 flex-1"><p className="line-clamp-2 text-sm font-black uppercase italic tracking-tighter">{item.name}</p><p className="mt-1 text-[11px] font-bold uppercase tracking-widest text-slate-400">{item.size || 'OS'} x {item.quantity}</p></div><p className="text-sm font-black">{(item.price * item.quantity).toLocaleString()} ₸</p></div>)}</div>
            <div className="mt-6 border-t pt-5"><div className="flex items-end justify-between"><span className="text-xs font-black uppercase tracking-widest text-slate-400">Total</span><span className="text-3xl font-black tracking-tighter">{cartTotal.toLocaleString()} ₸</span></div></div>
          </aside>
        </div>
      </div>
    </div>
  );
}
