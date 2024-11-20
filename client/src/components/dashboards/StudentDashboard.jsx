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
  const [isLoading, setIsLoading] = useState(true);
  const [isDataLoading, setIsDataLoading] = useState(true);
  
  useEffect(() => {
    if (user?.id) {
      fetchReports();
    }
  }, [user]);

  const fetchReports = async () => {
    try {
      if (!user?.id) {
        throw new Error('User ID not found');
      }

      const response = await fetch(`http://localhost:5000/api/v1/reports/student/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch reports');
      
      const data = await response.json();
      setStudentReports(data);
    } catch (error) {
      console.log('Error fetching reports:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <Loading />;
  if (isDataLoading) return <DashboardSkeleton />;

  // Static data for now
  const internshipDetails = {
    companyName: "Tech Corp",
    startDate: "2024-01-01",
    endDate: "2024-06-30",
    status: "Approved",
    type: "Full-time"
  };

  const mentorDetails = {
    name: "Dr. John Doe",
    email: "john.doe@university.edu",
    phone: "+1234567890"
  };

  const progress = {
    reportsSubmitted: 3,
    totalReports: 12,
    completionPercentage: 25
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Welcome Banner */}
      <Card className="bg-primary text-primary-foreground">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome, {user?.firstName}!</CardTitle>
          <p className="text-lg opacity-90">Internship Status: {internshipDetails.status}</p>
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
              <Progress value={progress.completionPercentage} />
              <p className="text-sm text-muted-foreground">
                {progress.reportsSubmitted} of {progress.totalReports} reports submitted
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Next Report Due</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">5 Days</p>
            <Button className="mt-4" variant="outline">
              <FileUp className="mr-2" />
              Submit Report
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm">• Report #4 due soon</p>
              <p className="text-sm">• New message from mentor</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <ReportSubmission />
      <ReportList reports={studentReports} />

      {/* Internship Details */}
      <Card>
        <CardHeader>
          <CardTitle>Internship Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-medium">Company</p>
              <p className="text-muted-foreground">{internshipDetails.companyName}</p>
            </div>
            <div>
              <p className="font-medium">Duration</p>
              <p className="text-muted-foreground">
                {internshipDetails.startDate} to {internshipDetails.endDate}
              </p>
            </div>
            <div>
              <p className="font-medium">Type</p>
              <p className="text-muted-foreground">{internshipDetails.type}</p>
            </div>
            <div>
              <p className="font-medium">Status</p>
              <p className="text-muted-foreground">{internshipDetails.status}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mentor Details */}
      <Card>
        <CardHeader>
          <CardTitle>Internal Mentor</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p><span className="font-medium">Name:</span> {mentorDetails.name}</p>
            <p><span className="font-medium">Email:</span> {mentorDetails.email}</p>
            <p><span className="font-medium">Phone:</span> {mentorDetails.phone}</p>
            <Button className="mt-4" variant="outline">
              <MessageCircle className="mr-2" />
              Message Mentor
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 