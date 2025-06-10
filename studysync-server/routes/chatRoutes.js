import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import ChatMessage from '../models/ChatMessage.js';
import { queryAI } from '../controllers/chatController.js';

const router = express.Router();

// POST /chat → generate response + save
router.post('/', protect, async (req, res) => {
  const { prompt } = req.body;

  if (!prompt?.trim()) {
    return res.status(400).json({ error: 'Prompt is required.' });
  }

  try {
    const response = await queryAI(prompt);

    // Save to DB
    const message = await ChatMessage.create({
      user: req.user._id,
      prompt,
      response,
    });

    res.json({ response: message.response });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ error: 'Failed to get AI response' });
  }
});

// GET /chat/history → fetch user chat
router.get('/history', protect, async (req, res) => {
  try {
    const history = await ChatMessage.find({ user: req.user._id }).sort('createdAt');
    res.json(history);
  } catch {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// DELETE /chat/history → clear history
router.delete('/history', protect, async (req, res) => {
  try {
    await ChatMessage.deleteMany({ user: req.user._id });
    res.json({ message: 'History cleared' });
  } catch {
    res.status(500).json({ error: 'Failed to delete history' });
  }
});

export default router;
