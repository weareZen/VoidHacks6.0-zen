import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Slider } from './ui/slider';
import { Badge } from './ui/badge';
import { Download } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from './hooks/use-toast';

export default function ReportEvaluation({ report, onEvaluated }) {
  const { toast } = useToast();
  const [evaluation, setEvaluation] = useState({
    points: 0,
    feedback: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/v1/reports/${report._id}/evaluate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(evaluation)
      });

      if (!response.ok) throw new Error('Failed to submit evaluation');

      toast({
        title: "Success",
        description: "Report evaluated successfully",
      });
      
      onEvaluated();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit evaluation",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{report.title}</CardTitle>
          <Badge variant={report.status === 'SUBMITTED' ? 'default' : 'secondary'}>
            {report.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium">Report Details</h4>
            <p className="text-sm text-muted-foreground">
              Submitted by {report.student.name} on {format(new Date(report.submissionDate), 'PPP')}
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Content</h4>
            <p className="text-sm whitespace-pre-wrap">{report.content}</p>
          </div>

          {report.attachments?.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Attachments</h4>
              {report.attachments.map((attachment, index) => (
                <Button key={index} variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  {attachment.fileName}
                </Button>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label>Points (0-10)</label>
              <Slider
                min={0}
                max={10}
                step={1}
                value={[evaluation.points]}
                onValueChange={(value) => setEvaluation({ ...evaluation, points: value[0] })}
              />
            </div>
            <Textarea
              placeholder="Feedback"
              value={evaluation.feedback}
              onChange={(e) => setEvaluation({ ...evaluation, feedback: e.target.value })}
            />
            <Button type="submit">Submit Evaluation</Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
} 