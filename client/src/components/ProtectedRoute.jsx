'use client'

import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Loading from './Loading';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    let timeoutId;
    
    if (!user && !loading) {
      timeoutId = setTimeout(() => {
        window.location.href = '/login';
      }, 500);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [user, loading]);

  if (loading) return <Loading />;
  if (!user) return null;

  return <>{children}</>;
} 