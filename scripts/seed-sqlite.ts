import db from '../lib/db';

const categories = [
  { name: 'Apparel', slug: 'apparel', description: 'Clothing, hoodies, tees and long sleeves' },
  { name: 'Footwear', slug: 'footwear', description: 'Sneakers and archive shoes' },
  { name: 'Accessories', slug: 'accessories', description: 'Bags, jewelry and utility items' },
];

const sizes = ['S', 'M', 'L', 'XL'];
const oneSize = ['OS'];
const shoeSizes = ['39', '40', '41', '42', '43', '44'];

const products = [
  ['rick-owens-jumbo-lace', 'Rick Owens Jumbo Lace', 450000, 'Footwear', 'Darkwear', 'https://images.unsplash.com/photo-1628149422079-0efc0683a311?auto=format&fit=crop&q=80&w=1200', shoeSizes, 1, 1, 0],
  ['balenciaga-defender', 'Balenciaga Defender', 580000, 'Footwear', 'Avant-garde', 'https://images.unsplash.com/photo-1615291244093-68f7000d11c1?auto=format&fit=crop&q=80&w=1200', shoeSizes, 1, 1, 0],
  ['old-order-skater-v2', 'Old Order Skater v2', 85000, 'Footwear', 'Y2K', 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=1200', shoeSizes, 1, 0, 1],
  ['vans-knu-skool-black', 'Vans Knu Skool Black', 52000, 'Footwear', 'Skate', 'https://images.unsplash.com/photo-1525966222134-fcfa99bafb73?auto=format&fit=crop&q=80&w=1200', shoeSizes, 0, 1, 1],
  ['rick-owens-ramones-high', 'Rick Owens Ramones High', 390000, 'Footwear', 'Cult', 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=1200', shoeSizes, 1, 1, 0],
  ['mihara-yasuhiro-blake', 'Mihara Yasuhiro Blake', 185000, 'Footwear', 'Deconstructed', 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&q=80&w=1200', shoeSizes, 1, 0, 1],
  ['vans-tote-white', 'Vans Off The Wall Tote White', 24000, 'Accessories', 'Bags', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=1200', oneSize, 1, 1, 1],
  ['vans-tote-black', 'Vans Off The Wall Tote Black', 24000, 'Accessories', 'Bags', 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&q=80&w=1200', oneSize, 1, 1, 1],
  ['cyber-sigil-zip-up', 'Cyber Sigil Zip-Up', 45000, 'Apparel', 'Hoodies', 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=1200', sizes, 1, 0, 1],
  ['opium-boxy-tee', 'Opium Boxy Tee', 22000, 'Apparel', 'Minimal', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=1200', sizes, 1, 0, 1],
  ['melancholy-longsleeve', 'Melancholy Black Longsleeve', 32000, 'Apparel', 'Longsleeves', 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=1200', sizes, 1, 1, 1],
  ['black-eye-graphic-tee', 'Black Eye Graphic Tee', 28000, 'Apparel', 'Graphic Tee', 'https://images.unsplash.com/photo-1576566582419-43c329864205?auto=format&fit=crop&q=80&w=1200', sizes, 1, 1, 1],
  ['cyrillic-graphic-tee', 'Color Cyrillic Graphic Tee', 30000, 'Apparel', 'Graphic Tee', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=1200', sizes, 1, 0, 1],
  ['distressed-baggy-denim', 'Distressed Baggy Denim', 48000, 'Apparel', 'Denim', 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=1200', sizes, 0, 0, 1],
  ['rick-owens-gimp-hoodie', 'Rick Owens Gimp Hoodie', 320000, 'Apparel', 'Luxury', 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=1200', sizes, 1, 1, 0],
  ['waxed-cargo-pants', 'Waxed Cargo Pants', 110000, 'Apparel', 'Pants', 'https://images.unsplash.com/photo-1552664688-cf412ec27db2?auto=format&fit=crop&q=80&w=1200', sizes, 1, 0, 0],
  ['silver-chain-bracelet', 'Silver Chain Bracelet', 39000, 'Accessories', 'Jewelry', 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=1200', oneSize, 0, 0, 1],
  ['black-nylon-crossbody', 'Black Nylon Crossbody', 59000, 'Accessories', 'Bags', 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&q=80&w=1200', oneSize, 1, 0, 0],
  ['logo-beanie', 'Logo Beanie', 18000, 'Accessories', 'Headwear', 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&q=80&w=1200', oneSize, 0, 0, 1],
  ['tech-utility-belt', 'Tech Utility Belt', 42000, 'Accessories', 'Utility', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=1200', oneSize, 1, 0, 0],
] as const;

const seed = db.transaction(() => {
  for (const table of ['order_items', 'orders', 'customers', 'product_images', 'product_sizes', 'products', 'categories']) db.prepare(`DELETE FROM ${table}`).run();
  for (const table of ['order_items', 'orders', 'customers', 'product_images', 'product_sizes', 'products', 'categories']) db.prepare('DELETE FROM sqlite_sequence WHERE name = ?').run(table);

  const insertCategory = db.prepare('INSERT INTO categories (name, slug, description) VALUES (?, ?, ?)');
  for (const category of categories) insertCategory.run(category.name, category.slug, category.description);
  const categoryRows = db.prepare('SELECT id, name FROM categories').all() as Array<{ id: number; name: string }>;
  const categoryIds = new Map(categoryRows.map(category => [category.name, category.id]));

  const insertProduct = db.prepare('INSERT INTO products (slug, name, price, category_id, sub_category, rating, image_url, main_image, description, stock, status, is_featured, is_bestseller, is_new, discount_percent, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)');
  const insertImage = db.prepare('INSERT INTO product_images (product_id, image_url, alt, sort_order) VALUES (?, ?, ?, ?)');
  const insertSize = db.prepare('INSERT INTO product_sizes (product_id, size, stock) VALUES (?, ?, ?)');

  for (const [slug, name, price, categoryName, sub, image, productSizes, featured, bestseller, isNew] of products) {
    const categoryId = categoryIds.get(categoryName);
    if (!categoryId) throw new Error(`Missing category: ${categoryName}`);
    const stock = productSizes.length * 4;
    const result = insertProduct.run(slug, name, price, categoryId, sub, 4.8, image, image, `Premium ${name} for the modern collector.`, stock, 'active', featured, bestseller, isNew, 0);
    const productId = Number(result.lastInsertRowid);
    insertImage.run(productId, image, name, 0);
    insertImage.run(productId, image, `${name} detail`, 1);
    for (const size of productSizes) insertSize.run(productId, size, 4);
  }

  db.prepare('INSERT INTO customers (name, phone, email) VALUES (?, ?, ?)').run('Demo Customer', '+7 777 777 77 77', 'demo@example.com');
  const order = db.prepare('INSERT INTO orders (order_number, customer_name, phone, email, city, address, comment, total, payment_method, payment_status, order_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').run('THR-DEMO-1001', 'Demo Customer', '+7 777 777 77 77', 'demo@example.com', 'Almaty', 'Demo street 1', 'Demo order', 82000, 'cash_on_delivery', 'pending', 'new');
  db.prepare('INSERT INTO order_items (order_id, product_id, product_name, size, quantity, price, image) VALUES (?, ?, ?, ?, ?, ?, ?)').run(Number(order.lastInsertRowid), 1, 'Rick Owens Jumbo Lace', '42', 1, 450000, '');
});

try {
  seed();
  console.log(`Database seeded successfully with ${products.length} products.`);
} finally {
  db.close();
}
