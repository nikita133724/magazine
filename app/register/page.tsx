'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { authText, localizeAuthError } from '@/lib/authMessages';
import { useApp } from '@/lib/context';
import { getSupabaseBrowser } from '@/lib/supabase/client';

const CODE_LENGTH = 6;

const copy = {
  RU: {
    cabinet: 'Личный кабинет', title: 'Регистрация', name: 'Имя', email: 'Email', phone: 'Телефон', password: 'Пароль от 6 символов', create: 'Получить код', creating: 'Отправляем код...', codeTitle: 'Подтверждение почты', codeText: 'Введите 6-значный код из письма. После подтверждения аккаунт будет создан.', code: '000000', confirm: 'Подтвердить', confirming: 'Проверяем...', resend: 'Отправить код ещё раз', hasAccount: 'Уже есть аккаунт?', login: 'Войти',
  },
  KZ: {
    cabinet: 'Жеке кабинет', title: 'Тіркелу', name: 'Аты', email: 'Email', phone: 'Телефон', password: '6 таңбадан бастап құпиясөз', create: 'Код алу', creating: 'Код жіберілуде...', codeTitle: 'Поштаны растау', codeText: 'Хаттағы 6 таңбалы кодты енгізіңіз. Расталғаннан кейін аккаунт жасалады.', code: '000000', confirm: 'Растау', confirming: 'Тексерілуде...', resend: 'Кодты қайта жіберу', hasAccount: 'Аккаунтыңыз бар ма?', login: 'Кіру',
  },
};

export default function RegisterPage() {
  const router = useRouter();
  const { lang } = useApp();
  const l = copy[lang];
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'form' | 'code'>('form');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const startRegistration = async (event?: FormEvent) => {
    event?.preventDefault();
    setMessage('');
    setLoading(true);
    try {
      const supabase = getSupabaseBrowser();
      if (!supabase) throw new Error(authText(lang, 'supabaseMissing'));

      const existsRes = await fetch('/api/auth/email-exists', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
      const existsData = await existsRes.json();
      if (existsData.exists) throw new Error(authText(lang, 'emailTaken'));

      const { error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: { data: { full_name: fullName, phone }, emailRedirectTo: `${window.location.origin}/account` },
      });
      if (error) throw error;
      setStep('code');
      setMessage(authText(lang, 'otpSent'));
    } catch (err) {
      setMessage(err instanceof Error ? localizeAuthError(err.message, lang) : authText(lang, 'generic'));
    } finally {
      setLoading(false);
    }
  };

  const confirmCode = async (event: FormEvent) => {
    event.preventDefault();
    setMessage('');
    setLoading(true);
    try {
      const supabase = getSupabaseBrowser();
      if (!supabase) throw new Error(authText(lang, 'supabaseMissing'));
      const { data, error } = await supabase.auth.verifyOtp({ email: email.trim().toLowerCase(), token: code.trim(), type: 'signup' });
      if (error) throw error;
      const token = data.session?.access_token;
      if (token) {
        await fetch('/api/account/profile', { method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ full_name: fullName, phone }) });
      }
      setMessage(authText(lang, 'accountCreated'));
      setTimeout(() => router.push('/account'), 700);
    } catch (err) {
      setMessage(err instanceof Error ? localizeAuthError(err.message, lang) : authText(lang, 'otpInvalid'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="mx-auto max-w-md rounded-[2rem] bg-white p-6 shadow-sm md:p-8">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-violet-800">{l.cabinet}</p>
        <h1 className="mt-3 text-4xl font-black uppercase italic tracking-tighter">{step === 'form' ? l.title : l.codeTitle}</h1>
        {step === 'form' ? (
          <form onSubmit={startRegistration} className="mt-8 space-y-4">
            <input required placeholder={l.name} value={fullName} onChange={e => setFullName(e.target.value)} className="w-full rounded-2xl border border-slate-300 px-4 py-4 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100" />
            <input required type="email" placeholder={l.email} value={email} onChange={e => setEmail(e.target.value)} className="w-full rounded-2xl border border-slate-300 px-4 py-4 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100" />
            <input required placeholder={l.phone} value={phone} onChange={e => setPhone(e.target.value)} className="w-full rounded-2xl border border-slate-300 px-4 py-4 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100" />
            <input required type="password" minLength={6} placeholder={l.password} value={password} onChange={e => setPassword(e.target.value)} className="w-full rounded-2xl border border-slate-300 px-4 py-4 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100" />
            {message && <p className="rounded-2xl bg-violet-50 p-4 text-sm font-bold text-violet-800">{message}</p>}
            <button disabled={loading} className="w-full rounded-2xl bg-black py-4 text-xs font-black uppercase tracking-widest text-white transition hover:bg-violet-800 disabled:bg-slate-400">{loading ? l.creating : l.create}</button>
          </form>
        ) : (
          <form onSubmit={confirmCode} className="mt-8 space-y-4">
            <p className="rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-700">{l.codeText}</p>
            <label className="block">
              <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Код подтверждения</span>
              <input required inputMode="numeric" autoComplete="one-time-code" maxLength={CODE_LENGTH} placeholder={l.code} value={code} onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, CODE_LENGTH))} className="w-full rounded-3xl border border-violet-200 bg-violet-50/60 px-5 py-5 text-center text-3xl font-black tracking-[0.35em] text-black outline-none transition placeholder:text-slate-300 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100" />
            </label>
            {message && <p className="rounded-2xl bg-violet-50 p-4 text-sm font-bold text-violet-800">{message}</p>}
            <button disabled={loading || code.length !== CODE_LENGTH} className="w-full rounded-2xl bg-black py-4 text-xs font-black uppercase tracking-widest text-white transition hover:bg-violet-800 disabled:bg-slate-400">{loading ? l.confirming : l.confirm}</button>
            <button type="button" disabled={loading} onClick={() => startRegistration()} className="w-full rounded-2xl bg-slate-100 py-4 text-xs font-black uppercase tracking-widest text-slate-800 transition hover:bg-violet-50 disabled:opacity-50">{l.resend}</button>
          </form>
        )}
        <p className="mt-6 text-center text-sm text-slate-700">{l.hasAccount} <Link href="/login" className="font-black text-black underline">{l.login}</Link></p>
      </div>
    </div>
  );
}
