'use client';

import Link from 'next/link';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useApp } from '@/lib/context';

const labels = {
  RU: { tag: 'Готово', title: 'Заказ принят', text: 'Мы свяжемся с вами для подтверждения.', number: 'Номер заказа', back: 'Вернуться в каталог' },
  KZ: { tag: 'Дайын', title: 'Тапсырыс қабылданды', text: 'Біз растау үшін сізбен байланысамыз.', number: 'Тапсырыс нөмірі', back: 'Каталогқа қайту' },
};

function SuccessContent() {
  const searchParams = useSearchParams();
  const { lang } = useApp();
  const l = labels[lang];
  const order = searchParams.get('order') || 'THR-DEMO';
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4 py-16">
      <div className="max-w-xl rounded-[2rem] bg-white p-8 text-center shadow-sm md:p-12">
        <p className="mb-2 text-[10px] font-black uppercase tracking-[0.22em] text-violet-800">{l.tag}</p>
        <h1 className="text-4xl font-black uppercase italic tracking-tighter">{l.title}</h1>
        <p className="mt-4 text-slate-700">{l.number}: <span className="font-black text-black">#{order}</span>. {l.text}</p>
        <Link href="/products" className="mt-8 inline-flex rounded-full bg-black px-8 py-4 text-xs font-black uppercase tracking-widest text-white transition hover:scale-105 hover:bg-violet-800">{l.back}</Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return <Suspense><SuccessContent /></Suspense>;
}
