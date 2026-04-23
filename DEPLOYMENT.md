# Travel Planner Chatbot - Setup & Deployment Guide

## 📋 Project Overview

A modern, responsive AI-powered travel planner chatbot built with vanilla HTML, CSS, and JavaScript. Uses Google's Gemini API to provide intelligent travel planning assistance.

### Features
- ✅ Clean, modern chat interface (ChatGPT-style)
- ✅ Travel-themed design with soft colors
- ✅ Fully responsive (mobile, tablet, desktop)
- ✅ Typing animation for bot responses
- ✅ Scrollable chat history
- ✅ Quick action buttons
- ✅ Clear chat functionality
- ✅ Message animations
- ✅ Gemini API integration
- ✅ Environment variable support (Vercel ready)

---

## 🚀 Quick Start

### 1. **Get Gemini API Key**

1. Visit: https://makersuite.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

### 2. **Local Development**

#### Option A: Using .env File (for local testing)

1. Clone/download this project
2. Create a `.env` file in the project root:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```
3. Open `index.html` in your browser
4. Start chatting!

#### Option B: Direct Testing
1. Simply open `index.html` in your browser
2. When prompted, the app will ask you to configure the API key

### 3. **Deploy to Vercel** (Recommended)

#### Step-by-Step Vercel Deployment:

1. **Prepare your repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Travel Planner Chatbot"
   ```

2. **Push to GitHub**
   - Create a new GitHub repository
   - Push your code to GitHub
   - (Skip if using Vercel Git import directly)

