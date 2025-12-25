# Spur AI Chat Agent - Take-Home Assignment

A full-stack AI-powered live chat support agent built with TypeScript, Node.js, Svelte, PostgreSQL, and Google Gemini.

## 🎯 Overview

This application simulates a customer support chat where an AI agent answers user questions using Google's Gemini 2.5 Flash model. The agent is seeded with knowledge about a fictional e-commerce store (SpurStore) including shipping policies, return policies, and support hours.

## 🏗️ Architecture

### Backend Structure

```
backend/
├── src/
│   ├── index.ts           # Express server setup
│   ├── routes/
│   │   └── chat.ts        # Chat API endpoints
│   ├── services/
│   │   └── llm.ts         # LLM integration (Gemini, with Ollama support)
│   └── db/
│       ├── init.ts        # Database connection
│       ├── schema.ts      # Database schema
│       └── conversations.ts # Database operations
```

**Design Decisions:**
- **Separation of Concerns**: Routes handle HTTP, services handle business logic, DB layer handles persistence
- **Error Handling**: Comprehensive error handling at each layer with user-friendly error messages
- **Session Management**: UUID-based sessions stored in database, persisted in localStorage on frontend
- **LLM Integration**: Encapsulated in a service layer for easy swapping of providers
- **Input Validation**: Using Zod for type-safe validation

### Frontend Structure

```
frontend/
├── src/
│   ├── App.svelte         # Main app component
│   └── components/
│       └── ChatWidget.svelte # Chat interface
```

**Design Decisions:**
- **Svelte 5 Runes**: Using modern Svelte 5 with runes for reactive state
- **Auto-scroll**: Messages automatically scroll to bottom
- **Typing Indicator**: Shows "Agent is typing..." during API calls
- **Error Display**: User-friendly error messages in the UI
- **Example Questions**: Quick-start buttons for common queries

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 12+ (recommended) or Docker for PostgreSQL
- Google Gemini API key (free tier available) or Ollama for local development

### Installation

1. **Clone and install dependencies:**

```bash
npm run install:all
```

Or manually:

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

2. **Set up the database:**

**Option A: Using Docker (Recommended)**
```bash
docker run --name spur-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=spur_chat \
  -p 5432:5432 \
  -d postgres:15
```

**Option B: Local PostgreSQL**
```bash
# Create a database
createdb spur_chat

# Or using psql:
psql -U postgres
CREATE DATABASE spur_chat;
```

3. **Get your Gemini API key:**

- Go to https://aistudio.google.com/app/apikey
- Sign in with your Google account
- Click "Create API Key"
- Select "Default Gemini Project" or create a new project
- Copy the API key

4. **Configure environment variables:**

Backend (create `backend/.env`):
```env
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/spur_chat

# LLM Configuration - Choose one:
# Option 1: Google Gemini (Recommended - Free tier available)
LLM_PROVIDER=gemini
GEMINI_API_KEY=your_gemini_api_key_here

# Option 2: Ollama (Local, no API key needed)
# LLM_PROVIDER=ollama
# OLLAMA_BASE_URL=http://localhost:11434
# OLLAMA_MODEL=gemma3:27b

# Optional settings
MAX_MESSAGE_LENGTH=2000
MAX_TOKENS=1000
MAX_MESSAGES_PER_SESSION=50
```

Frontend (create `frontend/.env`):
```env
VITE_API_URL=http://localhost:3000
```

5. **Run database migrations:**

The database schema is automatically created on first run. No manual migration needed.

6. **Start the servers:**

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

7. **Open your browser:**

Navigate to `http://localhost:5173` (or the port shown in your terminal)

## 📝 API Endpoints

### POST `/chat/message`

Send a message to the AI agent.

**Request:**
```json
{
  "message": "What's your return policy?",
  "sessionId": "optional-uuid" // Omit for new conversation
}
```

**Response:**
```json
{
  "reply": "We have a 30-day return policy...",
  "sessionId": "uuid-here"
}
```

### GET `/chat/history/:sessionId`

Retrieve conversation history.

**Response:**
```json
{
  "sessionId": "uuid-here",
  "messages": [
    {
      "id": "msg-id",
      "sender": "user",
      "text": "Hello",
      "timestamp": "2024-01-01T00:00:00Z"
    }
  ]
}
```

## 🧠 LLM Integration

### Primary Provider: Google Gemini 2.5 Flash

**Why Gemini 2.5 Flash?**
- Fast response times
- Free tier available (generous limits)
- Excellent quality for customer support use cases
- Latest model with improved performance

**Alternative: Ollama (Local Development)**
- Supports local models (Gemma, Qwen, etc.)
- No API keys required
- Good for development and testing

