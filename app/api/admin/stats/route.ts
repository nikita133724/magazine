import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

const empty = {
  cards: { totalRevenue: 0, ordersCount: 0, customersCount: 0, productsCount: 0, avgOrder: 0 },
  revenueByDay: [],
  lowStock: [],
  topProducts: [],
  recentOrders: [],
  missingImages: [],
};

function sum(items: any[], key: string) {
  return items.reduce((acc, item) => acc + Number(item[key] || 0), 0);
}

function lastDays(count = 7) {
  return Array.from({ length: count }).map((_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (count - 1 - index));
    return date.toISOString().slice(0, 10);
  });
}

export async function GET() {
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json(empty);

  const [ordersResult, productsResult, customersResult, itemsResult] = await Promise.all([
    supabase.from('orders').select('id, order_number, customer_name, total, payment_status, order_status, created_at').order('created_at', { ascending: false }),
    supabase.from('products').select('id, name_ru, main_image, stock, status').is('deleted_at', null).order('stock', { ascending: true }),
    supabase.from('customers').select('id, name, phone, email, created_at').order('created_at', { ascending: false }),
    supabase.from('order_items').select('product_name, quantity, price'),
  ]);

  if (ordersResult.error) return NextResponse.json({ error: ordersResult.error.message }, { status: 500 });

  const orders = ordersResult.data || [];
  const products = productsResult.data || [];
  const customers = customersResult.data || [];
  const items = itemsResult.data || [];
  const totalRevenue = sum(orders, 'total');

  const dayMap = new Map<string, { day: string; revenue: number; orders: number }>();
  for (const day of lastDays(7)) dayMap.set(day, { day, revenue: 0, orders: 0 });
  for (const order of orders) {
    const day = String(order.created_at || '').slice(0, 10);
    if (!dayMap.has(day)) continue;
    const current = dayMap.get(day)!;
    current.revenue += Number(order.total || 0);
    current.orders += 1;
  }

  const productMap = new Map<string, { product_name: string; quantity: number; revenue: number }>();
  for (const item of items) {
    const name = String(item.product_name || 'Товар');
    const current = productMap.get(name) || { product_name: name, quantity: 0, revenue: 0 };
    current.quantity += Number(item.quantity || 0);
    current.revenue += Number(item.quantity || 0) * Number(item.price || 0);
    productMap.set(name, current);
  }

  return NextResponse.json({
    cards: {
      totalRevenue,
      ordersCount: orders.length,
      customersCount: customers.length,
      productsCount: products.length,
      avgOrder: orders.length ? totalRevenue / orders.length : 0,
    },
    recentOrders: orders.slice(0, 8),
    revenueByDay: Array.from(dayMap.values()),
    lowStock: products.filter(product => Number(product.stock || 0) <= 5).slice(0, 8),
    missingImages: products.filter(product => !product.main_image).slice(0, 8),
    topProducts: Array.from(productMap.values()).sort((a, b) => b.quantity - a.quantity).slice(0, 8),
  });
}
