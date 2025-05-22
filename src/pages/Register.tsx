import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Card, { CardHeader, CardBody, CardFooter } from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { AlertCircle } from 'lucide-react';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    try {
      await register(name, email, password);
      navigate('/');
    } catch (err) {
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
          <p className="mt-2 text-gray-600">Get started with managing your tasks</p>
        </div>
        
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-center">Register</h2>
          </CardHeader>
          
          <CardBody>
            {error && (
              <div className="mb-4 p-3 bg-rose-50 text-rose-700 rounded-md flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                <span>{error}</span>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                id="name"
                label="Full Name"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={errors.name}
                fullWidth
                autoComplete="name"
              />
              
              <Input
                id="email"
                type="email"
                label="Email"
                placeholder="youremail@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
                fullWidth
                autoComplete="email"
              />
              
              <Input
                id="password"
                type="password"
                label="Password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                fullWidth
                autoComplete="new-password"
              />
              
              <Input
                id="confirmPassword"
                type="password"
                label="Confirm Password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={errors.confirmPassword}
                fullWidth
                autoComplete="new-password"
              />
              
              <Button
                type="submit"
                isLoading={loading}
                fullWidth
                className="mt-6"
              >
                Create Account
              </Button>
            </form>
          </CardBody>
          
          <CardFooter className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-medium">
                Login
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Register;