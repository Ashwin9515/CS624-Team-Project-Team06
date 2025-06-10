import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import Task from '../models/Task.js';
import User from '../models/User.js';
import moment from 'moment';
import fs from 'fs';

const router = express.Router();

// GET /analytics
router.get('/', protect, async (req, res) => {
  try {
    // Task analytics
    const completed = await Task.countDocuments({ user: req.user._id, completed: true });

    const weekStart = moment().startOf('isoWeek').toDate();
    const weeklyCount = await Task.countDocuments({
      user: req.user._id,
      createdAt: { $gte: weekStart },
    });

    // Pomodoro analytics (stored locally)
    let totalPomodoro = 0;
    const userId = req.user._id.toString();
    const storageFile = `./pomodoro_sessions/${userId}.json`;

    if (fs.existsSync(storageFile)) {
      const data = JSON.parse(fs.readFileSync(storageFile, 'utf-8'));
      totalPomodoro = data.totalMinutes || 0;
    }

    res.json({ completed, weeklyCount, totalPomodoro });
  } catch (err) {
    console.error('Analytics error:', err);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

export default router;
