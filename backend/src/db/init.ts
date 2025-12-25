import { Pool, PoolClient } from 'pg';
import { createTables } from './schema';

let pool: Pool | null = null;

export function getPool(): Pool {
  if (!pool) {
    const databaseUrl = process.env.DATABASE_URL;
    
    if (!databaseUrl) {
      throw new Error('DATABASE_URL environment variable is not set');
    }

    pool = new Pool({
      connectionString: databaseUrl,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      max: 10, // Maximum number of clients in the pool
      idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
      connectionTimeoutMillis: 10000, // Return an error after 10 seconds if connection could not be established
    });

    pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
    });
  }

  return pool;
}

export async function initDatabase(): Promise<void> {
  const maxRetries = 3;
  let retries = 0;
  
  while (retries < maxRetries) {
    try {
      const client = await getPool().connect();
      
      try {
        await createTables(client);
        console.log('Database tables created/verified');
        return; // Success, exit the retry loop
      } catch (error) {
        console.error('Error initializing database:', error);
        throw error;
      } finally {
        client.release();
      }
    } catch (error: any) {
      retries++;
      if (retries >= maxRetries) {
        console.error(`Failed to connect to database after ${maxRetries} attempts`);
        throw error;
      }
      
      // If it's a connection error, wait a bit and retry
      if (error.code === 'ECONNRESET' || error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
        console.log(`Database connection failed, retrying in 2 seconds... (attempt ${retries}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, 2000));
      } else {
        // For other errors, don't retry
        throw error;
      }
    }
  }
}

export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

