// routes/analyticsRoutes.js
import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import Task from '../models/Task.js';
import PomodoroSession from '../models/PomodoroSession.js';
import moment from 'moment';

const router = express.Router();

// Daily breakdown analytics: GET /analytics/daily?start=YYYY-MM-DD&end=YYYY-MM-DD
router.get('/daily', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const start = req.query.start ? moment(req.query.start) : moment().startOf('isoWeek');
    const end = req.query.end ? moment(req.query.end) : moment().endOf('isoWeek');

    if (!start.isValid() || !end.isValid()) {
      return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD.' });
    }

    // Pomodoro per day
    const pomoAgg = await PomodoroSession.aggregate([
      {
        $match: {
          user: userId,
          createdAt: { $gte: start.toDate(), $lte: end.toDate() },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          pomodoroMinutes: { $sum: '$minutes' },
        },
      },
    ]);

    // Task count per day
    const taskAgg = await Task.aggregate([
      {
        $match: {
          user: userId,
          createdAt: { $gte: start.toDate(), $lte: end.toDate() },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          taskCount: { $sum: 1 },
        },
      },
    ]);

    // Merge both datasets by date
    const map = {};

    for (const p of pomoAgg) {
      map[p._id] = { date: p._id, pomodoroMinutes: p.pomodoroMinutes, taskCount: 0 };
    }

    for (const t of taskAgg) {
      if (map[t._id]) {
        map[t._id].taskCount = t.taskCount;
      } else {
        map[t._id] = { date: t._id, pomodoroMinutes: 0, taskCount: t.taskCount };
      }
    }

    const result = Object.values(map).sort((a, b) => new Date(a.date) - new Date(b.date));

    res.json(result);
  } catch (err) {
    console.error('Daily analytics error:', err);
    res.status(500).json({ error: 'Failed to fetch daily data' });
  }
});

export default router;
