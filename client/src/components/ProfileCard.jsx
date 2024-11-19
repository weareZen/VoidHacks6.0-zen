import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { User, Mail, Phone, Building, Calendar, Award } from 'lucide-react';

export default function ProfileCard({ user }) {
  const getProfileFields = (userType) => {
    const commonFields = [
      { icon: <User />, label: 'Name', value: user?.name },
      { icon: <Mail />, label: 'Email', value: user?.email },
      { icon: <Phone />, label: 'Phone', value: user?.phoneNumber || 'N/A' },
    ];

    const specificFields = {
      student: [
        { icon: <Building />, label: 'Company', value: user?.internshipDetails?.companyName || 'Not Assigned' },
        { icon: <Calendar />, label: 'Start Date', value: user?.internshipDetails?.startDate || 'Not Set' },
        { icon: <Calendar />, label: 'End Date', value: user?.internshipDetails?.endDate || 'Not Set' },
      ],
      mentor: [
        { icon: <Building />, label: 'Department', value: user?.department },
        { icon: <Building />, label: 'Office Location', value: user?.officeLocation },
        { icon: <Award />, label: 'Students Assigned', value: user?.assignedStudents?.length || 0 },
      ],
      admin: [
        { icon: <Building />, label: 'Department', value: user?.department },
        { icon: <Award />, label: 'Role', value: 'Administrator' },
      ],
    };

    return [...commonFields, ...(specificFields[userType] || [])];
  };

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