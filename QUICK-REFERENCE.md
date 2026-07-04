# Quick Reference Guide 📋

## Start Backend (Do This First!)

```bash
# Navigate to backend folder
cd ~/Desktop/Big_data/Portfolio/backend

# Install dependencies (first time only)
npm install

# Start server
npm start

# Expected output:
# 🚀 Backend running on http://localhost:3000
# 📋 Resume chunks loaded: 15
# 💬 Chat endpoint: POST http://localhost:3000/api/chat
```

## Configure Backend (First Time Only)

```bash
# Copy example environment file
cp .env.example .env

# Edit with your API key
nano .env

# Should contain:
# GEMINI_API_KEY=your_key_from_https://ai.google.dev/
# PORT=3000

# Also edit your resume
nano resume.txt
# Replace placeholder with your actual resume
```

## Test Server is Working

```bash
# Check health
curl http://localhost:3000/api/health

# Should return:
# {
#   "status": "ok",
#   "resumeChunksLoaded": 15,
#   "apiKey": "configured"
# }

# Test chat
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What do you do?", "context": {}}'
```

## Use the Chatbot

1. Backend must be running: `npm start` (in backend folder)
2. Open portfolio in browser (file:// or localhost)
3. Click **"💬 Chat"** button
4. Type question: *"Tell me about React"*
5. Get AI response based on YOUR resume ✅

## Update Your Resume

```bash
# Edit resume file
nano backend/resume.txt

# Save and restart server
npm start
```

**Note:** Changes take effect immediately on restart!

## Stop Server

```bash
# Press CTRL+C in terminal
# or

pkill -f "node server.js"
```

## Common Issues

### Port 3000 Already in Use
```bash
# Kill process using port 3000
lsof -i :3000
kill -9 <PID>
```

### API Key Error
```bash
# Check .env file has correct key
cat .env

# Verify key format (should be long string)
echo $GEMINI_API_KEY
```

### Resume Not Loading
```bash
# Check file exists
ls -la backend/resume.txt

# Check it has content
wc -l backend/resume.txt  # should have many lines

# Restart server to reload
npm start
```

## View Backend Logs

```bash
# Start with debug output
npm run dev

# Press CTRL+C to stop
```

## Git Operations

```bash
# Check status
git status

# Add all changes
git add -A

# Commit
git commit -m "Your message here"

# Push to GitHub
git push origin main

# View history
git log --oneline -5
```

## Important Files

| File | Purpose |
|------|---------|
| `backend/server.js` | Backend logic |
| `backend/package.json` | Dependencies |
| `backend/.env` | YOUR SECRETS (never commit!) |
| `backend/resume.txt` | YOUR resume |
| `app.js` | Chatbot frontend (no changes needed) |
| `.gitignore` | Prevents committing secrets |

## Environment Variable

```bash
# Must be in backend/.env
GEMINI_API_KEY=your_key_here

# Get free key: https://ai.google.dev/
# Paste in .env file
```

## Deploy to Vercel (Optional)

```bash
# Install vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
cd ~/Desktop/Big_data/Portfolio/backend
vercel

# Follow prompts
# Add GEMINI_API_KEY in Vercel dashboard
# Done!
```

## Documentation Files

- **SETUP.md** - Full setup guide
- **RAG-INTEGRATION.md** - RAG theory & options
- **RAG-EXPLAINED.md** - Visual architecture
- **IMPLEMENTATION-SUMMARY.md** - Complete overview
- **backend/README.md** - Backend details
- **This file** - Quick commands

## Before You Start

- [ ] Get Gemini API key from https://ai.google.dev/
- [ ] Have your resume ready
- [ ] Node.js installed: `node --version`
- [ ] npm installed: `npm --version`

## One-Time Setup Checklist

- [ ] `cd backend && npm install`
- [ ] `cp .env.example .env`
- [ ] Add GEMINI_API_KEY to .env
- [ ] Edit resume.txt with your resume
- [ ] Run `npm start`
- [ ] Test chatbot

## Daily Usage

```bash
# Every time you want to use it:
cd ~/Desktop/Big_data/Portfolio/backend
npm start

# Then open portfolio and click "💬 Chat"
# Stop with CTRL+C when done
```

## Fast Reference

```bash
# Start
cd backend && npm start

# Test
curl http://localhost:3000/api/health

# Stop
CTRL+C

# Update resume
nano backend/resume.txt
# Then npm start again

# Deploy
vercel
```

---

**Need help?** Check SETUP.md or IMPLEMENTATION-SUMMARY.md
