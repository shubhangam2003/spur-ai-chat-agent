# Environment Variables Setup Guide

## 📁 Where to Configure Environment Variables

You need to create **2 files** in your project:

1. **`backend/.env`** - Backend configuration
2. **`frontend/.env`** - Frontend configuration

## 🔧 Step-by-Step Setup

### 1. Backend Environment Variables

**Location:** `backend/.env`

**Create the file:**
- Copy `backend/env.template` to `backend/.env`
- Or create a new file named `.env` in the `backend` folder

**Required Variables:**

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration (PostgreSQL)
# If using Docker with default setup:
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/spur_chat

# LLM API Configuration
# ⚠️ IMPORTANT: Replace with your actual OpenAI API key
OPENAI_API_KEY=sk-your-actual-api-key-here

# Optional: Rate limiting and token limits
MAX_MESSAGE_LENGTH=2000
MAX_TOKENS=500
MAX_MESSAGES_PER_SESSION=50
```

**What to change:**
- ✅ `OPENAI_API_KEY` - **REQUIRED**: Get from https://platform.openai.com/api-keys
- ✅ `DATABASE_URL` - Only if your PostgreSQL setup is different

### 2. Frontend Environment Variables

**Location:** `frontend/.env`

**Create the file:**
- Copy `frontend/env.template` to `frontend/.env`
- Or create a new file named `.env` in the `frontend` folder

**Required Variables:**

```env
# Backend API URL
# For local development (default):
VITE_API_URL=http://localhost:3000

# For production (after deployment):
# VITE_API_URL=https://your-backend-url.com
```

**What to change:**
- ✅ `VITE_API_URL` - Only change if your backend runs on a different port or URL

## 🚀 Quick Setup Commands

### Windows PowerShell:

```powershell
# Create backend .env file
Copy-Item backend\env.template backend\.env

# Create frontend .env file
Copy-Item frontend\env.template frontend\.env
```

### Linux/macOS:

```bash
# Create backend .env file
cp backend/env.template backend/.env

# Create frontend .env file
cp frontend/env.template frontend/.env
```

## ✏️ Editing the Files

### Backend `.env` - What You MUST Change:

1. **Open `backend/.env` in a text editor**
2. **Find this line:**
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```
3. **Replace `your_openai_api_key_here` with your actual OpenAI API key**
   - Get it from: https://platform.openai.com/api-keys
   - It should start with `sk-`
   - Example: `OPENAI_API_KEY=sk-abc123def456...`

### Frontend `.env` - Usually No Changes Needed:

- Keep `VITE_API_URL=http://localhost:3000` for local development
- Only change if your backend runs on a different port

## 📋 Checklist

Before starting the application:

- [ ] Created `backend/.env` file
- [ ] Added your OpenAI API key to `backend/.env`
- [ ] Verified `DATABASE_URL` matches your PostgreSQL setup
- [ ] Created `frontend/.env` file
- [ ] Verified `VITE_API_URL` is correct (default is fine for local dev)

## 🔒 Security Notes

⚠️ **Important:**
- `.env` files are in `.gitignore` - they won't be committed to Git
- **Never share your API keys** publicly
- Don't commit `.env` files to version control
- For production, use environment variables provided by your hosting platform

## 🐛 Troubleshooting

### Error: "OPENAI_API_KEY is not set"

**Solution:** Make sure you:
1. Created `backend/.env` file
2. Added `OPENAI_API_KEY=sk-your-key-here`
3. Restarted your backend server after creating/editing `.env`

### Error: "DATABASE_URL environment variable is not set"

**Solution:** Make sure you:
1. Created `backend/.env` file
2. Added `DATABASE_URL=postgresql://postgres:postgres@localhost:5432/spur_chat`
3. Adjust the connection string if your PostgreSQL setup is different

### Frontend can't connect to backend

**Solution:** Check:
1. `frontend/.env` exists
2. `VITE_API_URL=http://localhost:3000` (or your backend URL)
3. Backend is running on the port specified
4. Restart frontend dev server after creating/editing `.env`

## 📝 File Structure

After setup, your project should look like:

```
Spur/
├── backend/
│   ├── .env              ← Backend environment variables
│   ├── env.template      ← Template (for reference)
│   └── ...
├── frontend/
│   ├── .env              ← Frontend environment variables
│   ├── env.template      ← Template (for reference)
│   └── ...
└── ...
```

## 🎯 Next Steps

After configuring environment variables:

1. ✅ Start PostgreSQL (Docker or local)
2. ✅ Start backend: `cd backend; npm run dev`
3. ✅ Start frontend: `cd frontend; npm run dev`
4. ✅ Open http://localhost:5173

