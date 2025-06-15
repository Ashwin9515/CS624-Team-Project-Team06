// routes/taskRoutes.js
import express from 'express';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js';
import {
  validateCreateTask,
  validateUpdateTask,
} from '../validators/taskValidator.js';

const router = express.Router();

router.use(protect);

router.get('/', getTasks);
router.post('/', validateCreateTask, createTask);
router.put('/:id', validateUpdateTask, updateTask);
router.delete('/:id', deleteTask);

export default router;
