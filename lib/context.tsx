'use client';

import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import type { CartItem } from '@/lib/types';

type Language = 'RU' | 'KZ';

type CartProduct = { id: number; slug?: string; name: string; price: number; image: string; size?: string };

interface AppContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  cart: CartItem[];
  cartCount: number;
  cartTotal: number;
  addToCart: (product: CartProduct, quantity?: number) => void;
  removeFromCart: (cartKey: string) => void;
  updateCartQuantity: (cartKey: string, quantity: number) => void;
  clearCart: () => void;
  t: (key: string) => string;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const translations: Record<Language, Record<string, string>> = {
  RU: {
    hero: 'СОБЕРИ СВОЙ АРХИВ', shop: 'В каталог', new_arrivals: 'Бесплатная доставка от 50 000 ₸', search: 'Поиск', catalog: 'Каталог', items: 'товаров', all_items: 'Все товары', sneakers: 'Кроссовки', hoodies: 'Худи', tshirts: 'Футболки', accessories: 'Аксессуары', men: 'Мужское', women: 'Женское', checkout: 'Оформить заказ', cart: 'Корзина', empty_cart: 'В корзине пусто', support: 'Поддержка', add_to_cart: 'В корзину', buy_now: 'Купить сейчас', exit: 'Назад', featured: 'Рекомендуем', view_all: 'Смотреть все', new: 'Новинки', featured_products: 'Товары недели', subtotal: 'Итого', no_styles: 'Ничего не найдено', try_adjusting: 'Попробуйте изменить поиск или фильтры.', clear_filters: 'Сбросить фильтры', explore: 'Открыть', top_picks: 'Лучший выбор', products: 'Товары', shoes: 'Обувь', clothing: 'Одежда', privacy: 'Политика конфиденциальности', terms: 'Условия использования', rights: 'Все права защищены', new_featured: 'Новинки и хиты', loading: 'Загрузка', bestsellers: 'Хиты продаж', home: 'Главная', menu: 'Меню', delivery: 'Доставка', admin: 'Админка', size: 'Размер', quantity: 'Количество', select_size: 'Выберите размер', in_stock: 'В наличии', out_of_stock: 'Нет в наличии', similar_products: 'Похожие товары'
  },
  KZ: {
    hero: 'ӨЗ АРХИВІҢДІ ЖИНА', shop: 'Каталогқа', new_arrivals: '50 000 ₸ бастап тегін жеткізу', search: 'Іздеу', catalog: 'Каталог', items: 'тауар', all_items: 'Барлық тауарлар', sneakers: 'Кроссовкалар', hoodies: 'Худилер', tshirts: 'Футболкалар', accessories: 'Аксессуарлар', men: 'Ерлер', women: 'Әйелдер', checkout: 'Тапсырыс беру', cart: 'Себет', empty_cart: 'Себет бос', support: 'Қолдау', add_to_cart: 'Себетке', buy_now: 'Қазір сатып алу', exit: 'Артқа', featured: 'Ұсынамыз', view_all: 'Барлығын көру', new: 'Жаңа', featured_products: 'Апта тауарлары', subtotal: 'Жиыны', no_styles: 'Ештеңе табылмады', try_adjusting: 'Іздеуді немесе фильтрлерді өзгертіп көріңіз.', clear_filters: 'Фильтрлерді тазалау', explore: 'Ашу', top_picks: 'Үздік таңдау', products: 'Тауарлар', shoes: 'Аяқ киім', clothing: 'Киім', privacy: 'Құпиялылық саясаты', terms: 'Пайдалану шарттары', rights: 'Барлық құқықтар қорғалған', new_featured: 'Жаңа және хиттер', loading: 'Жүктелуде', bestsellers: 'Хиттер', home: 'Басты', menu: 'Мәзір', delivery: 'Жеткізу', admin: 'Админка', size: 'Өлшем', quantity: 'Саны', select_size: 'Өлшем таңдаңыз', in_stock: 'Қоймада бар', out_of_stock: 'Қоймада жоқ', similar_products: 'Ұқсас тауарлар'
  },
};

const AppContext = createContext<AppContextType | undefined>(undefined);
const isLanguage = (value: unknown): value is Language => value === 'RU' || value === 'KZ';

function isCartItem(value: unknown): value is CartItem {
  if (!value || typeof value !== 'object') return false;
  const item = value as Partial<CartItem>;
  return typeof item.cartKey === 'string' && typeof item.id === 'number' && typeof item.name === 'string' && typeof item.price === 'number' && typeof item.image === 'string' && typeof item.quantity === 'number' && item.quantity > 0;
}

const cartKeyFor = (product: CartProduct) => `${product.id}:${product.size || 'OS'}`;

function readSavedCart() {
  try {
    const savedCart = localStorage.getItem('cart');
    const parsed = savedCart ? JSON.parse(savedCart) : [];
    return Array.isArray(parsed) ? parsed.filter(isCartItem) : [];
  } catch { return []; }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>('RU');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => { const savedLang = localStorage.getItem('lang'); if (isLanguage(savedLang)) setLangState(savedLang); setCart(readSavedCart()); setIsHydrated(true); }, []);
  useEffect(() => { if (!isHydrated) return; localStorage.setItem('cart', JSON.stringify(cart)); localStorage.setItem('lang', lang); }, [cart, lang, isHydrated]);

  const cartCount = useMemo(() => cart.reduce((acc, item) => acc + item.quantity, 0), [cart]);
  const cartTotal = useMemo(() => cart.reduce((acc, item) => acc + item.price * item.quantity, 0), [cart]);
  const addToCart = (product: CartProduct, quantity = 1) => { const cartKey = cartKeyFor(product); setCart(prev => { const existing = prev.find(item => item.cartKey === cartKey); if (existing) return prev.map(item => item.cartKey === cartKey ? { ...item, quantity: item.quantity + quantity } : item); return [...prev, { ...product, cartKey, quantity }]; }); setIsCartOpen(true); };
  const removeFromCart = (cartKey: string) => setCart(prev => prev.filter(item => item.cartKey !== cartKey));
  const updateCartQuantity = (cartKey: string, quantity: number) => quantity <= 0 ? removeFromCart(cartKey) : setCart(prev => prev.map(item => item.cartKey === cartKey ? { ...item, quantity } : item));
  const clearCart = () => setCart([]);
  const t = (key: string) => translations[lang][key] ?? key;
  const value: AppContextType = { lang, setLang: setLangState, cart, cartCount, cartTotal, addToCart, removeFromCart, updateCartQuantity, clearCart, t, isCartOpen, setIsCartOpen };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) throw new Error('useApp must be used within AppProvider');
  return context;
}
