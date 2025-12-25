# How to Set Up Your OpenAI API Key

## ⚠️ Current Issue

Your `backend/.env` file still has the placeholder value:
```
OPENAI_API_KEY=your_openai_api_key_here
```

You need to replace this with your actual OpenAI API key.

## 🔑 Step-by-Step: Get Your OpenAI API Key

### 1. Go to OpenAI Platform
Visit: **https://platform.openai.com/api-keys**

### 2. Sign In or Create Account
- If you don't have an account, create one (it's free to sign up)
- You'll need to add a payment method to use the API (they have pay-as-you-go pricing)

### 3. Create an API Key
1. Click **"Create new secret key"**
2. Give it a name (e.g., "Spur Assignment")
3. Click **"Create secret key"**
4. **⚠️ IMPORTANT:** Copy the key immediately - you won't be able to see it again!
   - It will look like: `sk-abc123def456ghi789...`

### 4. Add Credits (If Needed)
- Go to: https://platform.openai.com/account/billing
- Add payment method and credits
- You'll need at least $5-10 to test the application

## ✏️ Update Your .env File

### Option 1: Edit in VS Code/Your Editor

1. Open `backend/.env` file
2. Find this line:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```
3. Replace `your_openai_api_key_here` with your actual key:
   ```
   OPENAI_API_KEY=sk-abc123def456ghi789...
   ```
4. Save the file

### Option 2: Edit via PowerShell

```powershell
# Open the file in notepad
notepad .\backend\.env
```

Then replace `your_openai_api_key_here` with your actual API key and save.

### Option 3: Use PowerShell to Replace (Advanced)

```powershell
# Read the file
$content = Get-Content .\backend\.env

# Replace the placeholder (replace 'sk-your-actual-key' with your real key)
$content = $content -replace 'OPENAI_API_KEY=your_openai_api_key_here', 'OPENAI_API_KEY=sk-your-actual-key-here'

# Write back
$content | Set-Content .\backend\.env
```

## ✅ Verify Your Setup

After updating the `.env` file:

1. **Restart your backend server** (important - it needs to reload the .env file)
   - Stop the current server (Ctrl+C)
   - Start it again: `cd backend; npm run dev`

2. **Check the output** - you should see:
   ```
   Database tables created/verified
   Server running on http://localhost:3000
   ```
   (No more API key errors!)

## 🧪 Test It

1. Start your backend: `cd backend; npm run dev`
2. Start your frontend: `cd frontend; npm run dev`
3. Open http://localhost:5173
4. Try asking: "What's your return policy?"
5. You should get a response from the AI!

## 💰 Cost Information

- **GPT-3.5-turbo** (what we're using) is very affordable
- Approximately $0.001-0.002 per message
- For testing this assignment, you'll likely spend less than $1
- You can set usage limits in your OpenAI account settings

## 🔒 Security Reminder

- ✅ The `.env` file is in `.gitignore` - it won't be committed to Git
- ✅ Never share your API key publicly
- ✅ Don't commit `.env` files to version control
- ✅ If you accidentally share your key, revoke it and create a new one

## 🐛 Troubleshooting

### Error: "API authentication failed"

**Solutions:**
- Double-check your API key is correct (starts with `sk-`)
- Make sure there are no extra spaces in the `.env` file
- Verify you have credits in your OpenAI account
- Restart the backend server after changing `.env`

### Error: "You exceeded your current quota"

**Solution:**
- Add credits to your OpenAI account
- Go to: https://platform.openai.com/account/billing

### Still Getting "OPENAI_API_KEY is missing"

**Solutions:**
1. Make sure the file is named exactly `.env` (not `env.txt` or `.env.txt`)
2. Make sure it's in the `backend` folder (not the root)
3. Restart the backend server after creating/editing the file
4. Check for typos in the variable name: `OPENAI_API_KEY` (all caps, with underscores)

## 📝 Example .env File

Your `backend/.env` should look like this (with your actual API key):

```env
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/spur_chat
OPENAI_API_KEY=sk-proj-abc123def456ghi789jkl012mno345pqr678stu901vwx234yz
MAX_MESSAGE_LENGTH=2000
MAX_TOKENS=500
MAX_MESSAGES_PER_SESSION=50
```

Notice the `OPENAI_API_KEY` has a real key (starting with `sk-`), not the placeholder!

