import { queryAI } from '../services/aiService.js';
import User from '../models/User.js';

export const handleChat = async (req, res) => {
  const { prompt, relatedTask } = req.body;

  if (!prompt?.trim()) {
    return res.status(400).json({ error: 'Prompt is required.' });
  }

  try {
    const aiPrompt = `
You are a helpful assistant for a productivity app. Convert the following user input into a JSON object with these keys:
- title (string)
- description (string)
- dueDate (ISO 8601 format, e.g., "2025-06-30")
- priority (one of: Low, Medium, High)

Only respond with valid JSON. No explanation or surrounding text.

User Input: ${prompt}
    `.trim();

    const response = await queryAI(aiPrompt);

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.chatHistory.push(
      { role: 'user', message: prompt, relatedTask },
      { role: 'bot', message: response, relatedTask }
    );

    await user.save();
    res.json({ response });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ error: 'Failed to process chat' });
  }
};

export const fetchChatHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('chatHistory.relatedTask');
    res.json(user.chatHistory || []);
  } catch (err) {
    console.error('Fetch history error:', err);
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
};

export const clearChatHistory = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { chatHistory: [] });
    res.json({ message: 'Chat history cleared' });
  } catch (err) {
    console.error('Clear history error:', err);
    res.status(500).json({ error: 'Failed to clear chat history' });
  }
};
