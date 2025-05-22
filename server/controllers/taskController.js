import Task from '../models/taskModel.js';

export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(tasks);
  }
  catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    res.json(task);
  }
  catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;
    
    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
      user: req.user._id
    });
    
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const updateTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;
    
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    // Update task
    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;
    task.priority = priority || task.priority;
    task.dueDate = dueDate || task.dueDate;
    
    const updatedTask = await task.save();
    
    res.json(updatedTask);
  }
  catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTask = async (req, res) => {
  
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    await Task.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Task removed' });
  }
  catch (error) {
    res.status(500).json({ message: error.message });
  }
};