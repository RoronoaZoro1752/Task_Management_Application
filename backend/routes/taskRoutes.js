import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats,
  getAllusers
} from '../controllers/taskController.js';

const router = express.Router();

router.route('/')
  .get(protect, getTasks)
  .post(protect, createTask);

router.route('/:id')
  .put(protect, updateTask)
  .delete(protect, deleteTask);

router.get('/stats', protect, getTaskStats);

router.get('/getallusers', protect, getAllusers);

export default router;