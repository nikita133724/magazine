'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import ProductCard from '@/components/site/ProductCard';
import { useApp } from '@/lib/context';
import { orderStatusLabel, paymentStatusLabel } from '@/lib/orderLabels';
import { getSupabaseBrowser } from '@/lib/supabase/client';

type Profile = { full_name?: string; phone?: string; city?: string; email?: string };
type Address = { id: number; title: string; city: string; address: string; is_default: boolean };
type Order = { id: number; order_number: string; total: number; payment_status: string; order_status: string; created_at: string; order_items?: Array<{ id: number; product_name: string; size?: string; quantity: number; price: number }> };
type Wish = { id: number; product_id: number; product: any };

const copy = {
  RU: { account: 'Личный кабинет', profile: 'Мой профиль', logout: 'Выйти', saved: 'Профиль сохранён', addressSaved: 'Адрес добавлен', addressError: 'Ошибка адреса', loading: 'Загрузка кабинета...', buyerData: 'Данные покупателя', name: 'Имя', phone: 'Телефон', city: 'Город', save: 'Сохранить', addresses: 'Адреса', addressTitle: 'Название', address: 'Адрес', addAddress: 'Добавить адрес', primary: 'основной', history: 'История заказов', noOrders: 'Пока нет заказов. После оформления они появятся здесь.', updated: 'Обновляется автоматически', wishlist: 'Избранное', catalog: 'В каталог', noWishlist: 'Добавляйте товары в избранное сердечком на карточке товара.' },
  KZ: { account: 'Жеке кабинет', profile: 'Менің профилім', logout: 'Шығу', saved: 'Профиль сақталды', addressSaved: 'Мекенжай қосылды', addressError: 'Мекенжай қатесі', loading: 'Кабинет жүктелуде...', buyerData: 'Сатып алушы деректері', name: 'Аты', phone: 'Телефон', city: 'Қала', save: 'Сақтау', addresses: 'Мекенжайлар', addressTitle: 'Атауы', address: 'Мекенжай', addAddress: 'Мекенжай қосу', primary: 'негізгі', history: 'Тапсырыстар тарихы', noOrders: 'Әзірге тапсырыстар жоқ. Рәсімдегеннен кейін осында шығады.', updated: 'Автоматты жаңартылады', wishlist: 'Таңдаулылар', catalog: 'Каталогқа', noWishlist: 'Тауар карточкасындағы жүрекше арқылы таңдаулыларға қосыңыз.' },
};

