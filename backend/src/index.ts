// Load and validate environment variables FIRST
import { validateEnv } from './config';
import express from 'express';
import cors from 'cors';
import { chatRouter } from './routes/chat';
import { initDatabase } from './db/init';

// Validate environment variables
validateEnv();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/chat', chatRouter);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Initialize database and start server
async function start() {
  try {
    // Small delay to ensure database is ready
    console.log('Connecting to database...');
    await initDatabase();
    console.log('Database initialized');
    
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Using LLM provider: ${process.env.LLM_PROVIDER || 'ollama'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    console.error('\nTroubleshooting tips:');
    console.error('1. Make sure PostgreSQL is running: docker ps');
    console.error('2. Check DATABASE_URL in .env file');
    console.error('3. Try restarting the database: docker restart spur-postgres');
    process.exit(1);
  }
}

start();

