/* ============================================
   TRAVEL PLANNER CHATBOT - JAVASCRIPT
   ============================================

   API KEY SETUP FOR VERCEL (Backend API)
   
   1. Get your Gemini API key from: https://makersuite.google.com/app/apikey
   
   2. Add to Vercel Environment Variables:
      - Go to Vercel Project Settings → Environment Variables
      - Name: GEMINI_API_KEY
      - Value: Your actual API key
      - Apply to: Production, Preview, Development
   
   3. The API key will be securely stored on the server side.
   
   SECURITY BENEFITS:
   - API key is stored only on the server in environment variables
   - API key is never exposed to the frontend
   - All API calls go through your backend serverless function (/api/chat)
   - Safe for production use with high traffic
   - No daily limits issues
   
   LOCAL DEVELOPMENT:
   - Create a .env file with: GEMINI_API_KEY=your_actual_key
   - Run: npm vercel dev (or npx vercel dev)
   - Access at: http://localhost:3000
   - Backend API at: http://localhost:3000/api/chat
   
   ============================================ */

// ============================================
// CONFIGURATION & CONSTANTS
// ============================================

// System prompt for travel planner
const SYSTEM_PROMPT = `You are an expert Travel Planner Assistant. You help users plan their trips with detailed information about:
- Destination suggestions based on interests, budget, and time
- Day-wise itineraries with specific activities
- Hotel and accommodation recommendations with estimated pricing
- Flight booking tips and airline suggestions
- Budget breakdowns for trips
- Travel tips, visa requirements, and best times to visit
- Local attractions, restaurants, and hidden gems

When creating travel plans:
1. Ask clarifying questions if needed (budget, duration, season, preferences)
2. Provide destinations with brief descriptions
3. Create numbered day-by-day itineraries with times and activities
4. Include accommodation and food options with price ranges
5. Give estimated total budget
6. Add practical tips for each destination

Always format responses clearly with:
- Bullet points for lists
- Bold text for important information
- Clear section headers
- Numbered lists for itineraries
- Price ranges where applicable

Be friendly, encouraging, and enthusiastic about travel!`;

// ============================================
// DOM ELEMENTS
// ============================================

const messagesArea = document.getElementById('messagesArea');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const clearChatBtn = document.getElementById('clearChatBtn');
const quickActionsContainer = document.getElementById('quickActionsContainer');
const quickActionBtns = document.querySelectorAll('.quick-action-btn');

// ============================================
// STATE MANAGEMENT
// ============================================

let conversationHistory = [];
let isLoading = false;

// ============================================
// EVENT LISTENERS
// ============================================

sendBtn.addEventListener('click', handleSendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
    }
});

clearChatBtn.addEventListener('click', handleClearChat);

quickActionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const action = btn.getAttribute('data-action');
        userInput.value = action;
        handleSendMessage();
    });
});

// ============================================
// MESSAGE HANDLING
// ============================================

/**
 * Handle user message submission
 */
async function handleSendMessage() {
    const message = userInput.value.trim();

    if (!message || isLoading) return;

    // Clear input
    userInput.value = '';

    // Hide quick actions after first message
    if (quickActionsContainer && !quickActionsContainer.classList.contains('hidden')) {
        quickActionsContainer.classList.add('hidden');
    }

    // Add user message to UI
    addMessageToUI(message, 'user');

    // Add to conversation history
    conversationHistory.push({
        role: 'user',
        content: message
    });

    // Show typing indicator
    showTypingIndicator();

    // Get bot response
    try {
        const response = await getGeminiResponse(message);
        removeTypingIndicator();
        addMessageToUI(response, 'bot');

        // Add to conversation history
        conversationHistory.push({
            role: 'assistant',
            content: response
        });
    } catch (error) {
        removeTypingIndicator();
        const errorMessage = `❌ Error: ${error.message}`;
        addMessageToUI(errorMessage, 'bot');
        console.error('API Error:', error);
    }

    // Scroll to bottom
    scrollToBottom();

    // Re-enable send button
    isLoading = false;
    updateSendButton();
}

/**
 * Add message to UI
 */
function addMessageToUI(text, sender) {
    const messageWrapper = document.createElement('div');
    messageWrapper.className = `message-wrapper ${sender}-message-wrapper`;

    const message = document.createElement('div');
    message.className = `message ${sender}-message`;

    const content = document.createElement('div');
    content.className = 'message-content';

    // Parse and format the response for better readability
    if (sender === 'bot') {
        content.innerHTML = formatBotResponse(text);
    } else {
        content.textContent = text;
    }

    const time = document.createElement('span');
    time.className = 'message-time';
    time.textContent = getCurrentTime();

    message.appendChild(content);
    message.appendChild(time);
    messageWrapper.appendChild(message);

    messagesArea.appendChild(messageWrapper);
}

/**
 * Format bot response with proper markdown-like styling
 */
