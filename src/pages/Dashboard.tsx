import React, { useState } from 'react';
import TaskDashboard from '../components/task/TaskDashboard';
import TaskForm from '../components/task/TaskForm';
import TaskList from '../components/task/TaskList';
import { useTask } from '../contexts/TaskContext';
import { PlusCircle, X } from 'lucide-react';
import Button from '../components/ui/Button';
import Card, { CardHeader, CardBody } from '../components/ui/Card';

const Dashboard: React.FC = () => {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const { createTask } = useTask();

  const handleAddTask = async (taskData: any) => {
    await createTask(taskData);
    setIsAddingTask(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <TaskDashboard />

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Tasks</h2>
        <Button
          onClick={() => setIsAddingTask(true)}
          className="flex items-center"
          disabled={isAddingTask}
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          Add Task
        </Button>
      </div>

      {isAddingTask && (
        <Card className="mb-6 animate-fade-in">
          <CardHeader className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Create New Task</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAddingTask(false)}
              aria-label="Close form"
            >
              <X size={16} />
            </Button>
          </CardHeader>
          <CardBody>
            <TaskForm 
              onSubmit={handleAddTask}
              onCancel={() => setIsAddingTask(false)}
            />
          </CardBody>
        </Card>
      )}

      <TaskList />
    </div>
  );
};

export default Dashboard;