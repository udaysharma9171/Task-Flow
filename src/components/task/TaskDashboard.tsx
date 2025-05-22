import React, { useMemo } from 'react';
import { Task, useTask } from '../../contexts/TaskContext';
import Card, { CardBody, CardHeader } from '../ui/Card';
import { useAuth } from '../../contexts/AuthContext';
import { CheckCircle, Clock, AlertTriangle } from 'lucide-react';

const TaskDashboard: React.FC = () => {
  const { tasks } = useTask();
  const { user } = useAuth();

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.status === 'completed').length;
    const pending = tasks.filter(task => task.status === 'pending').length;
    const inProgress = tasks.filter(task => task.status === 'in-progress').length;
    const highPriority = tasks.filter(task => task.priority === 'high').length;
    
    // logic for overdue tasks
    const overdue = tasks.filter(task => {
      if (!task.dueDate || task.status === 'completed') return false;
      return new Date(task.dueDate) < new Date();
    }).length;
    
    // Calculate completion rate
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return {
      total,
      completed,
      pending,
      inProgress,
      highPriority,
      overdue,
      completionRate
    };
  }, [tasks]);

  // Function to get recent tasks
  const recentTasks = useMemo(() => {
    return [...tasks]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }, [tasks]);

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      
      {user && (
        <div className="mb-6">
          <p className="text-lg">
            Welcome back, <span className="font-semibold">{user.name}</span>!
          </p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard 
          title="Total Tasks" 
          value={stats.total} 
          icon={<CheckCircle className="h-5 w-5 text-indigo-500" />}
          bgColor="bg-indigo-50"
        />
        <StatCard 
          title="Completed" 
          value={stats.completed} 
          subtext={`${stats.completionRate}% completion rate`}
          icon={<CheckCircle className="h-5 w-5 text-emerald-500" />}
          bgColor="bg-emerald-50"
        />
        <StatCard 
          title="In Progress" 
          value={stats.inProgress} 
          icon={<Clock className="h-5 w-5 text-amber-500" />}
          bgColor="bg-amber-50"
        />
        <StatCard 
          title="Overdue" 
          value={stats.overdue} 
          icon={<AlertTriangle className="h-5 w-5 text-rose-500" />}
          bgColor="bg-rose-50"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Recent Tasks</h3>
          </CardHeader>
          <CardBody>
            {recentTasks.length > 0 ? (
              <ul className="space-y-3">
                {recentTasks.map(task => (
                  <RecentTaskItem key={task._id} task={task} />
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No tasks yet</p>
            )}
          </CardBody>
        </Card>
        
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Task Progress</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <ProgressBar label="Completed" value={stats.completionRate} color="bg-emerald-500" />
              <ProgressBar 
                label="High Priority" 
                value={stats.total > 0 ? Math.round((stats.highPriority / stats.total) * 100) : 0} 
                color="bg-rose-500" 
              />
              <ProgressBar 
                label="In Progress" 
                value={stats.total > 0 ? Math.round((stats.inProgress / stats.total) * 100) : 0} 
                color="bg-amber-500" 
              />
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: number;
  subtext?: string;
  icon?: React.ReactNode;
  bgColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtext, icon, bgColor = 'bg-gray-50' }) => {
  return (
    <Card className={`${bgColor} hover:shadow-md transition-shadow`}>
      <CardBody>
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-3xl font-bold mt-1">{value}</p>
            {subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
          </div>
          {icon}
        </div>
      </CardBody>
    </Card>
  );
};

interface RecentTaskItemProps {
  task: Task;
}

const RecentTaskItem: React.FC<RecentTaskItemProps> = ({ task }) => {
  
  const statusStyles = {
    pending: 'bg-gray-100 text-gray-800',
    'in-progress': 'bg-amber-100 text-amber-800',
    completed: 'bg-emerald-100 text-emerald-800',
  };

  return (
    <li className="p-3 hover:bg-gray-50 rounded-md transition-colors">
      <div className="flex justify-between items-center">
        <div className="flex-1">
          <p className={`font-medium ${task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-800'}`}>
            {task.title}
          </p>
          <p className="text-xs text-gray-500">
            {new Date(task.createdAt).toLocaleDateString()}
          </p>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full ${statusStyles[task.status]}`}>
          {task.status}
        </span>
      </div>
    </li>
  );
};

interface ProgressBarProps {
  label: string;
  value: number;
  color: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ label, value, color }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-medium text-gray-700">{value}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className={`${color} h-2.5 rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${value}%` }}
        ></div>
      </div>
    </div>
  );
};

export default TaskDashboard;