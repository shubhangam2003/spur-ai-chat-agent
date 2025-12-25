import express from 'express';
import { z } from 'zod';
import {
  createConversation,
  getConversation,
  addMessage,
  getMessages,
  getMessageCount,
} from '../db/conversations';
import { generateReply } from '../services/llm';

const router = express.Router();

const MAX_MESSAGE_LENGTH = parseInt(process.env.MAX_MESSAGE_LENGTH || '2000', 10);

const messageSchema = z.object({
  message: z
    .string()
    .min(1, 'Message cannot be empty')
    .max(MAX_MESSAGE_LENGTH, `Message cannot exceed ${MAX_MESSAGE_LENGTH} characters`),
  sessionId: z
    .union([z.string().uuid(), z.null(), z.undefined()])
    .optional()
    .transform((val) => val === null ? undefined : val),
});

// POST /chat/message
router.post('/message', async (req, res, next) => {
  try {
    // Log incoming request for debugging
    console.log('Received request:', JSON.stringify(req.body));
    
    // Validate input
    const validationResult = messageSchema.safeParse(req.body);
    if (!validationResult.success) {
      console.error('Validation failed:', validationResult.error.errors);
      const errorMessages = validationResult.error.errors.map(e => e.message).join(', ');
      return res.status(400).json({
        error: `Invalid request: ${errorMessages}`,
        details: validationResult.error.errors,
      });
    }

    const { message, sessionId } = validationResult.data;

    // Get or create conversation
    let conversationId: string;
    if (sessionId) {
      const conversation = await getConversation(sessionId);
      if (!conversation) {
        return res.status(404).json({
          error: 'Conversation not found',
        });
      }
      conversationId = sessionId;
    } else {
      const conversation = await createConversation();
      conversationId = conversation.id;
    }

    // Check message count limit
    const messageCount = await getMessageCount(conversationId);
    const maxMessages = parseInt(process.env.MAX_MESSAGES_PER_SESSION || '50', 10);
    if (messageCount >= maxMessages) {
      return res.status(429).json({
        error: 'Maximum message limit reached for this conversation. Please start a new conversation.',
        sessionId: conversationId,
      });
    }

    // Save user message
    await addMessage(conversationId, 'user', message);

    // Get conversation history
    const history = await getMessages(conversationId);

    // Generate AI reply
    const { reply, error: llmError } = await generateReply(history, message);

    if (llmError) {
      // Save error message as AI response
      const errorMessage = `Sorry, I'm having trouble right now. ${llmError.message}`;
      await addMessage(conversationId, 'ai', errorMessage);

      const statusCode = llmError.retryable ? 503 : 500;
      return res.status(statusCode).json({
        reply: errorMessage,
        sessionId: conversationId,
        error: {
          code: llmError.code,
          message: llmError.message,
          retryable: llmError.retryable,
        },
      });
    }

    // Save AI reply
    await addMessage(conversationId, 'ai', reply);

    res.json({
      reply,
      sessionId: conversationId,
    });
  } catch (error: any) {
    next(error);
  }
});

// GET /chat/history/:sessionId
router.get('/history/:sessionId', async (req, res, next) => {
  try {
    const { sessionId } = req.params;

    const conversation = await getConversation(sessionId);
    if (!conversation) {
      return res.status(404).json({
        error: 'Conversation not found',
      });
    }

    const messages = await getMessages(sessionId);

    res.json({
      sessionId,
      messages: messages.map((msg) => ({
        id: msg.id,
        sender: msg.sender,
        text: msg.text,
        timestamp: msg.createdAt,
      })),
    });
  } catch (error: any) {
    next(error);
  }
});

export { router as chatRouter };

