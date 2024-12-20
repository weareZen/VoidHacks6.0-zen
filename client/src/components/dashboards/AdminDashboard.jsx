import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { useAuth } from '../../context/AuthContext';
import { Progress } from '../../components/ui/progress';
import { Button } from '../../components/ui/button';
import { 
  Users, 
  Building,
  FileText, 
  Bell, 
  Settings,
  BarChart,
  UserPlus,
  CheckCircle
} from 'lucide-react';
import { Separator } from '../../components/ui/separator';
import { DashboardSkeleton } from '../../components/ui/loading';
import Loading from '../../components/Loading';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [adminStats, setAdminStats] = useState({
    totalStudents: 150,
    totalMentors: 25,
    pendingApprovals: 10,
    activeInternships: 85
  });
  const [pendingApprovals, setPendingApprovals] = useState([
    {
      id: 1,
      type: 'company',
      name: 'Tech Corp',
      status: 'Pending Verification',
      submittedDate: '2024-03-15'
    },
    {
      id: 2,
      type: 'internship',
      studentName: 'John Doe',
      company: 'Innovation Labs',
      status: 'Pending Approval',
      submittedDate: '2024-03-14'
    }
  ]);
  const [recentActivities, setRecentActivities] = useState([
    {
      id: 1,
      type: 'student_registration',
      message: 'New student registration: John Doe',
      timestamp: '2 hours ago'
    },
    {
      id: 2,
      type: 'company_verification',
      message: 'Company verification pending: Tech Corp',
      timestamp: '3 hours ago'
    }
  ]);

  useEffect(() => {
    // Initial loading animation
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    // Simulated data fetch
    const fetchData = async () => {
      try {
        // We'll implement the actual API call later
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsDataLoading(false);
      } catch (error) {
        console.log('Error fetching data:', error);
        setIsDataLoading(false);
      }
    };

    fetchData();
    return () => clearTimeout(timer);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/v1/admin/dashboard-stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }
      
      const data = await response.json();
      setAdminStats(data.stats);
      setPendingApprovals(data.pendingApprovals);
      setRecentActivities(data.recentActivities);
    } catch (error) {
      console.log('Error fetching dashboard data:', error);
    } finally {
      setIsDataLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
      setIsLoading(false);
    }
  };

  if (isLoading) return <Loading />;
  if (isDataLoading) return <DashboardSkeleton />;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Welcome Banner */}
      <Card className="bg-primary text-primary-foreground">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Welcome, {user?.firstName}!</CardTitle>
            <p className="text-lg opacity-90">Role: Administrator</p>
          </div>
          <Button 
            variant="secondary" 
            onClick={handleLogout}
            className="ml-auto"
          >
            Logout
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4 mt-2">
            <div>
              <p className="text-sm opacity-75">Total Students</p>
              <p className="text-2xl font-bold">{adminStats.totalStudents}</p>
            </div>
            <div>
              <p className="text-sm opacity-75">Total Mentors</p>
              <p className="text-2xl font-bold">{adminStats.totalMentors}</p>
            </div>
            <div>
              <p className="text-sm opacity-75">Pending Approvals</p>
              <p className="text-2xl font-bold">{adminStats.pendingApprovals}</p>
            </div>
            <div>
              <p className="text-sm opacity-75">Active Internships</p>
              <p className="text-2xl font-bold">{adminStats.activeInternships}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Button className="flex flex-col h-24 items-center justify-center gap-2">
          <UserPlus className="h-6 w-6" />
          Add New Mentor
        </Button>
        <Button className="flex flex-col h-24 items-center justify-center gap-2" variant="outline">
          <Building className="h-6 w-6" />
          Verify Company
        </Button>
        <Button className="flex flex-col h-24 items-center justify-center gap-2" variant="outline">
          <Users className="h-6 w-6" />
          Assign Mentors
        </Button>
        <Button className="flex flex-col h-24 items-center justify-center gap-2" variant="outline">
          <BarChart className="h-6 w-6" />
          View Reports
        </Button>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Approvals */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Approvals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingApprovals.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium">
                      {item.type === 'company' ? item.name : `${item.studentName} - ${item.company}`}
                    </p>
                    <p className="text-sm text-muted-foreground">{item.status}</p>
                    {item.submittedDate && (
                      <p className="text-sm text-muted-foreground">Submitted: {item.submittedDate}</p>
                    )}
                  </div>
                  <Button size="sm">Review</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <React.Fragment key={activity.id}>
                  <div className="flex items-start gap-3">
                    <Bell className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.message}</p>
                      <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                    </div>
                  </div>
                  {index < recentActivities.length - 1 && (
                    <Separator className="my-2" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 