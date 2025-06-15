// models/PomodoroSession.js
import mongoose from 'mongoose';

const pomodoroSessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  minutes: { type: Number, required: true },
  notes: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('PomodoroSession', pomodoroSessionSchema);
