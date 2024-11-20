import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { useAuth } from '../../context/AuthContext';
import { Progress } from '../../components/ui/progress';
import { Button } from '../../components/ui/button';
import { FileUp, MessageCircle, Bell } from 'lucide-react';
import Loading from '../Loading';
import { DashboardSkeleton } from '../ui/loading';
import ReportSubmission from '../ReportSubmission'
import ReportList from '../ReportList';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [studentReports, setStudentReports] = useState([]);
  const [studentData, setStudentData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReportForm, setShowReportForm] = useState(false);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        if (!user?.id) {
          setIsLoading(false);
          return;
        }

        const [reportsResponse, studentResponse] = await Promise.all([
          fetch(`http://localhost:5000/api/v1/reports/student/${user.id}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }),
          fetch(`http://localhost:5000/api/v1/students/${user.id}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          })
        ]);

        if (!reportsResponse.ok || !studentResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const [reportsData, studentData] = await Promise.all([
          reportsResponse.json(),
          studentResponse.json()
        ]);

        setStudentReports(reportsData.reports || []);
        setStudentData(studentData.student);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudentData();
  }, [user?.id]);

  // Calculate next report due
  const getNextReportDue = () => {
    if (!Array.isArray(studentReports)) return null;
    
    const pendingReports = studentReports.filter(report => report.status === 'PENDING');
    if (pendingReports.length === 0) return null;
    
    return pendingReports.reduce((nearest, report) => {
      return new Date(report.deadline) < new Date(nearest.deadline) ? report : nearest;
    });
  };

  const nextReport = getNextReportDue();
  const daysUntilDue = nextReport ? 
    Math.ceil((new Date(nextReport.deadline) - new Date()) / (1000 * 60 * 60 * 24)) : 
    null;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Welcome Banner */}
      <Card className="bg-primary text-primary-foreground">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome, {studentData?.firstName}!</CardTitle>
          <p className="text-lg opacity-90">
            Internship Status: {studentData?.internshipDetails?.status}
          </p>
        </CardHeader>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Reports Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Progress value={studentData?.progress?.overallCompletionPercentage || 0} />
              <p className="text-sm text-muted-foreground">
                {studentData?.progress?.completedReports} of {studentData?.progress?.totalReports} reports submitted
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Next Report Due</CardTitle>
          </CardHeader>
          <CardContent>
            {nextReport ? (
              <>
                <p className="text-2xl font-bold">{daysUntilDue} Days</p>
                <Button 
                  className="mt-4" 
                  variant="outline"
                  onClick={() => setShowReportForm(true)}
                >
                  <FileUp className="mr-2" />
                  Submit Report
                </Button>
              </>
            ) : (
              <p>No pending reports</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Internship Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><span className="font-medium">Company:</span> {studentData?.internshipDetails?.companyName}</p>
              <p><span className="font-medium">Duration:</span> {
                `${new Date(studentData?.internshipDetails?.startDate).toLocaleDateString()} to 
                 ${new Date(studentData?.internshipDetails?.endDate).toLocaleDateString()}`
              }</p>
              <p><span className="font-medium">Type:</span> {studentData?.internshipDetails?.internshipType}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mentor Details */}
      {studentData?.internalMentor && (
        <Card>
          <CardHeader>
            <CardTitle>Internal Mentor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Name:</span> 
                {`${studentData.internalMentor.firstName} ${studentData.internalMentor.lastName}`}
              </p>
              <p><span className="font-medium">Email:</span> {studentData.internalMentor.email}</p>
              <p><span className="font-medium">Phone:</span> {studentData.internalMentor.phone}</p>
              <Button className="mt-4" variant="outline">
                <MessageCircle className="mr-2" />
                Message Mentor
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 