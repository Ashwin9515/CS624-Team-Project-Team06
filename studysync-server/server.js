import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import taskRoutes from './routes/taskRoutes.js';
import chatRoutes from './routes/chatRoutes.js'; // Handles /api/chat

dotenv.config();
connectDB(); // Establish MongoDB connection

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/tasks', taskRoutes);
app.use('/api/chat', chatRoutes);

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