async function authHeaders(): Promise<Record<string, string>> {
  const supabase = getSupabaseBrowser();
  const session = await supabase?.auth.getSession();
  const token = session?.data.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function AccountPage() {
  const router = useRouter();
  const { lang } = useApp();
  const l = copy[lang];
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState('');
  const [profile, setProfile] = useState<Profile>({});
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlist, setWishlist] = useState<Wish[]>([]);
  const [addressForm, setAddressForm] = useState({ title: 'Основной адрес', city: 'Алматы', address: '', is_default: true });
  const [message, setMessage] = useState('');

  const loadOrders = async () => {
    const headers = await authHeaders();
    const orderRes = await fetch('/api/account/orders', { headers, cache: 'no-store' });
    if (orderRes.ok) setOrders(await orderRes.json());
  };

  const load = async () => {
    const supabase = getSupabaseBrowser();
    const session = await supabase?.auth.getSession();
    const user = session?.data.session?.user;
    if (!user) { router.push('/login'); return; }
    setEmail(user.email || '');
    const headers = await authHeaders();
    const [profileRes, addressRes, wishRes] = await Promise.all([
      fetch('/api/account/profile', { headers, cache: 'no-store' }),
      fetch('/api/account/addresses', { headers, cache: 'no-store' }),
      fetch('/api/account/wishlist', { headers, cache: 'no-store' }),
    ]);
    const profileData = await profileRes.json();
    setProfile(profileData.profile || { email: user.email });
    setAddresses(addressRes.ok ? await addressRes.json() : []);
    setWishlist(wishRes.ok ? await wishRes.json() : []);
    await loadOrders();
    setReady(true);
  };

  useEffect(() => { load().catch(console.error); }, []);
  useEffect(() => { if (!ready) return; const id = window.setInterval(() => loadOrders().catch(console.error), 10000); return () => window.clearInterval(id); }, [ready]);

  const saveProfile = async (event: FormEvent) => {
    event.preventDefault();
    const res = await fetch('/api/account/profile', { method: 'PATCH', headers: { 'Content-Type': 'application/json', ...(await authHeaders()) }, body: JSON.stringify(profile) });
    const data = await res.json();
    setMessage(res.ok ? l.saved : data.error || 'Ошибка');
  };

  const addAddress = async (event: FormEvent) => {
    event.preventDefault();
    const res = await fetch('/api/account/addresses', { method: 'POST', headers: { 'Content-Type': 'application/json', ...(await authHeaders()) }, body: JSON.stringify(addressForm) });
    const data = await res.json();
    if (!res.ok) setMessage(data.error || l.addressError);
    else { setMessage(l.addressSaved); setAddressForm({ title: 'Основной адрес', city: 'Алматы', address: '', is_default: true }); load(); }
  };

  const logout = async () => {
    await getSupabaseBrowser()?.auth.signOut();
    router.push('/');
  };

  if (!ready) return <div className="min-h-screen bg-slate-50 px-4 py-12"><div className="mx-auto max-w-screen-xl rounded-[2rem] bg-white p-8 shadow-sm">{l.loading}</div></div>;

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 md:px-8 md:py-10">
      <div className="mx-auto max-w-screen-2xl">
        <div className="mb-5 flex flex-col gap-3 rounded-[1.5rem] bg-black p-4 text-white md:flex-row md:items-end md:justify-between md:p-5"><div><p className="text-[9px] font-black uppercase tracking-[0.2em] text-violet-200">{l.account}</p><h1 className="mt-2 text-3xl font-black uppercase italic tracking-tighter md:text-4xl">{l.profile}</h1><p className="mt-1 text-xs text-slate-300">{email}</p></div><button onClick={logout} className="w-fit rounded-full bg-white px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-black">{l.logout}</button></div>
        {message && <p className="mb-6 rounded-2xl bg-violet-50 p-4 text-sm font-bold text-violet-800">{message}</p>}
        <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
          <div className="space-y-6">
            <form onSubmit={saveProfile} className="rounded-[2rem] bg-white p-6 shadow-sm"><h2 className="mb-4 text-2xl font-black uppercase italic tracking-tighter">{l.buyerData}</h2><div className="space-y-3"><input placeholder={l.name} value={profile.full_name || ''} onChange={e => setProfile(p => ({ ...p, full_name: e.target.value }))} className="w-full rounded-2xl border border-slate-300 px-4 py-3" /><input placeholder={l.phone} value={profile.phone || ''} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} className="w-full rounded-2xl border border-slate-300 px-4 py-3" /><input placeholder={l.city} value={profile.city || ''} onChange={e => setProfile(p => ({ ...p, city: e.target.value }))} className="w-full rounded-2xl border border-slate-300 px-4 py-3" /></div><button className="mt-4 rounded-2xl bg-black px-5 py-3 text-xs font-black uppercase tracking-widest text-white">{l.save}</button></form>
            <form onSubmit={addAddress} className="rounded-[2rem] bg-white p-6 shadow-sm"><h2 className="mb-4 text-2xl font-black uppercase italic tracking-tighter">{l.addresses}</h2><div className="space-y-3"><input placeholder={l.addressTitle} value={addressForm.title} onChange={e => setAddressForm(p => ({ ...p, title: e.target.value }))} className="w-full rounded-2xl border border-slate-300 px-4 py-3" /><input placeholder={l.city} value={addressForm.city} onChange={e => setAddressForm(p => ({ ...p, city: e.target.value }))} className="w-full rounded-2xl border border-slate-300 px-4 py-3" /><input required placeholder={l.address} value={addressForm.address} onChange={e => setAddressForm(p => ({ ...p, address: e.target.value }))} className="w-full rounded-2xl border border-slate-300 px-4 py-3" /></div><button className="mt-4 rounded-2xl bg-black px-5 py-3 text-xs font-black uppercase tracking-widest text-white">{l.addAddress}</button><div className="mt-4 space-y-2">{addresses.map(a => <div key={a.id} className="rounded-2xl bg-slate-50 p-3 text-sm"><p className="font-black">{a.title}{a.is_default ? ` · ${l.primary}` : ''}</p><p className="text-slate-700">{a.city}, {a.address}</p></div>)}</div></form>
          </div>
          <div className="space-y-6">
            <section className="rounded-[2rem] bg-white p-6 shadow-sm"><div className="mb-4 flex flex-wrap items-center justify-between gap-2"><h2 className="text-2xl font-black uppercase italic tracking-tighter">{l.history}</h2><span className="rounded-full bg-violet-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-violet-800">{l.updated}</span></div>{orders.length ? <div className="space-y-3">{orders.map(order => <div key={order.id} className="rounded-2xl border border-slate-200 p-4"><div className="flex flex-wrap items-center justify-between gap-3"><p className="font-black">#{order.order_number}</p><p className="text-xl font-black">{Number(order.total).toLocaleString()} ₸</p></div><div className="mt-2 flex flex-wrap gap-2 text-[11px] font-black uppercase tracking-widest"><span className="rounded-full bg-slate-100 px-3 py-1 text-slate-800">{orderStatusLabel(order.order_status, lang)}</span><span className="rounded-full bg-violet-50 px-3 py-1 text-violet-800">{paymentStatusLabel(order.payment_status, lang)}</span><span className="rounded-full bg-slate-100 px-3 py-1 text-slate-800">{String(order.created_at).slice(0, 10)}</span></div><div className="mt-3 space-y-1 text-sm text-slate-700">{order.order_items?.map(item => <p key={item.id}>{item.product_name} · {item.size || 'OS'} · x{item.quantity}</p>)}</div></div>)}</div> : <p className="text-sm text-slate-700">{l.noOrders}</p>}</section>
            <section className="rounded-[2rem] bg-white p-6 shadow-sm"><div className="mb-4 flex items-center justify-between gap-3"><h2 className="text-2xl font-black uppercase italic tracking-tighter">{l.wishlist}</h2><Link href="/products" className="text-xs font-black uppercase tracking-widest underline">{l.catalog}</Link></div>{wishlist.length ? <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{wishlist.map(item => <ProductCard key={item.id} product={item.product} />)}</div> : <p className="text-sm text-slate-700">{l.noWishlist}</p>}</section>
          </div>
        </div>
      </div>
    </div>
  );
}
