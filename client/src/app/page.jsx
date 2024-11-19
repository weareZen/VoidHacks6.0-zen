'use client'
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import StudentDashboard from '../components/dashboards/StudentDashboard';
import MentorDashboard from '../components/dashboards/MentorDashboard';
import AdminDashboard from '../components/dashboards/AdminDashboard';
import ProtectedRoute from '../components/ProtectedRoute';
import { useAuth } from '../context/AuthContext';
import { DashboardSkeleton } from '../components/ui/loading';

export default function Home() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time (remove this in production)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const getDashboardComponent = () => {
    if (isLoading) return <DashboardSkeleton />;

    switch (user?.userType) {
      case 'student':
        return <StudentDashboard />;
      case 'mentor':
        return <MentorDashboard />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return redirect('/login');
    }
  };

  return <ProtectedRoute>{getDashboardComponent()}</ProtectedRoute>;
}
