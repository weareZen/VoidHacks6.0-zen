'use client'
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Initialize auth state
  useEffect(() => {
    const checkAuth = () => {
      try {
        // Get stored data
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        // Clear storage if data is invalid
        if (!token || !storedUser || storedUser === 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
          return;
        }

        // Try to parse user data
        try {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser && typeof parsedUser === 'object') {
            setUser(parsedUser);
          } else {
            localStorage.removeItem('user');
            setUser(null);
          }
        } catch (parseError) {
          console.error('Failed to parse user data:', parseError);
          localStorage.removeItem('user');
          setUser(null);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (userType, credentials) => {
    try {
      const response = await fetch(`http://localhost:5000/api/v1/${userType}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store token first
      localStorage.setItem('token', data.token);

      // Extract and store user data
      const userData = data[userType] || data;
      if (!userData) {
        throw new Error('Invalid response format');
      }

      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      // Return early if successful
      return data;
    } catch (error) {
      console.error('Login error:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      throw error;
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Provide auth context
  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : <div>Loading...</div>}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 