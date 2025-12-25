# Quick Start Commands

## 🚀 Starting the Application

### Windows PowerShell Commands

**Terminal 1 - Start Backend:**
```powershell
cd backend
npm run dev
```

**Terminal 2 - Start Frontend:**
```powershell
cd frontend
npm run dev
```

### Linux/macOS Commands

**Terminal 1 - Start Backend:**
```bash
cd backend && npm run dev
```

**Terminal 2 - Start Frontend:**
```bash
cd frontend && npm run dev
```

## 📝 Important Notes for PowerShell

⚠️ **PowerShell doesn't support `&&` for chaining commands.**

**❌ Wrong (PowerShell):**
```powershell
cd backend && npm run dev  # This will fail!
```

**✅ Correct (PowerShell):**
```powershell
cd backend; npm run dev
```

Or use separate commands:
```powershell
cd backend
npm run dev
```

## 🔄 Alternative: One-Line Commands (PowerShell)

If you want to run from the project root:

**Backend:**
```powershell
cd backend; npm run dev
```

**Frontend:**
```powershell
cd frontend; npm run dev
```

## ✅ What You Should See

### Backend Output:
```
Database tables created/verified
Server running on http://localhost:3000
```

### Frontend Output:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

## 🌐 Access the Application

Once both servers are running:
- Open your browser
- Go to: **http://localhost:5173**
- Start chatting with the AI agent!

## 🛑 Stopping the Servers

Press `Ctrl + C` in each terminal to stop the servers.

