import React, { createContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface User {
  _id: string;
  name: string;
  email: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  error: null,
  login: async () => false,
  register: async () => false,
  logout: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Login user
  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/users/login`, { 
        email, 
        password 
      });

      const userData = response.data;
      
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return true; 
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || 'An error occurred during login');
      } else {
        setError('An error occurred during login');
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Register user
  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/users/register`, {
        name,
        email,
        password
      });
      
      const userData = response.data;
      
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return true;
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || 'An error occurred during registration');
      } else {
        setError('An error occurred during registration');
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login'); 
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);