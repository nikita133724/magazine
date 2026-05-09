'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { authText, localizeAuthError } from '@/lib/authMessages';
import { useApp } from '@/lib/context';
import { getSupabaseBrowser } from '@/lib/supabase/client';

const copy = {
  RU: { cabinet: 'Личный кабинет', title: 'Вход', email: 'Email', password: 'Пароль', loading: 'Входим...', submit: 'Войти', noAccount: 'Нет аккаунта?', register: 'Зарегистрироваться', forgot: 'Забыли пароль?' },
  KZ: { cabinet: 'Жеке кабинет', title: 'Кіру', email: 'Email', password: 'Құпиясөз', loading: 'Кіру...', submit: 'Кіру', noAccount: 'Аккаунтыңыз жоқ па?', register: 'Тіркелу', forgot: 'Құпиясөзді ұмыттыңыз ба?' },
};

export default function LoginPage() {
  const router = useRouter();
  const { lang } = useApp();
  const l = copy[lang];
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const supabase = getSupabaseBrowser();
      if (!supabase) throw new Error(authText(lang, 'supabaseMissing'));
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password });
      if (error) throw error;
      router.push('/account');
    } catch (err) {
      setError(err instanceof Error ? localizeAuthError(err.message, lang) : authText(lang, 'invalidLogin'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="mx-auto max-w-md rounded-[2rem] bg-white p-6 shadow-sm md:p-8">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-violet-800">{l.cabinet}</p>
        <h1 className="mt-3 text-4xl font-black uppercase italic tracking-tighter">{l.title}</h1>
        <form onSubmit={submit} className="mt-8 space-y-4">
          <input required type="email" placeholder={l.email} value={email} onChange={e => setEmail(e.target.value)} className="w-full rounded-2xl border border-slate-300 px-4 py-4 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100" />
          <input required type="password" placeholder={l.password} value={password} onChange={e => setPassword(e.target.value)} className="w-full rounded-2xl border border-slate-300 px-4 py-4 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100" />
          {error && <p className="rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-700">{error}</p>}
          <button disabled={loading} className="w-full rounded-2xl bg-black py-4 text-xs font-black uppercase tracking-widest text-white transition hover:bg-violet-800 disabled:bg-slate-400">{loading ? l.loading : l.submit}</button>
        </form>
        <div className="mt-6 space-y-3 text-center text-sm text-slate-700">
          <p>{l.noAccount} <Link href="/register" className="font-black text-black underline underline-offset-4">{l.register}</Link></p>
          <p><Link href="/forgot-password" className="text-xs font-black uppercase tracking-widest text-slate-700 underline underline-offset-4">{l.forgot}</Link></p>
        </div>
      </div>
    </div>
  );
}
