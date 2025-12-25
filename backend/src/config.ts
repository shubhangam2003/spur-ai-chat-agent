// This file must be imported FIRST to load environment variables
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Validate required environment variables
export function validateEnv() {
  const provider = (process.env.LLM_PROVIDER || 'ollama').toLowerCase();
  
  // Ollama doesn't need API keys (runs locally)
  if (provider === 'ollama') {
    return;
  }
  
  // Support both OpenAI and Gemini
  const hasOpenAI = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here';
  const hasGemini = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here';
  
  if (!hasOpenAI && !hasGemini) {
    throw new Error(
      'No LLM API key found. Please set either:\n' +
      '- Use LLM_PROVIDER=ollama for local Ollama (no API key needed)\n' +
      '- GEMINI_API_KEY in backend/.env (free tier available)\n' +
      '  Get it from: https://makersuite.google.com/app/apikey\n' +
      '- OR OPENAI_API_KEY in backend/.env\n' +
      '  Get it from: https://platform.openai.com/api-keys'
    );
  }
}

// Export environment variables
export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL,
  openaiApiKey: process.env.OPENAI_API_KEY,
  geminiApiKey: process.env.GEMINI_API_KEY,
  llmProvider: (process.env.LLM_PROVIDER || 'ollama').toLowerCase(),
  ollamaBaseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
  ollamaModel: process.env.OLLAMA_MODEL || 'qwen2.5:4b',
  maxMessageLength: parseInt(process.env.MAX_MESSAGE_LENGTH || '2000', 10),
  maxTokens: parseInt(process.env.MAX_TOKENS || '500', 10),
  maxMessagesPerSession: parseInt(process.env.MAX_MESSAGES_PER_SESSION || '50', 10),
};

