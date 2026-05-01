const Chat = require('../models/Chat');
const axios = require('axios');

const CHATGPT_API_KEY = process.env.CHATGPT_API_KEY;

// Create or get chat session
exports.getChatSession = async (req, res) => {
  try {
    let chat = await Chat.findOne({ user: req.user.id, status: 'active' });

    if (!chat) {
      chat = new Chat({
        user: req.user.id,
        conversationId: `conv-${Date.now()}`,
        messages: [],
      });
      await chat.save();
    }

    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
    const chat = await Chat.findByIdAndUpdate(
      req.params.chatId,
      { status: 'closed', updatedAt: new Date() },
      { new: true }
    );

    res.json({
      message: 'Chat session closed',
      chat,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get chat history
exports.getChatHistory = async (req, res) => {
  try {
    const chats = await Chat.find({ user: req.user.id })
      .sort({ updatedAt: -1 });

    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
