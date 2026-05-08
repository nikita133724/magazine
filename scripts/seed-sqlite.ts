import db from '../lib/db';

const categories = [
  { name: 'Apparel', slug: 'apparel' },
  { name: 'Footwear', slug: 'footwear' },
  { name: 'Accessories', slug: 'accessories' }
];

const products = [
  // Footwear (Rick Owens, Balenciaga, Old Order, Vans)
  { name: 'Rick Owens Jumbo Lace', price: 450000, category: 'Footwear', sub: 'Darkwear', rating: 5.0, image: 'https://images.unsplash.com/photo-1628149422079-0efc0683a311?auto=format&fit=crop&q=80&w=600' },
  { name: 'Balenciaga Defender', price: 580000, category: 'Footwear', sub: 'Avant-garde', rating: 4.9, image: 'https://images.unsplash.com/photo-1615291244093-68f7000d11c1?auto=format&fit=crop&q=80&w=600' },
  { name: 'Old Order Skater v2', price: 85000, category: 'Footwear', sub: 'Y2K', rating: 4.8, image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=600' },
  { name: 'Vans Knu Skool Black', price: 52000, category: 'Footwear', sub: 'Skate', rating: 4.7, image: 'https://images.unsplash.com/photo-1525966222134-fcfa99bafb73?auto=format&fit=crop&q=80&w=600' },
  { name: 'Rick Owens Ramones High', price: 390000, category: 'Footwear', sub: 'Cult', rating: 5.0, image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=600' },
  { name: 'Mihara Yasuhiro Blake', price: 185000, category: 'Footwear', sub: 'Deconstructed', rating: 4.9, image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&q=80&w=600' },

  // Apparel (Drain/Underground/Opium style)
  { name: 'Cyber Sigil Zip-Up', price: 45000, category: 'Apparel', sub: 'Drain', rating: 4.9, image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=600' },
  { name: 'Opium Boxy Tee', price: 22000, category: 'Apparel', sub: 'Minimal', rating: 4.5, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=600' },
  { name: 'Distressed Baggy Denim', price: 48000, category: 'Apparel', sub: 'Grunge', rating: 4.6, image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=600' },
  { name: 'Rick Owens Gimp Hoodie', price: 320000, category: 'Apparel', sub: 'Lux', rating: 5.0, image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=600' },
  { name: 'Chrome Hearts Style Cross Tee', price: 150000, category: 'Apparel', sub: 'Hype', rating: 4.8, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=600' },
  { name: 'Spider Net Longsleeve', price: 28000, category: 'Apparel', sub: 'Ethereal', rating: 4.7, image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=600' },
  { name: 'Waxed Cargo Pants', price: 110000, category: 'Apparel', sub: 'Tech', rating: 4.9, image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=600' },
];

function seed() {
  const insertCat = db.prepare('INSERT OR IGNORE INTO categories (name, slug) VALUES (?, ?)');
  const insertProd = db.prepare(`
    INSERT INTO products (name, price, category_id, sub_category, rating, image_url, description)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  categories.forEach(cat => insertCat.run(cat.name, cat.slug));

  const allCats = db.prepare('SELECT * FROM categories').all() as any[];
  const catMap = new Map(allCats.map(c => [c.name, c.id]));

  // Clear products first for clean seed
  db.prepare('DELETE FROM products').run();

  products.forEach(p => {
    insertProd.run(
      p.name,
      p.price,
      catMap.get(p.category),
      p.sub,
      p.rating,
      p.image,
      `Premium ${p.name} for the modern athlete.`
    );
  });

  console.log('Database seeded successfully!');
}

seed();
