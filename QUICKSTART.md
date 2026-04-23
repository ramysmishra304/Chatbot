# 🌍 Travel Planner Chatbot - Quick Start Guide

## ⚡ 5-Minute Setup

### Step 1: Get API Key (2 minutes)
1. Go to: https://makersuite.google.com/app/apikey
2. Sign in with Google
3. Click "Create API Key"
4. Copy the key

### Step 2: Deploy to Vercel (3 minutes)
1. Push your project to GitHub
2. Go to https://vercel.com/new
3. Import your repository
4. Click "Settings" → "Environment Variables"
5. Add:
   - **Name**: `GEMINI_API_KEY`
   - **Value**: Paste your API key
6. Redeploy
7. Done! Your chatbot is live 🎉

---

## 📁 Files Overview

| File | Purpose |
|------|---------|
| `index.html` | Chat layout & structure |
| `style.css` | Modern styling & responsive design |
| `script.js` | API integration & chat logic |
| `.env.example` | Environment variables template |
| `vercel.json` | Vercel deployment config |
| `DEPLOYMENT.md` | Detailed setup guide |
| `README.md` | Project overview |

---

## 🎯 What This App Does

✅ Chat interface with typing animation  
✅ Travel planning (destinations, itineraries, budgets)  
✅ Hotel & flight recommendations  
✅ Responsive design (mobile + desktop)  
✅ Powered by Google's Gemini API  
✅ Environment variable support (Vercel ready)  

---

## 🔧 Local Testing

### Without API Key
1. Open `index.html` in browser
2. See chat interface working
3. Can't send messages (needs API key)

### With Local API Key
1. Create `.env` file with:
   ```
   GEMINI_API_KEY=your_key_here
   ```
2. Use a local server (Python, Node, etc.)
3. Messages should work

---

## 🚀 Vercel Deployment Steps

### Option 1: GitHub Integration (Recommended)

```bash
# 1. Initialize Git
git init
git add .
git commit -m "Initial commit"

# 2. Create GitHub repo and push
git remote add origin https://github.com/yourusername/chatbot-repo.git
git push -u origin main
```

Then on Vercel.com:
- Click "New Project"
- Select GitHub repo
- Add `GEMINI_API_KEY` environment variable
- Deploy!

### Option 2: Deploy Button
(If you set this up with a deploy button in README)

Click the deploy button and follow prompts.

---

## ⚙️ Configuration

### Change Bot Behavior
Edit `SYSTEM_PROMPT` in `script.js` (line ~20)

### Change Colors
Edit `:root` variables in `style.css` (line ~8)

### Add More Quick Buttons
Add more `quick-action-btn` buttons in `index.html`

---

## 🔐 Security Note

**API key is visible in frontend code.**

✅ OK for: Personal projects, demos  
❌ NOT OK for: Public production apps  

**For production:** Create backend proxy to hide API key.

---

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| "API Key Not Configured" | Add `GEMINI_API_KEY` to Vercel environment variables |
| Messages not sending | Check API key is valid at makersuite.google.com |
| Missing icons | Font Awesome CDN might be blocked |
| Styling broken | Verify `style.css` path is correct |

---

## 📞 Quick Links

- **Gemini API Docs**: https://ai.google.dev/docs
- **Get API Key**: https://makersuite.google.com/app/apikey
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Font Awesome Icons**: https://fontawesome.com

---

## 🎨 Customization Ideas

- Change color scheme (primary, secondary colors)
- Add different travel destinations in quick buttons
- Modify system prompt for different assistant personalities
- Add more travel-related features
- Integrate with real flight/hotel APIs
- Add user authentication
- Export itineraries as PDF

---

## ✨ What's Included

✅ Clean, modern UI (ChatGPT-style)  
✅ Travel-themed design with gradients  
✅ Fully responsive (mobile-first)  
✅ Typing animation for bot  
✅ Message history & scrolling  
✅ Quick action buttons  
✅ Clear chat functionality  
✅ Smooth animations  
✅ Well-commented code  
✅ Production-ready  

---

## 📖 Learn More

See `DEPLOYMENT.md` for:
- Detailed setup instructions
- Troubleshooting guide
- Security best practices
- Future enhancement ideas
- Backend migration guide

---

**Ready to go? Open `index.html` and start exploring! 🚀**
