'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import ProductImage from '@/components/site/ProductImage';
import { useApp } from '@/lib/context';
import { getSupabaseBrowser } from '@/lib/supabase/client';

const labels = {
  RU: { back: 'Назад в каталог', tag: 'Оформление', title: 'Данные заказа', name: 'Имя', phone: 'Телефон', email: 'Email', city: 'Город', address: 'Адрес', comment: 'Комментарий', payment: 'Оплата', paymentText: 'Оплата при получении. Kaspi и карта будут подключены позже.', empty: 'Корзина пустая', error: 'Не удалось оформить заказ', creating: 'Создаём заказ...', submit: 'Оформить заказ', order: 'Ваш заказ', total: 'Итого', accountHint: 'Войдите в аккаунт, чтобы заказ сохранился в личном кабинете.' },
  KZ: { back: 'Каталогқа қайту', tag: 'Тапсырыс', title: 'Тапсырыс деректері', name: 'Аты', phone: 'Телефон', email: 'Email', city: 'Қала', address: 'Мекенжай', comment: 'Пікір', payment: 'Төлем', paymentText: 'Алған кезде төлеу. Kaspi және карта кейін қосылады.', empty: 'Себет бос', error: 'Тапсырысты рәсімдеу мүмкін болмады', creating: 'Тапсырыс жасалуда...', submit: 'Тапсырыс беру', order: 'Сіздің тапсырысыңыз', total: 'Жиыны', accountHint: 'Тапсырыс жеке кабинетте сақталуы үшін аккаунтқа кіріңіз.' },
};

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartTotal, clearCart, lang } = useApp();
  const l = labels[lang];
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [form, setForm] = useState({ customerName: '', phone: '', email: '', city: 'Алматы', address: '', comment: '', deliveryMethod: 'courier', paymentMethod: 'cash_on_delivery' });

  useEffect(() => {
    let ignore = false;
    async function loadAccount() {
      const supabase = getSupabaseBrowser();
      const session = await supabase?.auth.getSession();
      const token = session?.data.session?.access_token;
      const email = session?.data.session?.user.email || '';
      if (!token) return;
      setLoggedIn(true);
      const res = await fetch('/api/account/profile', { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok || ignore) return;
      const data = await res.json();
      const profile = data.profile || {};
      setForm(prev => ({ ...prev, customerName: profile.full_name || prev.customerName, phone: profile.phone || prev.phone, email: profile.email || email || prev.email, city: profile.city || prev.city }));
      const addressRes = await fetch('/api/account/addresses', { headers: { Authorization: `Bearer ${token}` } });
      if (!addressRes.ok || ignore) return;
      const addresses = await addressRes.json();
      const address = Array.isArray(addresses) ? addresses.find((item: any) => item.is_default) || addresses[0] : null;
      if (address) setForm(prev => ({ ...prev, city: address.city || prev.city, address: address.address || prev.address }));
    }
    loadAccount().catch(console.error);
    return () => { ignore = true; };
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    if (cart.length === 0) { setError(l.empty); return; }
    setLoading(true);
    try {
      const supabase = getSupabaseBrowser();
      const session = await supabase?.auth.getSession();
      const token = session?.data.session?.access_token;
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers.Authorization = `Bearer ${token}`;
      const response = await fetch('/api/orders', { method: 'POST', headers, body: JSON.stringify({ ...form, items: cart }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || l.error);
      clearCart();
      router.push(`/checkout/success?order=${encodeURIComponent(data.orderNumber)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : l.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-screen-2xl px-4 py-8 md:px-8 md:py-12">
        <Link href="/products" className="mb-8 inline-flex text-xs font-black uppercase tracking-widest text-slate-700 hover:text-black">{l.back}</Link>
        <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
          <form onSubmit={handleSubmit} className="rounded-[2rem] bg-white p-5 shadow-sm md:p-8">
            <p className="mb-2 text-[10px] font-black uppercase tracking-[0.22em] text-violet-800">{l.tag}</p>
            <h1 className="mb-8 text-4xl font-black uppercase italic tracking-tighter md:text-6xl">{l.title}</h1>
            {!loggedIn && <Link href="/login" className="mb-5 block rounded-3xl border border-violet-200 bg-violet-50 p-4 text-sm font-bold text-violet-900">{l.accountHint}</Link>}
            <div className="grid gap-4 md:grid-cols-2">
              <input required aria-label={l.name} placeholder={l.name} value={form.customerName} onChange={e => setForm(p => ({ ...p, customerName: e.target.value }))} className="rounded-2xl border border-slate-300 px-4 py-4 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100" />
              <input required aria-label={l.phone} placeholder={l.phone} value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className="rounded-2xl border border-slate-300 px-4 py-4 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100" />
              <input aria-label={l.email} placeholder={l.email} value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className="rounded-2xl border border-slate-300 px-4 py-4 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100" />
              <input required aria-label={l.city} placeholder={l.city} value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))} className="rounded-2xl border border-slate-300 px-4 py-4 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100" />
              <input required aria-label={l.address} placeholder={l.address} value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} className="rounded-2xl border border-slate-300 px-4 py-4 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100 md:col-span-2" />
              <textarea aria-label={l.comment} placeholder={l.comment} value={form.comment} onChange={e => setForm(p => ({ ...p, comment: e.target.value }))} className="min-h-28 rounded-2xl border border-slate-300 px-4 py-4 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100 md:col-span-2" />
            </div>
            <div className="mt-6 rounded-3xl border border-violet-200 bg-violet-50 p-5"><p className="font-black uppercase tracking-widest text-black">{l.payment}</p><p className="mt-2 text-sm text-slate-700">{l.paymentText}</p></div>
            {error && <p className="mt-4 rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-700">{error}</p>}
            <button disabled={loading || cart.length === 0} className="mt-8 w-full rounded-2xl bg-black py-5 text-sm font-black uppercase tracking-widest text-white transition hover:bg-violet-800 disabled:bg-slate-400">{loading ? l.creating : l.submit}</button>
          </form>
          <aside className="h-fit rounded-[2rem] bg-white p-5 shadow-sm md:p-6 lg:sticky lg:top-28">
            <h2 className="mb-5 text-xl font-black uppercase italic tracking-tighter">{l.order}</h2>
            <div className="space-y-4">{cart.map(item => <div key={item.cartKey} className="flex gap-3"><div className="h-20 w-16 overflow-hidden rounded-2xl bg-slate-100"><ProductImage src={item.image} alt={item.name} /></div><div className="min-w-0 flex-1"><p className="line-clamp-2 text-sm font-black uppercase italic tracking-tighter">{item.name}</p><p className="mt-1 text-[11px] font-bold uppercase tracking-widest text-slate-700">{item.size || 'OS'} x {item.quantity}</p></div><p className="text-sm font-black">{(item.price * item.quantity).toLocaleString()} ₸</p></div>)}</div>
            <div className="mt-6 border-t pt-5"><div className="flex items-end justify-between"><span className="text-xs font-black uppercase tracking-widest text-slate-700">{l.total}</span><span className="text-3xl font-black tracking-tighter">{cartTotal.toLocaleString()} ₸</span></div></div>
          </aside>
        </div>
      </div>
    </div>
  );
}
