import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Bell, AlertTriangle } from 'lucide-react';
import { differenceInDays, format } from 'date-fns';
import { useToast } from '../components/hooks/use-toast';

export default function DeadlineNotifications({ reports }) {
  const { toast } = useToast();
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);

  useEffect(() => {
    // Filter reports with upcoming deadlines (within 7 days)
    const upcoming = reports
      .filter(report => {
        const daysUntilDeadline = differenceInDays(new Date(report.deadline), new Date());
        return daysUntilDeadline >= 0 && daysUntilDeadline <= 7 && report.status === 'PENDING';
      })
      .sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

    setUpcomingDeadlines(upcoming);

    // Show toast notifications for urgent deadlines
    upcoming.forEach(report => {
      const daysRemaining = differenceInDays(new Date(report.deadline), new Date());
      if (daysRemaining <= 3) {
        toast({
          title: 'Urgent Deadline',
          description: `${report.title} is due in ${daysRemaining} days!`,
          variant: 'warning',
          duration: 5000,
        });
      }
    });
  }, [reports]);

  if (upcomingDeadlines.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-warning" />
          <CardTitle>Upcoming Deadlines</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {upcomingDeadlines.map(report => {
            const daysRemaining = differenceInDays(new Date(report.deadline), new Date());
            
            return (
              <div key={report._id} className="flex items-start gap-3 p-3 border rounded-lg">
                <AlertTriangle className={`h-5 w-5 ${daysRemaining <= 3 ? 'text-destructive' : 'text-warning'}`} />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{report.title}</h4>
                    <Badge variant={daysRemaining <= 3 ? 'destructive' : 'warning'}>
                      {daysRemaining} days left
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Due: {format(new Date(report.deadline), 'PPP')}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
} 