import { Pool } from 'pg';
import { getPool } from './init';

export interface Conversation {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, any>;
}

export interface Message {
  id: string;
  conversationId: string;
  sender: 'user' | 'ai';
  text: string;
  createdAt: Date;
  metadata?: Record<string, any>;
}

export async function createConversation(): Promise<Conversation> {
  const pool = getPool();
  const result = await pool.query<Conversation>(
    `INSERT INTO conversations (created_at, updated_at) 
     VALUES (NOW(), NOW()) 
     RETURNING id, created_at as "createdAt", updated_at as "updatedAt", metadata`
  );
  return result.rows[0];
}

export async function getConversation(id: string): Promise<Conversation | null> {
  const pool = getPool();
  const result = await pool.query<Conversation>(
    `SELECT id, created_at as "createdAt", updated_at as "updatedAt", metadata 
     FROM conversations 
     WHERE id = $1`,
    [id]
  );
  return result.rows[0] || null;
}

export async function addMessage(
  conversationId: string,
  sender: 'user' | 'ai',
  text: string
): Promise<Message> {
  const pool = getPool();
  
  // Update conversation's updated_at timestamp
  await pool.query(
    `UPDATE conversations SET updated_at = NOW() WHERE id = $1`,
    [conversationId]
  );

  const result = await pool.query<Message>(
    `INSERT INTO messages (conversation_id, sender, text, created_at) 
     VALUES ($1, $2, $3, NOW()) 
     RETURNING id, conversation_id as "conversationId", sender, text, created_at as "createdAt", metadata`,
    [conversationId, sender, text]
  );
  
  return result.rows[0];
}

export async function getMessages(conversationId: string): Promise<Message[]> {
  const pool = getPool();
  const result = await pool.query<Message>(
    `SELECT id, conversation_id as "conversationId", sender, text, created_at as "createdAt", metadata 
     FROM messages 
     WHERE conversation_id = $1 
     ORDER BY created_at ASC`,
    [conversationId]
  );
  return result.rows;
}

export async function getMessageCount(conversationId: string): Promise<number> {
  const pool = getPool();
  const result = await pool.query<{ count: string }>(
    `SELECT COUNT(*) as count FROM messages WHERE conversation_id = $1`,
    [conversationId]
  );
  return parseInt(result.rows[0].count, 10);
}

