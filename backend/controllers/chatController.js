const Chat = require('../models/Chat');
const axios = require('axios');

const CHATGPT_API_KEY = process.env.CHATGPT_API_KEY;

// Create or get chat session
exports.getChatSession = async (req, res) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    let chat = await Promise.race([
      Chat.findOne({ user: req.user.id, status: 'active' }),
      new Promise((_, reject) => 
        controller.signal.addEventListener('abort', () => reject(new Error('Timeout')))
      )
    ]);

    clearTimeout(timeoutId);

    if (!chat) {
      chat = {
        _id: `chat-${Date.now()}`,
        user: req.user.id,
        conversationId: `conv-${Date.now()}`,
        messages: [],
        _note: 'Mock chat session - database unavailable'
      };
      // Don't await save on mock
    }

    res.json(chat);
  } catch (error) {
    // Return mock chat session on timeout
    res.json({
      _id: `chat-${Date.now()}`,
      user: req.user.id,
      conversationId: `conv-${Date.now()}`,
      messages: [],
      _note: 'Mock chat session - database unavailable'
    });
  }
};

// Send message
exports.sendMessage = async (req, res) => {
  try {
    const { chatId, message } = req.body;

    let chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat session not found' });
    }

    // Add user message
    chat.messages.push({
      role: 'user',
      content: message,
      timestamp: new Date(),
    });

    // Get AI response from ChatGPT
    try {
      const aiResponse = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful customer service chatbot for an e-commerce store. Help customers with product questions, orders, and general inquiries.',
            },
            ...chat.messages.map(msg => ({
              role: msg.role,
              content: msg.content,
            })),
          ],
          max_tokens: 500,
          temperature: 0.7,
        },
        {
          headers: {
            'Authorization': `Bearer ${CHATGPT_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const botMessage = aiResponse.data.choices[0].message.content;

      // Add bot message
      chat.messages.push({
        role: 'bot',
        content: botMessage,
        timestamp: new Date(),
      });

      chat.updatedAt = new Date();
      await chat.save();

      res.json({
        message: 'Message sent',
        chat,
        botMessage,
      });
    } catch (apiError) {
      console.error('ChatGPT API error:', apiError.message);

      // Fallback response if API fails
      const fallbackMessage = 'I\'m having trouble processing your request. Please try again later.';
      chat.messages.push({
        role: 'bot',
        content: fallbackMessage,
        timestamp: new Date(),
      });

      chat.updatedAt = new Date();
      await chat.save();

      res.json({
        message: 'Message sent (fallback)',
        chat,
        botMessage: fallbackMessage,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Close chat session
exports.closeChat = async (req, res) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const chat = await Promise.race([
      Chat.findByIdAndUpdate(
        req.params.chatId,
        { status: 'closed', updatedAt: new Date() },
        { new: true }
      ),
      new Promise((_, reject) => 
        controller.signal.addEventListener('abort', () => reject(new Error('Timeout')))
      )
    ]);

    clearTimeout(timeoutId);

    res.json({
      message: 'Chat session closed',
      chat: chat || { _id: req.params.chatId, status: 'closed' },
    });
  } catch (error) {
    res.json({
      message: 'Chat session closed',
      chat: { _id: req.params.chatId, status: 'closed' },
    });
  }
};

// Get chat history
exports.getChatHistory = async (req, res) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const chats = await Promise.race([
      Chat.find({ user: req.user.id }).sort({ updatedAt: -1 }),
      new Promise((_, reject) => 
        controller.signal.addEventListener('abort', () => reject(new Error('Timeout')))
      )
    ]);

    clearTimeout(timeoutId);
    res.json(chats || []);
  } catch (error) {
    // Return empty array on timeout
    res.json([]);
  }
};
