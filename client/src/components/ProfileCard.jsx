import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { User, Mail, Phone, Building, Calendar, Award, Briefcase, MapPin, Hash, Users, Percent } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';

export default function ProfileCard({ user }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  const formatDate = (date) => {
    if (!date) return 'Not Set';
    return format(new Date(date), 'PPP');
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const baseUrl = 'http://localhost:5000/api/v1';
        let endpoint = '';
        
        switch (user?.userType) {
          case 'student':
            endpoint = `${baseUrl}/students/profile/${user.id}`;
            break;
          case 'mentor':
            endpoint = `${baseUrl}/mentors/profile/${user.id}`;
            break;
          case 'admin':
            endpoint = `${baseUrl}/admin/profile/${user.id}`;
            break;
          default:
            throw new Error('Invalid user type');
        }

        const response = await fetch(endpoint, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setUserData(data.mentor || data.student || data.admin);
      } catch (error) {
        console.log('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchUserData();
    }
  }, [user?.id, user?.userType, token]);

  const getProfileFields = (userType) => {
    const studentFields = [
      { icon: <User />, label: 'Name', value: `${userData?.firstName} ${userData?.lastName}` },
      { icon: <Mail />, label: 'Email', value: userData?.email },
      { icon: <Phone />, label: 'Phone', value: userData?.phoneNumber || 'Not Set' },
      { icon: <Hash />, label: 'Enrollment Number', value: userData?.enrollmentNumber },
      { icon: <Building />, label: 'Company', value: userData?.internshipDetails?.companyName },
      { icon: <MapPin />, label: 'Company Address', value: userData?.internshipDetails?.companyAddress },
      { icon: <Calendar />, label: 'Start Date', value: formatDate(userData?.internshipDetails?.startDate) },
      { icon: <Calendar />, label: 'End Date', value: formatDate(userData?.internshipDetails?.endDate) },
      { icon: <Briefcase />, label: 'Internship Type', value: userData?.internshipDetails?.type },
      { icon: <User />, label: 'External Mentor', value: userData?.internshipDetails?.externalMentor?.name },
      { icon: <Mail />, label: 'External Mentor Email', value: userData?.internshipDetails?.externalMentor?.email },
    ];

    const mentorFields = [
      { icon: <User />, label: 'Name', value: `${userData?.firstName} ${userData?.lastName}` },
      { icon: <Mail />, label: 'Email', value: userData?.email },
      { icon: <Phone />, label: 'Phone', value: userData?.phoneNumber || 'Not Set' },
      { icon: <Building />, label: 'Department', value: userData?.department || 'Not Set' },
      { icon: <MapPin />, label: 'Office Location', value: userData?.officeLocation || 'Not Set' },
      { icon: <Users />, label: 'Students Assigned', value: userData?.assignedStudents?.length || 0 },
      { icon: <Calendar />, label: 'Joined Date', value: formatDate(userData?.createdAt) },
    ];

    const adminFields = [
      { icon: <Building />, label: 'Department', value: userData?.department },
      { icon: <Award />, label: 'Role', value: userData?.role || 'Administrator' },
      { icon: <Calendar />, label: 'Joining Date', value: formatDate(userData?.joiningDate) },
    ];

    switch (userType) {
      case 'student':
        return studentFields;
      case 'mentor':
        return mentorFields;
      case 'admin':
        return adminFields;
      default:
        throw new Error('Invalid user type');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">Profile Information</CardTitle>
          <Badge>{user?.userType?.toUpperCase()}</Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        {getProfileFields(user?.userType).map((field, index) => (
          <div key={index} className="flex items-center space-x-4 rounded-lg border p-4">
            <div className="p-2 bg-primary/10 rounded-full">
              {field.icon}
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">{field.label}</p>
              <p className="text-sm text-muted-foreground">{field.value}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
} 