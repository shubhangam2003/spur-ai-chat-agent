# Gemini API 404 Error - Troubleshooting Guide

## The Problem

You're getting: `404 Not Found - models/gemini-pro is not found`

This means the API can't find the model, which usually indicates:

1. **The Generative Language API is not enabled** in your Google Cloud project
2. **The API key doesn't have the right permissions**
3. **The model name format is incorrect**

## Solution Steps

### Step 1: Enable the Generative Language API

1. **Go to Google Cloud Console:**
   - Visit: https://console.cloud.google.com/apis/library
   - Sign in with the same Google account you used for the API key

2. **Search for "Generative Language API"**
   - Type "Generative Language API" in the search box
   - Click on it

3. **Enable the API:**
   - Click the "Enable" button
   - Wait for it to enable (usually takes a few seconds)

### Step 2: Verify Your API Key

1. **Go to Google AI Studio:**
   - Visit: https://aistudio.google.com/app/apikey

2. **Check your API key:**
   - Make sure it's active
   - Copy it again if needed
   - Update it in `backend/.env`

### Step 3: Alternative - Use a Different API Key Source

If you created the API key from Google AI Studio, it should work. But if it doesn't:

1. **Create a new API key from Google Cloud Console:**
   - Go to: https://console.cloud.google.com/apis/credentials
   - Click "Create Credentials" → "API Key"
   - Copy the new key
   - Update `backend/.env` with the new key

2. **Restrict the API key (optional but recommended):**
   - Click on the API key
   - Under "API restrictions", select "Restrict key"
   - Choose "Generative Language API"
   - Save

### Step 4: Test the API Key

After enabling the API, restart your backend and try again.

## Quick Check

Run this in your backend terminal to test:

```powershell
cd backend
node -e "const {GoogleGenerativeAI} = require('@google/generative-ai'); const genAI = new GoogleGenerativeAI('YOUR_API_KEY'); const model = genAI.getGenerativeModel({model: 'gemini-pro'}); model.generateContent('Hello').then(r => console.log(r.response.text())).catch(e => console.error(e));"
```

Replace `YOUR_API_KEY` with your actual key.

## Common Issues

### Issue: "API not enabled"
**Solution:** Enable Generative Language API in Google Cloud Console

### Issue: "Invalid API key"
**Solution:** 
- Check the key is correct
- Make sure no extra spaces
- Try creating a new key

### Issue: "Permission denied"
**Solution:**
- Check API key has access to Generative Language API
- Make sure billing is enabled (even if free tier)

## Still Not Working?

If after enabling the API it still doesn't work:

1. **Wait 5-10 minutes** - API enablement can take time to propagate
2. **Try a new API key** - Create a fresh one from Google Cloud Console
3. **Check billing** - Even free tier requires billing account setup
4. **Verify the project** - Make sure API key and API are in the same project

## Alternative: Use OpenAI Instead

If Gemini continues to have issues, you can switch back to OpenAI:

1. Update `backend/.env`:
   ```env
   OPENAI_API_KEY=your_openai_key
   LLM_PROVIDER=openai
   ```

2. Restart backend

But Gemini should work once the API is enabled! 🚀

