import Task from '../models/Task.js';
import User from "../models/User.js";

export const getTasks = async (req, res) => {
  try {
    const { search, status, dueDate } = req.query;
    const userId = req.user.id;

    let query = { $or: [{ assignedTo: userId }, { createdBy: userId }] };

    if (search) {
      query.$and = [
        {
          $or: [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
          ]
        }
      ];
    }

    if (status) {
      query.status = status;
    }

    if (dueDate) {
      query.dueDate = new Date(dueDate);
    }

    const tasks = await Task.find(query)
      .populate('assignedTo', 'firstName lastName')
      .populate('createdBy', 'firstName lastName');

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, status, assignedTo } = req.body;
    const createdBy = req.user.id;

    const task = new Task({
      title,
      description,
      dueDate,
      status: status || 'Pending',
      assignedTo,
      createdBy
    });

    const createdTask = await task.save();

    if (assignedTo !== createdBy) {
      await User.findByIdAndUpdate(assignedTo, {
        $push: { assignedTasks: createdTask._id }
      });
    }
    
    res.status(201).json(createdTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { title, description, dueDate, status, assignedTo } = req.body;
    const taskId = req.params.id;
    const userId = req.user.id;

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if the user is the creator or assignee
    if (task.createdBy.toString() !== userId && task.assignedTo.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.dueDate = dueDate || task.dueDate;
    task.status = status || task.status;
    task.assignedTo = assignedTo || task.assignedTo;

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const userId = req.user.id;

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Only the creator can delete the task
    if (task.createdBy.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete this task' });
    }

    await task.deleteOne();
    res.json({ message: 'Task removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTaskStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const assignedTasks = await Task.countDocuments({ assignedTo: userId });
    // const createdTasks = await Task.countDocuments({ createdBy: userId });

    const createdTasks = await Task.countDocuments({
    createdBy: userId,
    assignedTo: { $ne: userId } // Only count if the task was not assigned to them
    });

    const overdueTasks = await Task.countDocuments({
      assignedTo: userId,
      dueDate: { $lt: new Date() },
      status: { $ne: 'Done' }
    });

    res.json({
      assignedTasks,
      createdTasks,
      overdueTasks
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllusers = async (req, res) => {
  try{
    const users = await User.find({}, '-password')
    res.status(200).json(users);
  }catch (error) {
    res.status(500).json({ message: error.message });
  }
}