3. **Deploy to Vercel**
   - Go to https://vercel.com
   - Click "New Project"
   - Import your GitHub repository OR use "Create Git Repository"
   - Configure project:
     - **Framework Preset**: Other (it's a static site)
     - **Root Directory**: `.`
     - **Build Command**: (leave empty - it's a static site)
     - **Output Directory**: `.`

4. **Add Environment Variable**
   - In Vercel project settings:
     - Click "Settings" → "Environment Variables"
     - Add new variable:
       - **Name**: `GEMINI_API_KEY`
       - **Value**: Your Gemini API key
       - **Environments**: Check Production, Preview, and Development
     - Save

5. **Redeploy**
   - Vercel will automatically redeploy with the new environment variable
   - Your chatbot will now work with Gemini API!

---

## 📁 File Structure

```
project-root/
├── index.html          # Main HTML layout & structure
├── style.css           # Styling & responsive design
├── script.js           # JavaScript logic & API integration
├── .env.example        # Example environment variables
└── DEPLOYMENT.md       # This file
```

### File Descriptions

**index.html**
- Chat window with message display area
- Input field and send button
- Quick action buttons
- Header with clear chat button
- Responsive layout

**style.css**
- Modern gradient design
- Travel-themed color scheme
- Responsive grid & flexbox layout
- Mobile-first approach
- Smooth animations
- Dark mode support
- Custom scrollbar styling

**script.js**
- Message handling and UI updates
- Gemini API integration via fetch()
- Typing indicator animation
- Conversation history management
- HTML formatting for responses
- Environment variable support

---

## 🔧 Configuration

### Environment Variables

The project uses environment variables for API key management:

```javascript
// In script.js
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
```

### For Vercel Deployment

Environment variables are automatically available as `process.env.VARIABLE_NAME` during build and runtime.

**To add environment variables in Vercel:**

1. Go to Project Settings
2. Select "Environment Variables"
3. Add `GEMINI_API_KEY`
4. Apply to all environments
5. Redeploy

### For Local Testing

Create a `.env` file (not committed to Git):
```
GEMINI_API_KEY=sk-...your-key...
```

---

## 💡 How It Works

### API Integration Flow

```
User Input
    ↓
JavaScript captures message
    ↓
Send to Gemini API via fetch()
    ↓
API Key from environment variable
    ↓
Gemini API generates response
    ↓
Parse and format response
    ↓
Display in chat UI
```

### Message Flow

1. User types message and clicks send
2. Message added to conversation history
3. Typing indicator shown
4. Request sent to Gemini API with:
   - System prompt (travel planner context)
   - Conversation history
   - User message
5. Response received and formatted
6. Displayed in chat with timestamp
7. Added to conversation history

---

## 🎨 Customization

### Change Colors

Edit the CSS variables in `style.css`:

```css
:root {
    --primary-color: #6366f1;
    --secondary-color: #10b981;
    --accent-color: #f59e0b;
    /* ... more colors ... */
}
```

### Modify System Prompt

Edit `SYSTEM_PROMPT` in `script.js` to change bot behavior:

```javascript
const SYSTEM_PROMPT = `You are an expert Travel Planner...`;
```

### Add More Quick Actions

In `index.html`, add more buttons:

```html
<button class="quick-action-btn" data-action="Your prompt here">
    <i class="fas fa-icon"></i>
    <span>Button Label</span>
</button>
```

### Change API Model

The project uses Gemini 1.5 Flash. To use other models:

```javascript
// In script.js, modify the API URL:
const url = `...models/gemini-pro:generateContent...`;
```

---

## 🔐 Security Considerations

### ⚠️ Important: API Key Exposure

**Current Implementation:**
- API key is exposed in frontend code
- Any user can see your API key in browser DevTools
- Anyone with the key can use your quota

**Acceptable For:**
- Personal/hobby projects
- Low-traffic applications
- Development/testing

**Not Recommended For:**
- Public production apps
- High-traffic websites
- Sensitive applications

### Recommended: Backend Proxy

For production apps, implement a backend:

```
Frontend → Your Backend → Gemini API
```

**Benefits:**
- API key stays private
- Rate limiting & authentication
- Request logging & monitoring
- Cost control

### Upgrading to Backend

The code is structured for easy backend migration:

1. Keep HTML/CSS/JS interface as-is
2. Create backend endpoint (Node.js/Python/etc.)
3. Change API call in `script.js`:

```javascript
// Instead of calling Gemini directly:
const response = await fetch('/api/chat', {
    method: 'POST',
    body: JSON.stringify({ message: userMessage })
});
```

---

## 📱 Responsive Design

The chatbot is fully responsive:

- **Desktop** (1200px+): Optimized layout
- **Tablet** (768px - 1199px): Adjusted spacing
- **Mobile** (480px - 767px): Single column, touch-friendly
- **Small Mobile** (<480px): Compact everything

### Testing on Mobile

1. Open in Chrome DevTools (F12)
2. Click device toolbar icon
3. Select device or custom size
4. Test interaction

---

## 🐛 Troubleshooting

### "API Key is not configured" Error

**Problem**: API key not found

**Solutions**:
1. In Vercel: Check Settings → Environment Variables
2. Verify variable name is exactly: `GEMINI_API_KEY`
3. Redeploy after adding variable
4. Check all environments (Production, Preview, Dev)

### API Requests Failing

**Problem**: Getting 400/401 errors

**Solutions**:
1. Verify API key is valid at https://makersuite.google.com
2. Check Gemini API is enabled in Google Cloud
3. Ensure you have API quota available
4. Check browser console for exact error

### Messages Not Sending

**Problem**: Send button not working

**Solutions**:
1. Check browser console for JavaScript errors
2. Verify API key is configured
3. Try clearing browser cache
4. Check internet connection
5. Restart browser

### Styling Issues

**Problem**: Missing icons or broken layout

**Solutions**:
1. Font Awesome CDN might be blocked
   - Check browser console for errors
   - Use alternative icon library
2. CSS not loading
   - Verify `style.css` is in same directory as `index.html`
   - Clear browser cache (Ctrl+Shift+Del)

---

## 🎯 Future Enhancements

Potential improvements:

- [ ] Backend API proxy for security
- [ ] User authentication & saved trips
- [ ] Database for chat history
- [ ] Multiple AI model support
- [ ] Image generation for destinations
- [ ] Integration with travel booking APIs
- [ ] Real-time flight/hotel data
- [ ] PDF itinerary export
- [ ] Dark mode toggle button
- [ ] Voice input/output
- [ ] Multi-language support
- [ ] Analytics tracking

---

## 📄 License

This project is open source and free to use, modify, and distribute.

---

## 🤝 Support

**For API Issues**: https://ai.google.dev/docs
**For Vercel Help**: https://vercel.com/docs
**For Font Awesome Icons**: https://fontawesome.com/search

---

## 📚 Resources

- [Gemini API Documentation](https://ai.google.dev/)
- [Vercel Deployment Guide](https://vercel.com/docs)
- [MDN Web Docs - Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [CSS Grid Guide](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout)
- [Responsive Design](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)

---

**Happy travels! 🌍✈️**

Last Updated: April 2026