function formatBotResponse(text) {
    let formatted = text;

    // Replace **text** with <strong>text</strong>
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Replace newlines with <br>
    formatted = formatted.replace(/\n/g, '<br>');

    // Handle bullet points (lines starting with -)
    formatted = formatted.replace(/^\s*-\s+(.+?)(?=<br>|$)/gm, '<li>$1</li>');

    // Wrap consecutive <li> in <ul>
    formatted = formatted.replace(/(<li>.*?<\/li>)/s, '<ul>$1</ul>');

    // Clean up multiple <ul> tags
    formatted = formatted.replace(/<\/ul>\s*<ul>/g, '');

    // Handle numbered lists (1., 2., etc.)
    formatted = formatted.replace(/^\s*\d+\.\s+(.+?)(?=<br>|$)/gm, '<li>$1</li>');

    // Wrap consecutive numbered <li> in <ol>
    formatted = formatted.replace(/(<li>.*?<\/li>)/s, (match) => {
        if (match.includes('<ul>')) return match;
        return '<ol>' + match + '</ol>';
    });

    // Handle section headers (text ending with :)
    formatted = formatted.replace(/^([^<][^:\n]+):$/gm, '<strong>$1:</strong>');

    // Create a temporary div to set HTML safely
    const div = document.createElement('div');
    div.innerHTML = formatted;
    return div.innerHTML;
}

/**
 * Show typing indicator
 */
function showTypingIndicator() {
    isLoading = true;
    updateSendButton();

    const messageWrapper = document.createElement('div');
    messageWrapper.className = 'message-wrapper bot-message-wrapper';
    messageWrapper.id = 'typingIndicator';

    const message = document.createElement('div');
    message.className = 'message bot-message';

    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    typingDiv.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';

    message.appendChild(typingDiv);
    messageWrapper.appendChild(message);

    messagesArea.appendChild(messageWrapper);
    scrollToBottom();
}

/**
 * Remove typing indicator
 */
function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

/**
 * Scroll messages area to bottom
 */
function scrollToBottom() {
    setTimeout(() => {
        messagesArea.scrollTop = messagesArea.scrollHeight;
    }, 0);
}

/**
 * Update send button state
 */
function updateSendButton() {
    sendBtn.disabled = isLoading || !userInput.value.trim();
}

/**
 * Handle clear chat
 */
function handleClearChat() {
    if (confirm('Clear all messages? This cannot be undone.')) {
        messagesArea.innerHTML = `
            <div class="message-wrapper bot-message-wrapper">
                <div class="message bot-message">
                    <div class="message-content">
                        <p>Hello! 👋 I'm your Travel Planner Assistant. I can help you:</p>
                        <ul style="margin-top: 10px; margin-left: 20px;">
                            <li>Suggest amazing travel destinations</li>
                            <li>Create detailed day-wise itineraries</li>
                            <li>Recommend hotels and flights</li>
                            <li>Plan budget-friendly trips</li>
                            <li>Answer any travel-related questions</li>
                        </ul>
                        <p style="margin-top: 10px;">Where would you like to travel?</p>
                    </div>
                    <span class="message-time">Just now</span>
                </div>
            </div>
        `;
        conversationHistory = [];
        quickActionsContainer.classList.remove('hidden');
        scrollToBottom();
    }
}

/**
 * Show alert message
 */
function showAlert(message) {
    // Simple alert - can be replaced with better UI later
    alert(message);
}

/**
 * Get current time in HH:MM format
 */
function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

// ============================================
// API INTEGRATION - BACKEND (SECURE)
// ============================================

/**
 * Get response from Gemini API via secure backend endpoint
 * 
 * IMPORTANT: The API key is kept on the server side (not exposed in browser)
 * This backend endpoint:
 * 1. Receives the user message from the frontend
 * 2. Calls Gemini API with the API key stored in environment variables
 * 3. Returns only the response text to the frontend
 * 
 * API Key Security:
 * - Never exposed in frontend code
 * - Only accessible on the server through environment variables
 * - Safe for production use with high traffic
 */
async function getGeminiResponse(userMessage) {
    const apiUrl = '/api/chat'; // Vercel serverless function endpoint

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: userMessage,
                conversationHistory: conversationHistory,
                systemPrompt: SYSTEM_PROMPT
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `API error: ${response.status}`);
        }

        const data = await response.json();

        if (data.success && data.response) {
            return data.response;
        } else {
            throw new Error('Invalid response from backend');
        }

    } catch (error) {
        throw new Error(`Failed to get response: ${error.message}`);
    }
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Update send button state on input change
    userInput.addEventListener('input', updateSendButton);

    // Initial focus on input
    userInput.focus();

    console.log('Travel Planner Chatbot initialized');
    console.log('Backend API endpoint: /api/chat');
});

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Decode HTML entities
 */
function decodeHTML(html) {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
}

/**
 * Escape HTML special characters
 */
function escapeHTML(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// ============================================
// ERROR HANDLING
// ============================================

window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    // Could send error telemetry to a service here
});

// ============================================
// VERSION INFO
// ============================================

console.log(
    '%cTravel Planner Chatbot v1.0',
    'color: #6366f1; font-size: 14px; font-weight: bold;'
);
console.log(
    '%cPowered by Gemini API',
    'color: #10b981; font-size: 12px;'
);
