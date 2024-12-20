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
      console.log('Token:', token);
      const storedUser = localStorage.getItem('user');

      if (!token || !storedUser || storedUser === 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setLoading(false);
        return;
      }

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
      } finally {
        setLoading(false);
      }
    };

    // Add cleanup timeout
    const loadingTimeout = setTimeout(() => {
      setLoading(false);
    }, 3000);

    checkAuth();

    return () => clearTimeout(loadingTimeout);
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
      
      // Force reload after login to ensure proper state
      window.location.href = '/';
    } catch (error) {
      console.error('Error storing auth data:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      
      // First clear all storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Clear all auth-related data from localStorage
      jsCookie.remove('token',{path: '/'});
      localStorage.clear();

      sessionStorage.clear();
      
      // Reset state
      setUser(null);
      setToken(null);
      
      // Clear cookies
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
      
      // Important: Set loading to false before redirect
      setLoading(false);
      
      // Force redirect to login page
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
      setLoading(false);
      // Still redirect on error
      window.location.href = '/login';
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
