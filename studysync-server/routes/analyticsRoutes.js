// routes/analyticsRoutes.js
import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import Task from '../models/Task.js';
import User from '../models/User.js';
import moment from 'moment';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// GET /analytics
router.get('/', protect, async (req, res) => {
  try {
    const completed = await Task.countDocuments({ user: req.user._id, completed: true });

    const weekStart = moment().startOf('isoWeek').toDate();
    const weeklyCount = await Task.countDocuments({
      user: req.user._id,
      createdAt: { $gte: weekStart },
    });

    const POMO_DIR = path.join(process.cwd(), 'pomodoro_sessions');
    const userFile = path.join(POMO_DIR, `${req.user._id}.json`);

    let totalPomodoro = 0;
    if (fs.existsSync(userFile)) {
      const data = JSON.parse(fs.readFileSync(userFile, 'utf-8'));
      totalPomodoro = data.totalMinutes || 0;
    }

    res.json({ completed, weeklyCount, totalPomodoro });
  } catch (err) {
    console.error('Analytics error:', err);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

export default router;
