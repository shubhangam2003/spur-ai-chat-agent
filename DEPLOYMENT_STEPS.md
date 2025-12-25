# Step-by-Step Deployment Instructions

## Overview
- Database: Supabase (PostgreSQL) - FREE
- Backend: Render - FREE
- Frontend: Vercel - FREE

---

## Step 1: Set Up Database on Supabase

1. **Go to**: https://supabase.com
2. **Sign up** (use GitHub login for easiest setup)
3. **Click**: "New Project"
4. **Project Details**:
   - Name: `spur-chat-db` (or any name)
   - Database Password: Create a strong password (save it!)
   - Region: Choose closest to you
5. **Wait** 2-3 minutes for database to be created
6. **Get Connection String**:
   - Go to: Settings → Database
   - Find: "Connection string" section
   - Select: "URI" tab
   - Copy the connection string
   - Format: `postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres`
   - **Important**: Replace `[YOUR-PASSWORD]` with your actual password

**Save this connection string - you'll need it for backend deployment!**

---

## Step 2: Deploy Backend on Render

1. **Go to**: https://render.com
2. **Sign up** (use GitHub login)
3. **Click**: "New +" → "Web Service"
4. **Connect Repository**:
   - Click "Connect account" if needed
   - Select: `shubhangam2003/spur-ai-chat-agent`
5. **Service Settings**:
   - Name: `spur-chat-backend`
   - Region: Choose closest
   - Branch: `main`
   - Root Directory: `backend`
   - Runtime: `Node`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
6. **Environment Variables** (click "Add Environment Variable" for each):
   ```
   PORT = 3000
   NODE_ENV = production
   DATABASE_URL = [paste your Supabase connection string here]
   LLM_PROVIDER = gemini
   GEMINI_API_KEY = [your Gemini API key]
   MAX_MESSAGE_LENGTH = 2000
   MAX_TOKENS = 1000
   MAX_MESSAGES_PER_SESSION = 50
   ```
7. **Click**: "Create Web Service"
8. **Wait** 5-10 minutes for deployment
9. **Get Backend URL**: 
   - Your service will be at: `https://spur-chat-backend.onrender.com`
   - Or: `https://spur-chat-backend-[random].onrender.com`
   - **Copy this URL - you'll need it for frontend!**

**Note**: Render free tier sleeps after 15 minutes of inactivity. First request after sleep takes ~30 seconds.

---

## Step 3: Deploy Frontend on Vercel

1. **Go to**: https://vercel.com
2. **Sign up** (use GitHub login)
3. **Click**: "Add New..." → "Project"
4. **Import Repository**:
   - Find: `shubhangam2003/spur-ai-chat-agent`
   - Click "Import"
5. **Project Settings**:
   - Framework Preset: `Vite` (should auto-detect)
   - Root Directory: `frontend`
   - Build Command: `npm run build` (default)
   - Output Directory: `dist` (default)
6. **Environment Variables**:
   - Click "Environment Variables"
   - Add:
     ```
     Name: VITE_API_URL
     Value: https://your-backend-url.onrender.com
     ```
     (Replace with your actual Render backend URL)
7. **Click**: "Deploy"
8. **Wait** 2-3 minutes
9. **Get Frontend URL**:
   - Your app will be at: `https://spur-ai-chat-agent.vercel.app`
   - Or a custom URL like: `https://spur-ai-chat-agent-[random].vercel.app`
   - **This is your live demo link! Share this! 🎉**

---

## Step 4: Test Your Deployment

1. **Visit your frontend URL**: `https://your-app.vercel.app`
2. **Test the chat**:
   - Ask: "What's your return policy?"
   - Verify it works end-to-end
3. **Check backend logs** on Render if there are issues
4. **Check frontend logs** on Vercel if there are issues

---

## Important Notes

### Free Tier Limitations

**Render Backend:**
- Sleeps after 15 minutes of inactivity
- First request after sleep takes ~30 seconds
- Limited to 750 hours/month

**Supabase Database:**
- 500MB storage
- 50,000 monthly active users
- Perfect for development/demos

**Vercel Frontend:**
- Unlimited personal projects
- Fast global CDN
- No sleeping

### If Backend is Slow
- Free tier Render has cold starts
- First request takes time
- Subsequent requests are fast

### Database Connection
- Supabase connection string format: `postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres`
- Make sure to replace `[PASSWORD]` with your actual password

---

## Troubleshooting

### Backend won't start
- Check environment variables are all set
- Verify DATABASE_URL is correct
- Check Render logs for errors

### Frontend can't connect to backend
- Verify VITE_API_URL is correct in Vercel
- Check backend URL works (visit it in browser)
- Check CORS settings (should work automatically)

### Database connection fails
- Verify Supabase connection string
- Check password is correct in connection string
- Verify database is running in Supabase dashboard

---

## After Deployment

✅ **Share these links:**
- GitHub: https://github.com/shubhangam2003/spur-ai-chat-agent
- Live Demo: https://your-app.vercel.app

✅ **For assignment submission:**
- Include both GitHub link and live demo link
- Mention it's deployed and working
- Note free tier limitations if relevant

---

**Ready to start? Begin with Step 1 (Supabase Database)!**

