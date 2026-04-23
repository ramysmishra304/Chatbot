# 🏗️ Technical Documentation - Travel Planner Chatbot

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                   BROWSER (Client-Side)                 │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌──────────────────────────────────────────────────┐   │
│  │           HTML/CSS/JavaScript UI                │   │
│  │  ├── Chat Messages Display                      │   │
│  │  ├── Input Field & Send Button                  │   │
│  │  ├── Quick Action Buttons                       │   │
│  │  └── Header with Clear Chat                     │   │
│  └──────────────────────────────────────────────────┘   │
│                      │                                   │
│                      ▼                                   │
│  ┌──────────────────────────────────────────────────┐   │
│  │        JavaScript Logic (script.js)              │   │
│  │  ├── Message Handling                           │   │
│  │  ├── API Integration                            │   │
│  │  ├── Conversation History                       │   │
│  │  └── UI Updates & Animations                    │   │
│  └──────────────────────────────────────────────────┘   │
│                      │                                   │
│                      ▼                                   │
│  ┌──────────────────────────────────────────────────┐   │
│  │        Environment Variables                    │   │
│  │  └── process.env.GEMINI_API_KEY                 │   │
│  └──────────────────────────────────────────────────┘   │
│                      │                                   │
│                      ▼                                   │
│            FETCH API (HTTP Request)                     │
│                      │                                   │
└──────────────────────┼──────────────────────────────────┘
                       │
        ┌──────────────▼──────────────┐
        │   GEMINI API (External)     │
        │  ├── Receive Request        │
        │  ├── Process with LLM       │
        │  └── Return Response        │
        └──────────────┬──────────────┘
                       │
        ┌──────────────▼──────────────┐
        │   Response (JSON)           │
        │  └── AI-Generated Text      │
        └──────────────┬──────────────┘
                       │
        ┌──────────────▼──────────────┐
        │   Browser (Display)         │
        │  ├── Parse Response         │
        │  ├── Format HTML            │
        │  └── Update Chat UI         │
        └────────────────────────────┘
```

## File Structure & Responsibilities

### index.html
**Purpose**: DOM structure and semantic layout

**Key Components**:
```
├── Head
│   ├── Meta tags (viewport, charset)
│   ├── CSS link (style.css)
│   └── Font Awesome Icons CDN
│
├── Body
│   └── app-container
│       ├── Header (title, clear button)
│       ├── Main (messages area, quick actions)
│       └── Footer (input area, disclaimer)
└── Script Link (script.js)
```

**Elements**:
- `#messagesArea` - Container for chat messages
- `#userInput` - Text input field
- `#sendBtn` - Send button
- `#clearChatBtn` - Clear history button
- `.quick-action-btn` - Quick action buttons
- `chat-header`, `chat-container`, `input-area` - Main sections

### style.css
**Purpose**: Styling, layout, and responsive design

**Organization**:
```
1. CSS Variables (:root)
   ├── Colors (primary, secondary, neutral)
   ├── Spacing (xs, sm, md, lg, xl)
   ├── Border radius
   ├── Shadows
   └── Transitions

2. Base Styles
   ├── Body & general
   └── Scrollbar styling

3. Component Styles
   ├── Header
   ├── Chat container
   ├── Messages
   ├── Input area
   └── Animations

4. Responsive Breakpoints
   ├── Mobile (480px)
   ├── Tablet (768px)
   └── Large (1200px)

5. Utilities
   ├── Dark mode
   └── Print styles
```

**Key Classes**:
- `.app-container` - Main wrapper
- `.message` - Individual message
- `.user-message` / `.bot-message` - Message variants
- `.quick-action-btn` - Action buttons
- `.typing-indicator` - Typing animation

### script.js
**Purpose**: Application logic and API integration

**Major Sections**:

#### 1. Configuration
```javascript
GEMINI_API_KEY      // From environment variable
GEMINI_API_URL      // API endpoint
SYSTEM_PROMPT       // Bot behavior definition
```

