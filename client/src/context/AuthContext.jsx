'use client'
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import jsCookie from 'js-cookie';
import Loading from '../components/Loading';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
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

  const login = async (userType, credentials) => {
    try {
      const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/${userType}/login`;
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to login');
      }

      if (!data.token || !data.user) {
        throw new Error('Invalid response format from server');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      jsCookie.set('token', data.token, { expires: 1 });

      setUser(data.user);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    jsCookie.remove('token', { path: '/' });
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAuthenticated: !!user }}>
      {!loading ? children : <Loading />}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
