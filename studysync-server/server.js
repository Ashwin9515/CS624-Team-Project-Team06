import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import taskRoutes from './routes/taskRoutes.js';
import chatRoutes from './routes/chatRoutes.js';

// Load environment variables from .env
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check route
app.get('/api', (req, res) => {
  res.json({ message: 'API is up and running' });
});

// API Routes
app.use('/api/tasks', taskRoutes);
app.use('/api/chat', chatRoutes);

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
