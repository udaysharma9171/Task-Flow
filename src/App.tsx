import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { TaskProvider } from './contexts/TaskContext';
import Navbar from './components/layout/Navbar';
import ProtectedRoute from './components/layout/ProtectedRoute';
import { Toaster } from 'react-hot-toast'; // For toast notifications

// Lazy load components for better performance
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));

// Simple Error Boundary Component
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught in ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">Something went wrong.</h1>
            <p className="mt-2 text-gray-600">Please try refreshing the page or contact support.</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Refresh
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// App Loading Component
const AppLoading: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600"></div>
  </div>
);

// Footer Component
const Footer: React.FC = () => (
  <footer className="bg-gray-800 text-white py-4">
    <div className="container mx-auto text-center">
      <p>&copy; {new Date().getFullYear()} Task Manager. All rights reserved.</p>
      <p className="text-sm mt-1">
        Built with ❤️ by <a href="https://x.ai" className="underline hover:text-indigo-400">xAI</a>
      </p>
    </div>
  </footer>
);

function App() {
  const { loading } = useAuth(); // Get loading state from AuthContext

  // Show a loading spinner while checking auth status
  if (loading) {
    return <AppLoading />;
  }

  return (
    <ErrorBoundary>
      <AuthProvider>
        <TaskProvider>
          <Router>
            <div className="min-h-screen bg-gray-50 flex flex-col">
              {/* Toast Notifications */}
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 3000,
                  style: {
                    background: '#333',
                    color: '#fff',
                  },
                }}
              />

              {/* Navbar */}
              <Navbar />

              {/* Main Content */}
              <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <Suspense fallback={<AppLoading />}>
                  <Routes>
                    <Route
                      path="/"
                      element={
                        <ProtectedRoute>
                          <Dashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="/signin" element={<Login />} />
                    <Route path="/signup" element={<Register />} />
                    <Route path="*" element={<Navigate to="/" />} />
                  </Routes>
                </Suspense>
              </main>

              {/* Footer */}
              <Footer />
            </div>
          </Router>
        </TaskProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App; 