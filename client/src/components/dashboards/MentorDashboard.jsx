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
import { Separator } from '../ui/separator';
import Loading from '../Loading';
import { DashboardSkeleton } from '../ui/loading';
import ReportEvaluation from '../ReportEvaluation';
import ReportAnalytics from '../ReportAnalytics';
import DeadlineNotifications from '../DeadlineNotifications';

export default function MentorDashboard() {
  const { user } = useAuth();
  const [mentorStats, setMentorStats] = useState(null);
  const [reports, setReports] = useState({ pending: [], all: [] });
  const [assignedStudents, setAssignedStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMentorData = async () => {
      try {
        if (!user?.id) return;

        const [statsResponse, reportsResponse, studentsResponse] = await Promise.all([
          fetch(`${process.env.NEXT_APP_API_URL || 'http://localhost:5000/api/v1'}/mentors/${user.id}/dashboard-stats`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }),
          fetch(`${process.env.NEXT_APP_API_URL || 'http://localhost:5000/api/v1'}/reports/mentor/${user.id}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }),
          fetch(`${process.env.NEXT_APP_API_URL || 'http://localhost:5000/api/v1'}/mentors/${user.id}/assigned-students`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          })
        ]);

        if (!statsResponse.ok || !reportsResponse.ok || !studentsResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const [statsData, reportsData, studentsData] = await Promise.all([
          statsResponse.json(),
          reportsResponse.json(),
          studentsResponse.json()
        ]);

        setMentorStats(statsData);
        setReports({
          pending: reportsData.pendingReports || [],
          all: reportsData.allReports || []
        });
        setAssignedStudents(studentsData.assignedStudents || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMentorData();
  }, [user?.id]);

  if (error) return <div>Error loading dashboard: {error}</div>;
  if (isLoading) return <Loading />;
  if (!mentorStats) return <div>No mentor data found</div>;

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

      <DeadlineNotifications reports={reports.pending} />

      {/* Reports Analytics */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Reports Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <ReportAnalytics reports={reports.all} />
        </CardContent>
      </Card>

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
              {reports.pending.map((report) => (
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