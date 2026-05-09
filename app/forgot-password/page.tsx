'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { authText, localizeAuthError } from '@/lib/authMessages';
import { useApp } from '@/lib/context';
import { getSupabaseBrowser } from '@/lib/supabase/client';

const copy = {
  RU: { cabinet: 'Личный кабинет', title: 'Восстановление пароля', email: 'Email', send: 'Получить код', sending: 'Отправляем...', codeTitle: 'Введите код', codeText: 'Мы отправили код восстановления на почту. Введите код и новый пароль.', code: 'Код из письма', newPassword: 'Новый пароль от 6 символов', save: 'Обновить пароль', saving: 'Обновляем...', login: 'Вернуться ко входу' },
  KZ: { cabinet: 'Жеке кабинет', title: 'Құпиясөзді қалпына келтіру', email: 'Email', send: 'Код алу', sending: 'Жіберілуде...', codeTitle: 'Код енгізіңіз', codeText: 'Поштаңызға қалпына келтіру кодын жібердік. Кодты және жаңа құпиясөзді енгізіңіз.', code: 'Хаттағы код', newPassword: '6 таңбадан бастап жаңа құпиясөз', save: 'Құпиясөзді жаңарту', saving: 'Жаңартылуда...', login: 'Кіруге қайту' },
};

export default function ForgotPasswordPage() {
  const { lang } = useApp();
  const l = copy[lang];
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState<'email' | 'code' | 'done'>('email');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const sendCode = async (event?: FormEvent) => {
    event?.preventDefault();
    setMessage('');
    setLoading(true);
    try {
      const supabase = getSupabaseBrowser();
      if (!supabase) throw new Error(authText(lang, 'supabaseMissing'));
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), { redirectTo: `${window.location.origin}/forgot-password` });
      if (error) throw error;
      setStep('code');
      setMessage(authText(lang, 'resetSent'));
    } catch (err) {
      setMessage(err instanceof Error ? localizeAuthError(err.message, lang) : authText(lang, 'generic'));
    } finally {
      setLoading(false);
    }
  };

  const confirm = async (event: FormEvent) => {
    event.preventDefault();
    setMessage('');
    setLoading(true);
    try {
      const supabase = getSupabaseBrowser();
      if (!supabase) throw new Error(authText(lang, 'supabaseMissing'));
      const { error: otpError } = await supabase.auth.verifyOtp({ email: email.trim().toLowerCase(), token: code.trim(), type: 'recovery' });
      if (otpError) throw otpError;
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;
      setStep('done');
      setMessage(authText(lang, 'resetSaved'));
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
        <h1 className="mt-3 text-4xl font-black uppercase italic tracking-tighter">{step === 'email' ? l.title : step === 'code' ? l.codeTitle : authText(lang, 'resetSaved')}</h1>
        {step === 'email' && <form onSubmit={sendCode} className="mt-8 space-y-4"><input required type="email" placeholder={l.email} value={email} onChange={e => setEmail(e.target.value)} className="w-full rounded-2xl border border-slate-300 px-4 py-4 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100" />{message && <p className="rounded-2xl bg-violet-50 p-4 text-sm font-bold text-violet-800">{message}</p>}<button disabled={loading} className="w-full rounded-2xl bg-black py-4 text-xs font-black uppercase tracking-widest text-white transition hover:bg-violet-800 disabled:bg-slate-400">{loading ? l.sending : l.send}</button></form>}
        {step === 'code' && <form onSubmit={confirm} className="mt-8 space-y-4"><p className="rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-700">{l.codeText}</p><input required inputMode="numeric" maxLength={6} placeholder={l.code} value={code} onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))} className="w-full rounded-2xl border border-slate-300 px-4 py-4 text-center text-2xl font-black tracking-[0.4em] outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100" /><input required type="password" minLength={6} placeholder={l.newPassword} value={password} onChange={e => setPassword(e.target.value)} className="w-full rounded-2xl border border-slate-300 px-4 py-4 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100" />{message && <p className="rounded-2xl bg-violet-50 p-4 text-sm font-bold text-violet-800">{message}</p>}<button disabled={loading || code.length !== 6 || password.length < 6} className="w-full rounded-2xl bg-black py-4 text-xs font-black uppercase tracking-widest text-white transition hover:bg-violet-800 disabled:bg-slate-400">{loading ? l.saving : l.save}</button><button type="button" disabled={loading} onClick={() => sendCode()} className="w-full rounded-2xl bg-slate-100 py-4 text-xs font-black uppercase tracking-widest text-slate-800 transition hover:bg-violet-50 disabled:opacity-50">{copy[lang].send}</button></form>}
        {step === 'done' && <div className="mt-8"><p className="rounded-2xl bg-violet-50 p-4 text-sm font-bold text-violet-800">{message}</p></div>}
        <p className="mt-6 text-center text-sm text-slate-700"><Link href="/login" className="font-black text-black underline">{l.login}</Link></p>
      </div>
    </div>
  );
}
