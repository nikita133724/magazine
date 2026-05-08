'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'RU' | 'KZ';

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface AppContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  cart: CartItem[];
  addToCart: (product: any) => void;
  removeFromCart: (id: number) => void;
  t: (key: string) => string;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const translations = {
  RU: {
    hero: 'ВЫЙДИ ЗА ПРЕДЕЛЫ',
    shop: 'МАГАЗИН',
    collection: 'КОЛЛЕКЦИЯ',
    new_arrivals: 'НОВИНКИ ДО 40% СКИДКА',
    search: 'Поиск',
    catalog: 'КАТАЛОГ',
    items: 'ТОВАРЫ',
    all_items: 'ВСЕ ТОВАРЫ',
    sneakers: 'КРОССОВКИ',
    hoodies: 'ХУДИ',
    tshirts: 'ФУТБОЛКИ',
    accessories: 'АКСЕССУАРЫ',
    men: 'Мужское',
    women: 'Женское',
    checkout: 'ОФОРМИТЬ',
    cart: 'КОРЗИНА',
    empty_cart: 'В корзине пусто',
    support: 'Поддержка',
    add_to_cart: 'В корзину',
    exit: 'Выход',
    featured: 'РЕКОМЕНДУЕМ',
    view_all: 'СМОТРЕТЬ ВСЕ',
    kilo_tenge: '₸',
    new: 'НОВОЕ',
    featured_products: 'ИЗБРАННЫЕ ТОВАРЫ',
    subtotal: 'ИТОГО',
    no_styles: 'Стили не найдены',
    try_adjusting: 'Попробуйте изменить поиск или фильтры.',
    clear_filters: 'Сбросить фильтры',
    explore: 'ИССЛЕДОВАТЬ',
    top_picks: 'ЛУЧШИЙ ВЫБОР',
    products: 'ТОВАРЫ',
    shoes: 'Обувь',
    clothing: 'Одежда',
    sports: 'СПОРТ',
    running: 'Бег',
    training: 'Тренировки',
    yoga: 'Йога',
    golf: 'Гольф',
    collections: 'КОЛЛЕКЦИИ',
    help: 'Помощь',
    returns: 'Возврат',
    contact_us: 'Контакты',
    sizing: 'Размеры',
    privacy: 'Политика конфиденциальности',
    terms: 'Условия использования',
    rights: 'ВСЕ ПРАВА ЗАЩИЩЕНЫ',
    new_featured: 'Новинки и популярное',
    men_clothing: 'Мужская одежда',
    women_clothing: 'Женская одежда',
    new_arrivals_footer: 'Новинки',
  },
  KZ: {
    hero: 'ШЕКТЕН ШЫҚ',
    shop: 'ДҮКЕН',
    collection: 'ЖИНАҚ',
    new_arrivals: 'ЖАҢА ТАУАРЛАР 40% ЖЕҢІЛДІК',
    search: 'Іздеу',
    catalog: 'КАТАЛОГ',
    items: 'ТАУАРЛАР',
    all_items: 'БАРЛЫҚ ТАУАРЛАР',
    sneakers: 'КРОССОВКАЛАР',
    hoodies: 'ХУДИЛЕР',
    tshirts: 'ФУТБОЛКАЛАР',
    accessories: 'АКСЕССУАРЛАР',
    men: 'Ерлер',
    women: 'Әйелдер',
    checkout: 'ТАПСЫРЫС БЕРУ',
    cart: 'СЕБЕТ',
    empty_cart: 'Себет бос',
    support: 'Қолдау',
    add_to_cart: 'Себетке салу',
    exit: 'Шығу',
    featured: 'ҰСЫНАМЫЗ',
    view_all: 'БАРЛЫҒЫН КӨРУ',
    kilo_tenge: '₸',
    new: 'ЖАҢА',
    featured_products: 'ТАҢДАУЛЫ ТАУАРЛАР',
    subtotal: 'ЖИЫНЫ',
    no_styles: 'Стильдер табылмады',
    try_adjusting: 'Іздеуді немесе фильтрлерді өзгертіп көріңіз.',
    clear_filters: 'Фильтрлерді тазалау',
    explore: 'ЗЕРТТЕУ',
    top_picks: 'ҮЗДІК ТАҢДАУ',
    products: 'ТАУАРЛАР',
    shoes: 'Аяқ киім',
    clothing: 'Киім',
    sports: 'СПОРТ',
    running: 'Жүгіру',
    training: 'Жаттығу',
    yoga: 'Йога',
    golf: 'Гольф',
    collections: 'ЖИНАҚТАР',
    help: 'Көмек',
    returns: 'Қайтару',
    contact_us: 'Байланыс',
    sizing: 'Өлшемдер',
    privacy: 'Құпиялылық саясаты',
    terms: 'Пайдалану шарттары',
    rights: 'БАРЛЫҚ ҚҰҚЫҚТАР ҚОРҒАЛҒАН',
    new_featured: 'Жаңа және танымал',
    men_clothing: 'Ерлер киімі',
    women_clothing: 'Әйелдер киімі',
    new_arrivals_footer: 'Жаңа тауарлар',
  }
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('lang') as Language;
      if (savedLang === 'RU' || savedLang === 'KZ') return savedLang;
    }
    return 'RU';
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) return JSON.parse(savedCart);
      } catch (e) {}
    }
    return [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('cart', JSON.stringify(cart));
      localStorage.setItem('lang', lang);
    }
  }, [cart, lang, isHydrated]);

  const addToCart = (product: any) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const t = (key: string) => {
    return (translations[lang] as any)[key] || key;
  };

  return (
    <AppContext.Provider value={{ lang, setLang, cart, addToCart, removeFromCart, t, isCartOpen, setIsCartOpen }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