#### 2. DOM References
```javascript
messagesArea        // Message display area
userInput           // Input field
sendBtn             // Send button
clearChatBtn        // Clear button
quickActionBtns     // Quick action buttons
```

#### 3. Event Listeners
```javascript
- sendBtn.click()           // Send message
- userInput.keypress()      // Enter to send
- clearChatBtn.click()      // Clear chat
- quickActionBtns.click()   // Quick actions
```

#### 4. Message Flow Functions
```javascript
handleSendMessage()         // Main flow
addMessageToUI()            // Display message
formatBotResponse()         // HTML formatting
showTypingIndicator()       // Animation
```

#### 5. API Integration
```javascript
getGeminiResponse()         // Make API call
getGeminiDirectResponse()   // Gemini endpoint
```

## Data Flow

### User Message → Bot Response

```
1. USER SENDS MESSAGE
   └─ userInput.value = "Plan a trip to Japan"

2. VALIDATION
   ├─ Check message not empty
   ├─ Check not already loading
   └─ Check API key configured

3. PREPARE REQUEST
   ├─ Clear input field
   ├─ Hide quick actions
   └─ Add to conversation history

4. UI UPDATE (Immediate)
   ├─ Display user message
   ├─ Show typing indicator
   └─ Scroll to bottom

5. API REQUEST
   ├─ Build payload:
   │  ├─ System prompt
   │  ├─ Conversation history
   │  └─ New user message
   ├─ Send via fetch()
   ├─ Include API key from process.env
   └─ Wait for response (500-3000ms typically)

6. RESPONSE PROCESSING
   ├─ Parse JSON response
   ├─ Extract text content
   ├─ Format with HTML
   ├─ Remove typing indicator
   └─ Display bot message

7. STATE UPDATE
   ├─ Add to conversation history
   ├─ Re-enable send button
   └─ Scroll to bottom

8. READY FOR NEXT MESSAGE
   └─ User can send another message
```

## API Integration Details

### Gemini API Endpoint

```javascript
// Endpoint
https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent

// Method: POST
// Headers: Content-Type: application/json

// Request Body:
{
    "contents": [
        {
            "role": "user",
            "parts": [{"text": "system prompt..."}]
        },
        // ... conversation history ...
        {
            "role": "user",
            "parts": [{"text": "user message"}]
        }
    ],
    "generationConfig": {
        "temperature": 0.7,
        "maxOutputTokens": 1000,
        "topK": 40,
        "topP": 0.95
    },
    "safetySettings": [ /* safety filters */ ]
}

// Response:
{
    "candidates": [{
        "content": {
            "parts": [{
                "text": "bot response..."
            }],
            "role": "model"
        },
        "finishReason": "STOP"
    }]
}
```

### Error Handling

```javascript
try {
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        // Handle HTTP errors (401, 403, 429, 500, etc.)
        const errorData = await response.json();
        throw new Error(errorData?.error?.message);
    }

    const data = await response.json();
    
    // Extract response text
    const text = data.candidates[0].content.parts[0].text;
    
    // Handle invalid format
    if (!text) throw new Error('Invalid response format');
    
    return text;

} catch (error) {
    // Display error to user
    console.error('API Error:', error);
    addMessageToUI(`Error: ${error.message}`, 'bot');
}
```

## Conversation History Management

### Structure
```javascript
conversationHistory = [
    {
        role: 'user',
        content: 'First question'
    },
    {
        role: 'assistant',
        content: 'First response'
    },
    {
        role: 'user',
        content: 'Follow-up question'
    },
    {
        role: 'assistant',
        content: 'Follow-up response'
    }
]
```

### Usage
- Sent to API on each request for context
- Maintains conversation continuity
- Cleared when user clicks "Clear Chat"
- Limited by API token limits (not enforced in this version)

### Future Optimization
- Implement token counting
- Summarize old conversations
- Save to localStorage
- Persist to database

## Message Formatting

