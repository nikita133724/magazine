export type Lang = 'RU' | 'KZ';

export const orderStatusLabels: Record<Lang, Record<string, string>> = {
  RU: {
    new: 'Новый заказ',
    processing: 'В обработке',
    shipped: 'Отправлен',
    delivered: 'Доставлен',
    canceled: 'Отменён',
  },
  KZ: {
    new: 'Жаңа тапсырыс',
    processing: 'Өңделуде',
    shipped: 'Жіберілді',
    delivered: 'Жеткізілді',
    canceled: 'Бас тартылды',
  },
};

export const paymentStatusLabels: Record<Lang, Record<string, string>> = {
  RU: {
    pending: 'Ожидает оплаты',
    paid: 'Оплачен',
    failed: 'Ошибка оплаты',
    refunded: 'Возврат',
  },
  KZ: {
    pending: 'Төлем күтілуде',
    paid: 'Төленді',
    failed: 'Төлем қатесі',
    refunded: 'Қайтарылды',
  },
};

export function orderStatusLabel(status: string | undefined, lang: Lang = 'RU') {
  return orderStatusLabels[lang][status || ''] || status || '-';
}

export function paymentStatusLabel(status: string | undefined, lang: Lang = 'RU') {
  return paymentStatusLabels[lang][status || ''] || status || '-';
}
