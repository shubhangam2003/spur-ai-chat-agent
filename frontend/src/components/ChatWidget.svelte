<script>
  import { onMount } from 'svelte';
  import axios from 'axios';

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  // Svelte 4 reactive variables (no runes)
  let messages = [];
  let inputValue = '';
  let isLoading = false;
  let sessionId = null;
  let error = null;
  let isTyping = false;

  // Example questions to help users get started
  const exampleQuestions = [
    "What's your return policy?",
    "Do you ship to USA?",
    "What are your support hours?",
    "How long does shipping take?",
  ];

  onMount(() => {
    // Load conversation history if sessionId exists in localStorage
    const savedSessionId = localStorage.getItem('chatSessionId');
    if (savedSessionId) {
      loadHistory(savedSessionId);
    }
  });

  async function loadHistory(sessionIdToLoad) {
    try {
      const response = await axios.get(`${API_BASE_URL}/chat/history/${sessionIdToLoad}`);
      sessionId = response.data.sessionId;
      messages = response.data.messages.map((msg) => ({
        id: msg.id,
        sender: msg.sender,
        text: msg.text,
        timestamp: new Date(msg.timestamp),
      }));
      localStorage.setItem('chatSessionId', sessionId);
      scrollToBottom();
    } catch (err) {
      console.error('Failed to load history:', err);
      // If history load fails, start a new conversation
      sessionId = null;
      messages = [];
    }
  }

  // Track last request time to prevent rapid requests
  let lastRequestTime = 0;
  const MIN_REQUEST_INTERVAL = 2000; // 2 seconds between requests

  async function sendMessage(messageText = inputValue.trim()) {
    if (!messageText || isLoading) return;
    
    // Prevent rapid requests
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;
    if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
      const waitTime = Math.ceil((MIN_REQUEST_INTERVAL - timeSinceLastRequest) / 1000);
      error = `Please wait ${waitTime} second${waitTime > 1 ? 's' : ''} before sending another message.`;
      return;
    }
    lastRequestTime = now;

    const userMessage = {
      id: `temp-${Date.now()}`,
      sender: 'user',
      text: messageText,
      timestamp: new Date(),
    };

    messages = [...messages, userMessage];
    inputValue = '';
    error = null;
    isLoading = true;
    isTyping = true;
    scrollToBottom();

    try {
      const requestBody = {
        message: messageText,
      };
      // Only include sessionId if it exists
      if (sessionId) {
        requestBody.sessionId = sessionId;
      }
      
      const response = await axios.post(`${API_BASE_URL}/chat/message`, requestBody);

      sessionId = response.data.sessionId;
      localStorage.setItem('chatSessionId', sessionId);

      const aiMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: response.data.reply,
        timestamp: new Date(),
      };

      messages = [...messages, aiMessage];

      if (response.data.error) {
        error = response.data.error.message;
        // If it's a retryable error, show a helpful message
        if (response.data.error.retryable) {
          error = `${response.data.error.message} (You can try again in a few seconds)`;
        }
      }
    } catch (err) {
      console.error('Error sending message:', err);
      
      // Extract error message properly
      let errorMessage = 'Failed to send message. Please try again.';
      
      if (err.response?.data) {
        const errorData = err.response.data;
        if (typeof errorData.error === 'string') {
          errorMessage = errorData.error;
        } else if (errorData.error?.message) {
          errorMessage = errorData.error.message;
        } else if (errorData.details) {
          // Handle validation errors
          const details = Array.isArray(errorData.details) 
            ? errorData.details.map(d => d.message || d.msg).join(', ')
            : JSON.stringify(errorData.details);
          errorMessage = `Validation error: ${details}`;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else {
          errorMessage = JSON.stringify(errorData);
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      // Check if it's a rate limit error
      const isRateLimit = errorMessage.toLowerCase().includes('rate limit');
      
      const errorMsg = {
        id: `error-${Date.now()}`,
        sender: 'ai',
        text: isRateLimit 
          ? `⚠️ Rate limit exceeded. This means OpenAI is limiting requests. Please wait 10-30 seconds and try again. Your message was: "${messageText}"`
          : `Sorry, I encountered an error: ${errorMessage}`,
        timestamp: new Date(),
        isError: true,
        isRateLimit: isRateLimit,
      };

      messages = [...messages, errorMsg];
      error = errorMessage;
    } finally {
      isLoading = false;
      isTyping = false;
      scrollToBottom();
    }
  }

  function handleKeyPress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  }

  function scrollToBottom() {
    setTimeout(() => {
      const chatContainer = document.querySelector('.messages-container');
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }, 100);
  }

  function startNewConversation() {
    sessionId = null;
    messages = [];
    error = null;
    localStorage.removeItem('chatSessionId');
  }
</script>

<div class="chat-widget">
  <div class="chat-header">
    <h2>AI Support Agent</h2>
    {#if sessionId}
      <button class="new-chat-btn" on:click={startNewConversation}>New Chat</button>
    {/if}
  </div>

  <div class="messages-container">
    {#if messages.length === 0}
      <div class="welcome-message">
        <p>👋 Hi! I'm your AI support agent. How can I help you today?</p>
        <div class="example-questions">
          <p class="examples-label">Try asking:</p>
          {#each exampleQuestions as question}
            <button
              class="example-btn"
              on:click={() => sendMessage(question)}
              disabled={isLoading}
            >
              {question}
            </button>
          {/each}
        </div>
      </div>
    {:else}
      {#each messages as message (message.id)}
        <div class="message message-{message.sender}">
          <div class="message-content">
            <div class="message-text">{message.text}</div>
            <div class="message-time">
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>
      {/each}
    {/if}

    {#if isTyping}
      <div class="message message-ai">
        <div class="message-content">
          <div class="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    {/if}
  </div>

  {#if error}
    <div class="error-banner">
      ⚠️ {error}
    </div>
  {/if}

  <div class="input-container">
    <input
      type="text"
      placeholder="Type your message..."
      bind:value={inputValue}
      on:keypress={handleKeyPress}
      disabled={isLoading}
      maxlength="2000"
      class="message-input"
    />
    <button
      class="send-button"
      on:click={() => sendMessage()}
      disabled={isLoading || !inputValue.trim()}
    >
      {isLoading ? '⏳' : '➤'}
    </button>
  </div>
</div>

<style>
  .chat-widget {
    display: flex;
    flex-direction: column;
    height: 600px;
    background: #f8f9fa;
  }

  .chat-header {
    background: #667eea;
    color: white;
    padding: 16px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .chat-header h2 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
  }

  .new-chat-btn {
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: white;
    padding: 6px 12px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.875rem;
    transition: background 0.2s;
  }

  .new-chat-btn:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  .messages-container {
    flex: 1;
    overflow-y: auto;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .welcome-message {
    text-align: center;
    padding: 40px 20px;
    color: #666;
  }

  .welcome-message p {
    font-size: 1.1rem;
    margin-bottom: 24px;
  }

  .example-questions {
    display: flex;
    flex-direction: column;
    gap: 12px;
    max-width: 400px;
    margin: 0 auto;
  }

  .examples-label {
    font-size: 0.9rem;
    color: #888;
    margin-bottom: 8px;
  }

  .example-btn {
    background: white;
    border: 2px solid #667eea;
    color: #667eea;
    padding: 12px 20px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.95rem;
    transition: all 0.2s;
    text-align: left;
  }

  .example-btn:hover:not(:disabled) {
    background: #667eea;
    color: white;
  }

  .example-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .message {
    display: flex;
    margin-bottom: 8px;
  }

  .message-user {
    justify-content: flex-end;
  }

  .message-ai {
    justify-content: flex-start;
  }

  .message-content {
    max-width: 70%;
    padding: 12px 16px;
    border-radius: 12px;
    word-wrap: break-word;
  }

  .message-user .message-content {
    background: #667eea;
    color: white;
    border-bottom-right-radius: 4px;
  }

  .message-ai .message-content {
    background: white;
    color: #333;
    border: 1px solid #e0e0e0;
    border-bottom-left-radius: 4px;
  }

  .message-text {
    line-height: 1.5;
    margin-bottom: 4px;
  }

  .message-time {
    font-size: 0.75rem;
    opacity: 0.7;
    margin-top: 4px;
  }

  .typing-indicator {
    display: flex;
    gap: 4px;
    padding: 8px 0;
  }

  .typing-indicator span {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #999;
    animation: typing 1.4s infinite;
  }

  .typing-indicator span:nth-child(2) {
    animation-delay: 0.2s;
  }

  .typing-indicator span:nth-child(3) {
    animation-delay: 0.4s;
  }

  @keyframes typing {
    0%, 60%, 100% {
      transform: translateY(0);
      opacity: 0.7;
    }
    30% {
      transform: translateY(-10px);
      opacity: 1;
    }
  }

  .error-banner {
    background: #fee;
    color: #c33;
    padding: 12px 24px;
    border-top: 1px solid #fcc;
    font-size: 0.9rem;
  }

  .input-container {
    display: flex;
    padding: 16px 24px;
    background: white;
    border-top: 1px solid #e0e0e0;
    gap: 12px;
  }

  .message-input {
    flex: 1;
    padding: 12px 16px;
    border: 2px solid #e0e0e0;
    border-radius: 24px;
    font-size: 1rem;
    outline: none;
    transition: border-color 0.2s;
  }

  .message-input:focus {
    border-color: #667eea;
  }

  .message-input:disabled {
    background: #f5f5f5;
    cursor: not-allowed;
  }

  .send-button {
    background: #667eea;
    color: white;
    border: none;
    border-radius: 50%;
    width: 44px;
    height: 44px;
    font-size: 1.2rem;
    cursor: pointer;
    transition: background 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .send-button:hover:not(:disabled) {
    background: #5568d3;
  }

  .send-button:disabled {
    background: #ccc;
    cursor: not-allowed;
  }

  /* Scrollbar styling */
  .messages-container::-webkit-scrollbar {
    width: 8px;
  }

  .messages-container::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  .messages-container::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }

  .messages-container::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
</style>

