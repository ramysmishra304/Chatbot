/**
 * Vercel Serverless Function - Gemini Chat API
 * This endpoint securely handles Gemini API calls on the server side
 * API key is never exposed to the frontend
 */

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { message, conversationHistory, systemPrompt } = req.body;

        // Validate required fields
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Get API key from environment variables
        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
        if (!GEMINI_API_KEY) {
            return res.status(500).json({ error: 'Gemini API key is not configured' });
        }

        // Gemini API endpoint
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${GEMINI_API_KEY}`;

        // Build conversation for Gemini
        const contents = [
            {
                role: 'user',
                parts: [
                    {
                        text: systemPrompt || 'You are a helpful travel planning assistant.'
                    }
                ]
            }
        ];

        // Add conversation history
        if (conversationHistory && Array.isArray(conversationHistory)) {
            conversationHistory.forEach(msg => {
                contents.push({
                    role: msg.role === 'assistant' ? 'model' : 'user',
                    parts: [
                        {
                            text: msg.content
                        }
                    ]
                });
            });
        }

        // Add current user message
        contents.push({
            role: 'user',
            parts: [
                {
                    text: message
                }
            ]
        });

        // Prepare Gemini API payload
        const payload = {
            contents: contents,
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 1000,
            },
            safetySettings: [
                {
                    category: 'HARM_CATEGORY_HARASSMENT',
                    threshold: 'BLOCK_NONE',
                },
                {
                    category: 'HARM_CATEGORY_HATE_SPEECH',
                    threshold: 'BLOCK_NONE',
                },
                {
                    category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
                    threshold: 'BLOCK_NONE',
                },
                {
                    category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
                    threshold: 'BLOCK_NONE',
                },
            ],
        };

        // Call Gemini API
        const response = await fetch(geminiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Gemini API error:', errorData);
            return res.status(response.status).json({ error: 'Failed to get response from Gemini API' });
        }

        const data = await response.json();

        // Extract response text
        let responseText = '';
        if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
            responseText = data.candidates[0].content.parts[0].text || '';
        }

        // Return response to frontend
        return res.status(200).json({ 
            success: true,
            response: responseText 
        });

    } catch (error) {
        console.error('API error:', error);
        return res.status(500).json({ error: `Server error: ${error.message}` });
    }
}
