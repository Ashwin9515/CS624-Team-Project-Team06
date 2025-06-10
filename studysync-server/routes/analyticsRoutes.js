import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import Task from '../models/Task.js';
import path from 'path';
import fs from 'fs';
import moment from 'moment';

const router = express.Router();

// GET /analytics
router.get('/', protect, async (req, res) => {
  try {
    const userId = req.user._id;

    const completed = await Task.countDocuments({ user: userId, status: 'completed' });

    const weekStart = moment().startOf('isoWeek').toDate();
    const weeklyCount = await Task.countDocuments({
      user: userId,
      createdAt: { $gte: weekStart },
    });

    const POMO_DIR = path.join(process.cwd(), 'pomodoro_sessions');
    const userFile = path.join(POMO_DIR, `${userId}.json`);

    let totalPomodoro = 0;
    if (fs.existsSync(userFile)) {
      try {
        const data = JSON.parse(fs.readFileSync(userFile, 'utf-8'));
        totalPomodoro = data.totalMinutes || 0;
      } catch (e) {
        console.warn('Failed to read pomodoro data:', e);
      }
    }

    res.json({
      completed,
      weeklyCount,
      totalPomodoro,
    });
  } catch (err) {
    console.error('Analytics error:', err);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

export default router;
