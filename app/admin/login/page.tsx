'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [login, setLogin] = useState('admin');
  const [pass, setPass] = useState('admin123');
  const [error, setError] = useState('');

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (login !== 'admin' || pass !== 'admin123') {
      setError('Неверный логин или пароль');
      return;
    }
    localStorage.setItem('admin_session', 'ok');
    router.push('/admin');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <form onSubmit={submit} className="w-full max-w-md rounded-[2rem] border border-violet-100 bg-white p-8 shadow-2xl shadow-violet-100">
        <p className="mb-2 text-[10px] font-black uppercase tracking-[0.4em] text-violet-500">Admin access</p>
        <h1 className="mb-8 text-4xl font-black uppercase italic tracking-tighter">Вход</h1>
        <label className="mb-4 block"><span className="mb-2 block text-xs font-black uppercase tracking-widest text-slate-400">Логин</span><input value={login} onChange={e => setLogin(e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-4 outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-100" /></label>
        <label className="mb-6 block"><span className="mb-2 block text-xs font-black uppercase tracking-widest text-slate-400">Пароль</span><input type="password" value={pass} onChange={e => setPass(e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-4 outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-100" /></label>
        {error && <p className="mb-4 rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-600">{error}</p>}
        <button className="w-full rounded-2xl bg-black py-4 text-xs font-black uppercase tracking-widest text-white transition hover:scale-[1.02] hover:bg-violet-700">Войти</button>
      </form>
    </div>
  );
}
