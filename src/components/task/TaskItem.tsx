import React, { useState } from 'react';
import { Pencil, Trash2, CheckCircle } from 'lucide-react';
import { Task, useTask } from '../../contexts/TaskContext';
import Card from '../ui/Card';
import Button from '../ui/Button';
import TaskForm from './TaskForm';

interface TaskItemProps {
  task: Task;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const [isEditing, setIsEditing] = useState(false);
  const { updateTask, deleteTask } = useTask();

  const handleStatusChange = async () => {
    const newStatus = 
      task.status === 'pending' ? 'in-progress' : 
      task.status === 'in-progress' ? 'completed' : 
      'pending';
    
    await updateTask(task._id, { status: newStatus });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await deleteTask(task._id);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = async (updatedTask: Partial<Task>) => {
    await updateTask(task._id, updatedTask);
    setIsEditing(false);
  };

  // Priority colors
  const priorityColors = {
    low: 'bg-blue-100 text-blue-800',
    medium: 'bg-amber-100 text-amber-800',
    high: 'bg-rose-100 text-rose-800',
  };

  // Status colors
  const statusColors = {
    pending: 'bg-gray-100 text-gray-800',
    'in-progress': 'bg-purple-100 text-purple-800',
    completed: 'bg-emerald-100 text-emerald-800',
  };

  if (isEditing) {
    return (
      <Card className="mb-4 transform transition-all duration-200 hover:shadow-lg">
        <TaskForm 
          initialData={task}
          onSubmit={handleSave}
          onCancel={handleCancel}
          isEditing
        />
      </Card>
    );
  }

  return (
    <Card className="mb-4 transform transition-all duration-200 hover:shadow-lg">
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className={`text-lg font-semibold ${task.status === 'completed' ? 'line-through text-gray-500' : ''}`}>
            {task.title}
          </h3>
          <div className="flex space-x-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>
              {task.priority}
            </span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[task.status]}`}>
              {task.status}
            </span>
          </div>
        </div>
        
        {task.description && (
          <p className={`text-gray-600 mb-4 ${task.status === 'completed' ? 'line-through text-gray-400' : ''}`}>
            {task.description}
          </p>
        )}
        
        {task.dueDate && (
          <div className="text-sm text-gray-500 mb-4">
            Due: {new Date(task.dueDate).toLocaleDateString()}
          </div>
        )}
        
        <div className="flex justify-between items-center mt-4">
          <div className="text-xs text-gray-500">
            Created: {new Date(task.createdAt).toLocaleDateString()}
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleStatusChange}
              aria-label="Change status"
            >
              <CheckCircle size={16} className="mr-1" />
              {task.status === 'pending' ? 'Start' : task.status === 'in-progress' ? 'Complete' : 'Reopen'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleEdit}
              aria-label="Edit task"
            >
              <Pencil size={16} />
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleDelete}
              aria-label="Delete task"
            >
              <Trash2 size={16} />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TaskItem;