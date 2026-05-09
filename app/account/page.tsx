'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import ProductCard from '@/components/site/ProductCard';
import { getSupabaseBrowser } from '@/lib/supabase/client';

type Profile = { full_name?: string; phone?: string; city?: string; email?: string };
type Address = { id: number; title: string; city: string; address: string; is_default: boolean };
type Order = { id: number; order_number: string; total: number; payment_status: string; order_status: string; created_at: string; order_items?: Array<{ id: number; product_name: string; size?: string; quantity: number; price: number }> };
type Wish = { id: number; product_id: number; product: any };

async function authHeaders(): Promise<Record<string, string>> {
  const supabase = getSupabaseBrowser();
  const session = await supabase?.auth.getSession();
  const token = session?.data.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function AccountPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState('');
  const [profile, setProfile] = useState<Profile>({});
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlist, setWishlist] = useState<Wish[]>([]);
  const [addressForm, setAddressForm] = useState({ title: 'Основной адрес', city: 'Алматы', address: '', is_default: true });
  const [message, setMessage] = useState('');

  const load = async () => {
    const supabase = getSupabaseBrowser();
    const session = await supabase?.auth.getSession();
    const user = session?.data.session?.user;
    if (!user) { router.push('/login'); return; }
    setEmail(user.email || '');
    const headers = await authHeaders();
    const [profileRes, addressRes, orderRes, wishRes] = await Promise.all([
      fetch('/api/account/profile', { headers }),
      fetch('/api/account/addresses', { headers }),
      fetch('/api/account/orders', { headers }),
      fetch('/api/account/wishlist', { headers }),
    ]);
    const profileData = await profileRes.json();
    setProfile(profileData.profile || { email: user.email });
    setAddresses(addressRes.ok ? await addressRes.json() : []);
    setOrders(orderRes.ok ? await orderRes.json() : []);
    setWishlist(wishRes.ok ? await wishRes.json() : []);
    setReady(true);
  };

  useEffect(() => { load().catch(console.error); }, []);

  const saveProfile = async (event: FormEvent) => {
    event.preventDefault();
    const res = await fetch('/api/account/profile', { method: 'PATCH', headers: { 'Content-Type': 'application/json', ...(await authHeaders()) }, body: JSON.stringify(profile) });
    const data = await res.json();
    setMessage(res.ok ? 'Профиль сохранён' : data.error || 'Ошибка');
  };

  const addAddress = async (event: FormEvent) => {
    event.preventDefault();
    const res = await fetch('/api/account/addresses', { method: 'POST', headers: { 'Content-Type': 'application/json', ...(await authHeaders()) }, body: JSON.stringify(addressForm) });
    const data = await res.json();
    if (!res.ok) setMessage(data.error || 'Ошибка адреса');
    else { setMessage('Адрес добавлен'); setAddressForm({ title: 'Основной адрес', city: 'Алматы', address: '', is_default: true }); load(); }
  };

  const logout = async () => {
    await getSupabaseBrowser()?.auth.signOut();
    router.push('/');
  };

  if (!ready) return <div className="min-h-screen bg-slate-50 px-4 py-12"><div className="mx-auto max-w-screen-xl rounded-[2rem] bg-white p-8 shadow-sm">Загрузка кабинета...</div></div>;

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 md:px-8 md:py-12">
      <div className="mx-auto max-w-screen-2xl">
        <div className="mb-6 flex flex-col gap-4 rounded-[2rem] bg-black p-6 text-white md:flex-row md:items-end md:justify-between md:p-8"><div><p className="text-[10px] font-black uppercase tracking-[0.22em] text-violet-200">Личный кабинет</p><h1 className="mt-3 text-5xl font-black uppercase italic tracking-tighter">Мой профиль</h1><p className="mt-2 text-sm text-slate-300">{email}</p></div><button onClick={logout} className="rounded-full bg-white px-6 py-3 text-xs font-black uppercase tracking-widest text-black">Выйти</button></div>
        {message && <p className="mb-6 rounded-2xl bg-violet-50 p-4 text-sm font-bold text-violet-800">{message}</p>}
        <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
          <div className="space-y-6">
            <form onSubmit={saveProfile} className="rounded-[2rem] bg-white p-6 shadow-sm"><h2 className="mb-4 text-2xl font-black uppercase italic tracking-tighter">Данные покупателя</h2><div className="space-y-3"><input placeholder="Имя" value={profile.full_name || ''} onChange={e => setProfile(p => ({ ...p, full_name: e.target.value }))} className="w-full rounded-2xl border border-slate-300 px-4 py-3" /><input placeholder="Телефон" value={profile.phone || ''} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} className="w-full rounded-2xl border border-slate-300 px-4 py-3" /><input placeholder="Город" value={profile.city || ''} onChange={e => setProfile(p => ({ ...p, city: e.target.value }))} className="w-full rounded-2xl border border-slate-300 px-4 py-3" /></div><button className="mt-4 rounded-2xl bg-black px-5 py-3 text-xs font-black uppercase tracking-widest text-white">Сохранить</button></form>
            <form onSubmit={addAddress} className="rounded-[2rem] bg-white p-6 shadow-sm"><h2 className="mb-4 text-2xl font-black uppercase italic tracking-tighter">Адреса</h2><div className="space-y-3"><input placeholder="Название" value={addressForm.title} onChange={e => setAddressForm(p => ({ ...p, title: e.target.value }))} className="w-full rounded-2xl border border-slate-300 px-4 py-3" /><input placeholder="Город" value={addressForm.city} onChange={e => setAddressForm(p => ({ ...p, city: e.target.value }))} className="w-full rounded-2xl border border-slate-300 px-4 py-3" /><input required placeholder="Адрес" value={addressForm.address} onChange={e => setAddressForm(p => ({ ...p, address: e.target.value }))} className="w-full rounded-2xl border border-slate-300 px-4 py-3" /></div><button className="mt-4 rounded-2xl bg-black px-5 py-3 text-xs font-black uppercase tracking-widest text-white">Добавить адрес</button><div className="mt-4 space-y-2">{addresses.map(a => <div key={a.id} className="rounded-2xl bg-slate-50 p-3 text-sm"><p className="font-black">{a.title}{a.is_default ? ' · основной' : ''}</p><p className="text-slate-700">{a.city}, {a.address}</p></div>)}</div></form>
          </div>
          <div className="space-y-6">
            <section className="rounded-[2rem] bg-white p-6 shadow-sm"><h2 className="mb-4 text-2xl font-black uppercase italic tracking-tighter">История заказов</h2>{orders.length ? <div className="space-y-3">{orders.map(order => <div key={order.id} className="rounded-2xl border border-slate-200 p-4"><div className="flex flex-wrap items-center justify-between gap-3"><p className="font-black">#{order.order_number}</p><p className="text-xl font-black">{Number(order.total).toLocaleString()} ₸</p></div><p className="mt-1 text-xs font-bold uppercase tracking-widest text-slate-700">{order.order_status} · {order.payment_status} · {String(order.created_at).slice(0, 10)}</p><div className="mt-3 space-y-1 text-sm text-slate-700">{order.order_items?.map(item => <p key={item.id}>{item.product_name} · {item.size || 'OS'} · x{item.quantity}</p>)}</div></div>)}</div> : <p className="text-sm text-slate-700">Пока нет заказов. После оформления они появятся здесь.</p>}</section>
            <section className="rounded-[2rem] bg-white p-6 shadow-sm"><div className="mb-4 flex items-center justify-between gap-3"><h2 className="text-2xl font-black uppercase italic tracking-tighter">Избранное</h2><Link href="/products" className="text-xs font-black uppercase tracking-widest underline">В каталог</Link></div>{wishlist.length ? <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{wishlist.map(item => <ProductCard key={item.id} product={item.product} />)}</div> : <p className="text-sm text-slate-700">Добавляйте товары в избранное сердечком на карточке товара.</p>}</section>
          </div>
        </div>
      </div>
    </div>
  );
}