### HTML Sanitization
```javascript
// Input: Raw text from API
"Plan a trip to **Paris**. Visit:\n- Eiffel Tower\n- Louvre Museum"

// Output: Formatted HTML
"Plan a trip to <strong>Paris</strong>. Visit:<ul><li>Eiffel Tower</li><li>Louvre Museum</li></ul>"

// Conversions:
- **text** → <strong>text</strong>
- \n → <br>
- - item → <li>item</li>
- 1. item → <li>item</li>
```

### Why Necessary
- API returns plain text
- Need to format for readability
- Prevent XSS vulnerabilities
- Support markdown-like syntax

## Responsive Design System

### Breakpoints
```css
Mobile:  < 480px   (phones)
Small:   480-768px (large phones, small tablets)
Tablet:  768-1200px (tablets)
Desktop: > 1200px  (desktops, large screens)
```

### Grid System
```css
Quick Actions:
- Desktop: 4 columns (grid-template-columns: repeat(4, 1fr))
- Tablet:  2 columns
- Mobile:  1 column
```

### Message Width
```css
- Desktop: 65% max-width
- Tablet:  75% max-width
- Mobile:  90% max-width
```

## Environment Variable System

### For Vercel

1. **Build Time**
   ```
   Vercel reads .env from project settings
   Injects as process.env.GEMINI_API_KEY
   ```

2. **Runtime**
   ```javascript
   const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
   ```

3. **Usage**
   ```javascript
   const url = `...?key=${GEMINI_API_KEY}`;
   ```

### For Local Development

1. **Create .env**
   ```
   GEMINI_API_KEY=your_key_here
   ```

2. **Local Server Required**
   (Static file won't have access to .env)

3. **Alternatives**
   - Use a bundler (Webpack, Vite)
   - Run local Node.js server
   - Use VS Code Live Server extension

## Security Considerations

### API Key Exposure

**Current State**:
- Key in frontend code
- Visible in browser DevTools
- Available in page source

**Risks**:
- Quota theft
- Cost overruns
- Rate limiting
- Service disruption

**Mitigations**:
1. Use Vercel environment variables (not in code)
2. Set API rate limits in Google Cloud
3. Monitor usage regularly
4. Rotate keys periodically
5. Use IP whitelisting if available

### XSS Prevention

```javascript
// What we DO:
div.innerHTML = "safe formatted text"

// What we DON'T:
div.innerHTML = userInput  // ❌ Never!

// Why:
User input is escaped and controlled
HTML formatting done by our code, not API
```

### CORS Considerations

- Gemini API allows direct browser access
- No CORS proxy needed
- Works with `fetch()` directly
- Some APIs might require backend proxy

## Performance Optimization

### Current
- Minimal dependencies (only Font Awesome)
- Single-page application
- No build step needed
- Fast initial load

### Potential Improvements
1. **Message Caching**
   ```javascript
   localStorage.setItem('chat', JSON.stringify(history));
   ```

2. **Lazy Loading**
   - Load Font Awesome conditionally
   - Defer non-critical images

3. **Response Streaming**
   - Show response as it arrives
   - Better UX for long responses

4. **Compression**
   - Minify CSS/JS
   - Use gzip on Vercel

## Browser Compatibility

### Supported
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

### Not Supported
- IE 11 (ES6 syntax)
- Old Android browsers

### Polyfills Needed
- None for modern browsers
- Optional: For older browsers, add fetch polyfill

## Deployment Checklist

```
[ ] Code complete and tested
[ ] API key obtained
[ ] .gitignore configured
[ ] README complete
[ ] Push to GitHub
[ ] Create Vercel project
[ ] Add environment variable
[ ] Redeploy after env var
[ ] Test on live URL
[ ] Test on mobile
[ ] Share link with others
```

## Monitoring & Maintenance

### Key Metrics
- API response time
- Error rate
- API quota usage
- User count/traffic

### Regular Tasks
- Monitor API usage
- Check error logs
- Update dependencies
- Rotate API key (quarterly)
- Performance review

---

**For deployment instructions**: See [DEPLOYMENT.md](DEPLOYMENT.md)  
**For quick setup**: See [QUICKSTART.md](QUICKSTART.md)  
**For usage guide**: See [README.md](README.md)
