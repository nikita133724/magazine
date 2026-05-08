import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

const dbPath = path.resolve(process.cwd(), 'nexus_app.db');

declare global {
  var nexusSqliteDb: Database.Database | undefined;
}

function removeDatabaseFiles() {
  for (const suffix of ['', '-wal', '-shm']) {
    const filePath = `${dbPath}${suffix}`;
    try {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    } catch (error) {
      console.warn(`Unable to remove ${filePath}:`, error);
    }
  }
}

function isSqliteCorruption(error: unknown) {
  if (!(error instanceof Error)) return false;
  const code = 'code' in error ? String((error as { code?: unknown }).code) : '';
  return code === 'SQLITE_CORRUPT' || /malformed|corrupt/i.test(error.message);
}

function createDatabase() {
  try {
    const database = new Database(dbPath);
    database.pragma('journal_mode = WAL');
    database.pragma('foreign_keys = ON');
    return database;
  } catch (error) {
    if (!isSqliteCorruption(error)) throw error;
    removeDatabaseFiles();
    const database = new Database(dbPath);
    database.pragma('journal_mode = WAL');
    database.pragma('foreign_keys = ON');
    return database;
  }
}

function tableColumns(database: Database.Database, tableName: string) {
  return new Set((database.prepare(`PRAGMA table_info(${tableName})`).all() as Array<{ name: string }>).map(column => column.name));
}

function addColumnIfMissing(database: Database.Database, tableName: string, columnName: string, definition: string) {
  const columns = tableColumns(database, tableName);
  if (!columns.has(columnName)) database.exec(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${definition}`);
}

function migrate(database: Database.Database) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS categories (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, slug TEXT UNIQUE NOT NULL, description TEXT);
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT, slug TEXT UNIQUE, name TEXT NOT NULL, price REAL NOT NULL, compare_at_price REAL,
      category_id INTEGER NOT NULL, sub_category TEXT, rating REAL DEFAULT 4.5, image_url TEXT, main_image TEXT, description TEXT,
      stock INTEGER DEFAULT 0, status TEXT DEFAULT 'active', is_featured INTEGER DEFAULT 0, is_bestseller INTEGER DEFAULT 0,
      is_new INTEGER DEFAULT 0, discount_percent INTEGER DEFAULT 0, created_at TEXT DEFAULT CURRENT_TIMESTAMP, updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories (id)
    );
    CREATE TABLE IF NOT EXISTS product_images (id INTEGER PRIMARY KEY AUTOINCREMENT, product_id INTEGER NOT NULL, image_url TEXT NOT NULL, alt TEXT, sort_order INTEGER DEFAULT 0, FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE);
    CREATE TABLE IF NOT EXISTS product_sizes (id INTEGER PRIMARY KEY AUTOINCREMENT, product_id INTEGER NOT NULL, size TEXT NOT NULL, stock INTEGER DEFAULT 0, FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE);
    CREATE TABLE IF NOT EXISTS customers (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, phone TEXT NOT NULL, email TEXT, created_at TEXT DEFAULT CURRENT_TIMESTAMP);
    CREATE TABLE IF NOT EXISTS orders (id INTEGER PRIMARY KEY AUTOINCREMENT, order_number TEXT UNIQUE NOT NULL, customer_name TEXT NOT NULL, phone TEXT NOT NULL, email TEXT, city TEXT NOT NULL, address TEXT NOT NULL, comment TEXT, total REAL NOT NULL, payment_method TEXT NOT NULL, payment_status TEXT DEFAULT 'pending', order_status TEXT DEFAULT 'new', created_at TEXT DEFAULT CURRENT_TIMESTAMP);
    CREATE TABLE IF NOT EXISTS order_items (id INTEGER PRIMARY KEY AUTOINCREMENT, order_id INTEGER NOT NULL, product_id INTEGER, product_name TEXT NOT NULL, size TEXT, quantity INTEGER NOT NULL, price REAL NOT NULL, image TEXT, FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE, FOREIGN KEY (product_id) REFERENCES products (id));
  `);
  addColumnIfMissing(database, 'categories', 'description', 'TEXT');
  addColumnIfMissing(database, 'products', 'slug', 'TEXT');
  addColumnIfMissing(database, 'products', 'compare_at_price', 'REAL');
  addColumnIfMissing(database, 'products', 'main_image', 'TEXT');
  addColumnIfMissing(database, 'products', 'stock', 'INTEGER DEFAULT 0');
  addColumnIfMissing(database, 'products', 'status', "TEXT DEFAULT 'active'");
  addColumnIfMissing(database, 'products', 'is_featured', 'INTEGER DEFAULT 0');
  addColumnIfMissing(database, 'products', 'is_bestseller', 'INTEGER DEFAULT 0');
  addColumnIfMissing(database, 'products', 'is_new', 'INTEGER DEFAULT 0');
  addColumnIfMissing(database, 'products', 'discount_percent', 'INTEGER DEFAULT 0');
  addColumnIfMissing(database, 'products', 'created_at', 'TEXT');
  addColumnIfMissing(database, 'products', 'updated_at', 'TEXT');
  database.exec("UPDATE products SET created_at = COALESCE(created_at, CURRENT_TIMESTAMP), updated_at = COALESCE(updated_at, CURRENT_TIMESTAMP)");
  database.exec(`
    CREATE UNIQUE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
    CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
    CREATE INDEX IF NOT EXISTS idx_products_flags ON products(is_featured, is_bestseller, is_new);
    CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);
    CREATE INDEX IF NOT EXISTS idx_product_sizes_product_id ON product_sizes(product_id);
    CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
  `);
}

function initDb() {
  const database = createDatabase();
  try {
    migrate(database);
  } catch (error) {
    if (!isSqliteCorruption(error)) throw error;
    try { database.close(); } catch {}
    removeDatabaseFiles();
    return initDb();
  }
  return database;
}

const db = globalThis.nexusSqliteDb ?? initDb();
if (process.env.NODE_ENV !== 'production') globalThis.nexusSqliteDb = db;
export default db;
