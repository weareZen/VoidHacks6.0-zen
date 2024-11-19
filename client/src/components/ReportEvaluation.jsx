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

export default function ReportEvaluation({ report }) {
  const { toast } = useToast();
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState({
    points: 5,
    feedback: ''
  });

  const handleEvaluate = async (e) => {
    e.preventDefault();
    setIsEvaluating(true);

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
        title: 'Success',
        description: 'Report evaluated successfully',
        variant: 'success'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setIsEvaluating(false);
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

          <form onSubmit={handleEvaluate} className="space-y-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Evaluation Points (0-10)</h4>
              <Slider
                value={[evaluation.points]}
                onValueChange={([value]) => setEvaluation(prev => ({ ...prev, points: value }))}
                max={10}
                step={1}
              />
              <p className="text-sm text-muted-foreground text-right">{evaluation.points} points</p>
            </div>

            <Textarea
              placeholder="Provide feedback..."
              value={evaluation.feedback}
              onChange={(e) => setEvaluation(prev => ({ ...prev, feedback: e.target.value }))}
              rows={4}
            />

            <Button type="submit" disabled={isEvaluating}>
              {isEvaluating ? 'Submitting...' : 'Submit Evaluation'}
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
} 