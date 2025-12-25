import { PoolClient } from 'pg';

export async function createTables(client: PoolClient): Promise<void> {
  // Create conversations table
  await client.query(`
    CREATE TABLE IF NOT EXISTS conversations (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
      metadata JSONB DEFAULT '{}'::jsonb
    )
  `);

  // Create messages table
  await client.query(`
    CREATE TABLE IF NOT EXISTS messages (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
      sender VARCHAR(10) NOT NULL CHECK (sender IN ('user', 'ai')),
      text TEXT NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      metadata JSONB DEFAULT '{}'::jsonb
    )
  `);

  // Create indexes for better query performance
  await client.query(`
    CREATE INDEX IF NOT EXISTS idx_messages_conversation_id 
    ON messages(conversation_id, created_at)
  `);

  await client.query(`
    CREATE INDEX IF NOT EXISTS idx_conversations_created_at 
    ON conversations(created_at)
  `);
}

