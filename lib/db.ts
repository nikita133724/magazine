import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbPath = path.resolve(process.cwd(), 'nexus_app.db');

let db: Database.Database;

try {
  db = new Database(dbPath);
} catch (e: any) {
  if (e.code === 'SQLITE_CORRUPT' || e.message.includes('malformed')) {
    console.warn('Database is corrupt/malformed. Recreating it...');
    try {
      fs.unlinkSync(dbPath);
    } catch(err) {}
    db = new Database(dbPath);
  } else {
    throw e;
  }
}

// Initialize tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    category_id INTEGER,
    sub_category TEXT,
    rating REAL,
    image_url TEXT,
    description TEXT,
    FOREIGN KEY (category_id) REFERENCES categories (id)
  );
`);

export default db;
