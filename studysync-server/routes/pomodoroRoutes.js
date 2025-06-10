// routes/pomodoroRoutes.js
import express from 'express';
import fs from 'fs';
import path from 'path';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
const POMO_DIR = path.join(process.cwd(), 'pomodoro_sessions');

if (!fs.existsSync(POMO_DIR)) {
  fs.mkdirSync(POMO_DIR);
}

// POST /pomodoro/log
router.post('/log', protect, (req, res) => {
  const { minutes } = req.body;
  if (!minutes || minutes <= 0) {
    return res.status(400).json({ error: 'Invalid minutes' });
  }

  const userFile = path.join(POMO_DIR, `${req.user._id}.json`);
  let current = { totalMinutes: 0 };

  if (fs.existsSync(userFile)) {
    current = JSON.parse(fs.readFileSync(userFile, 'utf-8'));
  }

  current.totalMinutes += minutes;
  fs.writeFileSync(userFile, JSON.stringify(current));

  res.json({ message: 'Logged successfully', totalMinutes: current.totalMinutes });
});

export default router;