### Prompting Strategy

1. **System Prompt**: Contains all domain knowledge (shipping, returns, support hours)
2. **Conversation History**: Last 10 messages included for context
3. **Token Limits**: Max 1000 tokens per response (configurable)
4. **Temperature**: 0.7 for balanced creativity and consistency
5. **Model**: Uses `gemini-2.5-flash` for optimal performance

### Error Handling

The LLM service handles:
- **Authentication errors** (401): Invalid API key
- **Rate limiting** (429): Too many requests
- **Service unavailable** (503/502): Temporary outages
- **Timeouts**: 120-second timeout with retry logic
- **Empty responses**: Graceful fallback
- **Connection errors**: Database connection retries (3 attempts)
- **Model not found**: Clear error messages with suggestions

All errors are surfaced to users with friendly messages and retry suggestions where appropriate.

## 🗄️ Database Schema
### `conversations`
- `id` (UUID, Primary Key)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)
- `metadata` (JSONB)

### `messages`
- `id` (UUID, Primary Key)
- `conversation_id` (UUID, Foreign Key)
- `sender` ('user' | 'ai')
- `text` (Text)
- `created_at` (Timestamp)
- `metadata` (JSONB)

**Indexes:**
- `idx_messages_conversation_id` on `(conversation_id, created_at)`
- `idx_conversations_created_at` on `created_at`

## 🛡️ Robustness Features

### Input Validation
- ✅ Empty messages rejected
- ✅ Message length capped at 2000 characters (configurable)
- ✅ UUID validation for session IDs
- ✅ Type validation using Zod

### Error Handling
- ✅ LLM API failures caught and displayed
- ✅ Database errors handled gracefully
- ✅ Network errors surfaced to users
- ✅ Invalid input returns 400 with clear errors

### Rate Limiting & Controls
- ✅ Max 50 messages per conversation (configurable)
- ✅ Max 1000 tokens per LLM response (configurable)
- ✅ 120-second timeout on LLM calls (configurable)
- ✅ Request rate limiting (2 seconds between requests)

### Security
- ✅ No hardcoded secrets (all via env vars)
- ✅ SQL injection prevention (parameterized queries)
- ✅ CORS configured
- ✅ Input sanitization

## 🚢 Deployment

### Backend (Render/Railway/Fly.io)

1. Set environment variables
2. Build: `npm run build:backend`
3. Start: `npm start` (runs `node dist/index.js`)

### Frontend (Vercel/Netlify)

1. Set `VITE_API_URL` to your backend URL
2. Build: `npm run build:frontend`
3. Deploy the `dist` folder

### Database

For production, use a managed PostgreSQL service:
- **Render**: Free tier available
- **Supabase**: Free tier with generous limits
- **Neon**: Serverless PostgreSQL

## 🧪 Testing the Application

### Manual Testing Checklist

- [x] Send a message and receive AI reply
- [x] Conversation persists across page reloads
- [x] Empty messages are rejected
- [x] Very long messages are handled (truncated at 2000 chars)
- [x] Error messages display when API fails
- [x] Typing indicator shows during requests
- [x] Auto-scroll to latest message
- [x] Example questions work
- [x] New chat button clears conversation
- [x] Enter key sends message

### Try Breaking It

The app handles:
- Invalid session IDs → 404 error
- Missing API key → Clear error message
- Network failures → User-friendly error
- Rate limits → Retry suggestion
- Empty responses → Fallback message

## 📊 Trade-offs & Design Decisions

### What I Prioritized

1. **Code Quality**: Clean, readable, maintainable code
2. **Error Handling**: Comprehensive error handling at every layer
3. **User Experience**: Smooth chat experience with loading states
4. **Extensibility**: Easy to add new LLM providers or channels


### Known Limitations

- No authentication (by design for this assignment)
- SQLite not implemented (PostgreSQL only, but easy to add)
- No message editing/deletion
- No file uploads
- Single conversation at a time per browser

## 📦 Dependencies

### Backend
- `express` - Web framework
- `@google/generative-ai` - Google Gemini API client
- `pg` - PostgreSQL client
- `zod` - Schema validation
- `cors` - CORS middleware
- `dotenv` - Environment variables

### Frontend
- `svelte` - UI framework
- `vite` - Build tool
- `axios` - HTTP client

## 🤝 Contributing

This is a take-home assignment, but the code is structured to be easily extensible for:
- Adding new chat channels (WhatsApp, Instagram, etc.)
- Integrating with more tools (Shopify, Stripe, etc.)
- Adding more LLM providers
- Implementing authentication
- Adding analytics and monitoring
