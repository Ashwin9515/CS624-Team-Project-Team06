import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  handleChat,
  fetchChatHistory,
  clearChatHistory,
} from '../controllers/chatController.js';

const router = express.Router();

// POST /chat → generate AI response and save chat
router.post('/', protect, handleChat);

// GET /chat/history → fetch chat history
router.get('/history', protect, fetchChatHistory);

// DELETE /chat/history → clear chat history
router.delete('/history', protect, clearChatHistory);

export default router;
