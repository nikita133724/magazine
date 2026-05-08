import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbPath = path.resolve(process.cwd(), 'nexus_app.db');

function initDb() {
  let database: Database.Database;
  try {
    database = new Database(dbPath);
    // Test if database is actually working by trying a simple PRAGMA or query
    database.pragma('journal_mode = WAL');
  } catch (e: any) {
    if (e.code === 'SQLITE_CORRUPT' || e.message.includes('malformed')) {
      console.warn('Database connection failed (malformed). Deleting and recreating...');
      try {
        if (fs.existsSync(dbPath)) fs.unlinkSync(dbPath);
      } catch (err) {}
      database = new Database(dbPath);
    } else {
      throw e;
    }
  }

  try {
    // Initialize tables if they don't exist
    database.exec(`
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
  } catch (e: any) {
    if (e.code === 'SQLITE_CORRUPT' || e.message.includes('malformed')) {
      console.warn('Database execution failed (malformed). Deleting and recreating...');
      try {
        database.close();
        if (fs.existsSync(dbPath)) fs.unlinkSync(dbPath);
      } catch (err) {}
      return initDb(); // Recursive call to retry after deletion
    } else {
      throw e;
    }
  }
  return database;
}

const db = initDb();

export default db;
