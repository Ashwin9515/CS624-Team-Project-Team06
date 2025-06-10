import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

import taskRoutes from './routes/taskRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import pomodoroRoutes from './routes/pomodoroRoutes.js';

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/tasks', taskRoutes);
app.use('/chat', chatRoutes);
app.use('/analytics', analyticsRoutes);
app.use('/pomodoro', pomodoroRoutes);

app.get('/', (req, res) => {
  res.send('API running...');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
