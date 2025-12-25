# Deployment Checklist

Use this checklist to track your deployment progress.

## 📋 Pre-Deployment Checklist

- [ ] GitHub repository is up to date
- [ ] All code is committed and pushed
- [ ] .env files are NOT committed (checked .gitignore)
- [ ] Backend builds successfully (`npm run build` in backend folder)
- [ ] Frontend builds successfully (`npm run build` in frontend folder)
- [ ] Gemini API key is ready
- [ ] Local version works correctly

---

## 🗄️ Step 1: Database (Supabase)

- [ ] Created Supabase account
- [ ] Created new project
- [ ] Saved database password
- [ ] Copied connection string (URI format)
- [ ] Tested connection string format
- [ ] Connection string saved securely

**Connection String Format:**
```
postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
```

**Supabase Dashboard:** https://supabase.com/dashboard

---

## 🔧 Step 2: Backend (Render)

- [ ] Created Render account
- [ ] Connected GitHub repository
- [ ] Created new Web Service
- [ ] Configured settings:
  - [ ] Name: `spur-chat-backend`
  - [ ] Root Directory: `backend`
  - [ ] Build Command: `npm install && npm run build`
  - [ ] Start Command: `npm start`
- [ ] Added environment variables:
  - [ ] `PORT=3000`
  - [ ] `NODE_ENV=production`
  - [ ] `DATABASE_URL` (from Supabase)
  - [ ] `LLM_PROVIDER=gemini`
  - [ ] `GEMINI_API_KEY` (your key)
  - [ ] `MAX_MESSAGE_LENGTH=2000`
  - [ ] `MAX_TOKENS=1000`
  - [ ] `MAX_MESSAGES_PER_SESSION=50`
- [ ] Deployment started
- [ ] Deployment successful (green status)
- [ ] Backend URL copied: `https://spur-chat-backend.onrender.com`
- [ ] Backend health check works: `https://your-backend.onrender.com/health`

**Render Dashboard:** https://dashboard.render.com

---

## 🎨 Step 3: Frontend (Vercel)

- [ ] Created Vercel account
- [ ] Connected GitHub repository
- [ ] Imported project
- [ ] Configured settings:
  - [ ] Framework: Vite
  - [ ] Root Directory: `frontend`
  - [ ] Build Command: `npm run build` (default)
  - [ ] Output Directory: `dist` (default)
- [ ] Added environment variable:
  - [ ] `VITE_API_URL` = your Render backend URL
- [ ] Deployment started
- [ ] Deployment successful
- [ ] Frontend URL copied: `https://your-app.vercel.app`
- [ ] Frontend loads correctly

**Vercel Dashboard:** https://vercel.com/dashboard

---

## ✅ Step 4: Testing

- [ ] Visited frontend URL in browser
- [ ] Chat interface loads
- [ ] Can send a message
- [ ] AI responds correctly
- [ ] No console errors
- [ ] No network errors
- [ ] Database connection works (messages persist)
- [ ] All features work as expected

---

## 🔗 Final Links

**Save these links:**

- **GitHub Repository:**
  ```
  https://github.com/shubhangam2003/spur-ai-chat-agent
  ```

- **Live Demo URL:**
  ```
  https://your-app.vercel.app
  ```

- **Backend API URL:**
  ```
  https://your-backend.onrender.com
  ```

---

## 📝 Notes

### Deployment URLs
- Backend: _______________________________
- Frontend: _______________________________
- Database: Supabase project

### Environment Variables Used
- DATABASE_URL: [starts with postgresql://]
- GEMINI_API_KEY: [starts with AIzaSy...]
- VITE_API_URL: [your Render backend URL]

### Issues Encountered
- [ ] Any issues? Note them here:

---

## 🎉 Success!

Once all checkboxes are checked:
- ✅ Your app is live!
- ✅ Share the frontend URL
- ✅ Include both GitHub and live links in submission

---

**Need help?** Check `DEPLOYMENT_STEPS.md` for detailed instructions.

