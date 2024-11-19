import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { useAuth } from '../../context/AuthContext';
import { Progress } from '../../components/ui/progress';
import { Button } from '../../components/ui/button';
import { 
  Users, 
  ClipboardCheck, 
  MessageCircle, 
  Bell, 
  FileText,
  UserCheck,
  BarChart
} from 'lucide-react';
import { Separator } from '../../components/ui/separator';
import Loading from '../../components/ui/loading';
import { DashboardSkeleton } from '../../components/ui/loading';

export default function MentorDashboard() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isDataLoading, setIsDataLoading] = useState(true);
  
  useEffect(() => {
    // Initial loading animation
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    // Simulated data fetch
    const fetchData = async () => {
      try {
        // Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsDataLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return <Loading />;
  if (isDataLoading) return <DashboardSkeleton />;

  // Static data for now
  const mentorStats = {
    totalStudents: 15,
    pendingEvaluations: 5,
    averageCompletion: 65
  };

  const assignedStudents = [
    {
      id: 1,
      name: "Alice Johnson",
      enrollmentNumber: "EN2024001",
      company: "Tech Corp",
      status: "Approved",
      progress: {
        reportsSubmitted: 3,
        totalReports: 12,
        completionPercentage: 25
      }
    },
    {
      id: 2,
      name: "Bob Smith",
      enrollmentNumber: "EN2024002",
      company: "Innovation Labs",
      status: "Pending",
      progress: {
        reportsSubmitted: 4,
        totalReports: 12,
        completionPercentage: 33
      }
    }
  ];

  const pendingReports = [
    {
      id: 1,
      studentName: "Alice Johnson",
      title: "Fortnightly Report - Week 2",
      submissionDate: "2024-03-15"
    },
    {
      id: 2,
      studentName: "Bob Smith",
      title: "Fortnightly Report - Week 4",
      submissionDate: "2024-03-14"
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Welcome Banner */}
      <Card className="bg-primary text-primary-foreground">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome, {user?.firstName}!</CardTitle>
          <p className="text-lg opacity-90">Role: Internal Mentor</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mt-2">
            <div>
              <p className="text-sm opacity-75">Total Students</p>
              <p className="text-2xl font-bold">{mentorStats.totalStudents}</p>
            </div>
            <div>
              <p className="text-sm opacity-75">Pending Evaluations</p>
              <p className="text-2xl font-bold">{mentorStats.pendingEvaluations}</p>
            </div>
            <div>
              <p className="text-sm opacity-75">Average Completion</p>
              <p className="text-2xl font-bold">{mentorStats.averageCompletion}%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Button className="flex flex-col h-24 items-center justify-center gap-2">
          <ClipboardCheck className="h-6 w-6" />
          Evaluate Reports
        </Button>
        <Button className="flex flex-col h-24 items-center justify-center gap-2" variant="outline">
          <FileText className="h-6 w-6" />
          Create Assignment
        </Button>
        <Button className="flex flex-col h-24 items-center justify-center gap-2" variant="outline">
          <MessageCircle className="h-6 w-6" />
          Message Students
        </Button>
        <Button className="flex flex-col h-24 items-center justify-center gap-2" variant="outline">
          <BarChart className="h-6 w-6" />
          View Analytics
        </Button>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assigned Students */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Assigned Students</CardTitle>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {assignedStudents.map((student) => (
                <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium">{student.name}</p>
                    <p className="text-sm text-muted-foreground">EN: {student.enrollmentNumber}</p>
                    <p className="text-sm text-muted-foreground">{student.company}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-sm font-medium">Progress</p>
                    <Progress value={student.progress.completionPercentage} className="w-[100px]" />
                    <p className="text-sm text-muted-foreground">
                      {student.progress.reportsSubmitted}/{student.progress.totalReports} Reports
                    </p>
                  </div>
                  <Button size="sm">View Profile</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Evaluations */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Evaluations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingReports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium">{report.title}</p>
                    <p className="text-sm text-muted-foreground">{report.studentName}</p>
                    <p className="text-sm text-muted-foreground">Submitted: {report.submissionDate}</p>
                  </div>
                  <Button size="sm">Evaluate</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <Bell className="mt-1 h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">New Report Submitted</p>
                  <p className="text-sm text-muted-foreground">Alice Johnson submitted Week 2 Report</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-start gap-4">
                <Bell className="mt-1 h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Evaluation Reminder</p>
                  <p className="text-sm text-muted-foreground">5 reports pending evaluation</p>
                  <p className="text-xs text-muted-foreground">1 day ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 