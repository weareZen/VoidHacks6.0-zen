import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { 
  FileText, 
  Clock, 
  AlertTriangle,
  CheckCircle 
} from 'lucide-react';
import { format, differenceInDays } from 'date-fns';

export default function ReportList({ reports }) {
  const getDeadlineStatus = (deadline) => {
    const daysRemaining = differenceInDays(new Date(deadline), new Date());
    if (daysRemaining < 0) return { status: 'overdue', variant: 'destructive' };
    if (daysRemaining <= 3) return { status: 'urgent', variant: 'warning' };
    return { status: 'upcoming', variant: 'default' };
  };

  const getStatusBadge = (report) => {
    switch (report.status) {
      case 'EVALUATED':
        return <Badge variant="success">Evaluated</Badge>;
      case 'SUBMITTED':
        return <Badge variant="default">Submitted</Badge>;
      case 'OVERDUE':
        return <Badge variant="destructive">Overdue</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reports</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {reports.map((report) => {
            const deadlineStatus = getDeadlineStatus(report.deadline);
            
            return (
              <div 
                key={report._id} 
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <FileText className="h-5 w-5 mt-1" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{report.title}</h4>
                      {getStatusBadge(report)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {report.type === 'FORTNIGHTLY' ? 'Fortnightly Report' : 
                       report.type === 'ASSIGNMENT' ? 'Monthly Assignment' : 
                       'Final Evaluation'}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm text-muted-foreground">
                        Due: {format(new Date(report.deadline), 'PPP')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {report.evaluation ? (
                    <div className="text-right">
                      <p className="text-sm font-medium">Score</p>
                      <p className="text-2xl font-bold">{report.evaluation.points}/10</p>
                    </div>
                  ) : (
                    <Button variant={deadlineStatus.variant}>
                      {report.status === 'PENDING' ? 'Submit Report' : 'View Report'}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
} 