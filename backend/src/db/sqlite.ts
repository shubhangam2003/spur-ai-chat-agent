// Alternative SQLite implementation (optional)
// Uncomment and modify init.ts to use this instead of PostgreSQL

import Database from 'better-sqlite3';
import { existsSync } from 'fs';

let db: Database.Database | null = null;

export function getSQLiteDatabase(): Database.Database {
  if (!db) {
    const dbPath = process.env.DATABASE_PATH || './chat.db';
    db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
  }
  return db;
}

export async function initSQLiteDatabase(): Promise<void> {
  const database = getSQLiteDatabase();

  // Create conversations table
  database.exec(`
    CREATE TABLE IF NOT EXISTS conversations (
      id TEXT PRIMARY KEY,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      metadata TEXT DEFAULT '{}'
    )
  `);

  // Create messages table
  database.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      conversation_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
      sender TEXT NOT NULL CHECK (sender IN ('user', 'ai')),
      text TEXT NOT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      metadata TEXT DEFAULT '{}'
    )
  `);

  // Create indexes
  database.exec(`
    CREATE INDEX IF NOT EXISTS idx_messages_conversation_id 
    ON messages(conversation_id, created_at)
  `);

  console.log('SQLite database initialized');
}

export function closeSQLiteDatabase(): void {
  if (db) {
    db.close();
    db = null;
  }
}

