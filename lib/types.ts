export type ProductStatus = 'active' | 'draft' | 'archived';
export type OrderStatus = 'new' | 'processing' | 'shipped' | 'delivered' | 'canceled';
export type PaymentStatus = 'pending' | 'paid' | 'error' | 'refunded';

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
}

export interface ProductImage {
  id: number;
  product_id: number;
  image_url: string;
  alt?: string | null;
  sort_order: number;
}

export interface ProductSize {
  id: number;
  product_id: number;
  size: string;
  stock: number;
}

export interface Product {
  id: number;
  slug: string;
  name: string;
  price: number;
  compare_at_price?: number | null;
  category_id: number;
  category_name: string;
  category_slug: string;
  sub_category?: string | null;
  rating: number;
  description?: string | null;
  main_image?: string | null;
  image_url?: string | null;
  stock: number;
  status: ProductStatus;
  is_featured: boolean;
  is_bestseller: boolean;
  is_new: boolean;
  discount_percent: number;
  created_at?: string | null;
  updated_at?: string | null;
  images: ProductImage[];
  sizes: ProductSize[];
}

export interface CartItem {
  cartKey: string;
  id: number;
  slug?: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
}

export interface CheckoutPayload {
  customerName: string;
  phone: string;
  email?: string;
  city: string;
  address: string;
  comment?: string;
  deliveryMethod: string;
  paymentMethod: string;
  items: CartItem[];
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number | null;
  product_name: string;
  size?: string | null;
  quantity: number;
  price: number;
  image?: string | null;
}

export interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  phone: string;
  email?: string | null;
  city: string;
  address: string;
  comment?: string | null;
  total: number;
  payment_method: string;
  payment_status: PaymentStatus;
  order_status: OrderStatus;
  created_at: string;
  items?: OrderItem[];
}
