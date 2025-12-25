import { GoogleGenerativeAI } from '@google/generative-ai';
import { Message } from '../db/conversations';
import { config } from '../config';

const MAX_TOKENS = config.maxTokens;
const MAX_MESSAGES_PER_SESSION = config.maxMessagesPerSession;

// Domain knowledge about the fictional store
const STORE_KNOWLEDGE = `
You are a helpful and friendly customer support agent for "SpurStore", a small e-commerce store. 

Here's what you need to know about our store:

SHIPPING POLICY:
- We ship to USA, Canada, UK, and India
- Standard shipping: 5-7 business days
- Express shipping: 2-3 business days (available for USA and UK only)
- Free shipping on orders over $50
- Shipping costs: $5 for standard, $15 for express

RETURN/REFUND POLICY:
- 30-day return policy from date of delivery
- Items must be unused and in original packaging
- Refunds are processed within 5-7 business days after we receive the return
- Return shipping is free for defective items
- For non-defective returns, customer pays return shipping

SUPPORT HOURS:
- Monday to Friday: 9 AM - 6 PM EST
- Saturday: 10 AM - 4 PM EST
- Sunday: Closed
- Email: support@spurstore.com

PRODUCT INFORMATION:
- We sell electronics, accessories, and lifestyle products
- All products come with a 1-year warranty
- We accept major credit cards, PayPal, and Apple Pay

Answer questions clearly, concisely, and in a friendly tone. If you don't know something specific, politely say so and suggest they contact support@spurstore.com for more details.
`;

export interface LLMError {
  message: string;
  code: string;
  retryable: boolean;
}

// Initialize Gemini client if API key is available
let geminiClient: GoogleGenerativeAI | null = null;
if (config.geminiApiKey && config.geminiApiKey !== 'your_gemini_api_key_here') {
  geminiClient = new GoogleGenerativeAI(config.geminiApiKey);
}

export async function generateReply(
  conversationHistory: Message[],
  userMessage: string
): Promise<{ reply: string; error?: LLMError }> {
  try {
    // Check message count limit
    if (conversationHistory.length >= MAX_MESSAGES_PER_SESSION) {
      return {
        reply: '',
        error: {
          message: 'Maximum message limit reached for this conversation. Please start a new conversation.',
          code: 'MESSAGE_LIMIT_EXCEEDED',
          retryable: false,
        },
      };
    }

    // Route to appropriate LLM provider
    if (config.llmProvider === 'ollama') {
      return await generateReplyWithOllama(conversationHistory, userMessage);
    } else if (config.llmProvider === 'gemini' && geminiClient) {
      return await generateReplyWithGemini(conversationHistory, userMessage);
    } else {
      // Fallback error
      throw new Error(`LLM provider '${config.llmProvider}' is not configured properly. Please check your .env file.`);
    }
  } catch (error: any) {
    console.error('LLM API Error:', error);
    return handleLLMError(error);
  }
}

async function generateReplyWithOllama(
  conversationHistory: Message[],
  userMessage: string
): Promise<{ reply: string; error?: LLMError }> {
  try {
    // Build messages array for Ollama chat API
    // Use system message for better model understanding (gemma3:27b supports this well)
    const messages: Array<{ role: string; content: string }> = [
      { role: 'system', content: STORE_KNOWLEDGE },
    ];

    // Add conversation history (last 10 messages)
    const recentHistory = conversationHistory.slice(-10);
    for (const msg of recentHistory) {
      messages.push({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text,
      });
    }

    // Add current user message
    messages.push({ role: 'user', content: userMessage });

    // Call Ollama API with timeout
    console.log(`Calling Ollama API at ${config.ollamaBaseUrl}/api/chat with model ${config.ollamaModel}`);
    console.log(`Messages count: ${messages.length}`);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120000); // 120 second timeout (2 minutes) for slower models
    
    const response = await fetch(`${config.ollamaBaseUrl}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: config.ollamaModel,
        messages: messages,
        stream: false,
        options: {
          temperature: 0.7,
          num_predict: Math.max(MAX_TOKENS, 1000), // Ensure at least 1000 tokens for thinking models
          num_ctx: 4096, // Larger context window for better performance
        },
      }),
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Ollama API error: ${response.status} ${errorText}`);
    }

    const data = await response.json() as { 
      message?: { 
        role?: string; 
        content?: string;
        thinking?: string;
      }; 
      done?: boolean;
      done_reason?: string;
    };
    console.log('Ollama API response received:', JSON.stringify(data, null, 2));
    
    // Get the reply from content field (or thinking if content is empty and this is a thinking model)
    let reply = data.message?.content?.trim() || '';
    
    // If content is empty but thinking exists, and done_reason is 'length', 
    // the model might need more tokens. Use thinking as fallback for now.
    if (!reply && data.message?.thinking && data.done_reason === 'length') {
      console.warn('Content is empty but thinking field exists. Token limit may be too low.');
      reply = data.message.thinking.trim();
    }

    if (!reply) {
      console.warn('Empty reply from Ollama, response data:', data);
      return {
        reply: '',
        error: {
          message: 'Sorry, I received an empty response. Please try again.',
          code: 'EMPTY_RESPONSE',
          retryable: true,
        },
      };
    }

    console.log('Ollama reply generated successfully, length:', reply.length);
    return { reply };
  } catch (error: any) {
    console.error('Ollama API Error:', error);
    return handleLLMError(error);
  }
}

