// routes/pomodoroRoutes.js
import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import PomodoroSession from '../models/PomodoroSession.js';
import moment from 'moment';

const router = express.Router();

// POST /pomodoro/log
router.post('/log', protect, async (req, res) => {
  const { minutes, notes = '' } = req.body;

  if (!minutes || typeof minutes !== 'number' || minutes <= 0) {
    return res.status(400).json({ error: 'Invalid minutes value' });
  }

  try {
    const session = await PomodoroSession.create({
      user: req.user._id,
      minutes,
      notes,
    });

    res.status(201).json({ message: 'Pomodoro logged', session });
  } catch (err) {
    console.error('Log error:', err);
    res.status(500).json({ error: 'Failed to log session' });
  }
});

// GET /pomodoro?start=&end=
router.get('/', protect, async (req, res) => {
  const { start, end } = req.query;

  const startDate = start ? moment(start).startOf('day') : moment().startOf('isoWeek');
  const endDate = end ? moment(end).endOf('day') : moment().endOf('isoWeek');

  if (!startDate.isValid() || !endDate.isValid()) {
    return res.status(400).json({ error: 'Invalid date format' });
  }

  try {
    const agg = await PomodoroSession.aggregate([
      {
        $match: {
          user: req.user._id,
          createdAt: {
            $gte: startDate.toDate(),
            $lte: endDate.toDate(),
          },
        },
      },
      {
        $group: {
          _id: null,
          totalMinutes: { $sum: '$minutes' },
        },
      },
    ]);

    const total = agg[0]?.totalMinutes || 0;
    res.json({ totalMinutes: total, rangeStart: startDate, rangeEnd: endDate });
  } catch (err) {
    console.error('Pomodoro fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch pomodoro data' });
  }
});

// DELETE /pomodoro/reset
router.delete('/reset', protect, async (req, res) => {
  try {
    await PomodoroSession.deleteMany({ user: req.user._id });
    res.json({ message: 'Pomodoro data reset', totalMinutes: 0 });
  } catch (err) {
    console.error('Reset error:', err);
    res.status(500).json({ error: 'Failed to reset data' });
  }
});

export default router;
