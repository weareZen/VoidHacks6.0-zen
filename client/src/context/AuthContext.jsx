'use client'
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import jsCookie from 'js-cookie';
import Loading from '../components/Loading';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => {
    // Check if we have a token in localStorage
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (!token || !storedUser || storedUser === 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      } else {
        try {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser && typeof parsedUser === 'object') {
            setUser(parsedUser);
          } else {
            localStorage.removeItem('user');
            setUser(null);
          }
        } catch {
          localStorage.removeItem('user');
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (userData, authToken) => {
    try {
      if (!userData || !authToken) {
        throw new Error('Invalid login data');
      }

      // Store in state
      setUser(userData);
      setToken(authToken);

      // Store in localStorage
      localStorage.setItem('token', authToken);
      localStorage.setItem('user', JSON.stringify(userData));

      // Set default authorization header
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('token', authToken);
      }

      console.log('Auth data stored:', { userData, token: authToken });
    } catch (error) {
      console.error('Error storing auth data:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Clear all auth-related data from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Reset state
      setUser(null);
      setToken(null);
      
      // Clear any auth cookies if they exist
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      
      // Redirect to login page
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = {
    user,
    token,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : <Loading />}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
