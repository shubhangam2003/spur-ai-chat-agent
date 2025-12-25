# Quick Setup Guide

## Step-by-Step Setup

### 1. Install Dependencies

```bash
# From project root
npm run install:all
```

### 2. Set Up PostgreSQL Database

**Option A: Using Docker (Easiest) - Recommended**

**Windows PowerShell:**
```powershell
docker run --name spur-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=spur_chat -p 5432:5432 -d postgres:15
```

**Linux/macOS:**
```bash
docker run --name spur-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=spur_chat \
  -p 5432:5432 \
  -d postgres:15
```

**Verify it's running:**
```powershell
docker ps
```

You should see `spur-postgres` in the list. For detailed Docker setup instructions, see [DOCKER_SETUP.md](./DOCKER_SETUP.md).

**Option B: Local PostgreSQL**
```bash
# macOS (using Homebrew)
brew install postgresql@15
brew services start postgresql@15
createdb spur_chat

# Linux (Ubuntu/Debian)
sudo apt-get install postgresql postgresql-contrib
sudo -u postgres createdb spur_chat

# Windows
# Download and install from https://www.postgresql.org/download/windows/
# Use pgAdmin to create database 'spur_chat'
```

### 3. Get OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Copy the key (starts with `sk-`)

### 4. Configure Environment Variables

**Backend** - Create `backend/.env`:
```env
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/spur_chat
OPENAI_API_KEY=sk-your-key-here
MAX_MESSAGE_LENGTH=2000
MAX_TOKENS=500
MAX_MESSAGES_PER_SESSION=50
```

**Frontend** - Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:3000
```

### 5. Start the Application

**Terminal 1 - Backend:**

**Windows PowerShell:**
```powershell
cd backend
npm run dev
```

**Linux/macOS:**
```bash
cd backend
npm run dev
```

You should see:
```
Database tables created/verified
Server running on http://localhost:3000
```

**Terminal 2 - Frontend:**

**Windows PowerShell:**
```powershell
cd frontend
npm run dev
```

**Linux/macOS:**
```bash
cd frontend
npm run dev
```

You should see:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

### 6. Test the Application

1. Open http://localhost:5173 in your browser
2. Try asking: "What's your return policy?"
3. The AI should respond with information about the store

## Troubleshooting

### Database Connection Error

**Error:** `DATABASE_URL environment variable is not set`

**Solution:** Make sure you created `backend/.env` with the `DATABASE_URL` variable.

### PostgreSQL Connection Refused

**Error:** `connect ECONNREFUSED 127.0.0.1:5432`

**Solutions:**
- Make sure PostgreSQL is running: `pg_isready` or check service status
- Verify the connection string in `.env` matches your PostgreSQL setup
- Check if PostgreSQL is listening on port 5432: `lsof -i :5432`

### OpenAI API Error

**Error:** `API authentication failed`

**Solutions:**
- Verify your API key is correct in `backend/.env`
- Make sure you have credits in your OpenAI account
- Check the key starts with `sk-`

### Frontend Can't Connect to Backend

**Error:** `Failed to send message` or CORS errors

**Solutions:**
- Make sure backend is running on port 3000
- Check `VITE_API_URL` in `frontend/.env` matches your backend URL
- Verify CORS is enabled in backend (it should be by default)

## Next Steps

Once everything is working:
1. Try the example questions
2. Test error handling (disconnect internet, invalid API key, etc.)
3. Check that conversations persist after page reload
4. Review the code structure

## Production Deployment

See the main README.md for deployment instructions to Render, Vercel, etc.

