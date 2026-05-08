import db from '../lib/db';

const categories = [
  { name: 'Apparel', slug: 'apparel' },
  { name: 'Footwear', slug: 'footwear' },
  { name: 'Accessories', slug: 'accessories' },
] as const;

const products = [
  { name: 'Rick Owens Jumbo Lace', price: 450000, category: 'Footwear', sub: 'Darkwear', rating: 5.0, image: 'https://images.unsplash.com/photo-1628149422079-0efc0683a311?auto=format&fit=crop&q=80&w=600' },
  { name: 'Balenciaga Defender', price: 580000, category: 'Footwear', sub: 'Avant-garde', rating: 4.9, image: 'https://images.unsplash.com/photo-1615291244093-68f7000d11c1?auto=format&fit=crop&q=80&w=600' },
  { name: 'Old Order Skater v2', price: 85000, category: 'Footwear', sub: 'Y2K', rating: 4.8, image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=600' },
  { name: 'Vans Knu Skool Black', price: 52000, category: 'Footwear', sub: 'Skate', rating: 4.7, image: 'https://images.unsplash.com/photo-1525966222134-fcfa99bafb73?auto=format&fit=crop&q=80&w=600' },
  { name: 'Rick Owens Ramones High', price: 390000, category: 'Footwear', sub: 'Cult', rating: 5.0, image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=600' },
  { name: 'Mihara Yasuhiro Blake', price: 185000, category: 'Footwear', sub: 'Deconstructed', rating: 4.9, image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&q=80&w=600' },
  { name: 'Maison Margiela Replica Low', price: 220000, category: 'Footwear', sub: 'Luxury', rating: 4.8, image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&q=80&w=600' },

  { name: 'Cyber Sigil Zip-Up', price: 45000, category: 'Apparel', sub: 'Drain', rating: 4.9, image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=600' },
  { name: 'Opium Boxy Tee', price: 22000, category: 'Apparel', sub: 'Minimal', rating: 4.5, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=600' },
  { name: 'Distressed Baggy Denim', price: 48000, category: 'Apparel', sub: 'Grunge', rating: 4.6, image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=600' },
  { name: 'Rick Owens Gimp Hoodie', price: 320000, category: 'Apparel', sub: 'Lux', rating: 5.0, image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=600' },
  { name: 'Chrome Hearts Style Cross Tee', price: 150000, category: 'Apparel', sub: 'Hype', rating: 4.8, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=600' },
  { name: 'Spider Net Longsleeve', price: 28000, category: 'Apparel', sub: 'Ethereal', rating: 4.7, image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=600' },
  { name: 'Waxed Cargo Pants', price: 110000, category: 'Apparel', sub: 'Tech', rating: 4.9, image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=600' },
  { name: 'Oversized Washed Bomber', price: 135000, category: 'Apparel', sub: 'Outerwear', rating: 4.8, image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=600' },

  { name: 'Stealth Duffel Bag', price: 75000, category: 'Accessories', sub: 'Bags', rating: 4.4, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=600' },
  { name: 'Silver Chain Bracelet', price: 39000, category: 'Accessories', sub: 'Jewelry', rating: 4.6, image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=600' },
  { name: 'Black Nylon Crossbody', price: 59000, category: 'Accessories', sub: 'Bags', rating: 4.7, image: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&q=80&w=600' },
  { name: 'Logo Beanie', price: 18000, category: 'Accessories', sub: 'Headwear', rating: 4.5, image: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&q=80&w=600' },
  { name: 'Tech Utility Belt', price: 42000, category: 'Accessories', sub: 'Utility', rating: 4.6, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=600' },
];

const seed = db.transaction(() => {
  const upsertCategory = db.prepare(`
    INSERT INTO categories (name, slug)
    VALUES (?, ?)
    ON CONFLICT(slug) DO UPDATE SET name = excluded.name
  `);

  const insertProduct = db.prepare(`
    INSERT INTO products (name, price, category_id, sub_category, rating, image_url, description)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  for (const category of categories) {
    upsertCategory.run(category.name, category.slug);
  }

  db.prepare('DELETE FROM products').run();
  db.prepare("DELETE FROM sqlite_sequence WHERE name = 'products'").run();

  const allCategories = db.prepare('SELECT id, name FROM categories').all() as Array<{ id: number; name: string }>;
  const categoryIds = new Map(allCategories.map(category => [category.name, category.id]));

  for (const product of products) {
    const categoryId = categoryIds.get(product.category);

    if (!categoryId) {
      throw new Error(`Missing category: ${product.category}`);
    }

    insertProduct.run(
      product.name,
      product.price,
      categoryId,
      product.sub,
      product.rating,
      product.image,
      `Premium ${product.name} for the modern collector.`,
    );
  }
});

try {
  seed();
  console.log(`Database seeded successfully with ${products.length} products.`);
} finally {
  db.close();
}
