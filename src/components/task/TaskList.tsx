import React, { useState, useMemo } from 'react';
import { Task, useTask } from '../../contexts/TaskContext';
import TaskItem from './TaskItem';
import { Search, SortDesc, SortAsc, Filter } from 'lucide-react';

const TaskList: React.FC = () => {
  const { tasks, loading } = useTask();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<'createdAt' | 'dueDate' | 'priority'>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

 
  const filteredTasks = useMemo(() => {
    let filtered = [...tasks];
    
   
    if (searchTerm) {
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
  
    if (statusFilter !== 'all') {
      filtered = filtered.filter(task => task.status === statusFilter);
    }
    
    
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(task => task.priority === priorityFilter);
    }
    
    
    filtered.sort((a, b) => {
      if (sortField === 'createdAt') {
        return sortDirection === 'asc' 
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortField === 'dueDate') {
       
        if (!a.dueDate) return sortDirection === 'asc' ? 1 : -1;
        if (!b.dueDate) return sortDirection === 'asc' ? -1 : 1;
        
        return sortDirection === 'asc'
          ? new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
          : new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
      } else if (sortField === 'priority') {
        const priorityValues = { low: 1, medium: 2, high: 3 };
        return sortDirection === 'asc'
          ? priorityValues[a.priority] - priorityValues[b.priority]
          : priorityValues[b.priority] - priorityValues[a.priority];
      }
      return 0;
    });
    
    return filtered;
  }, [tasks, searchTerm, statusFilter, priorityFilter, sortField, sortDirection]);

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  const handleSortChange = (field: 'createdAt' | 'dueDate' | 'priority') => {
    if (sortField === field) {
      toggleSortDirection();
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  if (loading && tasks.length === 0) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center">
              <Filter size={18} className="text-gray-400 mr-1" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            
            <div className="flex items-center">
              <Filter size={18} className="text-gray-400 mr-1" />
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            
            <div className="flex items-center">
              {sortDirection === 'asc' ? (
                <SortAsc size={18} className="text-gray-400 mr-1" />
              ) : (
                <SortDesc size={18} className="text-gray-400 mr-1" />
              )}
              <select
                value={sortField}
                onChange={(e) => handleSortChange(e.target.value as 'createdAt' | 'dueDate' | 'priority')}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="createdAt">Created Date</option>
                <option value="dueDate">Due Date</option>
                <option value="priority">Priority</option>
              </select>
            </div>
            
            <button
              onClick={toggleSortDirection}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              {sortDirection === 'asc' ? <SortAsc size={18} /> : <SortDesc size={18} />}
            </button>
          </div>
        </div>
      </div>
      
      {filteredTasks.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-sm text-center">
          <p className="text-gray-500">No tasks found</p>
        </div>
      ) : (
        <div>
          {filteredTasks.map((task) => (
            <TaskItem key={task._id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;