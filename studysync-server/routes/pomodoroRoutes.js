import express from 'express';
import fs from 'fs';
import path from 'path';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

const POMODORO_DIR = './pomodoro_sessions';
if (!fs.existsSync(POMODORO_DIR)) fs.mkdirSync(POMODORO_DIR);

// POST /pomodoro/log { minutes }
router.post('/log', protect, (req, res) => {
  const { minutes } = req.body;
  if (!minutes || minutes <= 0) {
    return res.status(400).json({ error: 'Invalid minutes' });
  }

  const file = path.join(POMODORO_DIR, `${req.user._id}.json`);
  let current = { totalMinutes: 0 };

  if (fs.existsSync(file)) {
    current = JSON.parse(fs.readFileSync(file, 'utf-8'));
  }

  current.totalMinutes += minutes;
  fs.writeFileSync(file, JSON.stringify(current));

  res.json({ message: 'Logged successfully', totalMinutes: current.totalMinutes });
});

export default router;
