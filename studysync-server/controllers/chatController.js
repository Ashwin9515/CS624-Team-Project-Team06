import axios from 'axios';
import User from '../models/User.js';

/**
 * Sends a prompt to the Phi-2 model via Ollama and returns a response.
 */
export const queryAI = async (prompt) => {
  try {
    const res = await axios.post('http://localhost:11434/api/generate', {
      model: 'phi',
      prompt,
      stream: false,
    });

    if (!res.data || !res.data.response) {
      throw new Error('Invalid response from AI model');
    }

    return res.data.response.trim();
  } catch (error) {
    console.error('Phi-2 API error:', error.message);
    throw error;
  }
};

/**
 * Handles chat prompt, gets AI response, and saves to User.chatHistory.
 */
export const handleChat = async (req, res) => {
  const { prompt, relatedTask } = req.body;

  if (!prompt?.trim()) {
    return res.status(400).json({ error: 'Prompt is required.' });
  }

  try {
    const response = await queryAI(prompt);

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

/**
 * Fetches full chat history from User model.
 */
export const fetchChatHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('chatHistory.relatedTask');
    res.json(user.chatHistory);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
};

/**
 * Clears user's chat history.
 */
export const clearChatHistory = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { chatHistory: [] });
    res.json({ message: 'Chat history cleared' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to clear chat history' });
  }
};
