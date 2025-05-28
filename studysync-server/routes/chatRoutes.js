import express from 'express';
import { queryAI } from '../services/aiService.js';

const router = express.Router();

// Optional: Health check or basic GET response
router.get('/', (req, res) => {
  res.send('Chat endpoint is running');
});

// Main POST route to interact with AI
router.post('/', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const response = await queryAI(prompt);
    res.json({ response });
  } catch (error) {
    res.status(500).json({ error: 'AI model failed to respond.' });
  }
});

export default router;
