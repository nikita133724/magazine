import Link from 'next/link';

export default function CartPage() {
  return (
    <main style={{ padding: 32 }}>
      <h1>Cart</h1>
      <p>Use the cart button in the header to open the full cart drawer.</p>
      <p><Link href="/products">Go to catalog</Link></p>
      <p><Link href="/checkout">Go to checkout</Link></p>
    </main>
  );
}
