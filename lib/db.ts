import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbPath = path.resolve(process.cwd(), 'nexus_app.db');

declare global {
  // eslint-disable-next-line no-var
  var nexusSqliteDb: Database.Database | undefined;
}

function removeDatabaseFiles() {
  for (const suffix of ['', '-wal', '-shm']) {
    const filePath = `${dbPath}${suffix}`;
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
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

    console.warn('Database connection failed. Recreating local SQLite database...');
    removeDatabaseFiles();

    const database = new Database(dbPath);
    database.pragma('journal_mode = WAL');
    database.pragma('foreign_keys = ON');
    return database;
  }
}

function initDb() {
  const database = createDatabase();

  try {
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
        category_id INTEGER NOT NULL,
        sub_category TEXT,
        rating REAL DEFAULT 4.5,
        image_url TEXT,
        description TEXT,
        FOREIGN KEY (category_id) REFERENCES categories (id)
      );

      CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
    `);
  } catch (error) {
    if (!isSqliteCorruption(error)) throw error;

    console.warn('Database schema initialization failed. Recreating local SQLite database...');
    try {
      database.close();
    } catch {}
    removeDatabaseFiles();
    return initDb();
  }

  return database;
}

const db = globalThis.nexusSqliteDb ?? initDb();

if (process.env.NODE_ENV !== 'production') {
  globalThis.nexusSqliteDb = db;
}

export default db;