async function generateReplyWithGemini(
  conversationHistory: Message[],
  userMessage: string
): Promise<{ reply: string; error?: LLMError }> {
  if (!geminiClient) {
    return {
      reply: '',
      error: {
        message: 'Gemini API client not initialized. Please check your GEMINI_API_KEY.',
        code: 'CONFIG_ERROR',
        retryable: false,
      },
    };
  }

  try {
    // Build the full prompt with system instructions and conversation history
    let prompt = STORE_KNOWLEDGE + '\n\n';
    
    // Add conversation history (last 10 messages)
    const recentHistory = conversationHistory.slice(-10);
    for (const msg of recentHistory) {
      if (msg.sender === 'user') {
        prompt += `User: ${msg.text}\n`;
      } else {
        prompt += `Assistant: ${msg.text}\n`;
      }
    }
    
    // Add current user message
    prompt += `User: ${userMessage}\nAssistant:`;

    // Use gemini-2.5-flash (latest fast model, recommended by Google)
    // Other available models: gemini-2.5-pro, gemini-2.0-flash
    const model = geminiClient.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
    });
    
    // Use the correct API format
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        maxOutputTokens: MAX_TOKENS,
        temperature: 0.7,
      },
    });

    const response = result.response;
    const reply = response.text().trim();

    if (!reply) {
      return {
        reply: '',
        error: {
          message: 'Sorry, I received an empty response. Please try again.',
          code: 'EMPTY_RESPONSE',
          retryable: true,
        },
      };
    }

    return { reply };
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return handleLLMError(error);
  }
}

function handleLLMError(error: any): { reply: string; error: LLMError } {
  // Handle connection errors (common with Ollama if not running)
  if (error.code === 'ECONNREFUSED' || error.message?.includes('fetch failed') || error.message?.includes('ECONNREFUSED')) {
    return {
      reply: '',
      error: {
        message: 'Cannot connect to Ollama. Please make sure Ollama is running on your machine.',
        code: 'CONNECTION_ERROR',
        retryable: true,
      },
    };
  }

  // Handle API key errors
  if (error.message?.includes('API key')) {
    return {
      reply: '',
      error: {
        message: 'API authentication failed. Please check your API key configuration.',
        code: 'AUTH_ERROR',
        retryable: false,
      },
    };
  }

  if (error.message?.includes('quota') || error.message?.includes('rate limit') || error.status === 429) {
    return {
      reply: '',
      error: {
        message: 'Rate limit exceeded. Please wait a moment and try again.',
        code: 'RATE_LIMIT',
        retryable: true,
      },
    };
  }

  if (error.status === 503 || error.status === 502 || error.message?.includes('unavailable')) {
    return {
      reply: '',
      error: {
        message: 'The AI service is temporarily unavailable. Please try again in a moment.',
        code: 'SERVICE_UNAVAILABLE',
        retryable: true,
      },
    };
  }

  // Handle timeout errors and abort errors
  if (error.code === 'ECONNABORTED' || error.name === 'AbortError' || error.message?.includes('timeout') || error.message?.includes('aborted')) {
    return {
      reply: '',
      error: {
        message: 'Request timed out. The model is taking too long to respond. Please try again.',
        code: 'TIMEOUT',
        retryable: true,
      },
    };
  }

  // Generic error
  return {
    reply: '',
    error: {
      message: error.message || 'Sorry, I encountered an error while processing your message. Please try again.',
      code: 'UNKNOWN_ERROR',
      retryable: true,
    },
  };
}
