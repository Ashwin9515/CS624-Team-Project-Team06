import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { queryAI } from '../controllers/chatController.js';
import User from '../models/User.js';

const router = express.Router();

// POST /chat → generate response + save
router.post('/', protect, async (req, res) => {
  const { prompt } = req.body;

  if (!prompt?.trim()) {
    return res.status(400).json({ error: 'Prompt is required.' });
  }

  try {
    const response = await queryAI(prompt);

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.chatHistory.push(
      { role: 'user', message: prompt, timestamp: new Date() },
      { role: 'bot', message: response, timestamp: new Date() }
    );

    await user.save();

    res.json({ response });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ error: 'Failed to get AI response' });
  }
});

// GET /chat/history → fetch user chat
router.get('/history', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('chatHistory');
    res.json(user.chatHistory || []);
  } catch {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// DELETE /chat/history → clear history
router.delete('/history', protect, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { $set: { chatHistory: [] } });
    res.json({ message: 'History cleared' });
  } catch {
    res.status(500).json({ error: 'Failed to delete history' });
  }
});

export default router;
