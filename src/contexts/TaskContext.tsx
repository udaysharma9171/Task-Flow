import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed";
  priority: "low" | "medium" | "high";
  dueDate?: string;
  createdAt: string;
}

interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  getTasks: () => Promise<void>;
  createTask: (taskData: Partial<Task>) => Promise<void>;
  updateTask: (id: string, taskData: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}

export const TaskContext = createContext<TaskContextType>({
  tasks: [],
  loading: false,
  error: null,
  getTasks: async () => {},
  createTask: async () => {},
  updateTask: async () => {},
  deleteTask: async () => {},
});

interface TaskProviderProps {
  children: ReactNode;
}

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const getAxiosConfig = useCallback(() => {
    return {
      headers: {
        Authorization: `Bearer ${user?.token}`,
      },
    };
  }, [user]);

  // Fetch all tasks
  const getTasks = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/tasks`,
        getAxiosConfig()
      );
      setTasks(response.data);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || "Error fetching tasks");
      } else {
        setError("Error fetching tasks");
      }
    } finally {
      setLoading(false);
    }
  }, [user, getAxiosConfig]);

  // Create a new task
  const createTask = async (taskData: Partial<Task>) => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/tasks`,
        taskData,
        getAxiosConfig()
      );
      setTasks([response.data, ...tasks]);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || "Error creating task");
      } else {
        setError("Error creating task");
      }
    } finally {
      setLoading(false);
    }
  };

  // Update a task
  const updateTask = async (id: string, taskData: Partial<Task>) => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/tasks/${id}`,
        taskData,
        getAxiosConfig()
      );

      setTasks(tasks.map((task) => (task._id === id ? response.data : task)));
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || "Error updating task");
      } else {
        setError("Error updating task");
      }
    } finally {
      setLoading(false);
    }
  };

  // Delete a task
  const deleteTask = async (id: string) => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/tasks/${id}`,
        getAxiosConfig()
      );

      setTasks(tasks.filter((task) => task._id !== id));
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || "Error deleting task");
      } else {
        setError("Error deleting task");
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch tasks when user changes
  useEffect(() => {
    if (user) {
      getTasks();
    } else {
      setTasks([]);
    }
  }, [user, getTasks]);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        error,
        getTasks,
        createTask,
        updateTask,
        deleteTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = () => React.useContext(TaskContext);
