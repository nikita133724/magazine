'use client';

import Link from 'next/link';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useApp } from '@/lib/context';
import { orderStatusLabel, paymentStatusLabel } from '@/lib/orderLabels';

const labels = {
  RU: { tag: 'Готово', title: 'Заказ принят', text: 'Мы свяжемся с вами для подтверждения.', number: 'Номер заказа', back: 'Вернуться в каталог', loading: 'Проверяем заказ...', notFoundTitle: 'Заказ не найден', notFoundText: 'Такого заказа не существует или номер указан неверно.', home: 'На главную', total: 'Сумма', status: 'Статус', payment: 'Оплата' },
  KZ: { tag: 'Дайын', title: 'Тапсырыс қабылданды', text: 'Біз растау үшін сізбен байланысамыз.', number: 'Тапсырыс нөмірі', back: 'Каталогқа қайту', loading: 'Тапсырыс тексерілуде...', notFoundTitle: 'Тапсырыс табылмады', notFoundText: 'Мұндай тапсырыс жоқ немесе нөмір қате көрсетілген.', home: 'Басты бетке', total: 'Сома', status: 'Статус', payment: 'Төлем' },
};

type OrderSummary = { order_number: string; total: number; payment_status: string; order_status: string; created_at: string };

function SuccessContent() {
  const searchParams = useSearchParams();
  const { lang } = useApp();
  const l = labels[lang];
  const orderNumber = searchParams.get('order') || '';
  const [order, setOrder] = useState<OrderSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let mounted = true;
    if (!orderNumber) {
      setLoading(false);
      setNotFound(true);
      return;
    }
    fetch(`/api/orders/lookup?order=${encodeURIComponent(orderNumber)}`, { cache: 'no-store' })
      .then(async response => {
        if (!mounted) return;
        if (!response.ok) {
          setNotFound(true);
          return;
        }
        const data = await response.json();
        setOrder(data.order || null);
        setNotFound(!data.order);
      })
      .catch(() => mounted && setNotFound(true))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, [orderNumber]);

  if (loading) {
    return <div className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4 py-16"><div className="max-w-xl rounded-[2rem] bg-white p-8 text-center text-sm font-black uppercase tracking-widest text-slate-700 shadow-sm md:p-12">{l.loading}</div></div>;
  }

  if (notFound || !order) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4 py-16">
        <div className="max-w-xl rounded-[2rem] bg-white p-8 text-center shadow-sm md:p-12">
          <p className="mb-2 text-[10px] font-black uppercase tracking-[0.22em] text-red-700">404</p>
          <h1 className="text-4xl font-black uppercase italic tracking-tighter">{l.notFoundTitle}</h1>
          <p className="mt-4 text-slate-700">{l.notFoundText}</p>
          <Link href="/" className="mt-8 inline-flex rounded-full bg-black px-8 py-4 text-xs font-black uppercase tracking-widest text-white transition hover:scale-105 hover:bg-violet-800">{l.home}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4 py-16">
      <div className="max-w-xl rounded-[2rem] bg-white p-8 text-center shadow-sm md:p-12">
        <p className="mb-2 text-[10px] font-black uppercase tracking-[0.22em] text-violet-800">{l.tag}</p>
        <h1 className="text-4xl font-black uppercase italic tracking-tighter">{l.title}</h1>
        <p className="mt-4 text-slate-700">{l.number}: <span className="font-black text-black">#{order.order_number}</span>. {l.text}</p>
        <div className="mt-6 grid gap-3 rounded-3xl bg-slate-50 p-4 text-left text-sm font-bold text-slate-700">
          <p>{l.total}: <span className="text-black">{Number(order.total || 0).toLocaleString()} ₸</span></p>
          <p>{l.status}: <span className="text-black">{orderStatusLabel(order.order_status, lang)}</span></p>
          <p>{l.payment}: <span className="text-black">{paymentStatusLabel(order.payment_status, lang)}</span></p>
        </div>
        <Link href="/products" className="mt-8 inline-flex rounded-full bg-black px-8 py-4 text-xs font-black uppercase tracking-widest text-white transition hover:scale-105 hover:bg-violet-800">{l.back}</Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return <Suspense><SuccessContent /></Suspense>;
}
