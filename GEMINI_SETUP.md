# Google Gemini API Setup (Free Tier)

## 🎉 Why Gemini?

- ✅ **Free tier available** - No credits required!
- ✅ Generous rate limits
- ✅ Good quality responses
- ✅ Easy to set up

## 🔑 Step 1: Get Your Gemini API Key

1. **Go to Google AI Studio:**
   - Visit: https://makersuite.google.com/app/apikey
   - Or: https://aistudio.google.com/app/apikey

2. **Sign in with your Google account**
   - Use any Google account (Gmail, etc.)

3. **Create API Key:**
   - Click "Create API Key"
   - Select "Create API key in new project" (or use existing project)
   - Copy the API key (starts with `AIza...`)

4. **That's it!** No payment method or credits needed for the free tier.

## ⚙️ Step 2: Update Your .env File

Open `backend/.env` and add:

```env
GEMINI_API_KEY=AIza-your-actual-api-key-here
LLM_PROVIDER=gemini
```

**Or replace the existing OPENAI_API_KEY section with:**

```env
# LLM API Configuration - Using Gemini (Free)
GEMINI_API_KEY=AIza-your-actual-api-key-here
LLM_PROVIDER=gemini
```

## 🚀 Step 3: Restart Backend

1. Stop your backend server (Ctrl+C)
2. Start it again:
   ```powershell
   cd backend
   npm run dev
   ```

## ✅ Step 4: Test It!

1. Refresh your browser
2. Try asking: "What's your return policy?"
3. It should work without any rate limit errors!

## 📊 Gemini Free Tier Limits

- **60 requests per minute** (much better than OpenAI free tier!)
- **1,500 requests per day**
- No payment method required
- Perfect for testing and development

## 🔄 Switching Back to OpenAI

If you want to use OpenAI instead:

1. Set `LLM_PROVIDER=openai` in `.env`
2. Make sure `OPENAI_API_KEY` is set
3. Restart the backend

## 🐛 Troubleshooting

### Error: "Gemini API key is required"

**Solution:** Make sure you:
- Added `GEMINI_API_KEY` to `backend/.env`
- Copied the full API key (starts with `AIza`)
- Restarted the backend server

### Error: "API authentication failed"

**Solution:**
- Double-check your API key is correct
- Make sure there are no extra spaces
- Verify the key starts with `AIza`

### Still Getting Rate Limits?

**Solution:**
- Wait 1-2 seconds between requests
- Gemini free tier allows 60 requests/minute, so you should be fine
- If you hit limits, wait 60 seconds and try again

## 🎯 That's It!

Your app should now work with Gemini's free tier. No credits needed! 🎉

