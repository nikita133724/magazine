'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { getSupabaseBrowser } from '@/lib/supabase/client';

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage('');
    setLoading(true);
    try {
      const supabase = getSupabaseBrowser();
      if (!supabase) throw new Error('Supabase не настроен');
      const { error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName, phone } } });
      if (error) throw error;
      setMessage('Аккаунт создан. Если Supabase попросит подтверждение email, подтвердите почту, затем войдите.');
      setTimeout(() => router.push('/login'), 1200);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Не удалось создать аккаунт');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="mx-auto max-w-md rounded-[2rem] bg-white p-6 shadow-sm md:p-8">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-violet-800">Личный кабинет</p>
        <h1 className="mt-3 text-4xl font-black uppercase italic tracking-tighter">Регистрация</h1>
        <form onSubmit={submit} className="mt-8 space-y-4">
          <input required placeholder="Имя" value={fullName} onChange={e => setFullName(e.target.value)} className="w-full rounded-2xl border border-slate-300 px-4 py-4 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100" />
          <input required type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full rounded-2xl border border-slate-300 px-4 py-4 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100" />
          <input placeholder="Телефон" value={phone} onChange={e => setPhone(e.target.value)} className="w-full rounded-2xl border border-slate-300 px-4 py-4 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100" />
          <input required type="password" minLength={6} placeholder="Пароль от 6 символов" value={password} onChange={e => setPassword(e.target.value)} className="w-full rounded-2xl border border-slate-300 px-4 py-4 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100" />
          {message && <p className="rounded-2xl bg-violet-50 p-4 text-sm font-bold text-violet-800">{message}</p>}
          <button disabled={loading} className="w-full rounded-2xl bg-black py-4 text-xs font-black uppercase tracking-widest text-white transition hover:bg-violet-800 disabled:bg-slate-400">{loading ? 'Создаём...' : 'Создать аккаунт'}</button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-700">Уже есть аккаунт? <Link href="/login" className="font-black text-black underline">Войти</Link></p>
      </div>
    </div>
  );
}
